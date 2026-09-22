import { Image, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { aparienciaCarta, svgDeCarta, svgDeMarcoCarta, svgDeFicha, type Carta as TipoCarta } from '@loteria/core';
import { fuentes, type Colores, useEstilos } from '../../tema';

export type TamanoCarta = 'mini' | 'chica' | 'mediana' | 'grande';

const MEDIDAS: Record<TamanoCarta, { numero: number; nombre: number; relleno: number; borde: number }> = {
  mini: { numero: 8, nombre: 0, relleno: 1, borde: 1 },
  chica: { numero: 9, nombre: 7, relleno: 2, borde: 1.5 },
  mediana: { numero: 11, nombre: 9, relleno: 3, borde: 2 },
  grande: { numero: 22, nombre: 18, relleno: 6, borde: 3 },
};

interface Props {
  carta: Pick<TipoCarta, 'id' | 'nombre' | 'imagen_url'>;
  tamano?: TamanoCarta;
  apagada?: boolean;
  skin?: string | null;
}

/** Carta de lotería con marco impreso, número, dibujo y nombre. */
export function Carta({ carta, tamano = 'chica', apagada = false, skin }: Props) {
  const estilos = useEstilos(crearEstilos);
  const a = aparienciaCarta(skin);
  const marco = svgDeMarcoCarta(skin);
  const m = MEDIDAS[tamano];
  return (
    <View
      style={[
        estilos.carta,
        { backgroundColor: a.fondo, borderColor: a.marco, padding: marco ? '7%' : m.relleno, borderWidth: m.borde },
        apagada && estilos.apagada,
      ]}
      accessibilityLabel={carta.nombre}
    >
      {marco && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SvgXml xml={marco} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      )}
      <View style={[estilos.interior, { borderColor: a.marco, backgroundColor: a.fondo }]}>
        <Text style={[estilos.numero, { fontSize: m.numero, color: a.texto }]}>{carta.id}</Text>
        <View style={estilos.dibujo}>
          {carta.imagen_url ? (
            <Image source={{ uri: carta.imagen_url }} style={estilos.imagen} resizeMode="contain" />
          ) : (
            <SvgXml xml={svgDeCarta(carta.id)} width="100%" height="100%" />
          )}
        </View>
        {m.nombre > 0 && (
          <Text numberOfLines={1} style={[estilos.nombre, { fontSize: m.nombre, color: a.texto, borderColor: a.marco }]}>
            {carta.nombre.toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  );
}

/** Ficha (frijolito) con la skin del jugador, dibujada en SVG. */
export function Ficha({ skin, tamano = 30 }: { skin?: string | null; tamano?: number }) {
  const estilos = useEstilos(crearEstilos);
  return (
    <View style={[estilos.ficha, { width: tamano, height: tamano }]} pointerEvents="none">
      <SvgXml xml={svgDeFicha(skin)} width="100%" height="100%" />
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  carta: { width: '100%', aspectRatio: 3 / 4, borderRadius: 6, overflow: 'hidden' },
  apagada: { opacity: 0.3 },
  interior: { flex: 1, borderWidth: 1, borderRadius: 3 },
  numero: { fontFamily: fuentes.cuerpoNegra, paddingHorizontal: 2, lineHeight: undefined },
  dibujo: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 2 },
  imagen: { width: '100%', height: '100%' },
  nombre: { fontFamily: fuentes.titulo, textAlign: 'center', borderTopWidth: 1, paddingHorizontal: 1 },
  ficha: { shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 0 },
});
