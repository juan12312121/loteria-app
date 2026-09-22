import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { espacio, radio, temaDe, useSesion, type NombreColor } from '@loteria/core';

/** Nombres de las fuentes cargadas con expo-font (ver app/_layout.tsx). */
export const fuentes = {
  titulo: 'PlayfairDisplay_900Black',
  tituloBold: 'PlayfairDisplay_700Bold',
  cuerpo: 'NunitoSans_400Regular',
  cuerpoBold: 'NunitoSans_700Bold',
  cuerpoNegra: 'NunitoSans_800ExtraBold',
} as const;

export { espacio, radio };

export type Colores = Record<NombreColor, string>;

interface EstadoTema {
  colores: Colores;
  oscuro: boolean;
}

const TemaContext = createContext<EstadoTema>({ colores: temaDe(null).colores, oscuro: false });

/** Da a toda la app los colores del tema que el jugador trae equipado (skin tipo "tema"). */
export function ProveedorTema({ children }: { children: ReactNode }) {
  const { perfil } = useSesion();
  const clave = perfil?.equipo.tema?.clave ?? null;
  const valor = useMemo(() => {
    const t = temaDe(clave);
    return { colores: t.colores, oscuro: t.oscuro };
  }, [clave]);
  return createElement(TemaContext.Provider, { value: valor }, children);
}

export const useColores = () => useContext(TemaContext).colores;
export const useTemaOscuro = () => useContext(TemaContext).oscuro;

/**
 * Estilos que dependen del tema: se crean con los colores actuales y se
 * rehacen solo cuando cambia el tema. `crear` debe definirse fuera del
 * componente para que el memo funcione.
 */
export function useEstilos<T>(crear: (colores: Colores) => T): T {
  const colores = useColores();
  return useMemo(() => crear(colores), [crear, colores]);
}

/** Estilos compartidos por varias pantallas. */
const crearComunes = (colores: Colores) =>
  StyleSheet.create({
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

export const useComunes = () => useEstilos(crearComunes);
