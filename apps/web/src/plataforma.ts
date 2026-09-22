import { tema, TEMAS, type Almacen } from '@loteria/core';

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

const variables = (colores: Record<string, string>) =>
  Object.entries(colores)
    .map(([nombre, valor]) => `--${aKebab(nombre)}:${valor};`)
    .join('');

/**
 * Publica los tokens del tema compartido como variables CSS (--rosa, --f-titulo…).
 * Cada tema de la tienda se activa con data-tema="<clave>" en <html>.
 */
export function aplicarTema(documento: Document) {
  const rareza = Object.entries(tema.coloresRareza)
    .map(([nombre, valor]) => `--rareza-${nombre}:${valor};`)
    .join('');
  const fuentes = `--f-titulo:'${tema.fuentes.titulo}', Georgia, serif;--f-cuerpo:'${tema.fuentes.cuerpo}', system-ui, sans-serif;`;
  const estilo = documento.createElement('style');
  estilo.id = 'tema-loteria';
  estilo.textContent =
    `:root{${variables(tema.colores)}${rareza}${fuentes}color-scheme:light;}` +
    Object.entries(TEMAS)
      .map(([clave, t]) => `:root[data-tema="${clave}"]{${variables(t.colores)}color-scheme:${t.oscuro ? 'dark' : 'light'};}`)
      .join('');
  documento.head.appendChild(estilo);
}
