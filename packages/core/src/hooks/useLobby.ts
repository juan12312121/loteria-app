import { useServicios } from '../contexto/LoteriaProvider';
import type { NuevaSala } from '../tipos';
import { useAccion, useConsulta } from './genericos';

/** Salas del jugador, salas públicas y las acciones para crear o entrar. */
export function useLobby() {
  const { api } = useServicios();
  const mias = useConsulta(() => api.salas.mias(), [api]);
  const publicas = useConsulta(() => api.salas.publicas(), [api]);

  /** Crea la sala y le abre la primera ronda para que todos puedan elegir tabla. */
  const crear = useAccion(async (datos: NuevaSala) => {
    const sala = await api.salas.crear(datos);
    await api.partidas.crear(sala.id);
    return sala;
  });

  const unirse = useAccion((codigo: string) => api.salas.unirse(codigo));

  return { mias, publicas, crear, unirse };
}
