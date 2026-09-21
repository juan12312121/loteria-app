import { useEffect } from 'react';
import { useServicios, useSesion } from '../contexto/LoteriaProvider';
import { useAccion, useConsulta, useEventoSala } from './genericos';
import { useAlReconectar } from './useConexion';

/**
 * Todo lo de una sala: datos, jugadores en vivo y la ronda actual.
 * Al montar se une al cuarto de tiempo real de la sala y al desmontar sale.
 */
export function useSala(salaId: string) {
  const { api, realtime } = useServicios();
  const { perfil } = useSesion();

  const sala = useConsulta(() => api.salas.obtener(salaId), [api, salaId]);
  const jugadores = useConsulta(() => api.salas.jugadores(salaId), [api, salaId]);
  const partida = useConsulta(() => api.partidas.actualDeSala(salaId), [api, salaId]);
  const catalogo = useConsulta(async () => {
    const [figuras, tablas] = await Promise.all([api.catalogo.figuras(), api.catalogo.tablasOficiales()]);
    // "Tabla 2" antes que "Tabla 10"
    tablas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }));
    return { figuras, tablas };
  }, [api]);

  useEffect(() => {
    realtime.unirseSala(salaId);
    return () => realtime.salirSala(salaId);
  }, [realtime, salaId]);

  const { recargar: recargarJugadores } = jugadores;
  useEventoSala('jugador:entro', () => void recargarJugadores());
  useEventoSala('jugador:salio', () => void recargarJugadores());
  useEventoSala('jugador:conectado', () => void recargarJugadores());
  useEventoSala('jugador:desconectado', () => void recargarJugadores());
  useEventoSala('partida:estado', (p) => {
    if (p.sala_id === salaId) partida.fijar(() => p);
  });

  // Si se cayó el internet, al volver se recupera quién está y en qué va la ronda
  useAlReconectar(() => {
    void recargarJugadores();
    void partida.recargar();
  });

  const nuevaRonda = useAccion(async () => {
    const p = await api.partidas.crear(salaId);
    partida.fijar(() => p);
    return p;
  });

  const salir = useAccion(() => api.salas.salir(salaId));

  const agregarBot = useAccion(async () => {
    await api.salas.agregarBot(salaId);
    await recargarJugadores();
  });

  const quitarBot = useAccion(async (botId: string) => {
    await api.salas.quitarBot(salaId, botId);
    await recargarJugadores();
  });

  const esAnfitrion = !!sala.data && sala.data.anfitrion_id === perfil?.id;
  const figuraFinal = catalogo.data?.figuras.find((f) => f.id === sala.data?.figura_id) ?? null;
  const figurasAnunciadas = catalogo.data?.figuras.filter((f) => f.intermedia && f.id !== sala.data?.figura_id) ?? [];

  return {
    sala: sala.data ?? null,
    jugadores: jugadores.data ?? [],
    partida: partida.data ?? null,
    tablasOficiales: catalogo.data?.tablas ?? [],
    figuraFinal,
    figurasAnunciadas,
    esAnfitrion,
    cargando: sala.cargando || partida.cargando,
    error: sala.error ?? partida.error,
    nuevaRonda,
    salir,
    bots: { agregar: agregarBot, quitar: quitarBot },
  };
}
