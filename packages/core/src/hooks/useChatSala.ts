import { useCallback } from 'react';
import { useServicios } from '../contexto/LoteriaProvider';
import { textoFrase, type ClaveFrase } from '../juego/frases';
import type { JugadorSala } from '../tipos';
import { useCola, useEventoSala } from './genericos';

export interface BurbujaFrase {
  usuarioId: string;
  nombre: string;
  avatar: string | null;
  texto: string;
}

/** Chat rápido de la sala: frases fijas que aparecen como globitos unos segundos. */
export function useChatSala(salaId: string, jugadores: JugadorSala[]) {
  const { realtime } = useServicios();
  const burbujas = useCola<BurbujaFrase>(3500);

  useEventoSala('sala:frase', (e) => {
    const j = jugadores.find((x) => x.id === e.usuarioId);
    const texto = textoFrase(e.clave);
    if (texto) burbujas.agregar({ usuarioId: e.usuarioId, nombre: j?.nombre ?? 'Alguien', avatar: j?.avatar ?? null, texto });
  });

  const enviar = useCallback((clave: ClaveFrase) => realtime.enviarFrase(salaId, clave), [realtime, salaId]);
  return { burbujas: burbujas.items, enviar };
}
