import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePerfilJuego, useSesion, type MovimientoPuntos } from '@loteria/core';
import { Avatar, Cargando, Chip, Tarjeta, Vacio } from '../componentes/ui/basicos';
import { Boton } from '../componentes/ui/Boton';
import { colores, comunes } from '../tema';

const ETIQUETAS: Record<MovimientoPuntos['tipo'], string> = {
  participacion: 'Participación',
  victoria: 'Victoria',
  logro: 'Figura',
  bono: 'Bono',
  penalizacion: 'Lotería falsa',
  canje: 'Canje',
  ajuste: 'Ajuste',
};
const MEDALLAS = ['🥇', '🥈', '🥉'];

export function PantallaPerfil() {
  const { perfil, salir } = useSesion();
  const { ranking, historial, cargando } = usePerfilJuego();
  if (!perfil) return null;

  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <Tarjeta>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar nombre={perfil.nombre} tamano={80} />
          <Text style={comunes.titulo}>{perfil.nombre}</Text>
          <View style={[comunes.fila, { justifyContent: 'center' }]}>
            <Chip tono="amarillo">{`⭐ ${perfil.puntos} pts`}</Chip>
            <Chip>{`${perfil.fichas} fichas`}</Chip>
            <Chip tono="rosa">{`🔥 Racha ${perfil.racha}`}</Chip>
          </View>
          <Text style={comunes.textoSuave}>
            Ficha: {perfil.equipo.ficha?.nombre ?? 'Frijolito'} · Cartas: {perfil.equipo.carta?.nombre ?? 'Clásica'}
          </Text>
        </View>
      </Tarjeta>

      <Tarjeta titulo="Ranking de puntos">
        {cargando ? (
          <Cargando />
        ) : !ranking.length ? (
          <Vacio>Todavía no hay puntos.</Vacio>
        ) : (
          ranking.map((l, i) => (
            <View key={l.id} style={[estilos.fila, l.id === perfil.id && { backgroundColor: colores.amarilloSuave }]}>
              <Text style={comunes.negrita}>{MEDALLAS[i] ?? `${i + 1}.`} {l.nombre}</Text>
              <Text style={comunes.negrita}>{l.puntos} pts</Text>
            </View>
          ))
        )}
      </Tarjeta>

      <Tarjeta titulo="Historial de puntos">
        {!historial.length ? (
          <Vacio>Juega tu primera ronda para ganar puntos.</Vacio>
        ) : (
          historial.map((m) => (
            <View key={m.id} style={estilos.fila}>
              <View style={{ flex: 1 }}>
                <Text style={comunes.negrita}>{ETIQUETAS[m.tipo]}</Text>
                <Text style={comunes.textoSuave}>{m.detalle}</Text>
              </View>
              <Text style={[comunes.negrita, { color: m.monto >= 0 ? colores.verde : colores.rojo }]}>
                {m.monto >= 0 ? '+' : ''}
                {m.monto}
              </Text>
            </View>
          ))
        )}
      </Tarjeta>

      <Boton variante="fantasma" alPresionar={salir}>
        Cerrar sesión
      </Boton>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
});
