import { tema, type Almacen } from '@loteria/core';

/** Sesión en localStorage (si el navegador lo bloquea, la app sigue sin recordar la sesión). */
export const almacenWeb: Almacen = {
  leer: async (clave) => {
    try {
      return localStorage.getItem(clave);
    } catch {
      return null;
    }
  },
  guardar: async (clave, valor) => {
    try {
      localStorage.setItem(clave, valor);
    } catch {
      /* sin almacenamiento disponible */
    }
  },
  borrar: async (clave) => {
    try {
      localStorage.removeItem(clave);
    } catch {
      /* sin almacenamiento disponible */
    }
  },
};

const aKebab = (s: string) => s.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);

/** Publica los tokens del tema compartido como variables CSS (--rosa, --f-titulo…). */
export function aplicarTema(raiz: HTMLElement) {
  for (const [nombre, valor] of Object.entries(tema.colores)) raiz.style.setProperty(`--${aKebab(nombre)}`, valor);
  for (const [nombre, valor] of Object.entries(tema.coloresRareza)) raiz.style.setProperty(`--rareza-${nombre}`, valor);
  raiz.style.setProperty('--f-titulo', `'${tema.fuentes.titulo}', Georgia, serif`);
  raiz.style.setProperty('--f-cuerpo', `'${tema.fuentes.cuerpo}', system-ui, sans-serif`);
}
