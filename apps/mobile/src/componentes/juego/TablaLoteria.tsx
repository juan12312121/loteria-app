import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { casillasDeTabla, contarMarcas, type Carta as TipoCarta } from '@loteria/core';
import { fuentes, radio, type Colores, useEstilos } from '../../tema';
import { Chip } from '../ui/basicos';
import { Carta, Ficha } from './Carta';

interface Props {
  nombre: string;
  cartas: number[];
  porId: Map<number, TipoCarta>;
  cantadas: ReadonlySet<number>;
  marcas?: number;
  destacadas?: ReadonlySet<number>;
  skinFicha?: string | null;
  skinCarta?: string | null;
  alTocarCasilla?: (indice: number) => void;
  /** Festejo: las casillas destacadas se encienden una tras otra */
  encender?: boolean;
}

/** Tabla 4×4: cartas, frijolitos del jugador y figuras logradas resaltadas. */
export function TablaLoteria({ nombre, cartas, porId, cantadas, marcas = 0, destacadas, skinFicha, skinCarta, alTocarCasilla, encender }: Props) {
  const estilos = useEstilos(crearEstilos);
  const casillas = casillasDeTabla(cartas, cantadas, marcas, destacadas);
  const filas = [0, 1, 2, 3].map((f) => casillas.slice(f * 4, f * 4 + 4));

  return (
    <View style={estilos.tabla} accessibilityLabel={nombre}>
      <View style={estilos.encabezado}>
        <Text style={estilos.nombre}>{nombre}</Text>
        <Chip tono="verde">{`${contarMarcas(marcas)}/16`}</Chip>
      </View>
      {filas.map((fila, f) => (
        <View key={f} style={estilos.fila}>
          {fila.map((c) => {
            const carta = porId.get(c.carta) ?? { id: c.carta, nombre: `Carta ${c.carta}`, imagen_url: null };
            const porMarcar = c.cantada && !c.marcada && !!alTocarCasilla;
            return (
              <Pressable
                key={c.indice}
                style={[estilos.casilla, porMarcar && estilos.porMarcar, c.destacada && estilos.destacada]}
                onPress={() => alTocarCasilla?.(c.indice)}
                disabled={!alTocarCasilla || !c.cantada}
                accessibilityRole="button"
                accessibilityLabel={`${carta.nombre}, fila ${c.fila + 1} columna ${c.col + 1}`}
                accessibilityState={{ selected: c.marcada, disabled: !c.cantada }}
              >
                {encender && c.destacada ? (
                  <Encendida orden={c.indice}>
                    <Carta carta={carta} tamano="chica" skin={skinCarta} />
                  </Encendida>
                ) : (
                  <Carta carta={carta} tamano="chica" skin={skinCarta} />
                )}
                {c.marcada && (
                  <View style={estilos.encima} pointerEvents="none">
                    <Ficha skin={skinFicha} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const MS_ENTRE_CASILLAS = 90;

/** Brinquito de la casilla ganadora, escalonado según su lugar en la tabla. */
function Encendida({ orden, children }: { orden: number; children: React.ReactNode }) {
  const [escala] = useState(() => new Animated.Value(1));
  useEffect(() => {
    Animated.sequence([
      Animated.delay(orden * MS_ENTRE_CASILLAS),
      Animated.timing(escala, { toValue: 1.12, duration: 160, useNativeDriver: true }),
      Animated.timing(escala, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [escala, orden]);
  return <Animated.View style={{ transform: [{ scale: escala }] }}>{children}</Animated.View>;
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  tabla: { backgroundColor: colores.papel, borderWidth: 3, borderColor: colores.tinta, borderRadius: radio.l, padding: 8, gap: 5 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  nombre: { fontFamily: fuentes.cuerpoNegra, color: colores.anil, fontSize: 15 },
  fila: { flexDirection: 'row', gap: 5 },
  casilla: { flex: 1, borderRadius: 7 },
  porMarcar: { borderWidth: 2, borderColor: colores.verde },
  destacada: { borderWidth: 3, borderColor: colores.amarillo },
  encima: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
