import { ScrollView, Text } from 'react-native';
import { useComunes } from '../tema';
import { PanelProgreso } from './lobby/PanelProgreso';

/** Recompensa diaria y misiones, en su propia pestaña como en la web. */
export function PantallaMisiones() {
  const comunes = useComunes();
  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <Text style={comunes.textoSuave}>Cobra tu recompensa de cada día y completa misiones para ganar puntos y skins exclusivas.</Text>
      <PanelProgreso />
    </ScrollView>
  );
}
