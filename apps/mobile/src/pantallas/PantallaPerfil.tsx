import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePerfilJuego, useRankingSemanal, useSesion, type MovimientoPuntos, type TipoSkin } from '@loteria/core';
import { Avance, Avatar, Cargando, Chip, MensajeError, Pestanas, Tarjeta, Vacio } from '../componentes/ui/basicos';
import { Boton } from '../componentes/ui/Boton';
import { Carta } from '../componentes/juego/Carta';
import { colores, comunes, fuentes, radio } from '../tema';

const ETIQUETAS: Record<MovimientoPuntos['tipo'], string> = {
  participacion: 'Participación',
  victoria: 'Victoria',
  logro: 'Figura',
  bono: 'Bono',
  penalizacion: 'Penalización',
  canje: 'Canje',
  ajuste: 'Ajuste',
  diario: 'Recompensa diaria',
  mision: 'Misión',
  ranking: 'Ranking semanal',
};
const NOMBRES_TIPO: Record<TipoSkin, string> = { ficha: 'Fichas', carta: 'Cartas', avatar: 'Avatares', fondo: 'Fondos' };
const MEDALLAS = ['🥇', '🥈', '🥉'];

type Seccion = 'perfil' | 'ranking';

export function PantallaPerfil() {
  const { salir } = useSesion();
  const [seccion, setSeccion] = useState<Seccion>('perfil');
  return (
    <ScrollView style={comunes.pantalla} contentContainerStyle={comunes.contenido}>
      <Pestanas<Seccion>
        opciones={[
          { valor: 'perfil', etiqueta: 'Mi perfil' },
          { valor: 'ranking', etiqueta: 'Ranking semanal' },
        ]}
        valor={seccion}
        alCambiar={setSeccion}
      />
      {seccion === 'perfil' ? <MiPerfil /> : <Ranking />}
      <Boton variante="fantasma" alPresionar={salir}>
        Cerrar sesión
      </Boton>
    </ScrollView>
  );
}

function MiPerfil() {
  const { perfil: sesion } = useSesion();
  const { perfil, movimientos, cargando, error } = usePerfilJuego();
  if (!sesion) return null;
  if (cargando && !perfil) return <Cargando />;
  if (error || !perfil) return <MensajeError mensaje={error ?? 'No se pudo cargar tu perfil'} />;

  const datos = [
    { etiqueta: 'Partidas', valor: perfil.partidas },
    { etiqueta: 'Victorias', valor: perfil.victorias },
    { etiqueta: 'Efectividad', valor: `${perfil.efectividad}%` },
    { etiqueta: 'Tablas', valor: perfil.tablas },
    { etiqueta: 'Figuras', valor: perfil.logros },
    { etiqueta: 'Pts ganados', valor: perfil.puntos_ganados },
  ];

  return (
    <>
      <Tarjeta>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar nombre={perfil.nombre} clave={perfil.avatar} tamano={88} />
          <Text style={comunes.titulo}>{perfil.nombre}</Text>
          <View style={[comunes.fila, { justifyContent: 'center' }]}>
            <Chip tono="amarillo">{`⭐ ${perfil.puntos} pts`}</Chip>
            <Chip>{`${sesion.fichas} fichas`}</Chip>
          </View>
          <View style={[comunes.fila, { justifyContent: 'center' }]}>
            <Chip tono="rosa">{`🔥 Racha ${perfil.racha} (mejor ${perfil.mejor_racha})`}</Chip>
            <Chip tono="verde">{`📅 ${perfil.dias_seguidos} día(s) seguidos`}</Chip>
          </View>
        </View>
      </Tarjeta>

      <Tarjeta titulo="Estadísticas">
        <View style={estilos.estadisticas}>
          {datos.map((d) => (
            <View key={d.etiqueta} style={estilos.estadistica}>
              <Text style={estilos.numero}>{d.valor}</Text>
              <Text style={comunes.textoSuave}>{d.etiqueta}</Text>
            </View>
          ))}
        </View>
        {perfil.carta_suerte ? (
          <View style={[comunes.fila, { flexWrap: 'nowrap', marginTop: 12 }]}>
            <View style={{ width: 56 }}>
              <Carta carta={{ id: perfil.carta_suerte.id, nombre: perfil.carta_suerte.nombre, imagen_url: null }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={comunes.negrita}>Carta de la suerte</Text>
              <Text style={comunes.textoSuave}>{`${perfil.carta_suerte.nombre}: llenaste tu tabla con ella ${perfil.carta_suerte.veces} vez/veces`}</Text>
            </View>
          </View>
        ) : (
          <Text style={[comunes.textoSuave, { marginTop: 12 }]}>Gana una partida para descubrir tu carta de la suerte.</Text>
        )}
      </Tarjeta>

      <Tarjeta titulo="Colección">
        <View style={{ gap: 8 }}>
          <Text style={comunes.negrita}>{`Total: ${perfil.skins}/${perfil.skins_total}`}</Text>
          <Avance valor={perfil.skins} total={perfil.skins_total} tono="verde" />
          {perfil.coleccion.map((c) => (
            <View key={c.tipo} style={{ gap: 4 }}>
              <Text style={comunes.textoSuave}>{`${NOMBRES_TIPO[c.tipo]}: ${c.tengo}/${c.total}`}</Text>
              <Avance valor={c.tengo} total={c.total} />
            </View>
          ))}
        </View>
      </Tarjeta>

      <Tarjeta titulo="Últimas partidas">
        {!perfil.historial.length ? (
          <Vacio>Juega tu primera ronda para ver tu historial.</Vacio>
        ) : (
          perfil.historial.map((h) => (
            <View key={h.partida_id} style={estilos.fila}>
              <View style={{ flex: 1 }}>
                <Text style={comunes.negrita}>{`${h.gano ? '🏆 Ganaste' : 'Jugaste'} en ${h.sala}`}</Text>
                <Text style={comunes.textoSuave}>{`${new Date(h.terminada_en).toLocaleDateString('es-MX')} · ${h.tablas} tabla(s)`}</Text>
              </View>
              <Text style={[comunes.negrita, { color: colores.verde }]}>+{h.puntos}</Text>
            </View>
          ))
        )}
      </Tarjeta>

      <Tarjeta titulo="Movimientos de puntos">
        {!movimientos.length ? (
          <Vacio>Aquí verás lo que ganas y canjeas.</Vacio>
        ) : (
          movimientos.map((m) => (
            <View key={m.id} style={estilos.fila}>
              <View style={{ flex: 1 }}>
                <Text style={comunes.negrita}>{ETIQUETAS[m.tipo] ?? m.tipo}</Text>
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
    </>
  );
}

function Ranking() {
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
          <Vacio>Nadie ha jugado esta semana. ¡Sé el primero!</Vacio>
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

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
  estadisticas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  estadistica: { width: '31%', alignItems: 'center', paddingVertical: 8, borderWidth: 1.5, borderColor: colores.grisClaro, borderRadius: radio.m, backgroundColor: colores.blanco },
  numero: { fontFamily: fuentes.titulo, fontSize: 22, color: colores.rosa },
});
