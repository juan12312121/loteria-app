/**
 * Dónde guardar la sesión. Cada plataforma pone su implementación:
 * localStorage en web, SecureStore en el celular.
 */
export interface Almacen {
  leer(clave: string): Promise<string | null>;
  guardar(clave: string, valor: string): Promise<void>;
  borrar(clave: string): Promise<void>;
}

/** Almacén en memoria (pruebas o cuando no hay otro disponible). */
export function almacenEnMemoria(): Almacen {
  const datos = new Map<string, string>();
  return {
    leer: async (clave) => datos.get(clave) ?? null,
    guardar: async (clave, valor) => void datos.set(clave, valor),
    borrar: async (clave) => void datos.delete(clave),
  };
}
