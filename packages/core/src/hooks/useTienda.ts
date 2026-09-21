import { useServicios, useSesion } from '../contexto/LoteriaProvider';
import type { TipoSkin } from '../tipos';
import { useAccion, useConsulta } from './genericos';

/** Catálogo de skins de un tipo, con canje y equipo. Refresca el perfil tras cada cambio. */
export function useTienda(tipo: TipoSkin) {
  const { api } = useServicios();
  const { refrescar } = useSesion();
  const catalogo = useConsulta(() => api.skins.catalogo(tipo), [api, tipo]);

  const actualizarTodo = () => Promise.all([catalogo.recargar(), refrescar()]);

  const canjear = useAccion(async (skinId: string) => {
    const r = await api.skins.canjear(skinId);
    await actualizarTodo();
    return r;
  });

  const equipar = useAccion(async (skinId: string) => {
    await api.skins.equipar(skinId);
    await actualizarTodo();
  });

  return { skins: catalogo.data ?? [], cargando: catalogo.cargando, error: catalogo.error, canjear, equipar };
}

/** Cuántas skins tengo de cada tipo (álbum de colección). */
export function useColeccion() {
  const { api } = useServicios();
  const coleccion = useConsulta(() => api.skins.coleccion(), [api]);
  return { coleccion: coleccion.data ?? [], recargar: coleccion.recargar };
}
