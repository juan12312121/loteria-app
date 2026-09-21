import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { MAX_TABLAS_POR_JUGADOR, svgDeCarta, useSesion, type Tabla } from '@loteria/core';
import { Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { MiniFigura } from '../../componentes/juego/Cantor';
import { CodigoSala, ListaJugadores } from '../../componentes/juego/Sala';
import { colores, comunes, radio } from '../../tema';
import type { ContextoSala } from './tipos';

/** Antes de iniciar: invitar, ver las reglas y elegir tablas. */
export function VistaEspera({ sala, ronda }: ContextoSala) {
  const { perfil } = useSesion();
  const datosSala = sala.sala!;
  const misTablas = ronda.estado?.misTablas ?? [];
  const ocupadas = ronda.estado?.tablasOcupadas ?? [];
  const lleno = misTablas.length >= MAX_TABLAS_POR_JUGADOR;
  const { elegirTabla, soltarTabla } = ronda.jugador;
  const ocupado = elegirTabla.cargando || soltarTabla.cargando;

  const alTocar = (tabla: Tabla) => {
    const mia = misTablas.find((t) => t.tabla_id === tabla.id);
    if (mia) void soltarTabla.ejecutar(mia.id);
    else void elegirTabla.ejecutar(tabla.id);
  };

  return (
    <ScrollView contentContainerStyle={comunes.contenido}>
      <Tarjeta titulo="Invita con el código">
        <CodigoSala codigo={datosSala.codigo} nombreSala={datosSala.nombre} />
      </Tarjeta>

      <Tarjeta titulo="Reglas de la ronda">
        {sala.figuraFinal && (
          <View style={estilos.regla}>
            <MiniFigura mascara={sala.figuraFinal.mascaras[0]} />
            <Text style={[comunes.negrita, { flex: 1 }]}>Se gana con: {sala.figuraFinal.nombre}</Text>
          </View>
        )}
        {sala.figurasAnunciadas.map((f) => (
          <View key={f.id} style={estilos.regla}>
            <MiniFigura mascara={f.mascaras[0]} />
            <Text style={[comunes.texto, { flex: 1 }]}>
              Se anuncia: <Text style={comunes.negrita}>{f.nombre}</Text> · +{f.puntos} pts al primero
            </Text>
          </View>
        ))}
        <View style={comunes.fila}>
          <Chip>{datosSala.modo_cantor === 'automatico' ? `Cantor cada ${datosSala.velocidad_ms / 1000} s` : 'Canta el anfitrión'}</Chip>
          <Chip tono="amarillo">{`Pozo: ${ronda.estado?.partida.pozo ?? 0} fichas`}</Chip>
        </View>
      </Tarjeta>

      <Tarjeta titulo={`Elige tus tablas (${misTablas.length} de ${MAX_TABLAS_POR_JUGADOR})`}>
        <Text style={[comunes.textoSuave, { marginBottom: 8 }]}>
          Juega las que quieras: cada tabla cuesta {datosSala.costo_tabla} fichas y te da +5 pts al terminar.
        </Text>
        {(elegirTabla.error || soltarTabla.error) && <Text style={comunes.error}>{elegirTabla.error ?? soltarTabla.error}</Text>}
        <View style={estilos.rejilla}>
          {sala.tablasOficiales.map((t) => {
            const mia = misTablas.some((m) => m.tabla_id === t.id);
            const deOtro = ocupadas.find((o) => o.tabla_id === t.id && o.usuario_id !== perfil?.id);
            const deshabilitada = !!deOtro || (!mia && lleno) || ocupado;
            return (
              <Pressable
                key={t.id}
                onPress={() => alTocar(t)}
                disabled={deshabilitada}
                accessibilityRole="button"
                accessibilityState={{ selected: mia, disabled: deshabilitada }}
                style={[estilos.opcion, mia && estilos.mia, deshabilitada && !mia && { opacity: 0.45 }]}
              >
                <Text style={comunes.negrita}>{mia ? `✓ ${t.nombre}` : t.nombre}</Text>
                <View style={estilos.mini}>
                  {t.cartas.map((c) => (
                    <View key={c} style={estilos.miniCasilla}>
                      <SvgXml xml={svgDeCarta(c)} width="100%" height="100%" />
                    </View>
                  ))}
                </View>
                {deOtro && <Text style={comunes.textoSuave}>de {deOtro.nombre}</Text>}
              </Pressable>
            );
          })}
        </View>
      </Tarjeta>

      <Tarjeta titulo={`Jugadores (${sala.jugadores.length})`}>
        <ListaJugadores jugadores={sala.jugadores} detalle={(j) => `${ocupadas.filter((o) => o.usuario_id === j.id).length} tabla(s)`} />
      </Tarjeta>

      {sala.esAnfitrion ? (
        <>
          <Boton tamano="l" anchoCompleto deshabilitado={!ocupadas.length} cargando={ronda.anfitrion.iniciar.cargando} alPresionar={() => ronda.anfitrion.iniciar.ejecutar()}>
            Iniciar ronda
          </Boton>
          {ronda.anfitrion.iniciar.error && <Text style={comunes.error}>{ronda.anfitrion.iniciar.error}</Text>}
        </>
      ) : (
        <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>Esperando a que el anfitrión inicie…</Text>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  regla: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcion: { width: '48%', gap: 4, padding: 8, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.m, backgroundColor: colores.blanco },
  mia: { borderColor: colores.rosa, borderWidth: 3 },
  mini: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  miniCasilla: { width: '23%', aspectRatio: 1, borderWidth: 1, borderColor: colores.tinta, borderRadius: 2, overflow: 'hidden' },
});
