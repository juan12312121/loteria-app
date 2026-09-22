import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CASILLAS, indicesDeCasillas, useSesion, type Casilla, type Ganador } from '@loteria/core';
import { Avatar, Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { TablaLoteria } from '../../componentes/juego/TablaLoteria';
import { Confeti } from '../../componentes/ui/Confeti';
import { fuentes, type Colores, useComunes, useEstilos } from '../../tema';
import type { ContextoSala } from './tipos';

const cartasDeCasillas = (casillas: Casilla[] = []) => {
  if (casillas.length !== CASILLAS) return null;
  const cartas = new Array<number>(CASILLAS);
  for (const c of casillas) cartas[c.fila * 4 + c.col] = c.carta;
  return cartas;
};

/** Fin de la ronda: el tablero cantó ¡Lotería!, quién ganó, premio y puntos. */
export function VistaResultado({ sala, ronda, porId }: ContextoSala) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const { perfil } = useSesion();
  const estado = ronda.estado;
  const ganadores: Ganador[] = ronda.resultado?.ganadores ?? estado?.ganadores ?? [];
  const destacado = ganadores.find((g) => g.usuario_id === perfil?.id) ?? ganadores[0];
  const cartasGanadoras = cartasDeCasillas(destacado?.casillas);
  const nombres = ganadores.map((g) => (g.usuario_id === perfil?.id ? 'Tú' : g.nombre)).join(' y ');
  const carta = ronda.resultado?.carta ?? estado?.partida.indice;
  const puntos = destacado?.puntos;
  const enVivo = !!ronda.resultado && ganadores.length > 0;
  const avatarDe = (usuarioId: string) => estado?.tablasOcupadas.find((t) => t.usuario_id === usuarioId)?.avatar ?? null;

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={comunes.contenido}>
      <Text style={estilos.titulo}>{ganadores.length ? '¡LOTERÍA!' : 'Se acabó el mazo'}</Text>
      <Text style={[comunes.negrita, { textAlign: 'center', fontSize: 16 }]}>
        {ganadores.length ? `El tablero lo cantó: ${nombres} ganó en la carta ${carta}` : 'Nadie llenó su tabla; se regresaron las fichas.'}
      </Text>

      {cartasGanadoras && destacado && (
        <TablaLoteria
          nombre={`${destacado.tabla ?? 'Tabla ganadora'} de ${destacado.nombre}`}
          cartas={cartasGanadoras}
          porId={porId}
          cantadas={ronda.cantadas}
          marcas={0xffff}
          destacadas={indicesDeCasillas(destacado.casillas!)}
          encender={enVivo}
        />
      )}

      {ganadores.map((g) => (
        <Tarjeta key={g.usuario_id} titulo="Premio del pozo">
          <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
            <View style={[comunes.fila, { flexWrap: 'nowrap' }]}>
              <Avatar nombre={g.nombre} clave={avatarDe(g.usuario_id)} />
              <Text style={comunes.negrita}>{g.nombre}</Text>
            </View>
            <Chip tono="amarillo">{`+${g.premio} fichas`}</Chip>
          </View>
        </Tarjeta>
      ))}

      {puntos && (
        <Tarjeta titulo={`Puntos: +${puntos.total}`}>
          {[
            ['Figura', puntos.figura],
            ['Bono por varias tablas', puntos.multiTabla],
            ['Rapidez', puntos.rapidez],
            ['Racha', puntos.racha],
          ].map(([etiqueta, valor]) => (
            <View key={etiqueta} style={estilos.renglon}>
              <Text style={comunes.texto}>{etiqueta}</Text>
              <Text style={comunes.negrita}>+{valor}</Text>
            </View>
          ))}
        </Tarjeta>
      )}

      <Tarjeta titulo="Figuras de la ronda">
        {estado?.logros.length ? (
          estado.logros.map((l) => (
            <Text key={`${l.partida_tabla_id}-${l.clave}`} style={[comunes.texto, { marginBottom: 4 }]}>
              Carta {l.carta} · <Text style={comunes.negrita}>{l.nombre}</Text> · {l.figura}
              {l.puntos > 0 ? ` · +${l.puntos}` : ''}
            </Text>
          ))
        ) : (
          <Text style={comunes.textoSuave}>Nadie hizo figuras intermedias.</Text>
        )}
        <Text style={comunes.textoSuave}>Todos suman +5 pts por cada tabla jugada.</Text>
      </Tarjeta>

      {sala.esAnfitrion && (
        <Boton tamano="l" anchoCompleto cargando={sala.nuevaRonda.cargando} alPresionar={() => sala.nuevaRonda.ejecutar()}>
          Siguiente ronda
        </Boton>
      )}
      <Boton variante="fantasma" alPresionar={() => router.back()}>
        Volver al lobby
      </Boton>
    </ScrollView>
    {enVivo && <Confeti />}
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  titulo: { fontFamily: fuentes.titulo, fontSize: 48, color: colores.rosa, textAlign: 'center', textShadowColor: colores.amarillo, textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 },
  renglon: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
});
