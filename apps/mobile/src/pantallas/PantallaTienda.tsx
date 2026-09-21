import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  coloresRareza, nombresRareza, svgDeAvatar, svgDeFondo, useColeccion, useSesion, useTienda, type Skin, type TipoSkin,
} from '@loteria/core';
import { Avance, Cargando, Chip, MensajeError, Pestanas } from '../componentes/ui/basicos';
import { Boton } from '../componentes/ui/Boton';
import { Carta, Ficha } from '../componentes/juego/Carta';
import { colores, comunes, radio } from '../tema';

const MUESTRA = { id: 1, nombre: 'El Gallo', imagen_url: null };
const TIPOS: { valor: TipoSkin; etiqueta: string }[] = [
  { valor: 'ficha', etiqueta: 'Fichas' },
  { valor: 'carta', etiqueta: 'Cartas' },
  { valor: 'avatar', etiqueta: 'Avatares' },
  { valor: 'fondo', etiqueta: 'Fondos' },
];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fecha = (mmdd: string) => `${Number(mmdd.slice(3))} ${MESES[Number(mmdd.slice(0, 2)) - 1]}`;

export function PantallaTienda() {
  const { perfil } = useSesion();
  const [tipo, setTipo] = useState<TipoSkin>('ficha');
  const tienda = useTienda(tipo);
  const { coleccion, recargar } = useColeccion();
  const puntos = perfil?.puntos ?? 0;
  const error = tienda.canjear.error ?? tienda.equipar.error;
  const tengo = coleccion.reduce((t, c) => t + c.tengo, 0);
  const total = coleccion.reduce((t, c) => t + c.total, 0);

  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
        <Text style={comunes.titulo}>Tienda</Text>
        <Chip tono="amarillo">{`⭐ ${puntos} pts`}</Chip>
      </View>
      <Text style={comunes.textoSuave}>Gana puntos jugando, con la recompensa diaria y con misiones. Las exclusivas se ganan.</Text>
      {total > 0 && (
        <View style={{ gap: 4 }}>
          <Text style={comunes.negrita}>{`Álbum: ${tengo} de ${total}`}</Text>
          <Avance valor={tengo} total={total} tono="verde" />
        </View>
      )}
      <Pestanas<TipoSkin> opciones={TIPOS} valor={tipo} alCambiar={setTipo} />
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
              alCanjear={async () => {
                if (await tienda.canjear.ejecutar(skin.id)) void recargar();
              }}
              alEquipar={() => tienda.equipar.ejecutar(skin.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function Muestra({ skin }: { skin: Skin }) {
  switch (skin.tipo) {
    case 'ficha':
      return <Ficha skin={skin.clave} tamano={48} />;
    case 'carta':
      return (
        <View style={{ width: 64 }}>
          <Carta carta={MUESTRA} skin={skin.clave} />
        </View>
      );
    case 'avatar':
      return <SvgXml xml={svgDeAvatar(skin.clave)} width={60} height={60} />;
    case 'fondo':
      return (
        <View style={estilos.fondo}>
          <SvgXml xml={svgDeFondo(skin.clave)} width="100%" height="100%" />
        </View>
      );
  }
}

interface TarjetaProps {
  skin: Skin;
  puntos: number;
  ocupado: boolean;
  alCanjear: () => void;
  alEquipar: () => void;
}

function TarjetaSkin({ skin, puntos, ocupado, alCanjear, alEquipar }: TarjetaProps) {
  const faltan = skin.precio_puntos - puntos;
  const bloqueada = !skin.la_tengo && skin.disponible === false;
  return (
    <View style={[estilos.skin, { borderColor: coloresRareza[skin.rareza] }, bloqueada && { opacity: 0.75 }]}>
      <Muestra skin={skin} />
      <Text style={[comunes.negrita, { textAlign: 'center' }]}>{skin.nombre}</Text>
      <Text style={{ color: coloresRareza[skin.rareza], fontWeight: '900', fontSize: 12 }}>{nombresRareza[skin.rareza]}</Text>
      {skin.temporada_inicio && skin.temporada_fin && (
        <Chip tono={skin.disponible ? 'rosa' : 'neutro'}>
          {skin.disponible ? '¡De temporada!' : `${fecha(skin.temporada_inicio)} – ${fecha(skin.temporada_fin)}`}
        </Chip>
      )}
      {skin.equipada ? (
        <Chip tono="verde">✓ Equipada</Chip>
      ) : skin.la_tengo ? (
        <Boton tamano="s" variante="secundario" alPresionar={alEquipar} deshabilitado={ocupado}>
          Equipar
        </Boton>
      ) : skin.exclusiva ? (
        <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>{`🔒 ${skin.descripcion}`}</Text>
      ) : !skin.disponible ? (
        <Chip>{`🔒 Vuelve el ${fecha(skin.temporada_inicio ?? '01-01')}`}</Chip>
      ) : faltan > 0 ? (
        <Boton tamano="s" variante="secundario" deshabilitado>{`Faltan ${faltan}`}</Boton>
      ) : (
        <Boton tamano="s" alPresionar={alCanjear} deshabilitado={ocupado}>
          {skin.precio_puntos ? `${skin.precio_puntos} pts` : 'Gratis'}
        </Boton>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skin: { width: '48%', alignItems: 'center', gap: 6, padding: 12, borderWidth: 3, borderRadius: radio.l, backgroundColor: colores.blanco },
  fondo: { width: 100, height: 64, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.m, overflow: 'hidden' },
});
