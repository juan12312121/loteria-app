import type { Rareza } from './tipos';

/**
 * Tokens de diseño de "Lotería Tradicional" (tema claro de la baraja impresa).
 * Única fuente de verdad para web (variables CSS) y móvil (StyleSheet).
 */
export const colores = {
  crema: '#FFF6E5',
  papel: '#FFFDF7',
  tinta: '#1C1A17',
  tintaSuave: '#5C574D',
  gris: '#8A8578',
  grisClaro: '#E9E2D3',
  rosa: '#E4007C',
  rosaOscuro: '#B80064',
  amarillo: '#F7B500',
  amarilloSuave: '#FFF1C2',
  anil: '#1E4FA3',
  verde: '#0B8A4A',
  verdeSuave: '#DDF3E6',
  rojo: '#D7263D',
  naranja: '#F26A1B',
  blanco: '#FFFFFF',
} as const;

export const coloresRareza: Record<Rareza, string> = {
  comun: colores.gris,
  rara: colores.verde,
  epica: '#7B2FBE',
  legendaria: '#C99700',
};

export const nombresRareza: Record<Rareza, string> = {
  comun: 'Común',
  rara: 'Rara',
  epica: 'Épica',
  legendaria: 'Legendaria',
};

/** Colores de la guirnalda de papel picado. */
export const papelPicado = [colores.rosa, colores.amarillo, colores.verde, colores.anil, colores.naranja] as const;

export const espacio = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

export const radio = { s: 4, m: 8, l: 12, total: 999 } as const;

export const fuentes = {
  titulo: 'Playfair Display',
  cuerpo: 'Nunito Sans',
} as const;

export const tema = { colores, coloresRareza, papelPicado, espacio, radio, fuentes } as const;
export type Tema = typeof tema;
