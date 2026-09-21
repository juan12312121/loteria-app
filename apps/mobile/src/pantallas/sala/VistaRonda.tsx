import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSesion } from '@loteria/core';
import { Chip, Pestanas, Tarjeta, Vacio } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { Cantor, MarcadorLlena, TableroCantor } from '../../componentes/juego/Cantor';
import { TablaLoteria } from '../../componentes/juego/TablaLoteria';
import { colores, comunes, espacio } from '../../tema';
import type { ContextoSala } from './tipos';

/**
 * La ronda en el celular: cantor arriba, una tabla a la vez (pestañas si
 * juegas varias), tablero de 54 plegable y abajo cuánto te falta para
 * llenar. Nadie grita: el tablero anuncia ¡Lotería! solo.
 */
export function VistaRonda({ sala, ronda, porId, cartas }: ContextoSala) {
  const { perfil } = useSesion();
  const abajo = useSafeAreaInsets().bottom;
  const [verTablero, setVerTablero] = useState(false);
  const estado = ronda.estado;
  if (!estado) return null;

  const datosSala = sala.sala!;
  const pausada = estado.partida.estado === 'pausada';
  const skinFicha = perfil?.equipo.ficha?.clave;
  const skinCarta = perfil?.equipo.carta?.clave;
  const actual = ronda.tablaVisible;
  const { marcar } = ronda.jugador;
  const { cantar, pausar, reanudar, cancelar } = ronda.anfitrion;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[comunes.contenido, { paddingBottom: 140 }]}>
        <Tarjeta titulo="El cantor">
          <Cantor
            carta={ronda.cartaActual}
            ultimas={ronda.ultimas}
            velocidadMs={datosSala.modo_cantor === 'automatico' ? datosSala.velocidad_ms : undefined}
            ultimaCartaEn={ronda.ultimaCartaEn}
            pausada={pausada}
            skinCarta={skinCarta}
          />
          {sala.esAnfitrion && (
            <View style={[comunes.fila, { marginTop: espacio.m }]}>
              {datosSala.modo_cantor === 'manual' && (
                <Boton tamano="s" cargando={cantar.cargando} deshabilitado={pausada} alPresionar={() => cantar.ejecutar()}>
                  Cantar siguiente
                </Boton>
              )}
              {pausada ? (
                <Boton tamano="s" variante="exito" alPresionar={() => reanudar.ejecutar()}>Reanudar</Boton>
              ) : (
                <Boton tamano="s" variante="secundario" alPresionar={() => pausar.ejecutar()}>Pausar</Boton>
              )}
              <Boton tamano="s" variante="fantasma" alPresionar={() => cancelar.ejecutar()}>Cancelar</Boton>
            </View>
          )}
        </Tarjeta>

        {!actual ? (
          <Vacio>Llegaste con la ronda empezada. Entras en la siguiente.</Vacio>
        ) : (
          <>
            {estado.misTablas.length > 1 && (
              <Pestanas opciones={estado.misTablas.map((t) => ({ valor: t.id, etiqueta: t.nombre }))} valor={actual.id} alCambiar={ronda.seleccionar} />
            )}
            <TablaLoteria
              nombre={actual.nombre}
              cartas={actual.cartas}
              porId={porId}
              cantadas={ronda.cantadas}
              marcas={actual.marcas}
              destacadas={ronda.destacadas.get(actual.id)}
              skinFicha={skinFicha}
              skinCarta={skinCarta}
              alTocarCasilla={(i) => marcar(actual.id, i)}
            />
          </>
        )}

        <Tarjeta
          titulo={`Tablero (${estado.cantadas.length}/54)`}
          acciones={
            <Boton tamano="s" variante="fantasma" alPresionar={() => setVerTablero((v) => !v)}>
              {verTablero ? 'Ocultar' : 'Ver las 54'}
            </Boton>
          }
        >
          {verTablero && <TableroCantor cartas={cartas} cantadas={ronda.cantadas} />}
        </Tarjeta>

        <Tarjeta titulo="Avisos del tablero">
          {estado.logros.length === 0 ? (
            <Text style={comunes.textoSuave}>El tablero anuncia aquí las cuatro esquinas y La O.</Text>
          ) : (
            [...estado.logros].reverse().map((l) => (
              <View key={`${l.partida_tabla_id}-${l.clave}`} style={estilos.aviso}>
                <Text style={comunes.texto}>
                  {l.primero ? '🥇 ' : '🎉 '}
                  <Text style={comunes.negrita}>{l.usuario_id === perfil?.id ? 'Hiciste' : `${l.nombre} hizo`}</Text> ¡{l.figura}! · carta {l.carta}
                  {l.puntos > 0 ? ` · +${l.puntos} pts` : ''}
                </Text>
              </View>
            ))
          )}
        </Tarjeta>
      </ScrollView>

      {ronda.masCerca && (
        <View style={[estilos.pie, { paddingBottom: abajo + espacio.s }]}>
          <MarcadorLlena faltan={ronda.masCerca.faltan} tabla={ronda.masCerca.tabla.nombre} />
          {pausada && <Chip tono="amarillo">Ronda en pausa</Chip>}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: { backgroundColor: colores.amarilloSuave, borderWidth: 1.5, borderColor: colores.amarillo, borderRadius: 8, padding: 8, marginBottom: 6 },
  pie: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: espacio.l, paddingTop: espacio.s, backgroundColor: colores.crema, borderTopWidth: 2, borderTopColor: colores.tinta, gap: 4 },
});
