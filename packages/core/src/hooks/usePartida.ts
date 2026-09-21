import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useServicios, useSesion } from '../contexto/LoteriaProvider';
import { alternarBit, CASILLAS, indicesDeCasillas, progresoTabla, tieneBit } from '../juego/tabla';
import type { EstadoRonda, EventoFiguraLograda, EventoGanadores, LogroRonda, MiTabla } from '../tipos';
import { useAccion, useCola, useConsulta, useEventoSala } from './genericos';

/** Aviso que aparece durante la ronda (figuras que el tablero detectó). */
export interface AvisoRonda {
  evento: EventoFiguraLograda;
  mio: boolean;
}

const aLogro = (e: EventoFiguraLograda): LogroRonda => ({
  usuario_id: e.usuario_id,
  nombre: e.nombre,
  partida_tabla_id: e.partida_tabla_id,
  clave: e.figura.clave,
  figura: e.figura.nombre,
  carta: e.carta,
  primero: e.primero,
  puntos: e.puntos,
  mascara: [...indicesDeCasillas(e.casillas)].reduce((m, i) => m | (1 << i), 0),
});

const conTabla = (estado: EstadoRonda, id: string, cambiar: (t: MiTabla) => MiTabla): EstadoRonda => ({
  ...estado,
  misTablas: estado.misTablas.map((t) => (t.id === id ? cambiar(t) : t)),
});

/**
 * Una ronda en vivo: cartas cantadas, mis tablas, avisos de figuras,
 * resultado y las acciones del jugador y del anfitrión. El jugador no grita:
 * el tablero (servidor) declara ¡Lotería! cuando una tabla se llena.
 */
export function usePartida(partidaId: string | null) {
  const { api } = useServicios();
  const { perfil, refrescar } = useSesion();

  const ronda = useConsulta<EstadoRonda | null>(
    () => (partidaId ? api.partidas.estado(partidaId) : Promise.resolve(null)),
    [api, partidaId],
  );
  const avisos = useCola<AvisoRonda>(5000);
  const [resultado, setResultado] = useState<EventoGanadores | null>(null);
  const [ultimaCartaEn, setUltimaCartaEn] = useState<number | null>(null);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    setResultado(null);
    setSeleccionada(null);
    setUltimaCartaEn(null);
  }, [partidaId]);

  // ---------- eventos en vivo ----------
  useEventoSala('carta:cantada', (e) => {
    if (e.partida_id !== partidaId) return;
    ronda.fijar((s) =>
      s && !s.cantadas.some((c) => c.orden === e.orden)
        ? { ...s, partida: { ...s.partida, indice: e.orden }, cantadas: [...s.cantadas, { ...e.carta, orden: e.orden }] }
        : s,
    );
    setUltimaCartaEn(Date.now());
  });

  useEventoSala('figura:lograda', (e) => {
    if (e.partida_id !== partidaId) return;
    ronda.fijar((s) => (s ? { ...s, logros: [...s.logros, aLogro(e)] } : s));
    avisos.agregar({ evento: e, mio: e.usuario_id === perfil?.id });
  });

  useEventoSala('partida:tablas', (e) => {
    if (e.partida_id === partidaId) void ronda.recargar();
  });

  useEventoSala('partida:estado', (p) => {
    if (p.id === partidaId) ronda.fijar((s) => (s ? { ...s, partida: { ...s.partida, ...p } } : s));
  });

  useEventoSala('partida:ganadores', (e) => {
    if (e.partida_id !== partidaId) return;
    setResultado(e);
    void ronda.recargar();
    void refrescar();
  });

  // ---------- derivados ----------
  const estado = ronda.data ?? null;
  const cantadas = useMemo(() => new Set(estado?.cantadas.map((c) => c.id) ?? []), [estado?.cantadas]);
  const cartaActual = estado?.cantadas.at(-1) ?? null;
  const ultimas = useMemo(() => (estado ? estado.cantadas.slice(0, -1).slice(-5).reverse() : []), [estado]);

  /** Casillas a resaltar en cada una de mis tablas (figuras logradas y la ganadora). */
  const destacadas = useMemo(() => {
    const porTabla = new Map<string, Set<number>>();
    for (const t of estado?.misTablas ?? []) {
      const indices = new Set<number>();
      for (const l of estado?.logros ?? [])
        if (l.partida_tabla_id === t.id) for (let i = 0; i < 16; i++) if (tieneBit(l.mascara, i)) indices.add(i);
      porTabla.set(t.id, indices);
    }
    return porTabla;
  }, [estado?.misTablas, estado?.logros]);

  /** Tabla que se está viendo (en el celular se ve una a la vez). */
  const tablaVisible = estado?.misTablas.find((t) => t.id === seleccionada) ?? estado?.misTablas[0] ?? null;

  /** Mi tabla más cerca de llenarse: el tablero grita ¡Lotería! solo cuando faltan 0. */
  const masCerca = useMemo(() => {
    const tablas = estado?.misTablas ?? [];
    if (!tablas.length) return null;
    return tablas
      .map((t) => ({ tabla: t, faltan: CASILLAS - progresoTabla(t.cartas, cantadas) }))
      .reduce((mejor, x) => (x.faltan < mejor.faltan ? x : mejor));
  }, [estado?.misTablas, cantadas]);

  // ---------- acciones del jugador ----------

  // Marcas al instante (sin esperar al render) para que varios toques seguidos no se pisen,
  // y envíos en fila para que una respuesta vieja no gane a una nueva en el servidor.
  const marcasAlDia = useRef(new Map<string, number>());
  const envios = useRef(Promise.resolve());
  useEffect(() => {
    for (const t of estado?.misTablas ?? []) marcasAlDia.current.set(t.id, t.marcas);
  }, [estado?.misTablas]);

  const marcar = useCallback(
    (partidaTablaId: string, indice: number) => {
      const tabla = estado?.misTablas.find((t) => t.id === partidaTablaId);
      if (!tabla || !cantadas.has(tabla.cartas[indice])) return;
      const marcas = alternarBit(marcasAlDia.current.get(partidaTablaId) ?? tabla.marcas, indice);
      marcasAlDia.current.set(partidaTablaId, marcas);
      ronda.fijar((s) => (s ? conTabla(s, partidaTablaId, (t) => ({ ...t, marcas })) : s));
      envios.current = envios.current.then(() => api.partidas.marcar(partidaTablaId, marcas).then(() => undefined, () => undefined));
    },
    [api, cantadas, estado?.misTablas, ronda],
  );

  const conRecarga = <A extends unknown[]>(fn: (...a: A) => Promise<unknown>) =>
    async (...a: A) => {
      await fn(...a);
      await ronda.recargar();
    };

  const elegirTabla = useAccion(conRecarga((tablaId: string) => api.partidas.elegirTabla(partidaId!, tablaId)));
  const soltarTabla = useAccion(conRecarga((partidaTablaId: string) => api.partidas.soltarTabla(partidaTablaId)));

  // ---------- acciones del anfitrión ----------
  const iniciar = useAccion(() => api.partidas.iniciar(partidaId!));
  const pausar = useAccion(() => api.partidas.pausar(partidaId!));
  const reanudar = useAccion(() => api.partidas.reanudar(partidaId!));
  const cancelar = useAccion(() => api.partidas.cancelar(partidaId!));
  const cantar = useAccion(() => api.partidas.cantar(partidaId!));

  return {
    estado,
    cargando: ronda.cargando,
    error: ronda.error,
    cantadas,
    cartaActual,
    ultimas,
    ultimaCartaEn,
    destacadas,
    avisos,
    resultado,
    masCerca,
    tablaVisible,
    seleccionar: setSeleccionada,
    jugador: { marcar, elegirTabla, soltarTabla },
    anfitrion: { iniciar, pausar, reanudar, cancelar, cantar },
  };
}

export type RondaEnVivo = ReturnType<typeof usePartida>;
