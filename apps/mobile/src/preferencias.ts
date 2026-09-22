import { useSyncExternalStore } from 'react';
import { almacenMovil } from './plataforma';

/** Ajustes del jugador en este celular (se guardan en el teléfono). */
export interface Preferencias {
  sonido: boolean;
  autoMarcar: boolean;
}

const CLAVE = 'loteria.preferencias';
let actuales: Preferencias = { sonido: true, autoMarcar: false };
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

// Al abrir la app se recuperan los ajustes guardados
void almacenMovil
  .leer(CLAVE)
  .then((guardado) => {
    if (!guardado) return;
    actuales = { ...actuales, ...JSON.parse(guardado) };
    avisar();
  })
  .catch(() => undefined);

export const preferencias = () => actuales;

export function cambiarPreferencia<K extends keyof Preferencias>(clave: K, valor: Preferencias[K]) {
  actuales = { ...actuales, [clave]: valor };
  avisar();
  void almacenMovil.guardar(CLAVE, JSON.stringify(actuales)).catch(() => undefined);
}

const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};

export const usePreferencias = () => useSyncExternalStore(suscribir, preferencias, preferencias);
