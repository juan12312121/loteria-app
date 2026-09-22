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

// Sombra y luz van SIN contorno: se montan encima del color plano para dar volumen
const sombra = (d: string, op = 0.18) => `<path d="${d}" fill="#000000" fill-opacity="${op}" stroke="none"/>`;
const luz = (d: string, op = 0.28) => `<path d="${d}" fill="#FFFFFF" fill-opacity="${op}" stroke="none"/>`;
/** Línea fina para los detalles (pliegues, vetas, hilos). */
const detalle = (d: string, color = TINTA, ancho = 1.2) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}"/>`;
/** Brillo del ojo. */
const chispa = (cx: number, cy: number, rr = 0.9) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#FFFFFF" stroke="none"/>`;

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
    fondo: '#FFE9B8',
    dibujo:
      e(50, 91, 30, 5, C.cafeClaro) +
      p('M34 64 Q12 56 14 32 Q26 44 36 46Z', C.verdeOsc) +
      p('M36 62 Q20 42 26 22 Q36 38 42 48Z', C.anil) +
      p('M40 60 Q36 36 48 22 Q50 40 48 52Z', C.amarillo) +
      p('M42 80 Q28 68 36 52 Q44 36 58 38 Q72 40 74 56 Q76 74 62 82 Q50 88 42 80Z', C.rojo) +
      sombra('M60 44 Q76 50 74 66 Q72 80 58 83 Q72 74 70 60 Q68 48 60 44Z') +
      p('M46 62 Q56 52 68 60 Q62 72 48 70Z', '#A8162C') +
      luz('M48 62 Q56 56 64 60 Q58 64 48 66Z') +
      p('M62 44 Q60 28 70 24 L80 30 Q72 34 70 46Z', C.rojo) +
      c(74, 22, 9, C.rojo) +
      p('M68 14 Q70 7 74 12 Q77 5 80 12 Q84 8 84 17 L68 18Z', '#A8162C') +
      p('M73 30 Q70 39 76 39 Q80 34 78 29Z', '#A8162C') +
      p('M82 21 L93 24 L82 28Z', C.amarillo) +
      ojo(77, 20, 2) + chispa(77.6, 19.4) +
      detalle('M50 81 L48 92 M42 92 L54 92 M60 80 L62 92 M56 92 L68 92', C.naranja, 3),
  },
  2: { // El Diablito
    fondo: '#FFDCD6',
    dibujo:
      p('M30 66 Q18 62 16 50 Q24 56 30 54', C.rojo) +
      p('M62 58 L84 34', undefined, trazo(C.cafe, 3)) +
      p('M84 38 L80 24 L84 28 L88 22 L90 36Z', C.gris) +
      p('M38 86 Q34 62 42 50 Q50 40 58 50 Q66 62 62 86Z', C.rojo) +
      sombra('M54 48 Q64 60 60 86 L52 86 Q58 62 54 48Z') +
      p('M40 60 Q28 66 26 74', undefined, trazo(C.rojo, 5)) +
      p('M60 58 Q72 54 78 46', undefined, trazo(C.rojo, 5)) +
      p('M40 86 L38 93 M60 86 L62 93', undefined, trazo(C.rojo, 5)) +
      c(50, 32, 14, C.rojo) +
      sombra('M56 22 Q64 30 60 44 Q56 46 52 45 Q62 34 56 22Z') +
      p('M38 22 L34 10 L44 18Z', C.rojo) + p('M62 22 L66 10 L56 18Z', C.rojo) +
      ojo(45, 30, 2) + ojo(55, 30, 2) + chispa(45.6, 29.4) + chispa(55.6, 29.4) +
      detalle('M40 26 L47 28 M60 26 L53 28', TINTA, 1.6) +
      p('M43 38 Q50 44 57 38 Q50 41 43 38Z', C.blanco) +
      detalle('M44 38 L44 41 M50 39 L50 42 M56 38 L56 41'),
  },
  3: { // La Dama
    fondo: '#F6E6FF',
    dibujo:
      p('M30 92 Q34 62 44 52 L56 52 Q66 62 70 92Z', C.rosa) +
      sombra('M56 52 Q64 64 66 92 L58 92 Q60 66 52 54Z') +
      luz('M42 60 Q46 74 44 90 L40 90 Q40 72 42 60Z', 0.22) +
      p('M44 52 Q50 58 56 52 L56 44 L44 44Z', C.piel) +
      c(50, 34, 13, C.piel) +
      p('M37 32 Q36 16 50 16 Q64 16 63 32 Q60 24 50 24 Q40 24 37 32Z', TINTA) +
      p('M37 30 Q33 42 38 46 Q37 38 39 32Z', TINTA) + p('M63 30 Q67 42 62 46 Q63 38 61 32Z', TINTA) +
      ojo(45, 34) + ojo(55, 34) + chispa(45.5, 33.5, 0.7) + chispa(55.5, 33.5, 0.7) +
      p('M46 42 Q50 45 54 42', undefined, trazo('#C0392B', 1.6)) +
      c(42, 36, 2.5, '#F09BB5', 'stroke="none"') + c(58, 36, 2.5, '#F09BB5', 'stroke="none"') +
      p('M44 50 Q50 54 56 50', undefined, trazo(C.oro, 2)) +
      p('M66 62 L86 52 L86 74Z', C.rojo) + detalle('M70 60 L84 56 M70 66 L84 66 M70 70 L84 72', C.crema, 1.4),
  },
  4: { // El Catrín
    fondo: '#E6EEFF',
    dibujo:
      p('M34 92 Q34 62 44 52 L56 52 Q66 62 66 92Z', TINTA) +
      p('M44 52 L50 70 L56 52 L54 50 L46 50Z', C.blanco) +
      p('M46 56 L50 62 L54 56 L50 54Z', C.rojo) +
      sombra('M58 56 Q64 68 64 92 L58 92 Q60 70 56 58Z') +
      p('M44 50 Q50 55 56 50 L56 43 L44 43Z', C.piel) +
      c(50, 32, 12, C.piel) +
      p('M38 24 Q50 18 62 24 L62 20 Q50 14 38 20Z', TINTA) +
      p('M32 22 L68 22 L66 14 Q50 8 34 14Z', TINTA) + r(30, 21, 40, 4, TINTA) +
      luz('M38 12 L62 12 L62 15 L38 15Z', 0.18) +
      ojo(45, 32) + ojo(55, 32) +
      p('M43 38 Q50 34 57 38 Q50 41 43 38Z', TINTA) +
      p('M46 43 Q50 46 54 43', undefined, trazo('#B5523F', 1.4)) +
      p('M66 60 L74 92', undefined, trazo(C.cafe, 3)) + p('M64 58 Q70 54 74 58', undefined, trazo(C.oro, 3)),
  },
  5: { // El Paraguas
    fondo: '#E4F1FF',
    dibujo:
      p('M50 16 L50 78', undefined, trazo(C.cafe, 3)) +
      p('M50 78 Q50 90 38 88 Q42 84 46 84 Q48 80 50 80Z', C.cafe) +
      p('M12 54 Q14 20 50 18 Q86 20 88 54 Q78 46 70 54 Q60 44 50 54 Q40 44 30 54 Q22 46 12 54Z', C.rojo) +
      p('M30 54 Q40 44 50 54 L50 18 Q34 20 30 54Z', C.crema) +
      p('M70 54 Q60 44 50 54 L50 18 Q66 20 70 54Z', C.verde) +
      sombra('M70 54 Q78 46 88 54 Q86 26 68 20 Q76 32 70 54Z', 0.12) +
      detalle('M30 54 Q32 30 50 18 M70 54 Q68 30 50 18', TINTA, 1.4) +
      c(50, 14, 3, C.oro),
  },
  6: { // La Sirena
    fondo: '#D7F0FF',
    dibujo:
      detalle('M8 84 Q18 78 28 84 T48 84 T68 84 T88 84', C.azul, 2.2) +
      detalle('M8 92 Q18 86 28 92 T48 92 T68 92 T88 92', C.azul, 2.2) +
      p('M42 56 Q34 72 40 86 Q26 88 22 80 Q30 88 40 90 Q52 92 58 80 Q64 68 58 56Z', C.verde) +
      sombra('M52 58 Q58 70 52 86 Q58 84 58 76 Q62 64 56 56Z') +
      detalle('M44 62 Q50 66 56 62 M43 70 Q50 74 57 70 M44 78 Q50 82 56 78', C.verdeOsc, 1.4) +
      p('M42 56 Q40 42 50 38 Q60 42 58 56Z', C.piel) +
      c(50, 30, 10, C.piel) +
      p('M40 28 Q38 14 50 12 Q62 14 60 28 Q58 20 50 20 Q42 20 40 28Z', C.cafe) +
      p('M40 26 Q34 40 40 50 Q38 38 42 30Z', C.cafe) + p('M60 26 Q66 40 60 50 Q62 38 58 30Z', C.cafe) +
      ojo(46, 30) + ojo(54, 30) + chispa(46.5, 29.5, 0.7) + chispa(54.5, 29.5, 0.7) +
      p('M47 36 Q50 38 53 36', undefined, trazo('#C0392B', 1.4)) +
      p('M43 46 Q50 50 57 46', undefined, trazo(C.amarillo, 2.4)),
  },
  7: { // La Escalera
    fondo: '#F7E8CC',
    dibujo:
      p('M30 12 L24 92', undefined, trazo(C.cafe, 7)) +
      p('M70 12 L76 92', undefined, trazo(C.cafe, 7)) +
      p('M29 26 L71 26 M28 42 L72 42 M27 58 L73 58 M26 74 L74 74', undefined, trazo(C.cafeClaro, 6)) +
      detalle('M29 26 L71 26 M28 42 L72 42 M27 58 L73 58 M26 74 L74 74', TINTA, 1.2) +
      luz('M28 14 L31 14 L26 90 L23 90Z', 0.2) +
      detalle('M34 24 L64 24 M34 40 L64 40 M34 56 L64 56 M34 72 L64 72', '#8A5A2B', 1),
  },
  8: { // La Botella
    fondo: '#E3F3E2',
    dibujo:
      p('M42 26 L42 40 Q34 48 34 60 L34 88 Q34 92 38 92 L62 92 Q66 92 66 88 L66 60 Q66 48 58 40 L58 26Z', C.verdeOsc) +
      sombra('M56 40 Q62 48 62 62 L62 88 L56 88 L56 62 Q56 48 52 40Z') +
      luz('M40 44 Q38 52 38 62 L38 86 L42 86 L42 62 Q42 52 44 44Z', 0.25) +
      r(40, 18, 20, 9, C.rojo) +
      r(36, 56, 28, 22, C.crema) +
      detalle('M40 62 L60 62 M40 68 L56 68 M40 74 L58 74', C.cafe, 1.6) +
      c(50, 52, 3, C.oro),
  },
  9: { // El Barril
    fondo: '#F6E5CD',
    dibujo:
      p('M30 24 Q22 50 30 84 Q50 90 70 84 Q78 50 70 24 Q50 18 30 24Z', C.cafeClaro) +
      sombra('M60 22 Q68 50 60 86 Q66 86 70 84 Q78 50 70 24Z') +
      luz('M36 24 Q30 50 36 84 L42 85 Q36 50 42 23Z', 0.25) +
      detalle('M42 21 Q36 52 42 87 M50 20 Q46 52 50 88 M58 21 Q62 52 58 87', '#8A5A2B', 1.4) +
      p('M26 36 Q50 30 74 36', undefined, trazo(C.gris, 5)) +
      p('M26 72 Q50 78 74 72', undefined, trazo(C.gris, 5)) +
      detalle('M26 36 Q50 30 74 36 M26 72 Q50 78 74 72', TINTA, 1.2),
  },
  10: { // El Árbol
    fondo: '#DCF0D6',
    dibujo:
      e(50, 92, 28, 5, '#C8B48A') +
      p('M44 92 L44 62 Q40 54 34 50 Q42 52 44 56 L44 46 Q50 40 56 46 L56 60 Q60 52 68 50 Q60 56 56 66 L56 92Z', C.cafe) +
      sombra('M52 44 L56 46 L56 92 L52 92Z') +
      c(50, 34, 24, C.verde) + c(30, 44, 15, C.verde) + c(70, 44, 15, C.verde) +
      luz('M34 22 Q44 14 56 18 Q44 18 36 28Z', 0.3) +
      sombra('M66 30 Q76 42 68 54 Q62 56 58 54 Q72 46 66 30Z', 0.14) +
      c(40, 30, 3.5, C.rojo) + c(60, 38, 3.5, C.rojo) + c(50, 50, 3.5, C.rojo) + c(30, 44, 3.5, C.rojo),
  },
  11: { // El Melón
    fondo: '#FFEAD4',
    dibujo:
      p('M14 74 Q14 30 50 30 Q86 30 86 74 Q50 84 14 74Z', C.verde) +
      p('M20 72 Q20 36 50 36 Q80 36 80 72 Q50 80 20 72Z', C.lima) +
      p('M26 70 Q26 42 50 42 Q74 42 74 70 Q50 77 26 70Z', C.naranja) +
      sombra('M62 44 Q74 52 74 70 Q68 71 64 72 Q70 56 60 45Z', 0.12) +
      luz('M34 46 Q28 56 30 68 L34 69 Q32 56 38 47Z', 0.28) +
      p('M38 56 Q40 52 42 56 Q40 60 38 56Z', C.crema) + p('M50 52 Q52 48 54 52 Q52 56 50 52Z', C.crema) +
      p('M60 58 Q62 54 64 58 Q62 62 60 58Z', C.crema) + p('M46 62 Q48 58 50 62 Q48 66 46 62Z', C.crema) +
      detalle('M14 74 Q50 84 86 74', TINTA, 2),
  },
  12: { // El Valiente
    fondo: '#FFE2D6',
    dibujo:
      p('M34 92 Q32 64 42 54 L58 54 Q68 64 66 92Z', C.rojo) +
      sombra('M58 54 Q66 66 64 92 L58 92 Q60 68 54 56Z') +
      p('M42 54 L50 70 L58 54 L54 52 L46 52Z', C.crema) +
      p('M34 92 L66 92 L66 84 L34 84Z', C.anil) +
      p('M44 52 Q50 56 56 52 L56 45 L44 45Z', C.piel) +
      c(50, 34, 12, C.piel) +
      p('M38 26 Q50 20 62 26 Q60 16 50 16 Q40 16 38 26Z', TINTA) +
      ojo(45, 34) + ojo(55, 34) +
      p('M44 40 Q50 37 56 40 Q50 43 44 40Z', TINTA) +
      p('M66 66 L88 40', undefined, trazo(C.gris, 5)) +
      p('M86 34 L94 42 L88 44 L82 40Z', C.gris) +
      p('M62 68 L70 60', undefined, trazo(C.cafe, 5)) +
      luz('M70 62 L86 44 L88 46 L72 64Z', 0.4),
  },
  13: { // El Gorrito
    fondo: '#FFE4F0',
    dibujo:
      p('M22 66 Q22 28 50 28 Q78 28 78 66 Q50 74 22 66Z', C.rosa) +
      sombra('M62 32 Q74 44 72 68 Q76 67 78 66 Q78 36 62 32Z') +
      luz('M34 36 Q28 48 30 64 L34 65 Q32 48 38 37Z', 0.3) +
      p('M20 66 Q50 76 80 66 L80 74 Q50 84 20 74Z', C.blanco) +
      detalle('M24 70 Q50 79 76 70', C.rosa, 1.4) +
      c(50, 24, 6, C.rosa) +
      p('M44 76 Q36 88 26 90 Q34 84 38 74Z', C.rosa) +
      p('M56 76 Q64 88 74 90 Q66 84 62 74Z', C.rosa) +
      detalle('M34 44 Q50 40 66 44 M32 54 Q50 50 68 54', C.blanco, 1.6),
  },
  14: { // La Muerte
    fondo: '#EDEDEF',
    dibujo:
      p('M74 10 L74 92', undefined, trazo(C.cafe, 4)) +
      p('M74 14 Q54 12 44 24 Q58 20 72 24Z', C.gris) +
      luz('M74 16 Q58 15 50 22 Q60 18 73 20Z', 0.5) +
      p('M38 60 Q30 78 34 92 L66 92 Q70 78 62 60Z', C.blanco) +
      detalle('M42 66 L58 66 M40 72 L60 72 M41 78 L59 78', C.gris, 1.6) +
      p('M44 52 L56 52 L56 62 L44 62Z', C.blanco) +
      e(50, 38, 19, 21, C.blanco) +
      sombra('M60 24 Q70 38 62 56 Q58 58 56 57 Q68 40 58 24Z', 0.12) +
      e(42, 38, 6, 7, TINTA) + e(58, 38, 6, 7, TINTA) +
      chispa(43, 36, 1.4) + chispa(59, 36, 1.4) +
      p('M50 44 L46 52 L54 52Z', TINTA) +
      detalle('M40 58 L60 58 M44 58 L44 63 M50 58 L50 63 M56 58 L56 63', TINTA, 1.6),
  },
  15: { // La Pera
    fondo: '#F4F8DA',
    dibujo:
      p('M50 28 Q52 20 56 16', undefined, trazo(C.cafe, 3)) +
      p('M56 20 Q68 12 74 20 Q66 28 56 24Z', C.verde) +
      detalle('M58 22 Q66 20 72 20', C.verdeOsc, 1.2) +
      p('M50 28 Q62 30 62 44 Q62 54 70 64 Q78 76 68 86 Q58 94 50 94 Q42 94 32 86 Q22 76 30 64 Q38 54 38 44 Q38 30 50 28Z', '#E3D24A') +
      luz('M40 46 Q34 58 30 70 Q28 80 34 86 Q28 76 36 64 Q42 54 42 46Z', 0.35) +
      sombra('M60 46 Q62 58 68 66 Q76 78 66 86 Q62 89 58 90 Q72 84 66 70 Q58 58 58 46Z', 0.14) +
      c(44, 66, 1.4, C.cafe, 'stroke="none"') + c(56, 74, 1.4, C.cafe, 'stroke="none"'),
  },
  16: { // La Bandera
    fondo: '#E6F5EA',
    dibujo:
      p('M20 10 L20 94', undefined, trazo(C.cafe, 4)) +
      c(20, 8, 4, C.oro) +
      p('M22 16 L82 22 L82 58 L22 52Z', C.blanco) +
      p('M22 16 L42 18 L42 54 L22 52Z', C.verde) +
      p('M62 20 L82 22 L82 58 L62 56Z', C.rojo) +
      sombra('M62 20 L68 20.6 L68 56.5 L62 56Z', 0.12) +
      c(52, 36, 9, '#C8B48A') +
      p('M46 36 Q52 30 58 36 Q52 40 46 36Z', C.cafe) +
      detalle('M48 40 Q52 44 56 40', C.verdeOsc, 1.4) +
      detalle('M22 52 L82 58', TINTA, 1.4),
  },
  17: { // El Bandolón
    fondo: '#F8E7CE',
    dibujo:
      p('M50 14 L50 44', undefined, trazo(C.cafe, 9)) +
      r(44, 8, 12, 9, C.cafe) +
      c(44, 10, 1.6, C.gris, 'stroke="none"') + c(56, 10, 1.6, C.gris, 'stroke="none"') +
      e(50, 66, 30, 26, C.barro) +
      sombra('M60 44 Q78 56 74 74 Q70 86 58 90 Q74 78 72 64 Q70 50 60 44Z', 0.16) +
      luz('M36 50 Q26 62 28 76 L32 78 Q28 62 40 52Z', 0.25) +
      c(50, 62, 9, '#5A2E10') +
      detalle('M20 60 L80 60 M20 66 L80 66 M20 72 L80 72', C.crema, 1) +
      detalle('M20 60 L80 60 M20 66 L80 66 M20 72 L80 72', TINTA, 0.5) +
      r(38, 84, 24, 5, C.cafe),
  },
  18: { // El Violoncello
    fondo: '#F6E4D0',
    dibujo:
      p('M22 78 L84 18', undefined, trazo(C.cafeClaro, 3)) +
      detalle('M22 78 L84 18', TINTA, 1) +
      p('M50 8 L50 40', undefined, trazo(C.cafe, 7)) +
      r(45, 4, 10, 8, C.cafe) +
      p('M50 40 Q30 42 30 58 Q30 68 38 72 Q30 76 30 84 Q30 94 50 94 Q70 94 70 84 Q70 76 62 72 Q70 68 70 58 Q70 42 50 40Z', C.barro) +
      sombra('M58 42 Q66 48 64 58 Q62 68 56 72 Q64 76 64 84 Q64 90 54 93 Q70 92 70 84 Q70 76 62 72 Q70 68 70 58 Q70 44 58 42Z', 0.16) +
      luz('M40 44 Q32 50 34 60 Q36 68 42 72 Q34 76 34 84 L38 90 Q30 84 34 76 Q40 70 38 60 Q36 50 44 45Z', 0.22) +
      p('M42 60 Q40 68 44 72 M58 60 Q60 68 56 72', undefined, trazo(TINTA, 1.6)) +
      detalle('M48 42 L48 92 M52 42 L52 92', C.crema, 1) +
      r(44, 86, 12, 4, TINTA),
  },
  19: { // La Garza
    fondo: '#DFF1F7',
    dibujo:
      detalle('M8 88 Q28 84 48 88 T88 88', C.azul, 2) +
      p('M46 88 L46 64 M54 88 L54 64', undefined, trazo(C.amarillo, 3)) +
      p('M38 90 L52 90 M48 90 L62 90', undefined, trazo(C.amarillo, 3)) +
      p('M40 64 Q30 52 36 40 Q42 28 54 30 Q66 32 66 46 Q66 60 56 66Z', C.blanco) +
      sombra('M58 32 Q68 42 64 56 Q60 64 54 66 Q64 56 62 44 Q60 36 56 32Z', 0.12) +
      p('M40 60 Q28 66 20 78 Q32 70 42 68Z', C.blanco) +
      p('M54 32 Q52 20 62 16 Q72 14 74 22 Q76 30 66 34Z', C.blanco) +
      p('M74 20 L92 24 L74 28Z', C.amarillo) +
      ojo(70, 21, 1.8) + chispa(70.6, 20.4, 0.7) +
      detalle('M44 44 Q52 50 60 46 M42 52 Q52 58 62 54', C.gris, 1.2),
  },
  20: { // El Pájaro
    fondo: '#E3F0FF',
    dibujo:
      p('M16 84 Q50 78 84 84', undefined, trazo(C.cafe, 4)) +
      p('M34 60 Q28 46 40 38 Q54 30 66 38 Q76 44 72 56 Q68 68 54 70 Q40 72 34 60Z', C.anil) +
      sombra('M58 34 Q74 42 70 56 Q66 68 54 70 Q68 62 68 50 Q68 40 58 34Z', 0.16) +
      p('M42 52 Q54 44 66 52 Q58 64 44 62Z', C.azul) +
      luz('M46 52 Q54 48 62 52 Q54 56 46 56Z', 0.3) +
      p('M34 58 Q18 62 10 72 Q24 68 34 66Z', C.anil) +
      c(68, 40, 8, C.anil) +
      p('M76 40 L88 44 L76 47Z', C.amarillo) +
      ojo(70, 38, 2) + chispa(70.6, 37.4) +
      p('M48 70 L46 82 M58 70 L60 82', undefined, trazo(C.amarillo, 2.6)) +
      p('M40 82 L52 82 M54 82 L66 82', undefined, trazo(C.amarillo, 2.6)),
  },
  21: { // La Mano
    fondo: '#FFE9E0',
    dibujo:
      p('M34 90 Q28 70 30 54 Q31 44 37 44 Q42 44 43 54 L43 40 Q43 30 49 30 Q55 30 55 40 L55 36 Q55 26 61 26 Q67 26 67 36 L67 44 Q67 34 73 34 Q79 34 79 44 Q79 62 74 76 Q70 90 60 92 L44 92 Q37 92 34 90Z', C.piel) +
      sombra('M70 36 Q76 40 76 50 Q76 68 70 80 Q66 90 58 92 L64 92 Q72 88 76 74 Q80 60 79 44 Q79 36 74 34Z', 0.14) +
      p('M34 62 Q24 58 22 50 Q22 44 28 46 Q33 50 35 56Z', C.piel) +
      detalle('M43 54 L43 70 M55 44 L55 70 M67 44 L67 70', '#D9A17A', 1.4) +
      p('M40 76 Q54 82 68 76', undefined, trazo('#D9A17A', 1.6)) +
      luz('M38 50 Q34 66 38 86 L42 86 Q38 66 42 50Z', 0.3),
  },
  22: { // La Bota
    fondo: '#F6E6D2',
    dibujo:
      p('M36 14 L64 14 L66 54 Q66 64 78 68 Q90 72 90 84 L90 90 L30 90 L30 60 Q30 40 36 14Z', C.cafe) +
      sombra('M56 16 L64 14 L66 54 Q66 64 78 68 Q90 72 90 84 L90 90 L78 90 L78 82 Q78 74 66 70 Q56 66 56 54Z', 0.18) +
      luz('M38 18 Q33 42 34 60 L34 86 L40 86 L40 60 Q39 42 44 18Z', 0.22) +
      r(28, 86, 64, 8, TINTA) +
      detalle('M36 26 L64 26 M35 34 L65 34', '#5A2E10', 1.4) +
      p('M40 44 L60 44', undefined, trazo(C.crema, 2.4)) +
      c(42, 44, 2, C.oro) + c(58, 44, 2, C.oro) +
      detalle('M30 74 L70 74', '#5A2E10', 1.4),
  },
  23: { // La Luna
    fondo: '#1F2B5B',
    dibujo:
      estrella(20, 22, 5, C.amarillo) + estrella(82, 30, 4, C.amarillo) + estrella(26, 78, 4, C.amarillo) +
      chispa(72, 72, 2.4) + chispa(16, 50, 1.6) +
      p('M60 12 Q30 20 30 50 Q30 80 60 88 Q40 74 40 50 Q40 26 60 12Z', C.amarillo) +
      sombra('M60 12 Q44 22 42 44 Q40 70 58 86 Q60 87 60 88 Q40 74 40 50 Q40 26 60 12Z', 0.1) +
      luz('M56 18 Q42 30 42 50 Q42 66 52 80 Q46 64 46 50 Q46 32 56 18Z', 0.3) +
      ojo(46, 44, 2) + chispa(46.6, 43.4, 0.8) +
      p('M44 56 Q50 60 54 54', undefined, trazo(TINTA, 1.8)) +
      c(40, 52, 2.6, '#E0A800', 'stroke="none"'),
  },
  24: { // El Cotorro
    fondo: '#E8F6E2',
    dibujo:
      p('M28 88 L72 88', undefined, trazo(C.cafe, 5)) +
      p('M50 88 L50 74 M44 88 L56 88', undefined, trazo(C.gris, 3)) +
      p('M38 74 Q30 56 38 42 Q46 28 58 32 Q70 36 70 52 Q70 68 58 76 Q46 82 38 74Z', C.verde) +
      sombra('M60 34 Q72 42 70 56 Q68 70 56 77 Q66 66 66 52 Q66 40 60 34Z', 0.16) +
      p('M42 52 Q52 44 62 52 Q56 66 44 64Z', C.lima) +
      p('M38 60 Q26 70 22 84 Q34 74 42 70Z', C.verdeOsc) +
      c(58, 34, 9, C.verde) +
      p('M64 30 Q76 28 78 38 Q76 48 66 44 Q70 38 64 30Z', C.amarillo) +
      p('M68 38 Q74 40 72 46', undefined, trazo(C.naranja, 2)) +
      ojo(58, 30, 2) + chispa(58.6, 29.4) +
      p('M50 24 Q56 16 62 22', undefined, trazo(C.rojo, 3)),
  },
  25: { // El Borracho
    fondo: '#FDE7D2',
    dibujo:
      p('M32 92 Q30 66 42 56 L58 56 Q70 66 68 92Z', C.anil) +
      sombra('M58 56 Q68 68 66 92 L60 92 Q62 70 54 58Z') +
      p('M44 56 Q50 62 56 56 L56 48 L44 48Z', C.piel) +
      c(50, 36, 13, C.piel) +
      c(42, 42, 3.5, '#E48A7A', 'stroke="none"') + c(58, 42, 3.5, '#E48A7A', 'stroke="none"') +
      c(50, 40, 3.2, '#D9534F') +
      p('M38 28 Q50 20 62 28 Q62 18 50 18 Q38 18 38 28Z', C.cafe) +
      detalle('M42 34 Q45 32 48 34 M52 34 Q55 32 58 34', TINTA, 1.6) +
      p('M44 46 Q50 50 56 46', undefined, trazo(TINTA, 1.6)) +
      p('M68 60 L78 60 L76 80 L70 80Z', C.verdeOsc) + r(70, 54, 6, 7, C.verdeOsc) +
      luz('M71 62 L73 62 L72 78 L70 78Z', 0.35) +
      detalle('M24 30 Q22 24 26 20 M30 24 Q29 19 33 16', C.gris, 1.6),
  },
  26: { // El Negrito
    fondo: '#FFF0DB',
    dibujo:
      p('M32 92 Q32 64 42 54 L58 54 Q68 64 68 92Z', C.crema) +
      sombra('M58 54 Q66 66 66 92 L60 92 Q62 68 54 56Z', 0.12) +
      p('M32 78 L68 78 L68 86 L32 86Z', C.rojo) +
      p('M44 54 Q50 58 56 54 L56 46 L44 46Z', '#6B4230') +
      c(50, 34, 13, '#6B4230') +
      p('M37 26 Q50 18 63 26 Q62 14 50 14 Q38 14 37 26Z', TINTA) +
      ojo(45, 34) + ojo(55, 34) + chispa(45.5, 33.4, 0.7) + chispa(55.5, 33.4, 0.7) +
      p('M44 42 Q50 47 56 42 Q50 45 44 42Z', C.blanco) +
      p('M66 60 Q78 56 82 44', undefined, trazo('#6B4230', 5)) +
      p('M78 34 Q86 34 86 42 Q86 50 78 50 Q72 48 72 42 Q72 36 78 34Z', C.amarillo) +
      detalle('M76 38 L84 38 M76 44 L84 44', C.naranja, 1.4),
  },
  27: { // El Corazón
    fondo: '#FFE1E6',
    dibujo:
      p('M50 88 Q18 66 18 44 Q18 26 34 26 Q45 26 50 38 Q55 26 66 26 Q82 26 82 44 Q82 66 50 88Z', C.rojo) +
      sombra('M66 26 Q82 26 82 44 Q82 66 50 88 Q74 64 74 46 Q74 30 62 27Z', 0.16) +
      luz('M34 30 Q24 32 24 46 Q24 58 34 70 Q28 56 29 44 Q30 34 36 31Z', 0.3) +
      p('M22 16 L78 62', undefined, trazo(C.cafe, 3)) +
      p('M76 56 L84 68 L72 64Z', C.gris) +
      p('M22 16 L30 20 L26 26Z', C.gris) +
      detalle('M40 44 Q46 52 44 62', C.crema, 1.6),
  },
  28: { // La Sandía
    fondo: '#E9F7E2',
    dibujo:
      p('M10 34 Q50 28 90 34 Q86 84 50 92 Q14 84 10 34Z', C.verdeOsc) +
      p('M16 38 Q50 33 84 38 Q80 80 50 87 Q20 80 16 38Z', C.lima) +
      p('M22 42 Q50 38 78 42 Q74 76 50 82 Q26 76 22 42Z', C.rojo) +
      sombra('M64 40 Q76 42 78 42 Q74 76 50 82 Q68 72 70 52Z', 0.12) +
      luz('M34 42 Q28 56 32 74 L36 76 Q32 58 38 43Z', 0.25) +
      p('M36 52 Q38 48 40 52 Q38 56 36 52Z', TINTA) + p('M50 48 Q52 44 54 48 Q52 52 50 48Z', TINTA) +
      p('M62 54 Q64 50 66 54 Q64 58 62 54Z', TINTA) + p('M44 64 Q46 60 48 64 Q46 68 44 64Z', TINTA) +
      p('M58 68 Q60 64 62 68 Q60 72 58 68Z', TINTA) +
      detalle('M10 34 Q50 28 90 34', TINTA, 2),
  },
  29: { // El Tambor
    fondo: '#FFEAD8',
    dibujo:
      p('M18 62 L28 26 M82 62 L72 26', undefined, trazo(C.cafe, 3)) +
      c(28, 22, 5, C.crema) + c(72, 22, 5, C.crema) +
      p('M24 36 L76 36 L70 80 Q50 88 30 80Z', C.rojo) +
      sombra('M62 36 L76 36 L70 80 Q64 83 58 84 Q66 70 62 36Z', 0.16) +
      e(50, 36, 26, 8, C.crema) +
      luz('M32 34 Q42 30 52 31 Q40 32 34 36Z', 0.5) +
      p('M26 44 L44 74 M36 42 L54 76 M46 40 L62 74 M56 40 L70 66 M66 42 L74 58', undefined, trazo(C.crema, 2.4)) +
      p('M24 44 L76 44 M28 66 L72 66', undefined, trazo(C.oro, 3)) +
      detalle('M24 44 L76 44 M28 66 L72 66', TINTA, 1),
  },
  30: { // El Camarón
    fondo: '#FFE8DE',
    dibujo:
      p('M74 30 Q84 36 82 46 Q80 58 68 64 Q54 72 40 70 Q24 68 18 56 Q14 46 22 40 Q26 50 38 52 Q30 42 38 34 Q42 44 52 46 Q48 34 58 28 Q60 40 70 42 Q74 36 74 30Z', C.naranja) +
      sombra('M74 30 Q84 36 82 46 Q80 58 68 64 Q60 68 52 69 Q70 60 74 46 Q76 36 74 30Z', 0.14) +
      luz('M24 44 Q20 50 24 56 Q30 64 42 66 Q30 62 26 54 Q24 48 26 45Z', 0.28) +
      p('M18 56 Q8 60 6 70 Q14 66 20 64Z', C.naranja) +
      p('M74 30 Q78 20 88 18 M74 34 Q82 28 92 28', undefined, trazo(C.naranja, 2)) +
      ojo(72, 38, 2) + chispa(72.6, 37.4) +
      detalle('M40 52 Q44 60 40 68 M52 48 Q56 58 52 68 M64 44 Q68 54 62 64', '#C2410C', 1.4),
  },
  31: { // Las Jaras
    fondo: '#F3E9D8',
    dibujo:
      flecha(22, 86, 70, 24) + flecha(78, 86, 30, 24) +
      p('M46 92 Q50 86 54 92', undefined, trazo(C.cafe, 2.4)) +
      detalle('M34 74 L66 74', C.cafe, 1.2),
  },
  32: { // El Músico
    fondo: '#E9F1FF',
    dibujo:
      p('M30 92 Q30 64 42 54 L58 54 Q70 64 70 92Z', C.anil) +
      sombra('M58 54 Q68 66 68 92 L62 92 Q64 68 54 56Z') +
      p('M44 54 Q50 58 56 54 L56 46 L44 46Z', C.piel) +
      c(50, 34, 12, C.piel) +
      e(50, 22, 26, 6, C.cafe) + p('M38 22 Q40 10 50 10 Q60 10 62 22Z', C.cafe) +
      detalle('M38 20 Q50 16 62 20', C.rojo, 2) +
      ojo(45, 34) + ojo(55, 34) +
      p('M44 40 Q50 37 56 40 Q50 43 44 40Z', TINTA) +
      p('M60 62 Q74 58 78 46', undefined, trazo(C.cafe, 4)) +
      e(74, 70, 14, 16, C.barro) + c(74, 66, 5, '#5A2E10') +
      detalle('M62 70 L86 70 M62 74 L86 74', C.crema, 1) +
      p('M64 60 L84 40', undefined, trazo(C.cafe, 5)),
  },
  33: { // La Araña
    fondo: '#EFEAF7',
    dibujo:
      detalle('M50 6 L50 30 M20 14 L36 34 M80 14 L64 34', C.gris, 1.2) +
      p('M34 48 Q20 44 14 30 M38 56 Q22 58 12 52 M38 66 Q24 74 18 86 M44 72 Q40 84 44 94', undefined, trazo(TINTA, 3)) +
      p('M66 48 Q80 44 86 30 M62 56 Q78 58 88 52 M62 66 Q76 74 82 86 M56 72 Q60 84 56 94', undefined, trazo(TINTA, 3)) +
      e(50, 60, 20, 18, '#3B2F45') +
      sombra('M58 46 Q70 54 68 66 Q64 76 54 78 Q66 68 64 58 Q62 50 58 46Z', 0.2) +
      luz('M40 50 Q32 58 34 68 L38 70 Q34 58 44 50Z', 0.16) +
      c(50, 40, 11, '#3B2F45') +
      c(45, 38, 3.2, C.rojo) + c(55, 38, 3.2, C.rojo) + ojo(45, 38, 1.4) + ojo(55, 38, 1.4) +
      p('M42 50 Q50 54 58 50', undefined, trazo(C.crema, 1.4)),
  },
  34: { // El Soldado
    fondo: '#E7F2E9',
    dibujo:
      p('M34 92 Q34 62 44 52 L56 52 Q66 62 66 92Z', C.verdeOsc) +
      sombra('M56 52 Q64 64 64 92 L58 92 Q60 66 52 54Z') +
      p('M34 66 L66 66', undefined, trazo(C.cafe, 4)) + r(44, 62, 12, 8, C.oro) +
      p('M44 52 Q50 56 56 52 L56 45 L44 45Z', C.piel) +
      c(50, 34, 12, C.piel) +
      p('M36 26 L64 26 L64 22 Q50 14 36 22Z', C.verdeOsc) + r(34, 25, 32, 4, C.verdeOsc) +
      luz('M40 18 L60 18 L62 22 L38 22Z', 0.18) +
      ojo(45, 34) + ojo(55, 34) +
      p('M46 42 Q50 45 54 42', undefined, trazo('#B5523F', 1.4)) +
      p('M66 58 L84 20', undefined, trazo(C.cafe, 4)) +
      p('M82 16 L90 20 L84 28Z', C.gris),
  },
  35: { // La Estrella
    fondo: '#1B2A6B',
    dibujo:
      chispa(18, 24, 2.2) + chispa(84, 20, 1.8) + chispa(24, 80, 2) + chispa(80, 74, 2.4) + chispa(50, 12, 1.6) +
      estrella(50, 52, 36, C.amarillo) +
      sombra('M50 16 L58 40 L86 52 L58 64 L50 88 Q60 62 60 52 Q60 40 50 16Z', 0.12) +
      luz('M50 16 L42 40 L14 52 L42 64 L50 88 Q40 62 40 52 Q40 40 50 16Z', 0.18) +
      estrella(50, 52, 14, C.oro) +
      detalle('M50 30 L50 74 M30 52 L70 52', '#C08A00', 1),
  },
  36: { // El Cazo
    fondo: '#F7EBD8',
    dibujo:
      p('M22 46 L78 46 L70 84 Q50 90 30 84Z', C.barro) +
      sombra('M62 46 L78 46 L70 84 Q64 87 58 88 Q68 70 62 46Z', 0.16) +
      luz('M30 48 Q28 68 34 84 L38 85 Q32 68 34 48Z', 0.25) +
      e(50, 46, 30, 7, C.barroClaro) +
      e(50, 46, 22, 4.5, '#8A3E10') +
      p('M78 48 Q92 48 92 58 Q92 66 82 66', undefined, trazo(C.gris, 4)) +
      p('M22 48 Q8 48 8 58 Q8 66 18 66', undefined, trazo(C.gris, 4)) +
      detalle('M34 62 L66 62', '#8A3E10', 1.4) +
      luz('M40 40 Q44 34 42 28 M52 40 Q56 32 52 26', 0.5),
  },
  37: { // El Mundo
    fondo: '#E4F0FF',
    dibujo:
      p('M50 88 L50 94 M36 94 L64 94', undefined, trazo(C.cafe, 3)) +
      p('M32 84 Q50 78 68 84', undefined, trazo(C.cafe, 4)) +
      c(50, 48, 34, C.azul) +
      p('M30 26 Q42 34 38 46 Q34 58 44 62 Q54 66 50 78 L44 76 Q30 66 24 50 Q22 36 30 26Z', C.verde) +
      p('M62 22 Q58 34 66 40 Q76 46 72 56 Q68 66 58 64 Q62 54 56 48 Q52 40 58 32Z', C.verde) +
      p('M72 68 Q80 66 82 60 Q78 74 68 80 Q70 74 72 68Z', C.verde) +
      sombra('M64 18 Q84 30 84 48 Q84 70 64 80 Q78 66 78 48 Q78 30 64 18Z', 0.14) +
      luz('M32 26 Q20 38 20 50 Q20 62 28 72 Q22 60 24 48 Q26 34 34 28Z', 0.22) +
      detalle('M16 48 L84 48', C.crema, 1.2),
  },
  38: { // El Apache
    fondo: '#F6E7D3',
    dibujo:
      p('M34 92 Q34 62 44 54 L56 54 Q66 62 66 92Z', C.barro) +
      sombra('M56 54 Q64 66 64 92 L58 92 Q60 68 52 56Z') +
      p('M40 68 L60 68', undefined, trazo(C.crema, 3)) +
      p('M44 54 Q50 58 56 54 L56 46 L44 46Z', '#C98C5A') +
      c(50, 34, 12, '#C98C5A') +
      p('M36 26 Q50 18 64 26 L64 22 Q50 12 36 22Z', TINTA) +
      p('M34 24 L28 8 L38 18Z', C.rojo) + p('M42 20 L40 4 L48 16Z', C.blanco) + p('M52 18 L56 4 L58 18Z', C.anil) +
      p('M62 22 L72 10 L68 26Z', C.amarillo) +
      ojo(45, 34) + ojo(55, 34) +
      p('M46 42 Q50 45 54 42', undefined, trazo('#8A4A2A', 1.4)) +
      detalle('M42 38 L46 38 M54 38 L58 38', C.rojo, 2),
  },
  39: { // El Nopal
    fondo: '#E8F5DC',
    dibujo:
      e(50, 92, 26, 5, '#C8B48A') +
      p('M42 92 Q38 66 40 48 Q42 34 50 34 Q58 34 60 48 Q62 66 58 92Z', C.verde) +
      p('M40 60 Q26 58 24 46 Q23 36 30 36 Q36 36 38 46Z', C.verde) +
      p('M60 52 Q74 48 76 36 Q77 26 70 26 Q64 26 62 38Z', C.verde) +
      sombra('M54 36 Q60 50 58 92 L54 92 Q58 60 52 36Z', 0.14) +
      luz('M44 40 Q40 62 42 88 L45 88 Q43 62 47 40Z', 0.2) +
      p('M50 30 Q54 24 58 28 Q56 34 50 34Z', C.rojo) + p('M30 34 Q34 28 38 32 Q36 38 30 34Z', C.rojo) +
      detalle('M46 46 L44 44 M52 54 L54 52 M46 64 L44 62 M52 72 L54 70 M34 44 L32 42 M68 38 L70 36', TINTA, 1.4),
  },
  40: { // El Alacrán
    fondo: '#F7E8D8',
    dibujo:
      p('M40 64 Q30 74 22 82 M46 66 Q42 78 40 90 M54 66 Q56 78 58 90 M60 62 Q70 72 78 80', undefined, trazo('#8A3E10', 2.4)) +
      p('M34 54 Q22 52 16 42 M36 60 Q22 62 12 58', undefined, trazo('#8A3E10', 2.2)) +
      p('M26 40 Q14 36 8 26 Q18 30 26 30 Q20 22 24 14 Q30 24 34 34Z', C.barro) +
      p('M44 34 Q36 26 38 14 Q44 22 48 30 Q52 20 58 16 Q58 28 54 36Z', C.barro) +
      e(44, 54, 12, 9, C.barro) +
      e(56, 62, 9, 7, C.barro) + e(64, 68, 7, 5.5, C.barro) +
      p('M68 68 Q84 66 88 52 Q92 36 80 28 Q88 40 82 50 Q76 60 68 62Z', C.barro) +
      p('M78 20 Q88 22 86 32 Q78 34 76 26Z', C.rojo) +
      sombra('M50 56 Q60 58 62 66 Q64 72 70 72 Q58 74 56 66 Q54 60 50 56Z', 0.16) +
      luz('M38 50 Q34 54 36 58 L40 58 Q38 54 41 50Z', 0.3) +
      ojo(40, 50, 1.6) + ojo(46, 48, 1.6) +
      detalle('M38 54 L50 54 M52 60 L62 62', '#8A3E10', 1.2),
  },
  41: { // La Rosa
    fondo: '#FFE6EE',
    dibujo:
      p('M50 52 L50 92', undefined, trazo(C.verdeOsc, 4)) +
      p('M50 66 Q34 62 30 48 Q44 48 50 60Z', C.verde) +
      p('M50 76 Q66 74 70 60 Q56 60 50 72Z', C.verde) +
      c(50, 36, 24, C.rojo) +
      p('M50 12 Q68 16 72 34 Q60 22 50 20 Q40 22 28 34 Q32 16 50 12Z', '#A8162C') +
      sombra('M64 20 Q76 32 72 48 Q68 58 58 60 Q72 48 70 34 Q68 26 64 20Z', 0.14) +
      c(50, 36, 14, '#C81E38') +
      c(50, 36, 7, '#A8162C') +
      luz('M38 26 Q30 34 32 44 Q36 34 44 28Z', 0.25) +
      detalle('M40 30 Q50 26 60 30 M36 42 Q50 38 64 42', '#8E0F24', 1.2),
  },
  42: { // La Calavera
    fondo: '#2C2C34',
    dibujo:
      e(50, 44, 27, 29, C.crema) +
      p('M34 68 Q50 78 66 68 L64 84 Q50 90 36 84Z', C.crema) +
      sombra('M62 22 Q76 36 72 58 Q68 70 58 74 Q72 58 70 40 Q68 28 62 22Z', 0.1) +
      e(39, 42, 8, 9, TINTA) + e(61, 42, 8, 9, TINTA) +
      p('M50 52 L44 62 L56 62Z', TINTA) +
      p('M34 70 L66 70 M40 70 L40 80 M50 70 L50 82 M60 70 L60 80', undefined, trazo(TINTA, 2)) +
      c(39, 30, 3, C.rosa) + c(61, 30, 3, C.amarillo) + c(50, 22, 3.4, C.verde) +
      detalle('M30 52 Q34 58 32 64 M70 52 Q66 58 68 64', C.rosa, 1.6) +
      p('M44 62 Q50 66 56 62', undefined, trazo(C.rosa, 1.4)),
  },
  43: { // La Campana
    fondo: '#FFF1D6',
    dibujo:
      p('M50 12 Q46 16 50 20', undefined, trazo(C.cafe, 3)) +
      p('M50 20 Q26 28 22 74 L78 74 Q74 28 50 20Z', C.oro) +
      sombra('M58 23 Q74 36 72 74 L78 74 Q74 28 58 23Z', 0.16) +
      luz('M40 28 Q30 44 30 72 L36 72 Q34 44 44 30Z', 0.3) +
      r(16, 74, 68, 9, C.amarillo) +
      p('M44 83 Q44 92 50 92 Q56 92 56 83Z', C.cafe) +
      detalle('M28 60 Q50 56 72 60', '#C08A00', 1.6) +
      detalle('M34 44 Q50 40 66 44', '#C08A00', 1.2),
  },
  44: { // El Cantarito
    fondo: '#F7E9D5',
    dibujo:
      p('M42 20 L58 20 L62 30 Q78 40 78 62 Q78 84 50 90 Q22 84 22 62 Q22 40 38 30Z', C.barro) +
      sombra('M60 28 Q72 42 72 62 Q72 80 50 88 Q78 82 78 62 Q78 40 62 30Z', 0.18) +
      luz('M36 34 Q28 46 28 62 Q28 76 40 84 Q32 74 32 62 Q32 46 40 36Z', 0.24) +
      p('M78 46 Q90 48 90 58 Q90 68 80 70', undefined, trazo(C.barro, 5)) +
      e(50, 20, 10, 4, C.barroClaro) +
      p('M27 52 Q50 46 73 52', undefined, trazo(C.crema, 4)) +
      detalle('M30 60 Q50 55 70 60', C.crema, 2) +
      p('M38 68 Q42 64 46 68 Q42 72 38 68Z', C.crema) +
      p('M54 70 Q58 66 62 70 Q58 74 54 70Z', C.crema),
  },
  45: { // El Venado
    fondo: '#F1E8D8',
    dibujo:
      e(50, 92, 28, 4, '#D9C9A3') +
      p('M32 88 L34 66 M44 90 L44 68 M60 90 L60 68 M70 88 L68 66', undefined, trazo(C.cafe, 4)) +
      p('M30 52 Q30 40 44 38 L64 38 Q74 40 74 52 Q74 66 62 70 L42 70 Q30 66 30 52Z', C.cafeClaro) +
      sombra('M62 38 Q74 42 74 54 Q74 66 62 70 L54 70 Q68 64 68 52 Q68 42 60 38Z', 0.14) +
      luz('M38 40 Q32 48 34 60 Q36 66 42 69 L45 69 Q37 62 37 52 Q37 44 42 40Z', 0.2) +
      p('M32 44 Q26 32 24 22 Q30 28 34 34 Q32 26 34 18 Q38 28 40 36Z', C.cafe) +
      p('M26 24 Q20 20 18 12 Q26 16 30 22Z', C.cafe) + p('M36 20 Q36 12 40 6 Q40 16 38 24Z', C.cafe) +
      p('M30 36 Q26 24 32 16 Q36 26 38 34 Q42 26 48 24 Q44 34 42 44Z', C.cafeClaro) +
      c(30, 46, 8, C.cafeClaro) +
      e(26, 50, 5, 4, '#5A2E10') +
      ojo(31, 43, 2) + chispa(31.6, 42.4) +
      p('M36 40 Q40 34 44 38 Q40 42 36 40Z', C.cafeClaro),
  },
  46: { // El Sol
    fondo: '#FFF3C4',
    dibujo:
      rayos(50, 50, 30, 46, 12, C.amarillo) +
      c(50, 50, 30, C.amarillo) +
      sombra('M62 22 Q80 34 80 50 Q80 68 62 78 Q74 66 74 50 Q74 34 62 22Z', 0.12) +
      luz('M38 26 Q26 38 26 52 Q26 64 34 72 Q30 60 32 48 Q34 34 42 28Z', 0.3) +
      c(50, 50, 22, '#F2A93B') +
      c(42, 45, 3, TINTA, 'stroke="none"') + c(58, 45, 3, TINTA, 'stroke="none"') +
      chispa(43, 44, 1.1) + chispa(59, 44, 1.1) +
      p('M40 58 Q50 68 60 58', undefined, trazo(TINTA, 2.4)) +
      c(36, 56, 3.4, '#E4806B', 'stroke="none"') + c(64, 56, 3.4, '#E4806B', 'stroke="none"'),
  },
  47: { // La Corona
    fondo: '#FFF0D2',
    dibujo:
      p('M18 76 L14 30 L32 48 L50 18 L68 48 L86 30 L82 76Z', C.amarillo) +
      sombra('M68 48 L86 30 L82 76 L70 76 Q76 58 68 48Z', 0.16) +
      luz('M14 30 L32 48 Q26 58 28 76 L20 76Z', 0.25) +
      r(16, 76, 68, 10, C.oro) +
      c(14, 28, 4.5, C.rojo) + c(50, 16, 5, C.verde) + c(86, 28, 4.5, C.anil) +
      e(50, 60, 6, 8, C.rojo) + e(32, 62, 4.5, 6, C.verde) + e(68, 62, 4.5, 6, C.anil) +
      c(30, 81, 2.6, C.crema) + c(50, 81, 2.6, C.crema) + c(70, 81, 2.6, C.crema) +
      detalle('M16 76 L84 76', '#C08A00', 1.4),
  },
  48: { // La Chalupa
    fondo: '#DCF1F4',
    dibujo:
      detalle('M6 86 Q22 80 38 86 T70 86 T94 86', C.azul, 2.2) +
      detalle('M10 94 Q26 88 42 94 T74 94', C.azul, 2.2) +
      p('M10 66 Q50 58 90 66 Q84 84 50 86 Q16 84 10 66Z', C.barro) +
      sombra('M64 61 Q80 64 90 66 Q84 84 50 86 Q72 80 78 64Z', 0.16) +
      luz('M20 66 Q24 78 40 83 L44 83 Q28 78 26 66Z', 0.2) +
      p('M30 58 Q34 44 46 40 L54 40 Q66 44 70 58Z', C.verde) +
      c(38, 46, 5, C.rojo) + c(50, 40, 5, C.amarillo) + c(62, 46, 5, C.rosa) +
      p('M46 40 Q50 30 54 40', undefined, trazo(C.verdeOsc, 2)) +
      p('M18 62 L6 44', undefined, trazo(C.cafe, 3)) + p('M4 40 L12 42 L8 48Z', C.cafeClaro) +
      detalle('M20 72 L80 72', '#8A3E10', 1.4),
  },
  49: { // El Pino
    fondo: '#E2F2E0',
    dibujo:
      e(50, 92, 22, 4, '#C8B48A') +
      r(44, 72, 12, 18, C.cafe) +
      sombra('M52 72 L56 72 L56 90 L52 90Z', 0.18) +
      p('M50 8 L74 42 L62 42 L82 70 L18 70 L38 42 L26 42Z', C.verdeOsc) +
      luz('M50 8 L38 24 L44 24 L30 48 L38 48 L26 66 L34 66 Q40 44 50 22Z', 0.16) +
      sombra('M62 30 L74 42 L62 42 L82 70 L64 70 Q72 54 62 30Z', 0.12) +
      c(38, 52, 3, C.rojo) + c(60, 60, 3, C.amarillo) + c(50, 38, 3, C.anil) +
      estrella(50, 10, 6, C.amarillo),
  },
  50: { // El Pescado
    fondo: '#DCF0FF',
    dibujo:
      detalle('M8 20 Q22 14 36 20 M8 88 Q22 82 36 88', C.azul, 2) +
      p('M18 54 Q34 28 58 32 Q78 36 84 54 Q78 72 58 76 Q34 80 18 54Z', C.naranja) +
      sombra('M62 33 Q80 38 84 54 Q78 72 60 76 Q76 66 78 54 Q78 40 62 33Z', 0.16) +
      luz('M32 40 Q22 48 24 58 Q28 48 38 42Z', 0.28) +
      p('M18 54 Q8 40 6 28 Q18 38 24 44 M18 54 Q8 68 6 80 Q18 70 24 64Z', C.naranja) +
      p('M48 34 Q52 22 62 20 Q58 28 58 33Z', C.naranja) +
      c(74, 50, 4.5, C.blanco) + ojo(74.5, 50, 2) + chispa(75, 49.4, 0.8) +
      p('M68 58 Q62 62 58 58', undefined, trazo('#C2410C', 1.6)) +
      detalle('M38 44 Q42 54 38 64 M50 40 Q54 54 50 68 M62 40 Q66 54 62 68', '#C2410C', 1.4),
  },
  51: { // La Palma
    fondo: '#E8F6DD',
    dibujo:
      e(50, 92, 24, 5, '#E8D9A8') +
      p('M46 90 Q42 60 50 34 L56 34 Q54 62 56 90Z', C.cafe) +
      detalle('M47 78 L55 76 M47 66 L55 64 M48 54 L56 52 M49 44 L56 42', '#5A2E10', 1.4) +
      p('M50 34 Q30 26 14 34 Q28 24 50 28Z', C.verdeOsc) +
      p('M50 30 Q34 14 16 14 Q34 6 50 24Z', C.verde) +
      p('M52 30 Q68 12 86 14 Q68 6 52 24Z', C.verde) +
      p('M52 34 Q72 26 88 34 Q74 24 52 28Z', C.verdeOsc) +
      p('M50 26 Q50 12 44 4 Q58 10 56 26Z', C.verde) +
      sombra('M54 28 Q72 24 86 33 Q74 26 54 30Z', 0.12) +
      c(46, 36, 3.4, C.cafeClaro) + c(55, 38, 3.4, C.cafeClaro) + c(50, 42, 3.4, C.cafeClaro),
  },
  52: { // La Maceta
    fondo: '#F3E8DC',
    dibujo:
      p('M50 56 L50 28', undefined, trazo(C.verdeOsc, 3)) +
      p('M50 46 Q38 42 34 30 M50 50 Q62 44 66 32', undefined, trazo(C.verde, 3)) +
      p('M50 40 Q42 36 40 42 Q46 48 50 40Z', C.verde) + p('M50 34 Q58 30 60 36 Q54 42 50 34Z', C.verde) +
      c(50, 24, 7, C.rosa) + c(50, 24, 3, C.amarillo) +
      c(34, 26, 6, C.amarillo) + c(34, 26, 2.4, C.naranja) +
      c(66, 28, 6, C.rojo) + c(66, 28, 2.4, C.amarillo) +
      p('M30 60 L70 60 L64 91 L36 91Z', C.barro) +
      sombra('M58 60 L70 60 L64 91 L56 91 Q62 76 58 60Z', 0.16) +
      luz('M36 62 Q34 76 39 89 L43 89 Q38 76 40 62Z', 0.22) +
      r(26, 54, 48, 8, C.barroClaro) +
      detalle('M38 74 L62 74', C.crema, 2),
  },
  53: { // El Arpa
    fondo: '#F8E7D2',
    dibujo:
      p('M30 90 L30 16 Q52 12 62 30 Q68 44 82 47 L82 90Z', C.crema) +
      p('M38 22 L38 86 M46 24 L46 86 M54 29 L54 86 M62 38 L62 86 M70 46 L70 86 M76 50 L76 86', undefined, trazo(C.oro, 1.6)) +
      p('M28 90 L28 16 Q52 10 62 30 Q68 44 84 47', undefined, trazo('#8A5A2B', 6)) +
      sombra('M62 30 Q68 44 84 47 L84 90 L78 90 L78 50 Q64 46 58 30Z', 0.14) +
      luz('M31 18 L34 18 L34 88 L31 88Z', 0.3) +
      r(22, 86, 66, 6, C.cafe) +
      detalle('M26 50 L34 50 M26 66 L34 66', C.oro, 2),
  },
  54: { // La Rana
    fondo: '#E3F5D9',
    dibujo:
      e(50, 90, 32, 5, '#B9D99B') +
      p('M28 70 Q12 78 18 90 L34 87', C.verde) +
      p('M72 70 Q88 78 82 90 L66 87', C.verde) +
      e(50, 64, 26, 20, C.verde) +
      sombra('M62 48 Q76 56 74 70 Q70 82 56 84 Q70 74 70 62 Q70 54 62 48Z', 0.16) +
      luz('M36 52 Q26 62 28 74 L32 76 Q28 62 40 54Z', 0.24) +
      c(37, 42, 9, C.verde) + c(63, 42, 9, C.verde) +
      c(37, 42, 5, C.blanco) + c(63, 42, 5, C.blanco) + ojo(38, 42, 2.2) + ojo(64, 42, 2.2) +
      chispa(38.8, 41, 0.9) + chispa(64.8, 41, 0.9) +
      p('M34 64 Q50 76 66 64', undefined, trazo(TINTA, 2.4)) +
      p('M44 74 Q50 80 56 74', C.lima) +
      detalle('M38 56 Q44 52 50 56 M52 58 Q58 54 64 58', C.verdeOsc, 1.4),
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
      // Halo claro al centro: separa la figura del fondo, como en la baraja impresa
      `<ellipse cx="50" cy="52" rx="46" ry="44" fill="#FFFFFF" fill-opacity="0.22"/>` +
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
