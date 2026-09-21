import { colores } from '../tema';

/** Cómo se ve cada skin de ficha (el frijolito que se pone en la casilla). */
export interface AparienciaFicha {
  fondo: string;
  borde: string;
  simbolo: string;
}

/** Cómo se ve cada skin de carta (el marco de todas las cartas). */
export interface AparienciaCarta {
  fondo: string;
  marco: string;
  acento: string;
  texto: string;
}

const FICHAS: Record<string, AparienciaFicha> = {
  frijol: { fondo: '#5B3A29', borde: '#3B2418', simbolo: '' },
  maiz: { fondo: '#F7C948', borde: '#C99700', simbolo: '' },
  piedrita: { fondo: '#9AA0A6', borde: '#6B7075', simbolo: '' },
  corcholata: { fondo: colores.rojo, borde: '#8E1426', simbolo: '★' },
  chile: { fondo: '#C1121F', borde: '#2D6A4F', simbolo: '🌶️' },
  calaverita: { fondo: '#FFFFFF', borde: '#7B2FBE', simbolo: '💀' },
  moneda_oro: { fondo: '#E0B100', borde: '#9C7A00', simbolo: '$' },
};

const CARTAS: Record<string, AparienciaCarta> = {
  clasica: { fondo: colores.papel, marco: colores.tinta, acento: colores.rosa, texto: colores.tinta },
  papel_picado: { fondo: '#FFF0F7', marco: colores.rosa, acento: colores.amarillo, texto: colores.tinta },
  dia_muertos: { fondo: '#FFF3E0', marco: '#F26A1B', acento: '#7B2FBE', texto: '#3B1F0B' },
  lucha_libre: { fondo: '#EAF1FF', marco: colores.anil, acento: colores.rojo, texto: '#0F1D3A' },
  neon: { fondo: '#1B1030', marco: '#FF2FB9', acento: '#29F0FF', texto: '#FFFFFF' },
};

export const aparienciaFicha = (clave?: string | null) => FICHAS[clave ?? ''] ?? FICHAS.frijol;

export const aparienciaCarta = (clave?: string | null) => CARTAS[clave ?? ''] ?? CARTAS.clasica;
