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
  /** Fondo de campos y barras (blanco de día, oscuro de noche) */
  superficie: '#FFFFFF',
  /** Sombra sólida de botones y tarjetas */
  sombra: '#1C1A17',
} as const;

export type NombreColor = keyof typeof colores;

/**
 * "Noche de feria": misma paleta tradicional sobre morado de noche.
 * Las cartas y fichas conservan sus colores (como la baraja real).
 */
export const coloresNoche: Record<NombreColor, string> = {
  crema: '#1B1530',
  papel: '#261E3D',
  tinta: '#F4ECDC',
  tintaSuave: '#C3B9D4',
  gris: '#9087A6',
  grisClaro: '#3B3256',
  rosa: '#FF3D9A',
  rosaOscuro: '#E4007C',
  amarillo: '#FFC23D',
  amarilloSuave: '#4A3B14',
  // Sirve de enlace sobre morado y de fondo con texto blanco a la vez
  anil: '#5A8BFF',
  verde: '#2FC774',
  verdeSuave: '#173B2B',
  rojo: '#FF5C6E',
  naranja: '#FF8A3D',
  blanco: '#FFFFFF',
  superficie: '#1F1833',
  sombra: '#08050F',
};

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

/** Paleta a partir de una lista en el orden de las claves de `colores`. */
const paleta = (valores: string[]) =>
  Object.fromEntries((Object.keys(colores) as NombreColor[]).map((k, i) => [k, valores[i]])) as Record<NombreColor, string>;

export interface TemaColor {
  oscuro: boolean;
  colores: Record<NombreColor, string>;
}

/**
 * Temas de la app (skins tipo "tema"). Solo cambian fondo, tarjetas, texto y
 * dos acentos; las cartas y fichas se quedan igual. Todos pasan la revisión de
 * contraste de temas.test.ts (texto ≥ 4.5:1, botones ≥ 3:1).
 */
export const TEMAS: Record<string, TemaColor> = {
  tema_clasico: { oscuro: false, colores: { ...colores } },
  tema_noche: { oscuro: true, colores: coloresNoche },
  //                crema      papel      tinta      tintaSuave gris       grisClaro  rosa       rosaOscuro amarillo   amarSuave  anil       verde      verdeSuave rojo       naranja    blanco     superficie sombra
  tema_talavera: { oscuro: false, colores: paleta(['#EEF3FB', '#FFFFFF', '#13294B', '#4A5B78', '#8292AE', '#D9E2F0', '#1F4E9C', '#163A75', '#F2A93B', '#FDF0D8', '#2A64B8', '#0B7F45', '#DDF3E6', '#C8283E', '#D9701C', '#FFFFFF', '#FFFFFF', '#13294B']) },
  tema_barro: { oscuro: false, colores: paleta(['#F6E9DC', '#FFF8F1', '#3A2418', '#6A4F40', '#A08878', '#E8D5C4', '#A84A25', '#8E3E1F', '#D9A441', '#F6E6C4', '#136A6D', '#3A7548', '#E1EEDF', '#B3261E', '#C8672E', '#FFFFFF', '#FFFDFB', '#3A2418']) },
  tema_mercado: { oscuro: false, colores: paleta(['#FFF0F6', '#FFFFFF', '#2A1020', '#6B4659', '#9C8492', '#F4D9E6', '#D1006F', '#A30057', '#E8B400', '#FFF3C4', '#0B7A43', '#0B7F45', '#DCF5E6', '#D7263D', '#F26A1B', '#FFFFFF', '#FFFFFF', '#2A1020']) },
  tema_jade: { oscuro: false, colores: paleta(['#EAF4EF', '#F9FCFA', '#0F2A20', '#41604E', '#7F9A8B', '#D3E6DB', '#177E5A', '#0F5E42', '#C99700', '#F6EDC8', '#1B6A87', '#1A7D44', '#D7F0E0', '#B83232', '#C8621A', '#FFFFFF', '#FFFFFF', '#0F2A20']) },
  tema_lucha: { oscuro: true, colores: paleta(['#141A2E', '#1E2640', '#EEF2FF', '#AEB8D6', '#7F8AAD', '#333D5C', '#FF4757', '#E0283A', '#FFC23D', '#3D3414', '#5A8BFF', '#2FC774', '#173B2B', '#FF6B7A', '#FF8A3D', '#FFFFFF', '#182038', '#05070F']) },
  tema_cempasuchil: { oscuro: false, colores: paleta(['#FFF1E0', '#FFFAF3', '#2E1A0C', '#6B4A33', '#9A8270', '#F1DCC4', '#C2410C', '#9A3412', '#F59E0B', '#FDE8C4', '#6D28D9', '#15803D', '#DCF3E3', '#B91C1C', '#EA580C', '#FFFFFF', '#FFFFFF', '#2E1A0C']) },
};

export const TEMA_POR_DEFECTO = 'tema_clasico';
export const temaDe = (clave?: string | null): TemaColor => TEMAS[clave ?? ''] ?? TEMAS[TEMA_POR_DEFECTO];

export const tema = { colores, coloresNoche, coloresRareza, papelPicado, espacio, radio, fuentes } as const;
export type Tema = typeof tema;
