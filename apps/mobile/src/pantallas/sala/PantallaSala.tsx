import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { svgDeFondo, useCartas, useChatSala, useConexion, useEventoSala, usePartida, useSala, useSesion } from '@loteria/core';
import { sonidos } from '../../sonidos';
import { BurbujasChat, ChatRapido } from '../../componentes/juego/ChatRapido';
import { usePreferencias } from '../../preferencias';
import { Cargando, Chip, MensajeError } from '../../componentes/ui/basicos';
import { espacio, type Colores, useComunes, useEstilos } from '../../tema';
import { VistaEspera } from './VistaEspera';
import { VistaRonda } from './VistaRonda';
import { VistaResultado } from './VistaResultado';
import { SinRonda } from './SinRonda';
import { AvisosDeRonda } from './AvisosDeRonda';

/** Una sala = un espacio de juego. La vista cambia sola con el estado de la ronda. */
export function PantallaSala({ salaId }: { salaId: string }) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const { perfil } = useSesion();
  const { autoMarcar } = usePreferencias();
  const sala = useSala(salaId);
  const ronda = usePartida(sala.partida?.id ?? null, { autoMarcar });
  const { porId, cartas } = useCartas();
  const chat = useChatSala(salaId, sala.jugadores);

  useEventoSala('carta:cantada', () => sonidos.carta());
  useEventoSala('figura:lograda', () => sonidos.figura());
  useEventoSala('partida:ganadores', (e) => e.ganadores.length > 0 && sonidos.loteria());
  useEventoSala('sala:frase', (e) => e.usuarioId !== perfil?.id && sonidos.frase());
  const conexion = useConexion();
  const abajo = useSafeAreaInsets().bottom;

  if (sala.cargando && !sala.sala) return <Cargando texto="Entrando a la sala…" />;
  if (!sala.sala) return <MensajeError mensaje={sala.error ?? 'No encontramos la sala'} />;

  const estado = (ronda.estado?.partida.id === sala.partida?.id ? ronda.estado?.partida.estado : undefined) ?? sala.partida?.estado;
  const contexto = { sala, ronda, porId, cartas };

  const enRonda = estado === 'cantando' || estado === 'pausada';

  return (
    <View style={comunes.pantalla}>
      {/* Fondo de sala que el jugador trae equipado */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SvgXml xml={svgDeFondo(perfil?.equipo.fondo?.clave)} width="100%" height="100%" />
      </View>
      <Stack.Screen options={{ title: sala.sala.nombre }} />
      {conexion === 'reconectando' && (
        <View style={estilos.sinConexion}>
          <Text style={comunes.negrita}>📡 Se fue la conexión… reconectando. Tus marcas están guardadas.</Text>
        </View>
      )}
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
      <BurbujasChat burbujas={chat.burbujas} />
      {/* En la ronda el marcador de abajo ocupa espacio: el botón sube */}
      <ChatRapido alEnviar={chat.enviar} abajo={abajo + (enRonda ? 110 : 0)} />
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  sinConexion: { backgroundColor: colores.amarillo, paddingHorizontal: espacio.l, paddingVertical: espacio.s, borderBottomWidth: 2, borderBottomColor: colores.tinta },
  barra: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, paddingHorizontal: espacio.l, paddingVertical: espacio.s, borderBottomWidth: 2, borderBottomColor: colores.tinta, backgroundColor: colores.papel },
});
