import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { nivelYInsignia, useAmigos, useRevanchas, type Amigo } from '@loteria/core';
import { Avatar, Cargando, Chip, MensajeError, Tarjeta, Vacio } from '../componentes/ui/basicos';
import { Boton } from '../componentes/ui/Boton';
import { fuentes, radio, useColores, useComunes, useEstilos, type Colores } from '../tema';

const LARGO_CODIGO = 6;

export function PantallaAmigos() {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const { miCodigo, amigos, pendientes, enviadas, cargando, error, recargar, intervaloMs, solicitar, aceptar, quitar } = useAmigos();
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  // La presencia cambia sola: se vuelve a preguntar cada tanto
  useEffect(() => {
    const t = setInterval(() => void recargar(), intervaloMs);
    return () => clearInterval(t);
  }, [intervaloMs, recargar]);

  const agregar = async () => {
    const r = await solicitar.ejecutar(codigo);
    if (!r) return;
    setCodigo('');
    setAviso(r.estado === 'aceptada' ? `¡${r.amigo.nombre} ya es tu amigo!` : `Le mandamos la solicitud a ${r.amigo.nombre}`);
  };

  const copiar = async () => {
    await Clipboard.setStringAsync(miCodigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  const compartir = async () => {
    const texto = `Agrégame en la Lotería: mi código es ${miCodigo}`;
    const whatsapp = `whatsapp://send?text=${encodeURIComponent(texto)}`;
    if (await Linking.canOpenURL(whatsapp)) await Linking.openURL(whatsapp);
    else await Share.share({ message: texto });
  };

  if (cargando && !miCodigo) return <Cargando />;

  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <Tarjeta titulo="Tu código">
        <View style={{ gap: 10 }}>
          <Text style={estilos.codigo}>{miCodigo}</Text>
          <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>Pásalo para que te agreguen. Nadie puede buscarte sin él.</Text>
          <View style={[comunes.fila, { justifyContent: 'center' }]}>
            <Boton tamano="s" variante="secundario" alPresionar={copiar}>
              {copiado ? '¡Copiado!' : 'Copiar'}
            </Boton>
            <Boton tamano="s" variante="exito" alPresionar={compartir}>
              Compartir
            </Boton>
          </View>
        </View>
      </Tarjeta>

      <Tarjeta titulo="Agregar con su código">
        <View style={{ gap: 10 }}>
          <TextInput
            style={estilos.campo}
            value={codigo}
            onChangeText={(t) => setCodigo(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, LARGO_CODIGO))}
            placeholder="ABC123"
            autoCapitalize="characters"
            accessibilityLabel="Código de tu amigo"
          />
          <Boton anchoCompleto deshabilitado={codigo.length !== LARGO_CODIGO} cargando={solicitar.cargando} alPresionar={agregar}>
            Mandar solicitud
          </Boton>
          {solicitar.error && <Text style={comunes.error}>{solicitar.error}</Text>}
          {aviso && !solicitar.error && <Text style={estilos.aviso}>{aviso}</Text>}
        </View>
      </Tarjeta>

      {error && <MensajeError mensaje={error} alReintentar={recargar} />}

      {pendientes.length > 0 && (
        <Tarjeta titulo={`Te quieren agregar (${pendientes.length})`}>
          {pendientes.map((x) => (
            <View key={x.id} style={estilos.fila}>
              <Avatar nombre={x.nombre} clave={x.avatar} />
              <Text style={[comunes.negrita, { flex: 1 }]}>{x.nombre}</Text>
              <Boton tamano="s" variante="exito" alPresionar={() => aceptar.ejecutar(x.id)}>
                Aceptar
              </Boton>
              <Boton tamano="s" variante="fantasma" alPresionar={() => quitar.ejecutar(x.id)}>
                No
              </Boton>
            </View>
          ))}
        </Tarjeta>
      )}

      <Tarjeta titulo={`Mis amigos (${amigos.length})`}>
        {!amigos.length ? (
          <Vacio carta={27}>Todavía no agregas a nadie. Pásale tu código a tus compas.</Vacio>
        ) : (
          amigos.map((a) => <FilaAmigo key={a.id} amigo={a} alQuitar={() => quitar.ejecutar(a.id)} />)
        )}
      </Tarjeta>

      {enviadas.length > 0 && (
        <Tarjeta titulo="Solicitudes que mandaste">
          {enviadas.map((x) => (
            <View key={x.id} style={estilos.fila}>
              <Avatar nombre={x.nombre} clave={x.avatar} />
              <Text style={[comunes.negrita, { flex: 1 }]}>{x.nombre}</Text>
              <Chip>Esperando</Chip>
            </View>
          ))}
        </Tarjeta>
      )}
    </ScrollView>
  );
}

function FilaAmigo({ amigo, alQuitar }: { amigo: Amigo; alQuitar: () => void }) {
  const colores = useColores();
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const [verRevanchas, setVerRevanchas] = useState(false);
  const { insignia, nivel } = nivelYInsignia(amigo.puntos_ganados);
  return (
    <View style={estilos.amigo}>
      <View style={estilos.fila}>
        <Avatar nombre={amigo.nombre} clave={amigo.avatar} conectado={amigo.en_linea} />
        <View style={{ flex: 1 }}>
          <Text style={comunes.negrita}>
            {amigo.nombre} <Text style={comunes.textoSuave}>{`${insignia.emoji} nivel ${nivel}`}</Text>
          </Text>
          <Text style={comunes.textoSuave}>
            {amigo.sala_nombre ? `Jugando en "${amigo.sala_nombre}"` : amigo.en_linea ? 'En línea' : 'Desconectado'}
          </Text>
        </View>
        {amigo.sala_id && (
          <Boton tamano="s" alPresionar={() => router.navigate(`/sala/${amigo.sala_id}`)}>
            Caerle
          </Boton>
        )}
        <Pressable onPress={() => setVerRevanchas((v) => !v)} hitSlop={8} accessibilityLabel="Ver revanchas">
          <Text style={{ fontSize: 20 }}>⚔️</Text>
        </Pressable>
        <Pressable onPress={alQuitar} hitSlop={8} accessibilityLabel={`Quitar a ${amigo.nombre}`}>
          <Text style={[comunes.negrita, { color: colores.rojo, fontSize: 18 }]}>✕</Text>
        </Pressable>
      </View>
      {verRevanchas && <Revanchas amigoId={amigo.id} />}
    </View>
  );
}

function Revanchas({ amigoId }: { amigoId: string }) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const { revanchas, cargando } = useRevanchas(amigoId);
  if (cargando || !revanchas) return <Text style={comunes.textoSuave}>Contando…</Text>;
  if (!revanchas.juntas) return <Text style={comunes.textoSuave}>Todavía no juegan una ronda juntos.</Text>;
  return (
    <View style={estilos.revanchas}>
      <Text style={comunes.negrita}>{`${revanchas.gane} tú`}</Text>
      <Text style={comunes.textoSuave}>{`${revanchas.juntas} juntos`}</Text>
      <Text style={comunes.negrita}>{`${revanchas.gano} ${revanchas.amigo.nombre}`}</Text>
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    codigo: {
      fontFamily: fuentes.titulo,
      fontSize: 30,
      letterSpacing: 8,
      textAlign: 'center',
      color: colores.tinta,
      borderWidth: 3,
      borderStyle: 'dashed',
      borderColor: colores.rosa,
      borderRadius: radio.l,
      paddingVertical: 10,
    },
    campo: {
      borderWidth: 2,
      borderColor: colores.tinta,
      borderRadius: radio.m,
      backgroundColor: colores.blanco,
      color: colores.tinta,
      fontFamily: fuentes.cuerpoNegra,
      fontSize: 22,
      letterSpacing: 6,
      textAlign: 'center',
      paddingVertical: 8,
    },
    fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    amigo: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
    revanchas: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      padding: 8,
      borderWidth: 1.5,
      borderColor: colores.amarillo,
      borderRadius: radio.m,
      backgroundColor: colores.amarilloSuave,
    },
    aviso: { fontFamily: fuentes.cuerpoBold, color: colores.verde },
  });
