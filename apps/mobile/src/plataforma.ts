import * as SecureStore from 'expo-secure-store';
import type { Almacen } from '@loteria/core';

/** La sesión se guarda cifrada en el llavero del teléfono. */
export const almacenMovil: Almacen = {
  leer: (clave) => SecureStore.getItemAsync(clave),
  guardar: (clave, valor) => SecureStore.setItemAsync(clave, valor),
  borrar: (clave) => SecureStore.deleteItemAsync(clave),
};
