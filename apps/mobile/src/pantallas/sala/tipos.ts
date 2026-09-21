import type { Carta, RondaEnVivo, useSala } from '@loteria/core';

/** Lo que reciben todas las vistas de la sala. */
export interface ContextoSala {
  sala: ReturnType<typeof useSala>;
  ronda: RondaEnVivo;
  porId: Map<number, Carta>;
  cartas: Carta[];
}
