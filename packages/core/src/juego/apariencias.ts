import { colores } from '../tema';

/**
 * Cómo se ve cada skin de carta (el marco de todas las cartas).
 * Las fichas ya no son colores: tienen dibujo propio en fichas.ts.
 */
export interface AparienciaCarta {
  fondo: string;
  marco: string;
  acento: string;
  texto: string;
}

const CARTAS: Record<string, AparienciaCarta> = {
  clasica: { fondo: colores.papel, marco: colores.tinta, acento: colores.rosa, texto: colores.tinta },
  papel_picado: { fondo: '#FFF0F7', marco: colores.rosa, acento: colores.amarillo, texto: colores.tinta },
  dia_muertos: { fondo: '#FFF3E0', marco: '#F26A1B', acento: '#7B2FBE', texto: '#3B1F0B' },
  lucha_libre: { fondo: '#EAF1FF', marco: colores.anil, acento: colores.rojo, texto: '#0F1D3A' },
  neon: { fondo: '#1B1030', marco: '#FF2FB9', acento: '#29F0FF', texto: '#FFFFFF' },
};

export const aparienciaCarta = (clave?: string | null) => CARTAS[clave ?? ''] ?? CARTAS.clasica;
