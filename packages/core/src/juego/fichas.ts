/**
 * Ilustraciones propias de las fichas (skins de frijolito) en SVG, viewBox 100×100
 * con fondo transparente: se ponen encima de la carta marcada.
 * Incluye objetos tradicionales y animales nacionales de México.
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

  // ---------- animales nacionales ----------
  ajolote:
    p('M27 42 Q10 32 13 20 Q21 28 30 36', '#E4557F') +
    p('M24 52 Q5 52 5 39 Q15 45 26 47', '#E4557F') +
    p('M27 62 Q10 71 7 60 Q18 60 29 57', '#E4557F') +
    p('M73 42 Q90 32 87 20 Q79 28 70 36', '#E4557F') +
    p('M76 52 Q95 52 95 39 Q85 45 74 47', '#E4557F') +
    p('M73 62 Q90 71 93 60 Q82 60 71 57', '#E4557F') +
    e(50, 53, 28, 24, '#F7A8C4') +
    c(38, 48, 3.8, TINTA) + c(62, 48, 3.8, TINTA) +
    c(39.2, 46.8, 1.2, '#FFFFFF', sinTrazo) + c(63.2, 46.8, 1.2, '#FFFFFF', sinTrazo) +
    p('M40 61 Q50 69 60 61', 'none') +
    c(33, 58, 3.2, '#F07DA3', sinTrazo) + c(67, 58, 3.2, '#F07DA3', sinTrazo),

  colibri:
    p('M32 60 L12 71 L17 59 L8 54 L30 56Z', '#067038') +
    p('M43 51 Q38 21 59 15 Q57 36 51 53Z', '#7FB8FF', 'fill-opacity="0.85"') +
    p('M30 58 Q40 40 60 44 Q71 48 67 58 Q58 71 40 69Z', '#0B8A4A') +
    p('M58 50 Q67 52 65 59 Q58 59 55 54Z', '#E4007C') +
    c(62, 44, 8, '#0B8A4A') +
    p('M69 42 L93 36 L70 46.5Z', TINTA) +
    c(63.5, 42.5, 1.8, TINTA, sinTrazo),

  mariposa_monarca:
    p('M50 50 Q30 18 13 27 Q8 46 30 53 Q41 55 50 50Z', '#F26A1B') +
    p('M50 50 Q70 18 87 27 Q92 46 70 53 Q59 55 50 50Z', '#F26A1B') +
    p('M50 53 Q30 56 24 72 Q34 85 46 71 Q50 63 50 53Z', '#F26A1B') +
    p('M50 53 Q70 56 76 72 Q66 85 54 71 Q50 63 50 53Z', '#F26A1B') +
    p('M48 48 L22 32 M46 50 L16 44 M48 56 L30 70 M52 48 L78 32 M54 50 L84 44 M52 56 L70 70', 'none', 'stroke-width="2"') +
    c(16, 30, 1.8, '#FFFFFF', sinTrazo) + c(12, 40, 1.8, '#FFFFFF', sinTrazo) + c(84, 30, 1.8, '#FFFFFF', sinTrazo) + c(88, 40, 1.8, '#FFFFFF', sinTrazo) +
    e(50, 54, 3.2, 17, TINTA) +
    p('M50 38 Q44 26 39 23 M50 38 Q56 26 61 23', 'none'),

  tortuga:
    p('M31 42 Q13 31 11 46 Q22 50 33 49Z', '#40916C') +
    p('M69 42 Q87 31 89 46 Q78 50 67 49Z', '#40916C') +
    p('M35 72 Q24 82 30 88 Q36 84 40 76Z', '#40916C') +
    p('M65 72 Q76 82 70 88 Q64 84 60 76Z', '#40916C') +
    c(50, 20, 8.5, '#40916C') + c(47, 18, 1.5, TINTA, sinTrazo) + c(53, 18, 1.5, TINTA, sinTrazo) +
    e(50, 55, 25, 29, '#2D6A4F') +
    p('M50 32 L60 42 L56 56 L44 56 L40 42Z M40 42 L28 46 M60 42 L72 46 M44 56 L36 72 M56 56 L64 72 M50 32 L50 26', 'none', 'stroke="#95D5B2" stroke-width="2"'),

  xolo:
    p('M31 42 L21 11 L44 31Z', '#56606B') +
    p('M69 42 L79 11 L56 31Z', '#56606B') +
    p('M30 36 Q50 25 70 36 Q77 56 64 73 Q50 85 36 73 Q23 56 30 36Z', '#6B7480') +
    p('M44 31 Q47 20 50 29 Q53 20 56 31', 'none') +
    c(41, 50, 3.4, TINTA) + c(59, 50, 3.4, TINTA) +
    c(42, 49, 1, '#FFFFFF', sinTrazo) + c(60, 49, 1, '#FFFFFF', sinTrazo) +
    e(50, 64, 5.5, 4, TINTA) +
    p('M50 68 L50 72 M44 74 Q50 78 56 74', 'none'),

  jaguar:
    c(28, 27, 9.5, '#F2A93B') + c(72, 27, 9.5, '#F2A93B') +
    c(28, 27, 4, TINTA, sinTrazo) + c(72, 27, 4, TINTA, sinTrazo) +
    c(50, 55, 32, '#F2A93B') +
    c(33, 40, 3, 'none', 'stroke-width="2.5"') + c(50, 32, 3, 'none', 'stroke-width="2.5"') + c(67, 40, 3, 'none', 'stroke-width="2.5"') +
    c(26, 58, 2.5, TINTA, sinTrazo) + c(74, 58, 2.5, TINTA, sinTrazo) + c(42, 30, 1.8, TINTA, sinTrazo) + c(58, 30, 1.8, TINTA, sinTrazo) +
    e(50, 68, 15, 12, '#FFF6E5') +
    e(38, 51, 4.5, 5.5, '#F7B500') + e(62, 51, 4.5, 5.5, '#F7B500') +
    e(38, 51, 1.4, 4, TINTA, sinTrazo) + e(62, 51, 1.4, 4, TINTA, sinTrazo) +
    p('M44 60 L56 60 L50 67Z', TINTA) +
    p('M50 67 L50 72 M43 74 Q50 79 57 74', 'none'),

  quetzal:
    p('M41 66 Q31 84 13 95 M45 68 Q42 86 31 97', 'none', 'stroke="#0B8A4A" stroke-width="6"') +
    p('M41 66 Q31 84 13 95 M45 68 Q42 86 31 97', 'none', 'stroke-width="1.2"') +
    p('M36 60 Q34 36 52 30 Q68 28 70 42 Q72 58 58 68 Q46 74 36 60Z', '#0B8A4A') +
    p('M52 50 Q66 50 64 62 Q56 69 48 62Z', '#D7263D') +
    p('M52 31 Q55 17 65 23 Q60 28 58 33Z', '#0B8A4A') +
    p('M68 38 L79 40.5 L68 44Z', '#F7B500') +
    c(62, 38, 2, TINTA, sinTrazo) +
    p('M40 48 Q44 58 52 60', 'none', 'stroke="#067038" stroke-width="2"'),

  // ---------- de temporada ----------
  tricolor:
    p('M40 62 L30 92 L40 86 L46 94 L50 66Z', '#0B8A4A') +
    p('M60 62 L70 92 L60 86 L54 94 L50 66Z', '#D7263D') +
    c(50, 44, 30, '#0B8A4A') +
    c(50, 44, 21, '#FFFFFF') +
    c(50, 44, 12, '#D7263D') +
    p(estrella(50, 44, 7), '#F7B500', 'stroke-width="1.5"'),

  cempasuchil:
    [0, 45, 90, 135, 180, 225, 270, 315].map((g) => e(50, 26, 10, 18, '#F7A21B', `transform="rotate(${g} 50 50)"`)).join('') +
    [22, 67, 112, 157, 202, 247, 292, 337].map((g) => e(50, 33, 8, 13, '#F26A1B', `transform="rotate(${g} 50 50)"`)).join('') +
    c(50, 50, 11, '#E0530F') +
    c(50, 50, 5, '#8A3A00', sinTrazo),

  pinata:
    [0, 51.4, 102.8, 154.2, 205.6, 257, 308.4].map((g, i) =>
      p('M44 34 L50 6 L56 34Z', ['#E4007C', '#F7B500', '#0B8A4A', '#1E4FA3', '#F26A1B', '#7B2FBE', '#D7263D'][i], `transform="rotate(${g} 50 52)"`),
    ).join('') +
    c(50, 52, 20, '#FFE066') +
    p('M32 46 H68 M31 54 H69 M34 62 H66', 'none', 'stroke="#E4007C" stroke-width="3"'),

  // ---------- exclusivas ----------
  sol_azteca:
    [...Array(16)].map((_, i) => p('M46 12 L50 2 L54 12Z', '#E0B100', `transform="rotate(${i * 22.5} 50 50)"`)).join('') +
    c(50, 50, 38, '#F7C948') +
    c(50, 50, 30, 'none', 'stroke="#9C7A00" stroke-width="2" stroke-dasharray="4 3"') +
    c(50, 50, 20, '#E0B100') +
    c(43, 46, 2.5, TINTA, sinTrazo) + c(57, 46, 2.5, TINTA, sinTrazo) +
    p('M44 57 Q50 52 56 57 L50 63Z', '#D7263D') +
    p('M50 30 L50 24 M50 70 L50 76 M30 50 L24 50 M70 50 L76 50', 'none', 'stroke="#9C7A00" stroke-width="3"'),

  corona_oro:
    p('M18 72 L14 30 L32 48 L50 20 L68 48 L86 30 L82 72Z', '#F7C948') +
    p('M18 72 H82 V84 H18Z', '#E0B100') +
    c(14, 30, 5, '#D7263D') + c(50, 20, 6, '#1E4FA3') + c(86, 30, 5, '#0B8A4A') +
    e(50, 60, 6, 8, '#D7263D') + e(32, 62, 4, 5, '#0B8A4A') + e(68, 62, 4, 5, '#1E4FA3') +
    c(30, 78, 2.5, '#FFFFFF', sinTrazo) + c(50, 78, 2.5, '#FFFFFF', sinTrazo) + c(70, 78, 2.5, '#FFFFFF', sinTrazo) +
    brillo('M26 60 L24 42'),

  aguila:
    p('M24 76 Q18 42 42 26 Q62 14 76 30 Q85 43 71 50 L61 53 Q58 66 65 80Z', '#7A4B2A') +
    p('M31 46 Q40 30 58 27', 'none', 'stroke="#E0B100" stroke-width="4"') +
    p('M70 33 Q90 35 88 51 Q82 46 72 48Z', '#F7B500') +
    c(62, 36, 4, '#F7B500') + c(62, 36, 1.8, TINTA, sinTrazo) +
    p('M40 58 Q46 62 52 60 M36 66 Q44 70 52 68', 'none', 'stroke="#B97A45" stroke-width="2"'),
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
