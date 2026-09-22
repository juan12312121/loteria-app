import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { fuentes, radio, type Colores, useColores, useEstilos } from '../../tema';

type Variante = 'primario' | 'secundario' | 'exito' | 'peligro' | 'fantasma';

interface Props {
  children: ReactNode;
  alPresionar?: () => void;
  variante?: Variante;
  tamano?: 's' | 'm' | 'l';
  cargando?: boolean;
  deshabilitado?: boolean;
  icono?: ReactNode;
  anchoCompleto?: boolean;
}

const fondoDe = (colores: Colores): Record<Variante, string> => ({
  primario: colores.rosa,
  secundario: colores.papel,
  exito: colores.verde,
  peligro: colores.rojo,
  fantasma: 'transparent',
});

const textoDe = (colores: Colores): Record<Variante, string> => ({
  primario: colores.blanco,
  secundario: colores.tinta,
  exito: colores.blanco,
  peligro: colores.blanco,
  fantasma: colores.anil,
});

const RELLENO = { s: 8, m: 12, l: 16 };
const LETRA = { s: 13, m: 16, l: 19 };

export function Boton({ children, alPresionar, variante = 'primario', tamano = 'm', cargando, deshabilitado, icono, anchoCompleto }: Props) {
  const colores = useColores();
  const estilos = useEstilos(crearEstilos);
  const fondo = fondoDe(colores)[variante];
  const texto = textoDe(colores)[variante];
  const inactivo = deshabilitado || cargando;
  const fantasma = variante === 'fantasma';
  return (
    <Pressable
      onPress={alPresionar}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactivo, busy: !!cargando }}
      style={({ pressed }) => [
        estilos.base,
        {
          backgroundColor: fondo,
          paddingVertical: RELLENO[tamano],
          borderColor: fantasma ? 'transparent' : colores.tinta,
          alignSelf: anchoCompleto ? 'stretch' : 'flex-start',
          opacity: inactivo ? 0.5 : 1,
          transform: [{ translateY: pressed && !fantasma ? 2 : 0 }],
        },
        !fantasma && !pressed && estilos.sombra,
      ]}
    >
      <View style={estilos.contenido}>
        {cargando ? <ActivityIndicator color={texto} size="small" /> : icono}
        <Text style={[estilos.texto, { color: texto, fontSize: LETRA[tamano] }]}>{children}</Text>
      </View>
    </Pressable>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  base: { borderWidth: 2, borderRadius: radio.m, paddingHorizontal: 18 },
  sombra: { shadowColor: colores.tinta, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  contenido: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  texto: { fontFamily: fuentes.cuerpoNegra, textAlign: 'center' },
});
