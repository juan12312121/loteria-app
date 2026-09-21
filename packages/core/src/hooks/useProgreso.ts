import { useServicios, useSesion } from '../contexto/LoteriaProvider';
import { useAccion, useConsulta } from './genericos';

/** Recompensa diaria y misiones. Cobrar refresca los puntos del perfil. */
export function useProgreso() {
  const { api } = useServicios();
  const { refrescar } = useSesion();
  const resumen = useConsulta(() => api.progreso.resumen(), [api]);

  const actualizar = () => Promise.all([resumen.recargar(), refrescar()]);

  const reclamarDiario = useAccion(async () => {
    const r = await api.progreso.reclamarDiario();
    await actualizar();
    return r;
  });

  const cobrarMision = useAccion(async (clave: string) => {
    const r = await api.progreso.cobrarMision(clave);
    await actualizar();
    return r;
  });

  return {
    diario: resumen.data?.diario ?? null,
    misiones: resumen.data?.misiones ?? [],
    /** Cosas por cobrar (misiones listas + la recompensa de hoy) */
    porCobrar: (resumen.data?.por_cobrar ?? 0) + (resumen.data?.diario.disponible ? 1 : 0),
    cargando: resumen.cargando,
    error: resumen.error,
    recargar: resumen.recargar,
    reclamarDiario,
    cobrarMision,
  };
}

/** Ranking de la semana en curso (se premia solo cada lunes). */
export function useRankingSemanal(limite = 20) {
  const { api } = useServicios();
  const ranking = useConsulta(() => api.progreso.ranking(limite), [api, limite]);
  return { ranking: ranking.data ?? null, cargando: ranking.cargando, error: ranking.error, recargar: ranking.recargar };
}

/** Perfil con estadísticas (el mío si no se pasa usuario) y, si es el mío, mis movimientos de puntos. */
export function usePerfilJuego(usuarioId?: string) {
  const { api } = useServicios();
  const perfil = useConsulta(() => api.progreso.perfil(usuarioId), [api, usuarioId]);
  const movimientos = useConsulta(() => (usuarioId ? Promise.resolve([]) : api.puntos.mios()), [api, usuarioId]);
  return {
    perfil: perfil.data ?? null,
    movimientos: movimientos.data ?? [],
    cargando: perfil.cargando,
    error: perfil.error,
  };
}
