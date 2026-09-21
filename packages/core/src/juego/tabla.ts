import type { Casilla } from '../tipos';

/**
 * Reglas visuales de una tabla 4×4. La casilla i está en fila = i / 4,
 * columna = i % 4, igual que en el servidor (bit i de las máscaras).
 */
export const CASILLAS = 16;
export const LADO = 4;
export const TOTAL_CARTAS = 54;

/** Tope general de tablas por jugador (el mismo que valida el servidor). */
export const MAX_TABLAS_POR_JUGADOR = 6;

export interface CasillaTabla extends Casilla {
  indice: number;
  cantada: boolean;
  marcada: boolean;
  destacada: boolean;
}

export const indiceDe = (fila: number, col: number) => fila * LADO + col;

export const tieneBit = (mascara: number, indice: number) => (mascara & (1 << indice)) !== 0;

export const alternarBit = (mascara: number, indice: number) => mascara ^ (1 << indice);

/** Las 16 casillas listas para dibujar. */
export function casillasDeTabla(
  cartas: number[],
  cantadas: ReadonlySet<number>,
  marcas = 0,
  destacadas: ReadonlySet<number> = new Set(),
): CasillaTabla[] {
  return cartas.map((carta, indice) => ({
    indice,
    fila: Math.floor(indice / LADO),
    col: indice % LADO,
    carta,
    cantada: cantadas.has(carta),
    marcada: tieneBit(marcas, indice),
    destacada: destacadas.has(indice),
  }));
}

/** Cuántas cartas de la tabla ya salieron. */
export const progresoTabla = (cartas: number[], cantadas: ReadonlySet<number>) => cartas.filter((c) => cantadas.has(c)).length;

/** Cuántas casillas marcó el jugador. */
export const contarMarcas = (marcas: number) => {
  let n = 0;
  for (let i = 0; i < CASILLAS; i++) if (tieneBit(marcas, i)) n++;
  return n;
};

/** Índices de casilla a partir de coordenadas (para resaltar figuras). */
export const indicesDeCasillas = (casillas: Casilla[]) => new Set(casillas.map((c) => indiceDe(c.fila, c.col)));

/** Las 16 casillas de una máscara como booleanos (para los mini diagramas de figura). */
export const bitsDeMascara = (mascara: number) => Array.from({ length: CASILLAS }, (_, i) => tieneBit(mascara, i));
