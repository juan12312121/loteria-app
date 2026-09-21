import { useLocalSearchParams } from 'expo-router';
import { ConSesion } from '../../navegacion/ConSesion';
import { PantallaSala } from '../../pantallas/sala/PantallaSala';

export default function RutaSala() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ConSesion>
      <PantallaSala salaId={id} />
    </ConSesion>
  );
}
