import { svgDeCarta } from './arte';
import { svgDeFicha } from './fichas';

/**
 * Avatares de jugador en SVG (viewBox 100×100, círculo). Los animales
 * reutilizan el dibujo de su ficha y El Gallo el de su carta; los personajes
 * tienen dibujo propio.
 */

const TINTA = '#1C1A17';
const PIEL = '#E8B98A';

const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`;
const c = (cx: number, cy: number, r: number, fill: string, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`;
const e = (cx: number, cy: number, rx: number, ry: number, fill: string, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`;
const sinTrazo = 'stroke="none"';

/** Quita la etiqueta <svg> de fuera para anidar el dibujo en otro SVG. */
const interior = (svg: string) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const anidado = (svg: string, x: number, y: number, lado: number) =>
  `<svg x="${x}" y="${y}" width="${lado}" height="${lado}" viewBox="0 0 100 100">${interior(svg)}</svg>`;

const PERSONAJES: Record<string, string> = {
  av_catrina:
    e(50, 62, 22, 26, '#FFFFFF') +
    c(41, 58, 7, TINTA) + c(59, 58, 7, TINTA) +
    [0, 72, 144, 216, 288].map((g) => e(41, 52, 2.5, 4, '#E4007C', `transform="rotate(${g} 41 58)" ${sinTrazo}`)).join('') +
    [0, 72, 144, 216, 288].map((g) => e(59, 52, 2.5, 4, '#1E4FA3', `transform="rotate(${g} 59 58)" ${sinTrazo}`)).join('') +
    c(41, 58, 2.5, '#F7B500', sinTrazo) + c(59, 58, 2.5, '#F7B500', sinTrazo) +
    p('M50 66 L47 71 L53 71Z', TINTA) +
    p('M40 78 H60 M44 75 V81 M50 75 V81 M56 75 V81', 'none', 'stroke-width="1.8"') +
    e(50, 36, 40, 9, '#7B2FBE') +
    p('M32 36 Q34 14 50 14 Q66 14 68 36Z', '#5A1F8F') +
    c(36, 30, 6, '#E4007C') + c(46, 26, 5, '#F7B500') + c(62, 28, 6, '#F26A1B'),

  av_charro:
    c(50, 62, 20, PIEL) +
    c(43, 60, 2.6, TINTA, sinTrazo) + c(57, 60, 2.6, TINTA, sinTrazo) +
    p('M38 70 Q44 66 50 70 Q56 66 62 70 Q56 76 50 72 Q44 76 38 70Z', '#3B2A1A') +
    p('M44 80 Q50 84 56 80', 'none') +
    e(50, 44, 44, 10, '#3B2A1A') +
    e(50, 44, 44, 10, 'none', 'stroke="#E0B100" stroke-width="2.5"') +
    p('M34 44 Q36 16 50 16 Q64 16 66 44Z', '#3B2A1A') +
    p('M36 36 Q50 30 64 36', 'none', 'stroke="#E0B100" stroke-width="3"'),

  av_luchador:
    c(50, 55, 30, '#D7263D') +
    p('M50 25 L50 85', 'none', 'stroke="#F7B500" stroke-width="3"') +
    p('M28 50 Q34 38 46 48 Q40 60 28 50Z', '#FFFFFF', 'stroke="#1E4FA3" stroke-width="2.5"') +
    p('M72 50 Q66 38 54 48 Q60 60 72 50Z', '#FFFFFF', 'stroke="#1E4FA3" stroke-width="2.5"') +
    c(38, 50, 3, TINTA, sinTrazo) + c(62, 50, 3, TINTA, sinTrazo) +
    e(50, 72, 10, 7, PIEL) +
    p('M44 72 Q50 76 56 72', 'none', 'stroke-width="2"') +
    p('M30 34 L36 28 L42 34 L50 26 L58 34 L64 28 L70 34', 'none', 'stroke="#F7B500" stroke-width="3"'),

  av_cantor:
    p('M28 92 Q30 76 50 74 Q70 76 72 92Z', '#D7263D') +
    c(50, 58, 18, PIEL) +
    c(44, 56, 2.4, TINTA, sinTrazo) + c(56, 56, 2.4, TINTA, sinTrazo) +
    p('M40 65 Q50 60 60 65 Q55 70 50 67 Q45 70 40 65Z', '#3B2A1A') +
    e(50, 42, 34, 8, '#E8C36A') +
    p('M36 42 Q38 22 50 22 Q62 22 64 42Z', '#E8C36A') +
    p('M37 36 H63', 'none', 'stroke="#D7263D" stroke-width="3"') +
    `<rect x="64" y="66" width="18" height="24" rx="2" fill="#FFFDF7" transform="rotate(12 73 78)"/>` +
    `<text x="73" y="83" font-family="Georgia, serif" font-size="12" font-weight="900" text-anchor="middle" fill="#E4007C" stroke="none" transform="rotate(12 73 78)">1</text>`,
};

/** Avatar → [color de fondo, dibujo] */
const AVATARES: Record<string, [string, () => string]> = {
  av_gallo: ['#FFE3A3', () => anidado(svgDeCarta(1), 0, 0, 100)],
  av_ajolote: ['#CDEBFA', () => anidado(svgDeFicha('ajolote'), 8, 10, 84)],
  av_xolo: ['#E6E0D4', () => anidado(svgDeFicha('xolo'), 8, 10, 84)],
  av_monarca: ['#DDF3E6', () => anidado(svgDeFicha('mariposa_monarca'), 8, 8, 84)],
  av_jaguar: ['#DDF3E6', () => anidado(svgDeFicha('jaguar'), 8, 8, 84)],
  av_charro: ['#FFE0B8', () => `<g stroke="${TINTA}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${PERSONAJES.av_charro}</g>`],
  av_luchador: ['#DCE6FA', () => `<g stroke="${TINTA}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${PERSONAJES.av_luchador}</g>`],
  av_catrina: ['#F3E0FF', () => `<g stroke="${TINTA}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${PERSONAJES.av_catrina}</g>`],
  av_cantor: ['#FFF1C2', () => `<g stroke="${TINTA}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${PERSONAJES.av_cantor}</g>`],
};

export const AVATAR_POR_DEFECTO = 'av_gallo';
const cache = new Map<string, string>();

/** SVG del avatar (cae en El Gallo si no existe). El clipPath lleva la clave en su id para no chocar con otros avatares. */
export function svgDeAvatar(clave?: string | null): string {
  const llave = clave && AVATARES[clave] ? clave : AVATAR_POR_DEFECTO;
  const guardado = cache.get(llave);
  if (guardado) return guardado;
  const [fondo, dibujo] = AVATARES[llave];
  const id = `a-${llave}`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<defs><clipPath id="${id}"><circle cx="50" cy="50" r="48"/></clipPath></defs>` +
    `<g clip-path="url(#${id})"><rect width="100" height="100" fill="${fondo}"/>${dibujo()}</g>` +
    `<circle cx="50" cy="50" r="48" fill="none" stroke="${TINTA}" stroke-width="3"/></svg>`;
  cache.set(llave, svg);
  return svg;
}

export const dataUriDeAvatar = (clave?: string | null) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDeAvatar(clave))}`;

export const avataresIlustrados = () => Object.keys(AVATARES);
