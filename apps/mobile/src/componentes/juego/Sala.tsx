import { useState } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { JugadorSala } from '@loteria/core';
import { fuentes, radio, type Colores, useColores, useComunes, useEstilos } from '../../tema';
import { Avatar, Chip } from '../ui/basicos';
import { WEB_URL } from '../../config';
import { Boton } from '../ui/Boton';

/** Código de invitación en casillas, con copiar y compartir (WhatsApp u otra app). */
export function CodigoSala({ codigo, nombreSala }: { codigo: string; nombreSala: string }) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const [copiado, setCopiado] = useState(false);
  const texto = `¡Vente a jugar lotería a "${nombreSala}"! Entra aquí: ${WEB_URL}/jugar?codigo=${codigo} (o en la app con el código ${codigo})`;

  const copiar = async () => {
    await Clipboard.setStringAsync(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  const compartir = async () => {
    const whatsapp = `whatsapp://send?text=${encodeURIComponent(texto)}`;
    if (await Linking.canOpenURL(whatsapp)) await Linking.openURL(whatsapp);
    else await Share.share({ message: texto });
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={estilos.codigo} accessibilityLabel={`Código ${codigo}`}>
        {[...codigo].map((l, i) => (
          <View key={i} style={estilos.letra}>
            <Text style={estilos.letraTexto}>{l}</Text>
          </View>
        ))}
      </View>
      <View style={[comunes.fila, { justifyContent: 'center' }]}>
        <Boton tamano="s" variante="secundario" alPresionar={copiar}>
          {copiado ? '¡Copiado!' : 'Copiar'}
        </Boton>
        <Boton tamano="s" variante="exito" alPresionar={compartir}>
          Compartir por WhatsApp
        </Boton>
      </View>
    </View>
  );
}

interface ListaProps {
  jugadores: JugadorSala[];
  detalle?: (j: JugadorSala) => string | undefined;
  /** Solo el anfitrión, fuera de ronda: quitar un bot */
  alQuitarBot?: (botId: string) => void;
}

/** Jugadores de la sala con su avatar y estado de conexión. */
export function ListaJugadores({ jugadores, detalle, alQuitarBot }: ListaProps) {
  const colores = useColores();
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  return (
    <View>
      {jugadores.map((j, i) => (
        <View key={j.id} style={[estilos.jugador, i === jugadores.length - 1 && { borderBottomWidth: 0 }]}>
          <Avatar nombre={j.nombre} clave={j.avatar} conectado={j.conectado} />
          <Text style={[comunes.negrita, { flex: 1 }]}>
            {j.nombre}
            {detalle?.(j) ? <Text style={comunes.textoSuave}>{` · ${detalle(j)}`}</Text> : null}
          </Text>
          {j.rol === 'anfitrion' && <Chip tono="amarillo">Anfitrión</Chip>}
          {j.bot && <Chip>🤖 Bot</Chip>}
          {j.bot && alQuitarBot && (
            <Pressable onPress={() => alQuitarBot(j.id)} accessibilityLabel={`Quitar a ${j.nombre}`} hitSlop={8}>
              <Text style={[comunes.negrita, { color: colores.rojo, fontSize: 18 }]}>✕</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  codigo: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  letra: { width: 42, height: 52, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.m, backgroundColor: colores.blanco, alignItems: 'center', justifyContent: 'center' },
  letraTexto: { fontFamily: fuentes.titulo, fontSize: 26, color: colores.tinta },
  jugador: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
});
