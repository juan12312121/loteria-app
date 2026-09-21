import { useSyncExternalStore } from 'react';

/** Ajustes de este navegador (no viajan al servidor). */
export interface Preferencias {
  sonido: boolean;
  autoMarcar: boolean;
  tema: 'claro' | 'noche';
}

const CLAVE = 'loteria.preferencias';
const INICIALES: Preferencias = { sonido: true, autoMarcar: false, tema: 'claro' };

function leer(): Preferencias {
  try {
    return { ...INICIALES, ...JSON.parse(localStorage.getItem(CLAVE) ?? '{}') };
  } catch {
    return INICIALES;
  }
}

let actuales = leer();
const oyentes = new Set<() => void>();

export const preferencias = () => actuales;

export function cambiarPreferencia<K extends keyof Preferencias>(clave: K, valor: Preferencias[K]) {
  actuales = { ...actuales, [clave]: valor };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(actuales));
  } catch {
    /* sin almacenamiento: dura hasta recargar */
  }
  oyentes.forEach((f) => f());
}

const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};

export function usePreferencias() {
  return useSyncExternalStore(suscribir, preferencias, preferencias);
}
