/**
 * Cómo se dibuja el nivel de un jugador. Las mismas reglas que el servidor
 * (loteria-backend/src/juego/Niveles.ts): aquí solo se usan para pintar la
 * insignia de alguien más cuando únicamente conocemos su experiencia.
 * Quien manda siempre es el servidor.
 */

const XP_BASE = 120;
export const NIVEL_MAXIMO = 50;

export const xpParaNivel = (nivel: number) => Math.round((XP_BASE * ((nivel - 1) * nivel)) / 2);

export function nivelDe(xp: number): number {
  let nivel = 1;
  while (nivel < NIVEL_MAXIMO && xp >= xpParaNivel(nivel + 1)) nivel++;
  return nivel;
}

export interface Insignia {
  desde: number;
  clave: string;
  nombre: string;
  emoji: string;
}

export const INSIGNIAS: Insignia[] = [
  { desde: 1, clave: 'novato', nombre: 'Novato', emoji: '🌱' },
  { desde: 5, clave: 'frijolito', nombre: 'Frijolito', emoji: '🫘' },
  { desde: 10, clave: 'buenas', nombre: 'De buenas', emoji: '🍀' },
  { desde: 16, clave: 'cantor', nombre: 'Cantor', emoji: '📣' },
  { desde: 23, clave: 'charro', nombre: 'Charro', emoji: '🤠' },
  { desde: 31, clave: 'catrin', nombre: 'Catrín', emoji: '🎩' },
  { desde: 40, clave: 'leyenda', nombre: 'Leyenda', emoji: '👑' },
];

export const insigniaDe = (nivel: number) => [...INSIGNIAS].reverse().find((i) => nivel >= i.desde) ?? INSIGNIAS[0];

/** Nivel e insignia a partir de los puntos ganados en toda la vida. */
export function nivelYInsignia(xp: number) {
  const nivel = nivelDe(xp);
  return { nivel, insignia: insigniaDe(nivel) };
}
