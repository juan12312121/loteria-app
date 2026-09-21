import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { coloresRareza, nombresRareza, useSesion, useTienda, type Skin, type TipoSkin } from '@loteria/core';
import { Cargando, Chip, MensajeError, Pestanas } from '../componentes/ui/basicos';
import { Boton } from '../componentes/ui/Boton';
import { Carta, Ficha } from '../componentes/juego/Carta';
import { colores, comunes, radio } from '../tema';

const MUESTRA = { id: 1, nombre: 'El Gallo', imagen_url: null };

export function PantallaTienda() {
  const { perfil } = useSesion();
  const [tipo, setTipo] = useState<TipoSkin>('ficha');
  const tienda = useTienda(tipo);
  const puntos = perfil?.puntos ?? 0;
  const error = tienda.canjear.error ?? tienda.equipar.error;

  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
        <Text style={comunes.titulo}>Tienda</Text>
        <Chip tono="amarillo">{`⭐ ${puntos} pts`}</Chip>
      </View>
      <Text style={comunes.textoSuave}>Gana puntos jugando: 5 por tabla, y más si ganas o haces figuras primero.</Text>
      <Pestanas<TipoSkin>
        opciones={[
          { valor: 'ficha', etiqueta: 'Fichas' },
          { valor: 'carta', etiqueta: 'Cartas' },
        ]}
        valor={tipo}
        alCambiar={setTipo}
      />
      {error && <Text style={comunes.error}>{error}</Text>}
      {tienda.cargando && !tienda.skins.length ? (
        <Cargando />
      ) : tienda.error ? (
        <MensajeError mensaje={tienda.error} />
      ) : (
        <View style={estilos.rejilla}>
          {tienda.skins.map((skin) => (
            <TarjetaSkin
              key={skin.id}
              skin={skin}
              puntos={puntos}
              ocupado={tienda.canjear.cargando || tienda.equipar.cargando}
              alCanjear={() => tienda.canjear.ejecutar(skin.id)}
              alEquipar={() => tienda.equipar.ejecutar(skin.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function TarjetaSkin({ skin, puntos, ocupado, alCanjear, alEquipar }: { skin: Skin; puntos: number; ocupado: boolean; alCanjear: () => void; alEquipar: () => void }) {
  const faltan = skin.precio_puntos - puntos;
  return (
    <View style={[estilos.skin, { borderColor: coloresRareza[skin.rareza] }]}>
      {skin.tipo === 'ficha' ? <Ficha skin={skin.clave} tamano={48} /> : <View style={{ width: 64 }}><Carta carta={MUESTRA} skin={skin.clave} /></View>}
      <Text style={[comunes.negrita, { textAlign: 'center' }]}>{skin.nombre}</Text>
      <Text style={{ color: coloresRareza[skin.rareza], fontWeight: '900', fontSize: 12 }}>{nombresRareza[skin.rareza]}</Text>
      {skin.equipada ? (
        <Chip tono="verde">✓ Equipada</Chip>
      ) : skin.la_tengo ? (
        <Boton tamano="s" variante="secundario" alPresionar={alEquipar} deshabilitado={ocupado}>Equipar</Boton>
      ) : faltan > 0 ? (
        <Boton tamano="s" variante="secundario" deshabilitado>{`Faltan ${faltan}`}</Boton>
      ) : (
        <Boton tamano="s" alPresionar={alCanjear} deshabilitado={ocupado}>{skin.precio_puntos ? `${skin.precio_puntos} pts` : 'Gratis'}</Boton>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skin: { width: '48%', alignItems: 'center', gap: 6, padding: 12, borderWidth: 3, borderRadius: radio.l, backgroundColor: colores.blanco },
});
