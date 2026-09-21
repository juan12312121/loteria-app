import { StyleSheet } from 'react-native';
import { colores, espacio, radio } from '@loteria/core';

/** Nombres de las fuentes cargadas con expo-font (ver app/_layout.tsx). */
export const fuentes = {
  titulo: 'PlayfairDisplay_900Black',
  tituloBold: 'PlayfairDisplay_700Bold',
  cuerpo: 'NunitoSans_400Regular',
  cuerpoBold: 'NunitoSans_700Bold',
  cuerpoNegra: 'NunitoSans_800ExtraBold',
} as const;

export { colores, espacio, radio };

/** Estilos compartidos por varias pantallas. */
export const comunes = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.crema },
  contenido: { padding: espacio.l, gap: espacio.l, paddingBottom: 120 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, flexWrap: 'wrap' },
  titulo: { fontFamily: fuentes.titulo, fontSize: 30, color: colores.tinta },
  lema: { fontFamily: fuentes.titulo, fontSize: 34, color: colores.rosa, textShadowColor: colores.amarillo, textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  texto: { fontFamily: fuentes.cuerpo, fontSize: 15, color: colores.tinta },
  textoSuave: { fontFamily: fuentes.cuerpo, fontSize: 13, color: colores.tintaSuave },
  negrita: { fontFamily: fuentes.cuerpoNegra, color: colores.tinta },
  error: { fontFamily: fuentes.cuerpoBold, color: colores.rojo, fontSize: 14 },
});
