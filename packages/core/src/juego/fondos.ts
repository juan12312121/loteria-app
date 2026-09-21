/**
 * Fondos de sala (skin "fondo"): un mosaico SVG de 120×120 que se repite
 * detrás de la sala. Colores suaves para que las tablas sigan leyéndose bien.
 */

interface Fondo {
  /** Color base (también sirve mientras carga) */
  base: string;
  /** Dibujo del mosaico, en unidades 0–120 */
  mosaico: string;
}

const banderitas = (y: number, colores: string[]) =>
  `<path d="M0 ${y} Q60 ${y + 10} 120 ${y}" fill="none" stroke="#8A8578" stroke-width="1.2" stroke-opacity="0.5"/>` +
  colores
    .map((col, i) => {
      const x = 8 + i * 24;
      const yy = y + 3 + Math.sin((i / (colores.length - 1)) * Math.PI) * 4;
      return `<path d="M${x} ${yy} h16 v14 l-4 -3 l-4 3 l-4 -3 l-4 3Z" fill="${col}" fill-opacity="0.35"/>`;
    })
    .join('');

const foquitos = (y: number) =>
  `<path d="M0 ${y} Q30 ${y + 14} 60 ${y} T120 ${y}" fill="none" stroke="#5C574D" stroke-width="1.2" stroke-opacity="0.45"/>` +
  ['#E4007C', '#F7B500', '#0B8A4A', '#1E4FA3', '#F26A1B']
    .map((col, i) => {
      const x = 12 + i * 24;
      const yy = y + 5 + Math.round(Math.sin((x / 60) * Math.PI) * 5);
      return `<circle cx="${x}" cy="${yy + 4}" r="5" fill="${col}" fill-opacity="0.45"/><circle cx="${x}" cy="${yy + 4}" r="9" fill="${col}" fill-opacity="0.12"/>`;
    })
    .join('');

const vela = (x: number, y: number) =>
  `<rect x="${x}" y="${y}" width="8" height="18" rx="1.5" fill="#FFFFFF" fill-opacity="0.8"/>` +
  `<path d="M${x + 4} ${y - 9} Q${x + 8} ${y - 3} ${x + 4} ${y} Q${x} ${y - 3} ${x + 4} ${y - 9}Z" fill="#F7A21B"/>` +
  `<circle cx="${x + 4}" cy="${y - 4}" r="9" fill="#F7B500" fill-opacity="0.15"/>`;

const estrellita = (x: number, y: number, r: number, col: string) =>
  `<path d="M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3}Z" fill="${col}"/>`;

const FONDOS: Record<string, Fondo> = {
  feria: {
    base: '#FFF6E5',
    mosaico: banderitas(10, ['#E4007C', '#F7B500', '#0B8A4A', '#1E4FA3', '#F26A1B']) + banderitas(70, ['#F26A1B', '#1E4FA3', '#E4007C', '#0B8A4A', '#F7B500']),
  },
  kermes: {
    base: '#FFF3DC',
    mosaico: foquitos(8) + foquitos(68),
  },
  playa: {
    base: '#FBEBC8',
    mosaico:
      `<path d="M0 30 Q15 20 30 30 T60 30 T90 30 T120 30" fill="none" stroke="#00A6A6" stroke-width="3" stroke-opacity="0.35"/>` +
      `<path d="M0 44 Q15 34 30 44 T60 44 T90 44 T120 44" fill="none" stroke="#5BC0EB" stroke-width="2" stroke-opacity="0.3"/>` +
      `<circle cx="30" cy="90" r="4" fill="#F26A1B" fill-opacity="0.3"/><circle cx="90" cy="100" r="3" fill="#E4557F" fill-opacity="0.3"/>` +
      `<path d="M70 80 q6 -8 12 0 q-6 4 -12 0Z" fill="#C9A66B" fill-opacity="0.5"/>`,
  },
  cantina: {
    base: '#EFD9B8',
    mosaico:
      `<path d="M0 0 H120 M0 30 H120 M0 60 H120 M0 90 H120" stroke="#A0703C" stroke-width="2" stroke-opacity="0.3"/>` +
      `<path d="M40 0 V30 M100 30 V60 M20 60 V90 M80 90 V120" stroke="#A0703C" stroke-width="1.5" stroke-opacity="0.25"/>` +
      `<path d="M58 12 q4 -4 8 0 M14 42 q4 -4 8 0 M72 72 q4 -4 8 0 M30 102 q4 -4 8 0" fill="none" stroke="#7A4B2A" stroke-width="1" stroke-opacity="0.35"/>`,
  },
  panteon: {
    base: '#EFE4F6',
    mosaico:
      vela(18, 30) + vela(78, 90) +
      `<path d="M92 14 v18 M85 20 h14" stroke="#7B2FBE" stroke-width="3" stroke-opacity="0.25"/>` +
      `<path d="M30 76 v16 M24 82 h12" stroke="#7B2FBE" stroke-width="3" stroke-opacity="0.25"/>` +
      `<circle cx="60" cy="56" r="3" fill="#F26A1B" fill-opacity="0.4"/>`,
  },
  noche_feria: {
    base: '#E6ECF8',
    mosaico:
      estrellita(20, 18, 5, '#1E4FA3') + estrellita(96, 40, 4, '#E4007C') + estrellita(50, 96, 5, '#F7B500') +
      `<g fill="none" stroke="#1E4FA3" stroke-opacity="0.25" stroke-width="2"><circle cx="72" cy="86" r="22"/>` +
      `<path d="M72 64 V108 M50 86 H94 M56 70 L88 102 M88 70 L56 102"/></g>` +
      [0, 45, 90, 135, 180, 225, 270, 315]
        .map((g) => `<circle cx="72" cy="64" r="3.5" fill="#E4007C" fill-opacity="0.35" transform="rotate(${g} 72 86)"/>`)
        .join(''),
  },
  altar: {
    base: '#FFF0E0',
    mosaico:
      banderitas(8, ['#7B2FBE', '#F26A1B', '#E4007C', '#7B2FBE', '#F26A1B']) +
      [[24, 70], [80, 96], [60, 60], [100, 66]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#F7A21B" fill-opacity="0.45"/><circle cx="${x}" cy="${y}" r="2" fill="#E0530F" fill-opacity="0.5"/>`)
        .join('') +
      vela(36, 96),
  },
};

export const FONDO_POR_DEFECTO = 'feria';
const fondo = (clave?: string | null) => FONDOS[clave ?? ''] ?? FONDOS[FONDO_POR_DEFECTO];

export const colorDeFondo = (clave?: string | null) => fondo(clave).base;

/** Mosaico 120×120 (web: background-image que se repite). */
export function svgMosaicoFondo(clave?: string | null) {
  const f = fondo(clave);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="${f.base}"/>${f.mosaico}</svg>`;
}

export const dataUriDeFondo = (clave?: string | null) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMosaicoFondo(clave))}`;

/** Fondo completo con el mosaico repetido (móvil: SvgXml que llena la pantalla). */
export function svgDeFondo(clave?: string | null) {
  const f = fondo(clave);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 960" preserveAspectRatio="xMidYMid slice">` +
    `<defs><pattern id="f" width="120" height="120" patternUnits="userSpaceOnUse">${f.mosaico}</pattern></defs>` +
    `<rect width="480" height="960" fill="${f.base}"/><rect width="480" height="960" fill="url(#f)"/></svg>`
  );
}

export const fondosIlustrados = () => Object.keys(FONDOS);
