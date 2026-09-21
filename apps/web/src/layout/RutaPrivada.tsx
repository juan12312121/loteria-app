import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSesion } from '@loteria/core';
import { Cargando } from '../componentes/ui/basicos';

/** Solo deja pasar con sesión; si no, manda a /entrar y recuerda a dónde iba. */
export function RutaPrivada() {
  const { perfil, iniciando } = useSesion();
  const ubicacion = useLocation();
  if (iniciando) return <Cargando texto="Revisando tu sesión…" />;
  if (!perfil) return <Navigate to="/entrar" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  return <Outlet />;
}
