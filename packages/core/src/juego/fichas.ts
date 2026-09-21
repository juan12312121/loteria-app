/**
 * Ilustraciones propias de las fichas (skins de frijolito) en SVG, viewBox 100×100
 * con fondo transparente: se ponen encima de la carta marcada.
 */

const TINTA = '#1C1A17';

const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`;
const c = (cx: number, cy: number, r: number, fill: string, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`;
const e = (cx: number, cy: number, rx: number, ry: number, fill: string, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${extra ? ` ${extra}` : ''}/>`;
const brillo = (d: string) => `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-opacity="0.7"/>`;
const sinTrazo = 'stroke="none"';
const redondo = (n: number) => Math.round(n * 10) / 10;

/** Borde dentado de corcholata. */
function dentado(cx: number, cy: number, rExt: number, rInt: number, dientes: number) {
  const pts: string[] = [];
  for (let i = 0; i < dientes * 2; i++) {
    const rr = i % 2 === 0 ? rExt : rInt;
    const a = (Math.PI / dientes) * i;
    pts.push(`${redondo(cx + rr * Math.cos(a))} ${redondo(cy + rr * Math.sin(a))}`);
  }
  return `M${pts.join(' L')}Z`;
}

function estrella(cx: number, cy: number, radio: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? radio : radio * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${redondo(cx + rr * Math.cos(a))} ${redondo(cy + rr * Math.sin(a))}`);
  }
  return `M${pts.join(' L')}Z`;
}

const FICHAS: Record<string, string> = {
  frijol:
    p('M24 50 Q20 26 46 22 Q70 18 80 38 Q88 56 74 70 Q60 84 40 78 Q33 76 36 66 Q40 56 30 58 Q24 60 24 50Z', '#5B3A29') +
    p('M38 70 Q44 62 38 56', 'none', 'stroke="#C9A27A" stroke-width="2.5"') +
    brillo('M36 34 Q48 28 62 30'),

  maiz:
    p('M50 12 Q77 15 81 43 Q83 70 62 87 Q50 93 38 87 Q17 70 19 43 Q23 15 50 12Z', '#F7C948') +
    p('M28 34 Q50 22 72 34 Q66 18 50 16 Q34 18 28 34Z', '#FFE38A', sinTrazo) +
    e(50, 64, 7, 11, '#E0A800', 'stroke-width="2"') +
    brillo('M30 46 Q30 60 36 70'),

  piedrita:
    p('M20 54 Q18 30 40 24 Q63 17 79 32 Q90 45 83 63 Q75 82 52 83 Q27 83 20 54Z', '#9AA0A6') +
    c(40, 60, 3, '#6B7075', sinTrazo) + c(62, 46, 2.5, '#6B7075', sinTrazo) + c(56, 68, 2, '#6B7075', sinTrazo) + c(34, 42, 2, '#C4C8CC', sinTrazo) +
    brillo('M34 34 Q46 28 58 30'),

  corcholata:
    p(dentado(50, 50, 44, 37, 21), '#D7263D') +
    c(50, 50, 30, '#E8475A') +
    p(estrella(50, 50, 16), '#FFFFFF') +
    brillo('M30 34 Q38 24 50 22'),

  chile:
    p('M36 30 Q54 20 66 34 Q80 54 72 76 Q66 91 53 86 Q60 66 47 51 Q39 43 36 30Z', '#C1121F') +
    p('M37 31 Q30 23 33 14 Q40 11 42 19 Q44 26 40 31Z', '#2D6A4F') +
    p('M34 32 Q44 26 50 34 Q44 38 34 32Z', '#40916C') +
    brillo('M58 40 Q68 54 64 70'),

  calaverita:
    p('M24 44 Q24 16 50 16 Q76 16 76 44 Q76 60 67 64 L67 78 L33 78 L33 64 Q24 60 24 44Z', '#FFFFFF') +
    c(39, 45, 8.5, TINTA) + c(61, 45, 8.5, TINTA) +
    c(39, 45, 3.2, '#E4007C', sinTrazo) + c(61, 45, 3.2, '#E4007C', sinTrazo) +
    p('M50 53 L45 62 L55 62Z', TINTA) +
    p('M38 70 L62 70 M44 65 L44 78 M50 65 L50 78 M56 65 L56 78', 'none') +
    c(50, 27, 4.5, '#F7B500') + c(44, 27, 2.8, '#E4007C') + c(56, 27, 2.8, '#E4007C') + c(50, 21, 2.8, '#7B2FBE'),

  moneda_oro:
    c(50, 50, 40, '#E0B100') +
    c(50, 50, 31, '#F7C948', 'stroke="#9C7A00" stroke-width="2.5"') +
    `<text x="50" y="63" font-family="Georgia, serif" font-size="36" font-weight="900" text-anchor="middle" fill="#9C7A00" stroke="none">$</text>` +
    brillo('M26 38 Q32 24 46 20'),
};

const FICHA_POR_DEFECTO = 'frijol';
const cache = new Map<string, string>();

/** SVG completo de una ficha (texto). Web: data URI; móvil: SvgXml. */
export function svgDeFicha(clave?: string | null): string {
  const llave = clave && FICHAS[clave] ? clave : FICHA_POR_DEFECTO;
  const guardado = cache.get(llave);
  if (guardado) return guardado;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<g stroke="${TINTA}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${FICHAS[llave]}</g></svg>`;
  cache.set(llave, svg);
  return svg;
}

export const dataUriDeFicha = (clave?: string | null) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDeFicha(clave))}`;

export const fichasIlustradas = () => Object.keys(FICHAS);
