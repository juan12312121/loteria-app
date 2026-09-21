import { colores } from '../tema';

/**
 * Cómo se ve cada skin de carta: colores del marco y, opcionalmente, un patrón
 * dibujado en SVG que llena el marco (talavera, grecas, papel picado...).
 * Las fichas no están aquí: tienen dibujo propio en fichas.ts.
 */
export interface AparienciaCarta {
  fondo: string;
  marco: string;
  acento: string;
  texto: string;
  /** Mosaico SVG de 10×10 unidades que se repite en el marco */
  patron?: string;
}

const CARTAS: Record<string, AparienciaCarta> = {
  clasica: { fondo: colores.papel, marco: colores.tinta, acento: colores.rosa, texto: colores.tinta },

  papel_picado: {
    fondo: '#FFF0F7', marco: colores.rosa, acento: colores.amarillo, texto: colores.tinta,
    patron:
      `<rect width="10" height="10" fill="${colores.rosa}"/>` +
      `<path d="M5 1.5 L8.5 5 L5 8.5 L1.5 5Z" fill="#FFF0F7"/>` +
      `<circle cx="5" cy="5" r="1.2" fill="${colores.rosa}"/>` +
      `<circle cx="0" cy="0" r="1" fill="${colores.amarillo}"/><circle cx="10" cy="10" r="1" fill="${colores.amarillo}"/>` +
      `<circle cx="10" cy="0" r="1" fill="${colores.amarillo}"/><circle cx="0" cy="10" r="1" fill="${colores.amarillo}"/>`,
  },

  dia_muertos: {
    fondo: '#FFF3E0', marco: '#F26A1B', acento: '#7B2FBE', texto: '#3B1F0B',
    patron:
      `<rect width="10" height="10" fill="#7B2FBE"/>` +
      `<g fill="#F7A21B"><circle cx="5" cy="3" r="1.6"/><circle cx="7" cy="5" r="1.6"/><circle cx="5" cy="7" r="1.6"/><circle cx="3" cy="5" r="1.6"/></g>` +
      `<circle cx="5" cy="5" r="1.3" fill="#F26A1B"/>` +
      `<circle cx="0" cy="0" r="0.8" fill="#FFF3E0"/><circle cx="10" cy="10" r="0.8" fill="#FFF3E0"/><circle cx="10" cy="0" r="0.8" fill="#FFF3E0"/><circle cx="0" cy="10" r="0.8" fill="#FFF3E0"/>`,
  },

  lucha_libre: {
    fondo: '#EAF1FF', marco: colores.anil, acento: colores.rojo, texto: '#0F1D3A',
    patron:
      `<rect width="10" height="10" fill="${colores.anil}"/>` +
      `<path d="M0 10 L10 0 M-2 2 L2 -2 M8 12 L12 8" stroke="${colores.rojo}" stroke-width="2.4"/>` +
      `<path d="M3 1.5 L3.6 2.8 L5 3 L4 3.9 L4.2 5.3 L3 4.6 L1.8 5.3 L2 3.9 L1 3 L2.4 2.8Z" fill="#FFFFFF"/>`,
  },

  neon: {
    fondo: '#1B1030', marco: '#FF2FB9', acento: '#29F0FF', texto: '#FFFFFF',
    patron:
      `<rect width="10" height="10" fill="#1B1030"/>` +
      `<path d="M0 0 H10 M0 0 V10" stroke="#29F0FF" stroke-width="0.8" stroke-opacity="0.8"/>` +
      `<circle cx="5" cy="5" r="1.4" fill="#FF2FB9"/>`,
  },

  // ---------- lugares y artesanías de México ----------
  talavera: {
    fondo: '#FBFAF4', marco: '#1F4E9C', acento: '#F2A93B', texto: '#142F5E',
    patron:
      `<rect width="10" height="10" fill="#FBFAF4"/>` +
      `<g fill="#1F4E9C"><ellipse cx="5" cy="2.3" rx="1.3" ry="2"/><ellipse cx="5" cy="7.7" rx="1.3" ry="2"/>` +
      `<ellipse cx="2.3" cy="5" rx="2" ry="1.3"/><ellipse cx="7.7" cy="5" rx="2" ry="1.3"/></g>` +
      `<circle cx="5" cy="5" r="1.2" fill="#F2A93B"/>` +
      `<path d="M0 0 L1.8 0 L0 1.8Z M10 0 L8.2 0 L10 1.8Z M0 10 L1.8 10 L0 8.2Z M10 10 L8.2 10 L10 8.2Z" fill="#1F4E9C"/>`,
  },

  alebrije: {
    fondo: '#FFF8E6', marco: '#E4007C', acento: '#00A6A6', texto: '#2B0A3D',
    patron:
      `<rect width="10" height="10" fill="#E4007C"/>` +
      `<path d="M0 3 L2.5 1 L5 3 L7.5 1 L10 3 V5.5 L7.5 3.5 L5 5.5 L2.5 3.5 L0 5.5Z" fill="#F7C948"/>` +
      `<path d="M0 7.5 L2.5 5.5 L5 7.5 L7.5 5.5 L10 7.5 V10 H0Z" fill="#00A6A6"/>` +
      `<circle cx="2.5" cy="8.5" r="0.8" fill="#FFFFFF"/><circle cx="7.5" cy="8.5" r="0.8" fill="#FFFFFF"/>`,
  },

  chichen_itza: {
    fondo: '#F6EEDD', marco: '#8A6A3F', acento: '#3E8E5A', texto: '#3A2A14',
    patron:
      `<rect width="10" height="10" fill="#C9A66B"/>` +
      `<path d="M0 10 V8 H2 V6 H4 V4 H6 V6 H8 V8 H10 V10Z" fill="#8A6A3F"/>` +
      `<path d="M4.4 4 V2.4 H5.6 V4" fill="#8A6A3F"/>` +
      `<path d="M0 2 H3 M7 2 H10" stroke="#F6EEDD" stroke-width="0.8"/>`,
  },

  xochimilco: {
    fondo: '#FFFBEF', marco: '#1BA0D8', acento: '#E4007C', texto: '#10283A',
    patron:
      `<rect width="10" height="10" fill="#1BA0D8"/>` +
      `<rect y="0" width="10" height="2.5" fill="#F7C948"/><rect y="2.5" width="10" height="2.5" fill="#E4007C"/>` +
      `<rect y="5" width="10" height="2.5" fill="#0B8A4A"/>` +
      `<path d="M0 8.8 Q2.5 7.6 5 8.8 T10 8.8" stroke="#FFFFFF" stroke-width="0.8" fill="none"/>` +
      `<circle cx="5" cy="3.75" r="0.9" fill="#FFFFFF"/>`,
  },

  bellas_artes: {
    fondo: '#FFF9EC', marco: '#1C1A17', acento: '#D4A017', texto: '#1C1A17',
    patron:
      `<rect width="10" height="10" fill="#1C1A17"/>` +
      `<path d="M0 10 A5 5 0 0 1 10 10 M2 10 A3 3 0 0 1 8 10 M4 10 A1 1 0 0 1 6 10 M5 5 V0" stroke="#D4A017" stroke-width="0.7" fill="none"/>` +
      `<path d="M0 5 A5 5 0 0 1 5 0 M10 5 A5 5 0 0 0 5 0" stroke="#D4A017" stroke-width="0.5" fill="none"/>`,
  },

  caribe: {
    fondo: '#F2FCFB', marco: '#00A6A6', acento: '#F2D39B', texto: '#0A3B3B',
    patron:
      `<rect width="10" height="10" fill="#7FE0DC"/>` +
      `<path d="M0 3 Q2.5 1 5 3 T10 3 V6 Q7.5 4 5 6 T0 6Z" fill="#00A6A6"/>` +
      `<path d="M0 8 Q2.5 6.5 5 8 T10 8 V10 H0Z" fill="#F2D39B"/>`,
  },

  // ---------- animales nacionales ----------
  selva_jaguar: {
    fondo: '#FFF6E5', marco: '#B8741A', acento: '#0B8A4A', texto: '#3A2208',
    patron:
      `<rect width="10" height="10" fill="#F2A93B"/>` +
      `<g fill="none" stroke="#3A2208" stroke-width="0.9"><circle cx="2.8" cy="2.8" r="1.5"/><circle cx="7.6" cy="7.2" r="1.5"/></g>` +
      `<g fill="#3A2208"><circle cx="2.8" cy="2.8" r="0.5"/><circle cx="7.6" cy="7.2" r="0.5"/><circle cx="8" cy="2" r="0.7"/><circle cx="2" cy="8" r="0.7"/></g>`,
  },

  ajolote_lago: {
    fondo: '#FFF1F6', marco: '#E4557F', acento: '#5BC0EB', texto: '#4A1027',
    patron:
      `<rect width="10" height="10" fill="#9FD8F0"/>` +
      `<g fill="#FFFFFF" fill-opacity="0.85"><circle cx="2.5" cy="2.5" r="1.2"/><circle cx="7.5" cy="6.5" r="1.6"/><circle cx="4.5" cy="8.5" r="0.7"/></g>` +
      `<path d="M6 1 Q7.5 2.5 9 1 M1 5.5 Q2 6.8 3.2 5.5" stroke="#E4557F" stroke-width="0.8" fill="none"/>`,
  },

  monarca: {
    fondo: '#FFF6EC', marco: '#1C1A17', acento: '#F26A1B', texto: '#2A1405',
    patron:
      `<rect width="10" height="10" fill="#F26A1B"/>` +
      `<path d="M0 0 L5 5 L10 0 M5 5 L5 10 M0 7 L5 5 L10 7" stroke="#1C1A17" stroke-width="0.9" fill="none"/>` +
      `<g fill="#FFFFFF"><circle cx="1" cy="9" r="0.5"/><circle cx="9" cy="9" r="0.5"/><circle cx="2.3" cy="9.6" r="0.4"/><circle cx="7.7" cy="9.6" r="0.4"/></g>`,
  },
};

export const aparienciaCarta = (clave?: string | null) => CARTAS[clave ?? ''] ?? CARTAS.clasica;

const cacheMarco = new Map<string, string | null>();

/**
 * SVG del marco de una skin (viewBox 60×80, proporción de carta) con el patrón
 * repetido. null si la skin no tiene patrón (la clásica es lisa).
 */
export function svgDeMarcoCarta(clave?: string | null): string | null {
  const llave = clave ?? '';
  if (cacheMarco.has(llave)) return cacheMarco.get(llave)!;
  const patron = aparienciaCarta(clave).patron;
  const svg = patron
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80" preserveAspectRatio="xMidYMid slice">` +
      `<defs><pattern id="m" width="10" height="10" patternUnits="userSpaceOnUse">${patron}</pattern></defs>` +
      `<rect width="60" height="80" fill="url(#m)"/></svg>`
    : null;
  cacheMarco.set(llave, svg);
  return svg;
}

/** Data URI del marco para usarlo como background-image en la web. */
export function dataUriDeMarcoCarta(clave?: string | null): string | null {
  const svg = svgDeMarcoCarta(clave);
  return svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : null;
}
