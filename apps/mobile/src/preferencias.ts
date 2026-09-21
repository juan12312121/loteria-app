import { useSyncExternalStore } from 'react';

/** Ajustes del jugador en este celular (duran mientras la app está abierta). */
export interface Preferencias {
  autoMarcar: boolean;
}

let actuales: Preferencias = { autoMarcar: false };
const oyentes = new Set<() => void>();

export function cambiarPreferencia<K extends keyof Preferencias>(clave: K, valor: Preferencias[K]) {
  actuales = { ...actuales, [clave]: valor };
  oyentes.forEach((f) => f());
}

const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
const leer = () => actuales;

export const usePreferencias = () => useSyncExternalStore(suscribir, leer, leer);
