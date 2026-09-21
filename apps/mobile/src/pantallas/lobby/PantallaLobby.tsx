import { RefreshControl, ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { useLobby, type Sala } from '@loteria/core';
import { Tarjeta } from '../../componentes/ui/basicos';
import { comunes } from '../../tema';
import { UnirseConCodigo } from './UnirseConCodigo';
import { FormCrearSala } from './FormCrearSala';
import { ListaSalas } from './ListaSalas';
import { PanelProgreso } from './PanelProgreso';

export function PantallaLobby() {
  const { mias, publicas, crear, unirse } = useLobby();
  const irASala = (sala: Sala) => router.push(`/sala/${sala.id}`);
  const recargar = () => Promise.all([mias.recargar(), publicas.recargar()]);

  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido} refreshControl={<RefreshControl refreshing={mias.cargando && !!mias.data} onRefresh={recargar} />}>
      <Text style={comunes.lema}>¡Se va y se corre!</Text>
      <Text style={comunes.textoSuave}>Se gana con tabla llena; las cuatro esquinas y La O se anuncian en vivo.</Text>
      <PanelProgreso />
      <Tarjeta titulo="Unirse con código">
        <UnirseConCodigo accion={unirse} alEntrar={irASala} />
      </Tarjeta>
      <Tarjeta titulo="Crear sala">
        <FormCrearSala accion={crear} alCrear={irASala} />
      </Tarjeta>
      <Tarjeta titulo="Mis salas">
        <ListaSalas consulta={mias} vacio="Todavía no estás en ninguna sala." alEntrar={irASala} />
      </Tarjeta>
      <Tarjeta titulo="Salas públicas">
        <ListaSalas
          consulta={publicas}
          vacio="No hay salas públicas abiertas. ¡Crea una!"
          alEntrar={async (sala) => {
            if (sala.soy_miembro) return irASala(sala);
            const unida = await unirse.ejecutar(sala.codigo);
            if (unida) irASala(unida);
          }}
        />
      </Tarjeta>
    </ScrollView>
  );
}
