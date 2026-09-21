/** Frases del chat rápido (las mismas claves que acepta el servidor). */
export const FRASES = {
  casi: '¡Ya casi!',
  corre: '¡Corre y se va corriendo!',
  falto: '¡Me faltó una!',
  suerte: '¡Suerte a todos!',
  bien: '¡Bien jugado!',
  otra: '¡Otra ronda!',
  ay: '¡Ay, nanita!',
  jaja: '¡Jajaja!',
} as const;

export type ClaveFrase = keyof typeof FRASES;
export const CLAVES_FRASE = Object.keys(FRASES) as ClaveFrase[];
export const textoFrase = (clave: string) => FRASES[clave as ClaveFrase] ?? '';
