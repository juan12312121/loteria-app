import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useSesion } from '@loteria/core';
import { useAvisos } from '../avisos';
import { Cargando } from '../componentes/ui/basicos';

/** Solo deja pasar con sesión; si no, manda a /entrar. */
export function ConSesion({ children }: { children: ReactNode }) {
  const { perfil, iniciando } = useSesion();
  useAvisos();
  if (iniciando) return <Cargando texto="Revisando tu sesión…" />;
  if (!perfil) return <Redirect href="/entrar" />;
  return <>{children}</>;
}
