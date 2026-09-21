/**
 * Ilustraciones propias de las 54 cartas, dibujadas en SVG (viewBox 100×100)
 * con el estilo de la baraja impresa: fondo de color, contorno de tinta grueso
 * y colores planos. Son originales: no copian ninguna edición comercial.
 */

const TINTA = '#1C1A17';
const C = {
  rojo: '#D7263D', rosa: '#E4007C', amarillo: '#F7B500', oro: '#E0A800', verde: '#0B8A4A', verdeOsc: '#067038',
  anil: '#1E4FA3', azul: '#3E7BD8', naranja: '#F26A1B', cafe: '#7A4B2A', cafeClaro: '#B97A45', barro: '#C8641E',
  barroClaro: '#E08A45', crema: '#FFF6E5', piel: '#F2C9A0', blanco: '#FFFFFF', gris: '#9AA0A6', lima: '#C9D86A',
  negro: TINTA, morado: '#7B2FBE',
} as const;

// ---------- primitivas (el grupo ya trae contorno de tinta y fill="none") ----------
const p = (d: string, fill?: string, extra = '') => `<path d="${d}"${fill ? ` fill="${fill}"` : ''}${extra ? ` ${extra}` : ''}/>`;
const c = (cx: number, cy: number, r: number, fill?: string, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}"${fill ? ` fill="${fill}"` : ''}${extra ? ` ${extra}` : ''}/>`;
const e = (cx: number, cy: number, rx: number, ry: number, fill?: string) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${fill ? ` fill="${fill}"` : ''}/>`;
const r = (x: number, y: number, w: number, h: number, fill?: string, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${fill ? ` fill="${fill}"` : ''}${extra ? ` ${extra}` : ''}/>`;
const trazo = (color: string, ancho = 2.5) => `stroke="${color}" stroke-width="${ancho}"`;
const ojo = (cx: number, cy: number, r = 1.8) => c(cx, cy, r, TINTA, 'stroke="none"');

const redondo = (n: number) => Math.round(n * 10) / 10;

/** Estrella de n puntas como path. */
function estrella(cx: number, cy: number, radio: number, fill: string, puntas = 5) {
  const pts: string[] = [];
  for (let i = 0; i < puntas * 2; i++) {
    const rr = i % 2 === 0 ? radio : radio * 0.45;
    const a = (Math.PI / puntas) * i - Math.PI / 2;
    pts.push(`${redondo(cx + rr * Math.cos(a))} ${redondo(cy + rr * Math.sin(a))}`);
  }
  return p(`M${pts.join(' L')}Z`, fill);
}

/** Rayos triangulares alrededor de un centro (sol). */
function rayos(cx: number, cy: number, r1: number, r2: number, n: number, fill: string) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = ((Math.PI * 2) / n) * i;
    const ancho = Math.PI / n / 1.6;
    const x1 = redondo(cx + r1 * Math.cos(a - ancho)), y1 = redondo(cy + r1 * Math.sin(a - ancho));
    const x2 = redondo(cx + r2 * Math.cos(a)), y2 = redondo(cy + r2 * Math.sin(a));
    const x3 = redondo(cx + r1 * Math.cos(a + ancho)), y3 = redondo(cy + r1 * Math.sin(a + ancho));
    d += `M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}Z`;
  }
  return p(d, fill);
}

/** Flecha con punta y plumas, de (x1,y1) a la punta (x2,y2). */
function flecha(x1: number, y1: number, x2: number, y2: number) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const punta = (dist: number, giro: number) => `${redondo(x2 - dist * Math.cos(ang + giro))} ${redondo(y2 - dist * Math.sin(ang + giro))}`;
  const pluma = (dist: number, giro: number) => `${redondo(x1 + dist * Math.cos(ang + giro))} ${redondo(y1 + dist * Math.sin(ang + giro))}`;
  return (
    p(`M${x1} ${y1} L${x2} ${y2}`, undefined, trazo(C.cafe, 3)) +
    p(`M${x2} ${y2} L${punta(10, 0.35)} L${punta(10, -0.35)}Z`, C.gris) +
    p(`M${x1} ${y1} L${pluma(9, 0.5)} L${pluma(4, 0)} L${pluma(9, -0.5)}Z`, C.rojo)
  );
}

// ---------- las 54 cartas ----------
interface Arte {
  fondo: string;
  dibujo: string;
}

const ARTE: Record<number, Arte> = {
  1: { // El Gallo
    fondo: '#FFE08A',
    dibujo:
      p('M32 60 Q8 45 16 22 Q26 40 38 50', C.verde) +
      p('M36 56 Q18 30 30 16 Q34 36 42 46', C.anil) +
      p('M30 70 Q22 40 40 32 Q52 26 60 36 L66 50 Q70 66 56 74Z', C.rojo) +
      p('M44 50 Q52 46 58 56 Q50 62 44 50Z', C.naranja) +
      c(62, 30, 9, C.rojo) +
      p('M56 23 Q57 12 62 20 Q64 10 67 20 Q72 13 70 25', C.rojo) +
      p('M70 28 L81 31 L70 34Z', C.amarillo) +
      p('M68 36 Q70 45 64 42', C.rojo) +
      ojo(64, 28) +
      p('M46 74 L44 88 M56 74 L58 88 M39 88 L49 88 M53 88 L63 88', undefined, trazo(C.naranja, 3)),
  },
  2: { // El Diablito
    fondo: '#2B2D6E',
    dibujo:
      p('M79 26 L79 92', undefined, trazo(C.negro, 3)) +
      p('M72 32 Q72 20 79 20 Q86 20 86 32 M79 20 L79 12', undefined, trazo(C.amarillo, 3)) +
      p('M36 34 Q24 20 29 10 Q36 23 43 29Z', C.amarillo) +
      p('M64 34 Q76 20 71 10 Q64 23 57 29Z', C.amarillo) +
      p('M34 40 Q34 70 50 78 Q66 70 66 40 Q66 28 50 28 Q34 28 34 40Z', C.rojo) +
      p('M40 45 L47 48 M60 45 L53 48') +
      ojo(44, 51, 2.2) + ojo(56, 51, 2.2) +
      p('M42 62 Q50 70 58 62') +
      p('M46 76 L50 88 L54 76', C.rojo),
  },
  3: { // La Dama
    fondo: '#FFD1E6',
    dibujo:
      p('M34 90 L41 54 Q50 49 59 54 L66 90Z', C.anil) +
      p('M36 78 L64 78', undefined, trazo(C.blanco, 2)) +
      p('M42 57 Q33 67 38 76 M58 57 Q67 64 72 58') +
      p('M41 36 Q38 48 44 51 L56 51 Q62 48 59 36Z', C.cafe) +
      c(50, 39, 8, C.piel) +
      ojo(47, 39, 1.3) + ojo(53, 39, 1.3) +
      p('M47 43 Q50 45 53 43') +
      e(50, 30, 21, 5, C.rosa) +
      p('M41 30 Q43 19 50 19 Q57 19 59 30Z', C.rosa) +
      c(58, 23, 3, C.amarillo),
  },
  4: { // El Catrín
    fondo: '#E9D8B4',
    dibujo:
      p('M36 90 L39 56 Q50 50 61 56 L64 90Z', C.negro) +
      p('M45 56 L50 72 L55 56Z', C.blanco) +
      p('M45 57 L50 60 L55 57 L55 62 L50 60 L45 62Z', C.rojo) +
      c(50, 42, 8, C.piel) +
      r(42, 16, 16, 20, C.negro) + r(36, 34, 28, 4, C.negro) + r(42, 29, 16, 3, C.rojo) +
      p('M44 46 Q50 43 56 46 Q50 49.5 44 46Z', C.negro) +
      ojo(47, 41, 1.3) + ojo(53, 41, 1.3) +
      p('M70 58 L72 92 M70 58 Q68 51 75 52', undefined, trazo(C.cafe, 3)),
  },
  5: { // El Paraguas
    fondo: '#CFE8FF',
    dibujo:
      p('M50 50 L50 82 Q50 90 42 88', undefined, trazo(C.cafe, 3.5)) +
      p('M18 50 Q50 8 82 50 Q74 44 66 50 Q58 44 50 50 Q42 44 34 50 Q26 44 18 50Z', C.rojo) +
      p('M50 22 Q40 34 34 50 M50 22 Q60 34 66 50 M50 22 L50 50') +
      p('M50 22 L50 13'),
  },
  6: { // La Sirena
    fondo: '#BFE9E4',
    dibujo:
      p('M12 90 Q18 85 24 90 Q30 95 36 90 M64 92 Q70 87 76 92 Q82 97 88 92', undefined, trazo(C.anil, 2)) +
      p('M45 58 Q40 76 52 82 Q60 86 67 80 Q58 78 56 70 Q56 60 55 56Z', C.verde) +
      p('M67 80 Q80 72 82 84 Q74 86 67 80 Q72 92 60 93Z', C.verde) +
      p('M42 40 Q41 58 46 60 L56 58 Q59 44 57 40Z', C.piel) +
      p('M43 46 Q49 50 56 46 L56 51 Q49 55 43 51Z', C.rosa) +
      p('M41 31 Q40 19 50 21 Q61 21 59 34 Q61 46 66 53 Q57 51 56 39', C.amarillo) +
      c(49, 32, 7, C.piel) +
      ojo(47, 32, 1.3) + ojo(52, 32, 1.3) + p('M47 36 Q49.5 38 52 36'),
  },
  7: { // La Escalera
    fondo: '#FFE3C2',
    dibujo:
      p('M33 92 L42 10 M67 92 L58 10', undefined, trazo(C.cafe, 6)) +
      p('M41 22 L59 22 M39.5 36 L60.5 36 M38.1 50 L61.9 50 M36.7 64 L63.3 64 M35.2 78 L64.8 78', undefined, trazo(C.cafe, 5)) +
      p('M33 92 L42 10 M67 92 L58 10', undefined, trazo(C.negro, 1.2)),
  },
  8: { // La Botella
    fondo: '#D6F0D0',
    dibujo:
      r(45, 7, 10, 8, C.cafeClaro) +
      p('M44 14 L56 14 L56 30 Q66 38 66 50 L66 86 Q66 90 62 90 L38 90 Q34 90 34 86 L34 50 Q34 38 44 30Z', C.verde) +
      r(38, 56, 24, 16, C.crema) +
      p('M42 62 L58 62 M44 67 L56 67', undefined, trazo(C.rojo, 2)) +
      p('M39 46 L39 80', undefined, trazo(C.blanco, 2.5)),
  },
  9: { // El Barril
    fondo: '#F3D9B1',
    dibujo:
      p('M32 18 Q23 50 32 82 L68 82 Q77 50 68 18Z', C.cafeClaro) +
      p('M41 18 Q37 50 41 82 M59 18 Q63 50 59 82', undefined, trazo(C.cafe, 1.5)) +
      p('M29 32 L71 32 M26 50 L74 50 M29 68 L71 68', undefined, trazo(C.gris, 3.5)) +
      e(50, 18, 18, 5, C.cafe),
  },
  10: { // El Árbol
    fondo: '#DDF3E6',
    dibujo:
      p('M44 90 L46 56 L54 56 L56 90Z', C.cafe) +
      c(34, 46, 13, C.verde) + c(66, 46, 13, C.verde) + c(50, 34, 20, C.verde) +
      c(42, 30, 2.8, C.rojo) + c(58, 26, 2.8, C.rojo) + c(36, 48, 2.8, C.rojo) + c(64, 46, 2.8, C.rojo) + c(52, 42, 2.8, C.rojo) +
      p('M20 90 L80 90', undefined, trazo(C.verdeOsc, 3)),
  },
  11: { // El Melón
    fondo: '#FFEFD0',
    dibujo:
      c(60, 38, 22, C.lima) +
      p('M46 22 Q54 38 46 56 M60 16 Q66 38 60 60 M74 22 Q80 38 74 54', undefined, trazo(C.verde, 1.5)) +
      p('M14 60 Q50 100 86 60Z', C.verde) +
      p('M19 60 Q50 92 81 60Z', '#F8B26A') +
      e(40, 70, 2, 3, C.crema) + e(50, 74, 2, 3, C.crema) + e(60, 70, 2, 3, C.crema) + e(45, 66, 2, 3, C.crema) + e(55, 66, 2, 3, C.crema),
  },
  12: { // El Valiente
    fondo: '#F7D6D0',
    dibujo:
      p('M34 90 L38 58 Q50 52 62 58 L66 90Z', C.rojo) +
      p('M38 70 L62 70 M37 80 L63 80', undefined, trazo(C.amarillo, 3)) +
      c(50, 43, 9, C.piel) +
      p('M44 47 Q50 44 56 47 Q50 50 44 47Z', C.negro) +
      ojo(47, 42, 1.4) + ojo(53, 42, 1.4) +
      p('M42 38 L58 38', undefined, trazo(C.rojo, 3)) +
      e(50, 33, 22, 5, C.amarillo) +
      p('M42 33 Q44 20 50 20 Q56 20 58 33Z', C.amarillo) +
      p('M66 62 L76 44', undefined, trazo(C.cafe, 4)) +
      p('M74 46 L86 22 L79 48Z', C.gris),
  },
  13: { // El Gorrito
    fondo: '#DCE7FF',
    dibujo:
      p('M31 72 Q26 84 32 90 M69 72 Q74 84 68 90', undefined, trazo(C.rosa, 3)) +
      p('M26 64 Q24 30 50 26 Q76 30 74 64 Q50 56 26 64Z', C.rosa) +
      p('M36 40 Q50 34 64 40 M32 52 Q50 44 68 52', undefined, trazo(C.blanco, 2)) +
      p('M23 66 Q29 60 35 66 Q41 60 47 66 Q53 60 59 66 Q65 60 71 66 Q77 70 72 73 L28 73 Q22 70 23 66Z', C.blanco) +
      c(50, 24, 4.5, C.amarillo),
  },
  14: { // La Muerte
    fondo: '#E6E0F5',
    dibujo:
      p('M74 18 L69 92', undefined, trazo(C.cafe, 3.5)) +
      p('M74 18 Q56 9 42 18 Q58 18 72 27Z', C.gris) +
      p('M32 92 Q35 50 50 44 Q65 50 68 92Z', C.negro) +
      p('M40 34 Q40 20 50 20 Q60 20 60 34 Q60 40 56 42 L56 47 L44 47 L44 42 Q40 40 40 34Z', C.blanco) +
      c(45.5, 32, 3.2, C.negro) + c(54.5, 32, 3.2, C.negro) +
      p('M50 36 L48 40 L52 40Z', C.negro) +
      p('M46 44 L46 47 M50 44 L50 47 M54 44 L54 47'),
  },
  15: { // La Pera
    fondo: '#FFF1B8',
    dibujo:
      p('M50 24 L52 13', undefined, trazo(C.cafe, 3)) +
      p('M52 16 Q65 9 67 18 Q59 23 52 16Z', C.verde) +
      p('M50 24 Q60 24 58 40 Q75 52 71 72 Q65 91 50 91 Q35 91 29 72 Q25 52 42 40 Q40 24 50 24Z', C.lima) +
      p('M38 60 Q36 70 42 78', undefined, trazo(C.blanco, 3)),
  },
  16: { // La Bandera
    fondo: '#E8F1FF',
    dibujo:
      p('M24 10 L24 94', undefined, trazo(C.cafe, 4)) +
      r(24, 16, 19, 32, C.verde) + r(43, 16, 19, 32, C.blanco) + r(62, 16, 19, 32, C.rojo) +
      e(52.5, 32, 5, 6, C.cafeClaro) +
      c(24, 9, 3, C.amarillo),
  },
  17: { // El Bandolón
    fondo: '#FFE3C2',
    dibujo:
      p('M52 44 L74 12 L81 17 L59 48Z', C.cafe) +
      e(44, 64, 21, 23, '#C98A4B') +
      c(44, 60, 6, C.negro) +
      r(36, 76, 16, 4, C.cafe) +
      p('M42 78 L76 14 M46 78 L79 16', undefined, trazo(C.crema, 1)),
  },
  18: { // El Violoncello
    fondo: '#F5E6D3',
    dibujo:
      p('M18 72 L82 38', undefined, trazo(C.cafe, 2.5)) +
      r(47, 8, 6, 24, C.negro) +
      p('M50 30 Q34 30 36 46 Q30 52 34 60 Q30 80 50 85 Q70 80 66 60 Q70 52 64 46 Q66 30 50 30Z', '#B5562C') +
      p('M44 52 Q42 58 44 64 M56 52 Q58 58 56 64') +
      p('M50 32 L50 80', undefined, trazo(C.crema, 1)) +
      p('M50 85 L50 94'),
  },
  19: { // La Garza
    fondo: '#D7EEF7',
    dibujo:
      p('M12 88 Q24 84 36 88 Q48 92 60 88 Q72 84 88 88', undefined, trazo(C.azul, 2)) +
      p('M46 70 L44 90 M52 70 L55 90', undefined, trazo(C.naranja, 2.5)) +
      p('M34 60 Q40 44 58 48 Q70 52 66 64 Q56 74 40 70Z', C.blanco) +
      p('M56 50 Q48 34 58 22 L63 24 Q55 36 62 50Z', C.blanco) +
      c(62, 22, 5, C.blanco) +
      p('M66 21 L84 24 L66 25.5Z', C.amarillo) +
      ojo(62, 21, 1.3),
  },
  20: { // El Pájaro
    fondo: '#FFF4D6',
    dibujo:
      p('M12 70 L88 64', undefined, trazo(C.cafe, 4)) +
      p('M32 58 L15 49 L19 63Z', C.anil) +
      p('M30 56 Q36 38 54 40 Q66 42 64 54 Q60 66 44 66 Q34 66 30 56Z', C.anil) +
      p('M40 50 Q50 45 57 54 Q46 61 40 50Z', C.azul) +
      c(62, 44, 8, C.anil) +
      p('M69 43 L77 46 L69 48Z', C.naranja) +
      ojo(63, 42, 1.6) +
      p('M46 66 L44 70 M52 66 L52 70'),
  },
  21: { // La Mano
    fondo: '#FCE3D2',
    dibujo:
      p('M36 92 L36 56 L29 44 Q27 38 32 37 Q37 37 40 45 L40 26 Q40 20 44 20 Q48 20 48 26 L48 42 L48 19 Q48 14 52 14 Q56 14 56 19 L56 42 L56 23 Q56 18 60 18 Q64 18 64 23 L64 46 L64 31 Q64 27 68 27 Q72 27 72 31 L72 62 Q72 80 64 92Z', C.piel) +
      p('M44 70 Q52 74 60 70', undefined, trazo(C.cafeClaro, 1.5)),
  },
  22: { // La Bota
    fondo: '#E4F0D8',
    dibujo:
      p('M36 16 L60 16 L60 60 Q60 66 70 68 L82 72 Q87 74 87 80 L87 86 L36 86Z', C.cafe) +
      r(34, 84, 55, 6, C.negro) +
      r(34, 12, 28, 7, C.cafeClaro) +
      p('M40 30 L56 30 M40 40 L56 40 M40 50 L56 50', undefined, trazo(C.amarillo, 1.5)),
  },
  23: { // La Luna
    fondo: '#1E3A6E',
    dibujo:
      estrella(80, 22, 6, C.amarillo) + estrella(74, 74, 4, C.amarillo) + estrella(20, 16, 3.5, C.amarillo) +
      p('M60 12 A38 38 0 1 0 60 88 A30 30 0 0 1 60 12Z', C.amarillo) +
      p('M30 42 Q34 39 37 43') +
      p('M28 60 Q33 64 38 60') +
      c(28, 51, 3, '#F8C9A0', 'stroke="none"'),
  },
  24: { // El Cotorro
    fondo: '#FFF1C9',
    dibujo:
      p('M20 84 L80 84', undefined, trazo(C.cafe, 4)) +
      p('M44 72 L39 95 L50 93 L52 74Z', C.anil) +
      p('M40 34 Q56 26 62 42 Q66 60 56 74 Q48 84 40 72 Q34 56 40 34Z', C.verde) +
      p('M44 48 Q56 50 56 66 Q46 64 44 48Z', C.verdeOsc) +
      p('M60 36 Q71 38 67 49 Q62 44 58 44Z', C.amarillo) +
      c(54, 38, 3.5, C.blanco) + ojo(54.5, 38, 1.5) +
      p('M44 36 Q48 30 54 32', undefined, trazo(C.rojo, 3)),
  },
  25: { // El Borracho
    fondo: '#F4E1C1',
    dibujo:
      p('M66 50 L72 50 L72 58 Q76 62 76 66 L76 88 L62 88 L62 66 Q62 62 66 58Z', C.verde) +
      c(46, 46, 16, C.piel) +
      c(51, 50, 4.5, C.rosa) +
      c(36, 52, 3.5, '#F5A0A0', 'stroke="none"') + c(58, 54, 3, '#F5A0A0', 'stroke="none"') +
      p('M37 42 L44 44 M49 44 L56 42') +
      p('M40 60 Q44 57 47 60 Q50 63 53 60') +
      p('M28 36 Q46 20 64 36Z', C.cafe) +
      c(24, 22, 3, C.blanco) + c(18, 14, 2, C.blanco) + c(28, 12, 1.5, C.blanco),
  },
  26: { // El Negrito: "el que se comió el azúcar" (se ilustra el azucarero)
    fondo: '#F6E7D8',
    dibujo:
      p('M70 32 L85 15', undefined, trazo(C.gris, 3)) +
      e(66, 35, 6, 3.5, C.gris) +
      r(33, 36, 11, 11, C.blanco) + r(45, 31, 11, 11, C.blanco) + r(57, 38, 11, 11, C.blanco) +
      p('M24 50 L76 50 Q74 81 50 83 Q26 81 24 50Z', C.blanco) +
      p('M27 60 Q50 66 73 60', undefined, trazo(C.anil, 3)) +
      c(38, 70, 2, C.anil) + c(50, 73, 2, C.anil) + c(62, 70, 2, C.anil),
  },
  27: { // El Corazón
    fondo: '#FFE0E6',
    dibujo:
      p('M50 85 Q18 62 18 40 Q18 23 34 23 Q45 23 50 34 Q55 23 66 23 Q82 23 82 40 Q82 62 50 85Z', C.rojo) +
      flecha(14, 72, 86, 26) +
      p('M30 36 Q30 30 36 29', undefined, trazo(C.blanco, 3)),
  },
  28: { // La Sandía
    fondo: '#EAF7E1',
    dibujo:
      p('M12 42 Q50 106 88 42Z', C.verde) +
      p('M18 42 Q50 96 82 42Z', C.blanco) +
      p('M23 42 Q50 89 77 42Z', C.rojo) +
      e(38, 52, 1.8, 3, C.negro) + e(50, 58, 1.8, 3, C.negro) + e(62, 52, 1.8, 3, C.negro) + e(44, 66, 1.8, 3, C.negro) + e(56, 66, 1.8, 3, C.negro) + e(50, 46, 1.8, 3, C.negro),
  },
  29: { // El Tambor
    fondo: '#FFE9C7',
    dibujo:
      p('M30 18 L46 32 M72 12 L58 30', undefined, trazo(C.cafe, 3.5)) +
      c(30, 18, 3, C.cafeClaro) + c(72, 12, 3, C.cafeClaro) +
      p('M26 36 L26 72 Q50 84 74 72 L74 36Z', C.rojo) +
      p('M26 40 L34 70 L42 42 L50 73 L58 42 L66 70 L74 40', undefined, trazo(C.amarillo, 2.5)) +
      e(50, 36, 24, 8, C.crema),
  },
  30: { // El Camarón
    fondo: '#D9F1F5',
    dibujo:
      p('M66 30 Q56 12 36 14 M64 32 Q50 20 30 24', undefined, trazo(C.naranja, 1.8)) +
      p('M40 80 L25 87 L29 73Z', C.naranja) +
      p('M66 30 Q85 44 75 66 Q63 86 40 80 Q30 76 34 68 Q48 72 58 62 Q66 52 58 40Z', C.naranja) +
      p('M72 44 Q64 50 66 58 M72 58 Q62 60 60 68 M62 72 Q54 70 48 76', undefined, trazo(C.negro, 1.5)) +
      ojo(64, 36, 2),
  },
  31: { // Las Jaras
    fondo: '#F7EBD3',
    dibujo: flecha(22, 86, 78, 18) + flecha(50, 92, 50, 12) + flecha(78, 86, 22, 18),
  },
  32: { // El Músico
    fondo: '#FDE2C8',
    dibujo:
      p('M24 92 L29 58 Q40 52 51 58 L55 92Z', C.anil) +
      c(40, 42, 10, C.piel) +
      p('M34 46 Q40 43 46 46 Q40 49 34 46Z', C.negro) +
      ojo(37, 40, 1.3) + ojo(43, 40, 1.3) +
      e(40, 32, 20, 5, C.amarillo) +
      p('M32 32 Q34 20 40 20 Q46 20 48 32Z', C.amarillo) +
      p('M46 48 L68 48 L86 36 L86 62 L68 52 L46 52Z', C.oro) +
      p('M56 48 L56 44 M61 48 L61 44'),
  },
  33: { // La Araña
    fondo: '#EFEFEF',
    dibujo:
      p('M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80', undefined, trazo(C.gris, 1)) +
      c(50, 50, 16, undefined, trazo(C.gris, 1)) + c(50, 50, 30, undefined, trazo(C.gris, 1)) +
      p('M44 56 L28 44 L22 50 M44 60 L26 60 L22 68 M46 64 L32 76 L30 84 M56 56 L72 44 L78 50 M56 60 L74 60 L78 68 M54 64 L68 76 L70 84', undefined, trazo(C.negro, 2.5)) +
      c(50, 60, 10, C.negro) + c(50, 46, 6, C.negro) +
      c(48, 45, 1.2, C.rojo, 'stroke="none"') + c(52, 45, 1.2, C.rojo, 'stroke="none"'),
  },
  34: { // El Soldado
    fondo: '#E2E8D5',
    dibujo:
      p('M71 92 L75 20', undefined, trazo(C.cafe, 3.5)) +
      p('M75 20 L76 10', undefined, trazo(C.gris, 2)) +
      p('M36 92 L38 58 Q50 52 62 58 L64 92Z', C.verde) +
      p('M39 61 L61 88 M61 61 L39 88', undefined, trazo(C.blanco, 3)) +
      c(50, 44, 8, C.piel) +
      ojo(47, 44, 1.3) + ojo(53, 44, 1.3) + p('M47 48 L53 48') +
      p('M41 38 L43 25 L57 25 L59 38Z', C.rojo) +
      p('M38 38 L62 38', undefined, trazo(C.negro, 3.5)),
  },
  35: { // La Estrella
    fondo: '#1E3A6E',
    dibujo:
      estrella(50, 50, 32, C.amarillo) +
      estrella(18, 18, 5, C.blanco) + estrella(84, 22, 4, C.blanco) + estrella(80, 82, 5, C.blanco) + estrella(16, 80, 3.5, C.blanco),
  },
  36: { // El Cazo
    fondo: '#F5E0C8',
    dibujo:
      p('M36 30 Q32 22 38 16 M50 30 Q46 22 52 14 M64 30 Q60 22 66 16', undefined, trazo(C.gris, 2)) +
      p('M22 50 Q10 50 12 58 Q14 63 23 61 M78 50 Q90 50 88 58 Q86 63 77 61', undefined, trazo(C.negro, 3)) +
      p('M22 44 L78 44 L72 78 Q50 89 28 78Z', C.barro) +
      e(50, 44, 28, 6, C.barroClaro) +
      p('M30 60 Q50 66 70 60', undefined, trazo(C.barroClaro, 2)),
  },
  37: { // El Mundo
    fondo: '#DDEBFF',
    dibujo:
      p('M50 76 L50 87 M37 89 L63 89', undefined, trazo(C.cafe, 3.5)) +
      c(50, 46, 29, C.azul) +
      p('M34 30 Q46 26 50 35 Q46 44 37 42 Q31 37 34 30Z', C.verde) +
      p('M54 49 Q67 45 71 56 Q67 70 56 66 Q51 58 54 49Z', C.verde) +
      p('M31 55 Q39 53 41 61 Q37 68 32 64Z', C.verde) +
      e(50, 46, 12, 29) +
      p('M21 46 L79 46', undefined, trazo(C.negro, 1.5)),
  },
  38: { // El Apache: "con pantalón y huarache" (se ilustra el huarache)
    fondo: '#F7E3C6',
    dibujo:
      p('M38 12 Q55 10 59 30 Q63 52 61 72 Q59 91 46 91 Q33 91 33 72 Q31 50 33 30 Q33 14 38 12Z', C.cafe) +
      p('M35 42 L60 38 M34 54 L61 54 M34 66 L61 68', undefined, trazo('#E0B070', 4.5)) +
      p('M44 38 L46 90 M52 38 L52 90', undefined, trazo(C.cafeClaro, 1.2)),
  },
  39: { // El Nopal
    fondo: '#FFF3D6',
    dibujo:
      p('M20 92 L80 92', undefined, trazo(C.cafe, 3)) +
      e(50, 72, 15, 19, C.verde) + e(34, 44, 10, 14, C.verde) + e(66, 42, 10, 14, C.verde) + e(50, 22, 8, 11, C.verde) +
      c(28, 30, 4, C.rosa) + c(72, 28, 4, C.rosa) + c(50, 10, 4, C.rosa) +
      p('M44 64 L42 62 M56 70 L58 68 M48 80 L46 82 M32 44 L30 42 M68 40 L70 38', undefined, trazo(C.amarillo, 1.5)),
  },
  40: { // El Alacrán
    fondo: '#F7E7C4',
    dibujo:
      p('M42 56 L28 50 M42 62 L26 62 M42 68 L28 74 M58 56 L72 50 M58 62 L74 62 M58 68 L72 74', undefined, trazo(C.cafe, 2.5)) +
      p('M44 72 Q32 76 28 88 Q34 83 39 85 Q35 79 46 75', C.cafeClaro) +
      p('M56 72 Q68 76 72 88 Q66 83 61 85 Q65 79 54 75', C.cafeClaro) +
      e(50, 62, 10, 14, C.cafeClaro) +
      c(50, 45, 5, C.cafeClaro) + c(53, 37, 4.5, C.cafeClaro) + c(57, 30, 4, C.cafeClaro) + c(63, 25, 3.5, C.cafeClaro) +
      p('M66 22 Q74 20 71 29Z', C.rojo),
  },
  41: { // La Rosa
    fondo: '#FFE6EE',
    dibujo:
      p('M50 50 L50 93', undefined, trazo(C.verde, 3)) +
      p('M50 70 Q36 62 31 70 Q40 79 50 72Z', C.verde) +
      p('M50 78 Q64 70 69 78 Q60 87 50 80Z', C.verde) +
      c(50, 35, 17, C.rojo) +
      p('M50 29 Q57 31 55 38 Q48 43 43 36 Q43 27 52 25') +
      p('M35 37 Q39 51 50 51 Q61 51 65 37'),
  },
  42: { // La Calavera
    fondo: '#2E2E3A',
    dibujo:
      p('M27 44 Q27 19 50 19 Q73 19 73 44 Q73 58 65 62 L65 73 L35 73 L35 62 Q27 58 27 44Z', C.blanco) +
      c(40, 45, 7.5, C.negro) + c(60, 45, 7.5, C.negro) +
      c(40, 45, 2.8, C.rosa, 'stroke="none"') + c(60, 45, 2.8, C.rosa, 'stroke="none"') +
      p('M50 52 L46 60 L54 60Z', C.negro) +
      p('M39 67 L61 67 M44 63 L44 73 M50 63 L50 73 M56 63 L56 73') +
      c(50, 29, 4, C.amarillo) +
      c(45, 29, 2.5, C.rosa) + c(55, 29, 2.5, C.rosa) + c(50, 24, 2.5, C.rosa) + c(50, 34, 2.5, C.verde),
  },
  43: { // La Campana
    fondo: '#FFF1C9',
    dibujo:
      p('M46 16 Q46 7 50 7 Q54 7 54 16', undefined, trazo(C.negro, 3)) +
      c(50, 83, 5.5, C.negro) +
      p('M50 16 Q66 16 68 40 Q70 62 81 72 L19 72 Q30 62 32 40 Q34 16 50 16Z', C.amarillo) +
      r(17, 70, 66, 7, C.oro, 'rx="3"') +
      p('M40 30 Q38 44 38 56', undefined, trazo(C.blanco, 3)),
  },
  44: { // El Cantarito
    fondo: '#E9F3FF',
    dibujo:
      p('M72 44 Q87 48 81 65', undefined, trazo(C.negro, 4.5)) +
      p('M40 20 L60 20 L58 30 Q76 40 74 62 Q72 85 50 87 Q28 85 26 62 Q24 40 42 30Z', C.barro) +
      e(50, 20, 10, 3, C.barroClaro) +
      p('M30 56 Q50 62 70 56', undefined, trazo(C.blanco, 2.5)) +
      c(38, 68, 2, C.blanco) + c(50, 71, 2, C.blanco) + c(62, 68, 2, C.blanco),
  },
  45: { // El Venado
    fondo: '#EAF3DC',
    dibujo:
      p('M43 36 L34 16 M38 26 L27 22 M36 21 L37 9 M57 36 L66 16 M62 26 L73 22 M64 21 L63 9', undefined, trazo(C.cafe, 3.5)) +
      p('M41 42 Q27 35 29 46 Q35 49 43 47Z', C.cafeClaro) +
      p('M59 42 Q73 35 71 46 Q65 49 57 47Z', C.cafeClaro) +
      p('M40 40 Q50 33 60 40 Q63 60 54 77 Q50 81 46 77 Q37 60 40 40Z', C.cafeClaro) +
      p('M45 60 Q50 64 55 60 Q54 72 50 74 Q46 72 45 60Z', C.crema) +
      ojo(45, 50, 2) + ojo(55, 50, 2) + c(50, 75, 3, C.negro),
  },
  46: { // El Sol
    fondo: '#FFE9B0',
    dibujo:
      rayos(50, 50, 24, 42, 12, C.naranja) +
      c(50, 50, 22, C.amarillo) +
      p('M41 45 Q44 42 47 45 M53 45 Q56 42 59 45') +
      p('M41 56 Q50 64 59 56') +
      c(38, 53, 3, '#F8A060', 'stroke="none"') + c(62, 53, 3, '#F8A060', 'stroke="none"'),
  },
  47: { // La Corona
    fondo: '#F3E6FF',
    dibujo:
      p('M22 70 L17 32 L36 50 L50 23 L64 50 L83 32 L78 70Z', C.amarillo) +
      r(21, 68, 58, 11, C.oro) +
      c(50, 73.5, 3.5, C.rojo) + c(35, 73.5, 3, C.anil) + c(65, 73.5, 3, C.verde) +
      c(17, 30, 3.5, C.amarillo) + c(50, 21, 3.5, C.amarillo) + c(83, 30, 3.5, C.amarillo) +
      c(50, 50, 4, C.rojo),
  },
  48: { // La Chalupa
    fondo: '#CFEAF7',
    dibujo:
      p('M70 26 L57 74', undefined, trazo(C.cafe, 3)) +
      e(56, 78, 3, 6, C.cafe) +
      p('M58 60 L60 44 Q65 41 70 44 L72 60Z', C.rosa) +
      c(65, 37, 5, C.piel) +
      p('M60 34 Q65 28 70 34', C.negro) +
      p('M15 62 L85 62 Q79 77 50 77 Q21 77 15 62Z', C.cafe) +
      c(30, 57, 4, C.rosa) + c(39, 55, 4, C.amarillo) + c(48, 57, 4, C.rojo) +
      p('M8 80 Q18 74 28 80 Q38 86 48 80 Q58 74 68 80 Q78 86 92 80 L92 100 L8 100Z', C.anil),
  },
  49: { // El Pino
    fondo: '#E5F4FF',
    dibujo:
      r(46, 76, 8, 15, C.cafe) +
      p('M50 44 L79 78 L21 78Z', C.verdeOsc) +
      p('M50 26 L73 57 L27 57Z', C.verde) +
      p('M50 10 L66 36 L34 36Z', C.verde) +
      estrella(50, 10, 5, C.amarillo),
  },
  50: { // El Pescado
    fondo: '#D8EEF9',
    dibujo:
      c(82, 20, 3) + c(76, 12, 2) +
      p('M20 50 Q40 25 66 44 L85 30 L81 50 L85 70 L66 56 Q40 75 20 50Z', C.naranja) +
      p('M40 40 Q35 50 40 60') +
      p('M48 44 Q52 48 48 52 M56 44 Q60 48 56 52 M52 52 Q56 56 52 60', undefined, trazo(C.negro, 1.3)) +
      c(31, 46, 3.5, C.blanco) + ojo(31.5, 46, 1.6),
  },
  51: { // La Palma
    fondo: '#FFF1D0',
    dibujo:
      p('M48 92 Q43 60 52 33 L57 33 Q51 60 57 92Z', C.cafe) +
      p('M54 32 Q36 17 17 30 Q36 26 54 32Z', C.verde) +
      p('M54 32 Q72 15 89 28 Q70 26 54 32Z', C.verde) +
      p('M54 32 Q39 36 27 55 Q42 40 54 32Z', C.verde) +
      p('M54 32 Q71 38 81 56 Q66 42 54 32Z', C.verde) +
      p('M54 32 Q52 13 60 5 Q56 20 54 32Z', C.verde) +
      c(50, 38, 4, C.cafeClaro) + c(58, 38, 4, C.cafeClaro),
  },
  52: { // La Maceta
    fondo: '#F1E6DA',
    dibujo:
      p('M50 55 L50 30 M50 44 Q38 40 34 28 M50 48 Q62 42 66 30', undefined, trazo(C.verde, 3)) +
      p('M50 40 Q42 36 40 42 Q46 46 50 40Z M50 36 Q58 32 60 38 Q54 42 50 36Z', C.verde) +
      c(50, 26, 6, C.rosa) + c(34, 26, 5, C.amarillo) + c(66, 28, 5, C.rojo) +
      p('M30 60 L70 60 L64 91 L36 91Z', C.barro) +
      r(27, 54, 46, 8, C.barroClaro) +
      p('M36 74 L64 74', undefined, trazo(C.crema, 2)),
  },
  53: { // El Arpa
    fondo: '#F7E6D0',
    dibujo:
      p('M38 19 L38 86 M46 21 L46 86 M54 26 L54 86 M62 35 L62 86 M70 45 L70 86', undefined, trazo(C.crema, 1.5)) +
      p('M38 19 L38 86 M46 21 L46 86 M54 26 L54 86 M62 35 L62 86 M70 45 L70 86', undefined, trazo(C.negro, 0.6)) +
      p('M30 90 L30 16 Q50 12 60 30 Q66 44 80 47 L80 90Z', undefined, trazo('#8A5A2B', 5.5)) +
      r(24, 88, 62, 5, C.cafe),
  },
  54: { // La Rana
    fondo: '#E3F5D9',
    dibujo:
      e(50, 88, 32, 6, C.verdeOsc) +
      p('M29 72 Q15 80 21 89 L36 87', C.verde) +
      p('M71 72 Q85 80 79 89 L64 87', C.verde) +
      e(50, 64, 25, 19, C.verde) +
      c(38, 44, 8.5, C.verde) + c(62, 44, 8.5, C.verde) +
      c(38, 44, 4.5, C.blanco) + c(62, 44, 4.5, C.blanco) + ojo(38.5, 44, 2) + ojo(62.5, 44, 2) +
      p('M36 64 Q50 74 64 64') +
      p('M44 74 Q50 80 56 74', C.lima),
  },
};

const cache = new Map<number, string>();

/** SVG completo de una carta (texto). Sirve para web (data URI) y móvil (SvgXml). */
export function svgDeCarta(cartaId: number): string {
  const guardado = cache.get(cartaId);
  if (guardado) return guardado;
  const arte = ARTE[cartaId];
  const svg = arte
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
      `<rect width="100" height="100" fill="${arte.fondo}"/>` +
      `<g fill="none" stroke="${TINTA}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${arte.dibujo}</g></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${C.crema}"/>` +
      `<text x="50" y="62" font-size="36" text-anchor="middle" fill="${TINTA}">${cartaId}</text></svg>`;
  cache.set(cartaId, svg);
  return svg;
}

/** Data URI listo para <img src> en la web. */
export const dataUriDeCarta = (cartaId: number) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDeCarta(cartaId))}`;

/** Ids que tienen ilustración (para pruebas). */
export const cartasIlustradas = () => Object.keys(ARTE).map(Number);
