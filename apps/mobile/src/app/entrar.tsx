import { Redirect } from 'expo-router';
import { useSesion } from '@loteria/core';
import { PantallaEntrar } from '../pantallas/PantallaEntrar';

export default function RutaEntrar() {
  const { perfil } = useSesion();
  if (perfil) return <Redirect href="/" />;
  return <PantallaEntrar />;
}
