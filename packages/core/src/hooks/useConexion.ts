import { useEffect, useRef, useState } from 'react';
import { useServicios } from '../contexto/LoteriaProvider';
import type { EstadoConexion } from '../realtime/RealtimeCliente';

/** Estado de la conexión en vivo (para mostrar "reconectando…"). */
export function useConexion(): EstadoConexion {
  const { realtime } = useServicios();
  const [estado, setEstado] = useState(realtime.estado);
  useEffect(() => {
    setEstado(realtime.estado);
    return realtime.alCambiarConexion(setEstado);
  }, [realtime]);
  return estado;
}

/** Corre `fn` cada vez que vuelve la conexión, para recuperar lo que pasó mientras tanto. */
export function useAlReconectar(fn: () => void) {
  const { realtime } = useServicios();
  const actual = useRef(fn);
  useEffect(() => {
    actual.current = fn;
  });
  useEffect(() => realtime.alReconectar(() => actual.current()), [realtime]);
}
