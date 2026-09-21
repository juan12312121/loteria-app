import { StyleSheet, Text, View } from 'react-native';
import type { AvisoRonda, ElementoCola } from '@loteria/core';
import { colores, fuentes, radio } from '../../tema';

/** Toasts en vivo: figuras que el tablero detectó (la ronda sigue hasta tabla llena). */
export function AvisosDeRonda({ avisos }: { avisos: ElementoCola<AvisoRonda>[] }) {
  if (!avisos.length) return null;
  return (
    <View style={estilos.contenedor} pointerEvents="none" accessibilityLiveRegion="polite">
      {avisos.map(({ id, valor: { evento, mio } }) => (
        <View key={id} style={estilos.aviso}>
          <Text style={estilos.texto}>
            {`${evento.primero ? '🥇' : '🎉'} ${mio ? 'Hiciste' : `${evento.nombre} hizo`} ¡${evento.figura.nombre}!${evento.puntos > 0 ? ` +${evento.puntos} pts` : ''} · Sigue la ronda`}
          </Text>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { position: 'absolute', top: 56, left: 12, right: 12, gap: 8 },
  aviso: { backgroundColor: colores.amarilloSuave, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.l, padding: 12, elevation: 6, shadowColor: colores.tinta, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  texto: { fontFamily: fuentes.cuerpoBold, color: colores.tinta, fontSize: 14 },
});
