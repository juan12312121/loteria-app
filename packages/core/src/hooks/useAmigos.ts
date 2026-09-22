import { useServicios } from '../contexto/LoteriaProvider';
import { useAccion, useConsulta } from './genericos';
import { useAlReconectar } from './useConexion';

/**
 * Amigos: agregar por código, aceptar solicitudes, ver quién está en línea
 * y en qué sala anda. La lista se refresca sola cada tanto para la presencia.
 */
const CADA_MS = 30_000;

export function useAmigos() {
  const { api } = useServicios();
  const resumen = useConsulta(() => api.amigos.resumen(), [api]);
  const { recargar } = resumen;

  useAlReconectar(() => void recargar());

  const solicitar = useAccion(async (codigo: string) => {
    const r = await api.amigos.solicitar(codigo);
    await recargar();
    return r;
  });

  const aceptar = useAccion(async (id: string) => {
    await api.amigos.aceptar(id);
    await recargar();
  });

  const quitar = useAccion(async (id: string) => {
    await api.amigos.quitar(id);
    await recargar();
  });

  return {
    miCodigo: resumen.data?.mi_codigo ?? '',
    amigos: resumen.data?.amigos ?? [],
    pendientes: resumen.data?.pendientes ?? [],
    enviadas: resumen.data?.enviadas ?? [],
    cargando: resumen.cargando,
    error: resumen.error,
    recargar,
    /** Cada cuánto conviene volver a preguntar quién está en línea */
    intervaloMs: CADA_MS,
    solicitar,
    aceptar,
    quitar,
  };
}

/** Revanchas contra un amigo: partidas juntos y quién ganó más. */
export function useRevanchas(amigoId: string | null) {
  const { api } = useServicios();
  const revanchas = useConsulta(() => (amigoId ? api.amigos.revanchas(amigoId) : Promise.resolve(null)), [api, amigoId]);
  return { revanchas: revanchas.data ?? null, cargando: revanchas.cargando };
}
