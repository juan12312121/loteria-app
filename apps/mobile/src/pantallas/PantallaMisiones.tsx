import { ScrollView, Text } from 'react-native';
import { useComunes } from '../tema';
import { PanelProgreso } from './lobby/PanelProgreso';
import { PanelNivel } from './lobby/PanelNivel';

/** Recompensa diaria y misiones, en su propia pestaña como en la web. */
export function PantallaMisiones() {
  const comunes = useComunes();
  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <Text style={comunes.textoSuave}>Tu nivel, el pase del mes, la recompensa diaria y las misiones. Todo se gana jugando.</Text>
      <PanelNivel />
      <PanelProgreso />
    </ScrollView>
  );
}
