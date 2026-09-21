import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useCartas, usePartida, useSala } from '@loteria/core';
import { Cargando, Chip, MensajeError } from '../../componentes/ui/basicos';
import { colores, comunes, espacio } from '../../tema';
import { VistaEspera } from './VistaEspera';
import { VistaRonda } from './VistaRonda';
import { VistaResultado } from './VistaResultado';
import { SinRonda } from './SinRonda';
import { AvisosDeRonda } from './AvisosDeRonda';

/** Una sala = un espacio de juego. La vista cambia sola con el estado de la ronda. */
export function PantallaSala({ salaId }: { salaId: string }) {
  const sala = useSala(salaId);
  const ronda = usePartida(sala.partida?.id ?? null);
  const { porId, cartas } = useCartas();

  if (sala.cargando && !sala.sala) return <Cargando texto="Entrando a la sala…" />;
  if (!sala.sala) return <MensajeError mensaje={sala.error ?? 'No encontramos la sala'} />;

  const estado = (ronda.estado?.partida.id === sala.partida?.id ? ronda.estado?.partida.estado : undefined) ?? sala.partida?.estado;
  const contexto = { sala, ronda, porId, cartas };

  return (
    <View style={comunes.pantalla}>
      <Stack.Screen options={{ title: sala.sala.nombre }} />
      <View style={estilos.barra}>
        {sala.partida && <Chip tono="anil">{`Ronda ${sala.partida.numero}`}</Chip>}
        {sala.figuraFinal && <Chip tono="rosa">{`Gana: ${sala.figuraFinal.nombre}`}</Chip>}
        <Text style={comunes.textoSuave}>Código {sala.sala.codigo}</Text>
      </View>
      {!sala.partida || estado === 'cancelada' ? (
        <SinRonda {...contexto} />
      ) : estado === 'preparando' ? (
        <VistaEspera {...contexto} />
      ) : estado === 'cantando' || estado === 'pausada' ? (
        <VistaRonda {...contexto} />
      ) : (
        <VistaResultado {...contexto} />
      )}
      <AvisosDeRonda avisos={ronda.avisos.items} />
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, paddingHorizontal: espacio.l, paddingVertical: espacio.s, borderBottomWidth: 2, borderBottomColor: colores.tinta, backgroundColor: colores.papel },
});
