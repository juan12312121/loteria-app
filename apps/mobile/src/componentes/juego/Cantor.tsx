import { useEffect, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { bitsDeMascara, TOTAL_CARTAS, type Carta as TipoCarta, type CartaCantada } from '@loteria/core';
import { fuentes, radio, type Colores, useColores, useComunes, useEstilos } from '../../tema';
import { Chip } from '../ui/basicos';
import { Carta } from './Carta';

interface CantorProps {
  carta: CartaCantada | null;
  ultimas: CartaCantada[];
  velocidadMs?: number;
  ultimaCartaEn: number | null;
  pausada?: boolean;
  skinCarta?: string | null;
}

/** La carta que acaba de salir, su verso, el tiempo y las anteriores en una tira. */
export function Cantor({ carta, ultimas, velocidadMs, ultimaCartaEn, pausada, skinCarta }: CantorProps) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  if (!carta) return <Text style={comunes.textoSuave}>El cantor está por empezar… ¡Se va y se corre!</Text>;
  return (
    <View style={{ gap: 10 }}>
      <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
        <Chip tono="verde">¡Recién cantada!</Chip>
        <Chip tono="anil">{`Carta ${carta.orden} de ${TOTAL_CARTAS}`}</Chip>
      </View>
      <View style={estilos.fila}>
        <Volteo key={`carta-${carta.orden}`}>
          <Carta carta={carta} tamano="grande" skin={skinCarta} />
        </Volteo>
        <View style={{ flex: 1, gap: 8 }}>
          {carta.verso ? <Verso key={`verso-${carta.orden}`} texto={carta.verso} /> : null}
          {velocidadMs && !pausada ? <BarraTiempo duracionMs={velocidadMs} reinicio={ultimaCartaEn ?? carta.orden} /> : null}
          {pausada && <Chip tono="amarillo">En pausa</Chip>}
        </View>
      </View>
      {ultimas.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {ultimas.map((c) => (
            <View key={c.orden} style={{ width: 52 }}>
              <Carta carta={c} tamano="chica" skin={skinCarta} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/** La carta nueva entra girando, como si el cantor la volteara. */
function Volteo({ children }: { children: React.ReactNode }) {
  const [giro] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(giro, { toValue: 1, duration: 450, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }).start();
  }, [giro]);
  const rotateY = giro.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] });
  const scale = giro.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  return <Animated.View style={{ width: 150, transform: [{ perspective: 800 }, { rotateY }, { scale }] }}>{children}</Animated.View>;
}

const MS_POR_LETRA = 28;

/** El verso del cantor, letra por letra como si lo estuviera diciendo. */
function Verso({ texto }: { texto: string }) {
  const estilos = useEstilos(crearEstilos);
  const [letras, setLetras] = useState(0);
  useEffect(() => {
    if (letras >= texto.length) return;
    const t = setTimeout(() => setLetras((n) => n + 1), MS_POR_LETRA);
    return () => clearTimeout(t);
  }, [letras, texto.length]);
  return (
    <Text style={estilos.verso} accessibilityLabel={texto}>
      «{texto.slice(0, letras)}
      <Text style={{ opacity: 0 }}>{texto.slice(letras)}»</Text>
    </Text>
  );
}

/** Barra que se vacía hasta la siguiente carta. */
function BarraTiempo({ duracionMs, reinicio }: { duracionMs: number; reinicio: number }) {
  const estilos = useEstilos(crearEstilos);
  const [avance] = useState(() => new Animated.Value(1));
  useEffect(() => {
    avance.setValue(1);
    const anim = Animated.timing(avance, { toValue: 0, duration: duracionMs, easing: Easing.linear, useNativeDriver: false });
    anim.start();
    return () => anim.stop();
  }, [avance, duracionMs, reinicio]);
  const ancho = avance.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={estilos.barra} accessibilityLabel="Tiempo para la siguiente carta">
      <Animated.View style={[estilos.relleno, { width: ancho }]} />
    </View>
  );
}

/** Las 54 cartas: a color las que ya salieron; la última brinca al llegar. */
export function TableroCantor({
  cartas,
  cantadas,
  recien,
}: {
  cartas: TipoCarta[];
  cantadas: ReadonlySet<number>;
  /** Id de la carta recién cantada */
  recien?: number;
}) {
  const filas = Array.from({ length: Math.ceil(cartas.length / 9) }, (_, i) => cartas.slice(i * 9, i * 9 + 9));
  return (
    <View style={{ gap: 3 }}>
      {filas.map((fila, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 3 }}>
          {fila.map((c) =>
            c.id === recien ? (
              <Aterriza key={c.id}>
                <Carta carta={c} tamano="mini" apagada={false} />
              </Aterriza>
            ) : (
              <View key={c.id} style={{ flex: 1 }}>
                <Carta carta={c} tamano="mini" apagada={!cantadas.has(c.id)} />
              </View>
            ),
          )}
        </View>
      ))}
    </View>
  );
}

/** Brinquito de la carta que acaba de llegar al tablero. */
function Aterriza({ children }: { children: React.ReactNode }) {
  const colores = useColores();
  const [escala] = useState(() => new Animated.Value(1.6));
  useEffect(() => {
    Animated.spring(escala, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [escala]);
  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: escala }], borderRadius: 4, borderWidth: 2, borderColor: colores.amarillo }}>
      {children}
    </Animated.View>
  );
}

/** Diagrama 4×4 de una figura. */
export function MiniFigura({ mascara }: { mascara: number }) {
  const colores = useColores();
  const bits = bitsDeMascara(mascara);
  return (
    <View style={{ width: 44, gap: 2 }}>
      {[0, 1, 2, 3].map((f) => (
        <View key={f} style={{ flexDirection: 'row', gap: 2 }}>
          {bits.slice(f * 4, f * 4 + 4).map((activa, i) => (
            <View key={i} style={{ flex: 1, aspectRatio: 1, borderRadius: 2, backgroundColor: activa ? colores.rosa : colores.grisClaro }} />
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * Cuánto le falta a mi tabla más cercana. Nadie grita: cuando faltan 0 el
 * tablero anuncia ¡Lotería! solo (lo decide el servidor, sin trampas).
 */
export function MarcadorLlena({ faltan, tabla }: { faltan: number; tabla: string }) {
  const colores = useColores();
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const urgente = faltan <= 2;
  return (
    <View style={[estilos.marcador, urgente && { backgroundColor: colores.amarilloSuave }]} accessibilityLiveRegion="polite">
      <View style={estilos.marcadorNumero}>
        <Text style={estilos.marcadorNumeroTexto}>{faltan}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={comunes.negrita}>{faltan === 1 ? '¡Te falta una carta!' : `Te faltan ${faltan} cartas`} para llenar {tabla}</Text>
        <Text style={comunes.textoSuave}>El tablero canta ¡Lotería! solito. Nadie tiene que gritar.</Text>
      </View>
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  fila: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  verso: { fontFamily: fuentes.tituloBold, fontStyle: 'italic', fontSize: 15, color: colores.tinta, backgroundColor: colores.crema, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colores.gris, borderRadius: radio.m, padding: 10 },
  barra: { height: 8, borderWidth: 1.5, borderColor: colores.tinta, borderRadius: radio.total, overflow: 'hidden', backgroundColor: colores.blanco },
  relleno: { height: '100%', backgroundColor: colores.rosa },
  marcador: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 3, borderColor: colores.tinta, borderRadius: 16, backgroundColor: colores.papel },
  marcadorNumero: { width: 54, height: 54, borderRadius: 27, borderWidth: 3, borderColor: colores.tinta, backgroundColor: colores.rosa, alignItems: 'center', justifyContent: 'center' },
  marcadorNumeroTexto: { fontFamily: fuentes.titulo, fontSize: 26, color: colores.blanco },
});
