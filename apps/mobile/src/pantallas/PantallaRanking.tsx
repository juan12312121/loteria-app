import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRankingSemanal, useSesion } from '@loteria/core';
import { Avatar, Cargando, MensajeError, Tarjeta, Vacio } from '../componentes/ui/basicos';
import { type Colores, useColores, useComunes, useEstilos } from '../tema';

const MEDALLAS = ['🥇', '🥈', '🥉'];

/** Ranking de la semana, en su propia pestaña como en la web. */
export function PantallaRanking() {
  const comunes = useComunes();
  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <Ranking />
    </ScrollView>
  );
}

function Ranking() {
  const colores = useColores();
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const { perfil } = useSesion();
  const { ranking, cargando, error, recargar } = useRankingSemanal(20);
  if (cargando && !ranking) return <Cargando />;
  if (error || !ranking) return <MensajeError mensaje={error ?? 'Sin ranking'} alReintentar={recargar} />;

  return (
    <>
      <Tarjeta titulo="Premios de la semana">
        {ranking.premios.map((p) => (
          <View key={p.lugar} style={estilos.fila}>
            <Text style={comunes.negrita}>{`${MEDALLAS[p.lugar - 1]} Lugar ${p.lugar}`}</Text>
            <Text style={comunes.negrita}>{`+${p.puntos} pts${p.skin ? ' + Corona de oro' : ''}`}</Text>
          </View>
        ))}
        <Text style={[comunes.textoSuave, { marginTop: 8 }]}>{`Cuentan los puntos ganados jugando. Cierra el lunes ${ranking.cierra.slice(5).split('-').reverse().join('/')}.`}</Text>
      </Tarjeta>
      <Tarjeta titulo="Esta semana">
        {!ranking.filas.length ? (
          <Vacio carta={35}>Nadie ha jugado esta semana. ¡Sé el primero!</Vacio>
        ) : (
          ranking.filas.map((f, i) => (
            <View key={f.usuario_id} style={[estilos.fila, f.usuario_id === perfil?.id && { backgroundColor: colores.amarilloSuave }]}>
              <View style={[comunes.fila, { flexWrap: 'nowrap', flex: 1 }]}>
                <Text style={[comunes.negrita, { width: 28 }]}>{MEDALLAS[i] ?? `${i + 1}.`}</Text>
                <Avatar nombre={f.nombre} clave={f.avatar} tamano={30} />
                <Text style={comunes.negrita} numberOfLines={1}>{f.nombre}</Text>
              </View>
              <Text style={comunes.negrita}>{f.puntos} pts</Text>
            </View>
          ))
        )}
      </Tarjeta>
      {!!ranking.anterior?.ganadores.length && (
        <Tarjeta titulo="Semana pasada">
          {ranking.anterior.ganadores.map((g) => (
            <View key={g.usuario_id} style={estilos.fila}>
              <Text style={comunes.negrita}>{`${MEDALLAS[g.lugar - 1]} ${g.nombre}`}</Text>
              <Text style={comunes.texto}>{g.puntos} pts</Text>
            </View>
          ))}
        </Tarjeta>
      )}
    </>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
  });
