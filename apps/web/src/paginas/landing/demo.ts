import type { Carta } from '@loteria/core';

/**
 * Datos fijos para la demostración de la landing (funciona aunque el
 * backend no responda y sin sesión).
 */
const CARTAS_DEMO: Array<Pick<Carta, 'id' | 'nombre' | 'verso'>> = [
  { id: 1, nombre: 'El Gallo', verso: 'El que le cantó a San Pedro no le volverá a cantar.' },
  { id: 3, nombre: 'La Dama', verso: 'Puliendo el paso, por toda la calle real.' },
  { id: 4, nombre: 'El Catrín', verso: 'Don Ferruco en la alameda, su bastón quería tirar.' },
  { id: 6, nombre: 'La Sirena', verso: 'Con los cantos de sirena, no te vayas a marear.' },
  { id: 8, nombre: 'La Botella', verso: 'La herramienta del borracho.' },
  { id: 10, nombre: 'El Árbol', verso: 'El que a buen árbol se arrima, buena sombra le cobija.' },
  { id: 12, nombre: 'El Valiente', verso: 'Por qué le corres cobarde, trayendo tan buen puñal.' },
  { id: 14, nombre: 'La Muerte', verso: 'La muerte tilica y flaca.' },
  { id: 23, nombre: 'La Luna', verso: 'El farol de los enamorados.' },
  { id: 24, nombre: 'El Cotorro', verso: 'Cotorro cotorro saca la pata, y empiézame a platicar.' },
  { id: 27, nombre: 'El Corazón', verso: 'No me extrañes corazón, que regreso en el camión.' },
  { id: 30, nombre: 'El Camarón', verso: 'Camarón que se duerme, se lo lleva la corriente.' },
  { id: 35, nombre: 'La Estrella', verso: 'La guía de los marineros.' },
  { id: 39, nombre: 'El Nopal', verso: 'Al nopal lo van a ver, nomás cuando tiene tunas.' },
  { id: 41, nombre: 'La Rosa', verso: 'Rosita, Rosaura, ven que te quiero ahora.' },
  { id: 43, nombre: 'La Campana', verso: 'Tú con la campana y yo con tu hermana.' },
  { id: 46, nombre: 'El Sol', verso: 'La cobija de los pobres.' },
  { id: 48, nombre: 'La Chalupa', verso: 'Rema que rema Lupita, sentada en su chalupita.' },
  { id: 50, nombre: 'El Pescado', verso: 'El que por la boca muere, aunque mudo fuere.' },
  { id: 54, nombre: 'La Rana', verso: 'Al ver a la verde rana, qué brinco pegó tu hermana.' },
];

export const cartasDemo: Map<number, Carta> = new Map(CARTAS_DEMO.map((c) => [c.id, { ...c, imagen_url: null }]));

/** Tabla de ejemplo (las esquinas son 1, 46, 4 y 54). */
export const TABLA_DEMO = [1, 6, 23, 46, 3, 14, 27, 35, 10, 24, 48, 50, 4, 39, 43, 54];

/** Orden en que canta el cantor de la demo: forma las cuatro esquinas en la carta 9. */
export const CANTADAS_DEMO = [23, 12, 1, 41, 54, 27, 4, 30, 46, 14, 8, 48];

/** Índices de las esquinas de una tabla 4×4. */
export const ESQUINAS = new Set([0, 3, 12, 15]);

export const listaCartasDemo = [...cartasDemo.values()];

/** Figuras explicadas en la landing (mismas máscaras que el servidor). */
export const FIGURAS_LANDING = [
  { clave: 'llena', nombre: 'Tabla llena', mascara: 0xffff, texto: 'Las 16 casillas. Es la única que termina la ronda.', premio: 'Pozo + 100 pts', gana: true },
  { clave: 'esquinas', nombre: 'Cuatro esquinas', mascara: 0x9009, texto: 'Las cuatro puntas. Se anuncia a toda la sala.', premio: '+25 pts, solo al primero', gana: false },
  { clave: 'marco', nombre: 'La O', mascara: 0xf99f, texto: 'Todo el borde: las 12 casillas de afuera.', premio: '+70 pts, solo al primero', gana: false },
];
