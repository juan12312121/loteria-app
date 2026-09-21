import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { papelPicado } from '@loteria/core';
import { colores, comunes, espacio, fuentes, radio } from '../../tema';
import { Boton } from './Boton';

// ---------- Chip ----------
type Tono = 'amarillo' | 'verde' | 'rosa' | 'anil' | 'neutro';
const TONOS: Record<Tono, { fondo: string; texto: string; borde: string }> = {
  amarillo: { fondo: colores.amarilloSuave, texto: colores.tinta, borde: colores.tinta },
  verde: { fondo: colores.verdeSuave, texto: colores.verde, borde: colores.verde },
  rosa: { fondo: colores.rosa, texto: colores.blanco, borde: colores.tinta },
  anil: { fondo: colores.anil, texto: colores.blanco, borde: colores.tinta },
  neutro: { fondo: colores.papel, texto: colores.tinta, borde: colores.tinta },
};

export function Chip({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) {
  const t = TONOS[tono];
  return (
    <View style={[estilos.chip, { backgroundColor: t.fondo, borderColor: t.borde }]}>
      <Text style={[estilos.chipTexto, { color: t.texto }]}>{children}</Text>
    </View>
  );
}

// ---------- Tarjeta ----------
export function Tarjeta({ titulo, acciones, children }: { titulo?: string; acciones?: ReactNode; children: ReactNode }) {
  return (
    <View style={estilos.tarjeta}>
      {(titulo || acciones) && (
        <View style={[comunes.fila, { justifyContent: 'space-between', marginBottom: espacio.m }]}>
          {titulo && <Text style={estilos.tarjetaTitulo}>{titulo.toUpperCase()}</Text>}
          {acciones}
        </View>
      )}
      {children}
    </View>
  );
}

// ---------- Campo ----------
export function Campo({ etiqueta, error, style, ...resto }: TextInputProps & { etiqueta: string; error?: string | null }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput style={[estilos.input, style]} placeholderTextColor={colores.gris} accessibilityLabel={etiqueta} {...resto} />
      {error ? <Text style={comunes.error}>{error}</Text> : null}
    </View>
  );
}

// ---------- Avatar ----------
const colorDe = (texto: string) => papelPicado[[...texto].reduce((a, c) => a + c.charCodeAt(0), 0) % papelPicado.length];

export function Avatar({ nombre, tamano = 36, conectado }: { nombre: string; tamano?: number; conectado?: boolean }) {
  return (
    <View style={[estilos.avatar, { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: colorDe(nombre) }]}>
      <Text style={{ color: colores.blanco, fontFamily: fuentes.cuerpoNegra, fontSize: tamano * 0.42 }}>{nombre.trim().charAt(0).toUpperCase()}</Text>
      {conectado !== undefined && (
        <View style={[estilos.punto, { backgroundColor: conectado ? colores.verde : colores.gris, width: tamano * 0.3, height: tamano * 0.3, borderRadius: tamano }]} />
      )}
    </View>
  );
}

// ---------- Papel picado ----------
export function PapelPicado({ banderitas = 14 }: { banderitas?: number }) {
  return (
    <View style={estilos.papelPicado} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: banderitas }, (_, i) => (
        <View key={i} style={[estilos.banderita, { backgroundColor: papelPicado[i % papelPicado.length] }]} />
      ))}
    </View>
  );
}

// ---------- Estados ----------
export function Cargando({ texto = 'Barajando…' }: { texto?: string }) {
  return (
    <View style={estilos.estado}>
      <ActivityIndicator color={colores.rosa} size="large" />
      <Text style={comunes.textoSuave}>{texto}</Text>
    </View>
  );
}

export function MensajeError({ mensaje, alReintentar }: { mensaje: string; alReintentar?: () => void }) {
  return (
    <View style={estilos.estado}>
      <Text style={[comunes.error, { textAlign: 'center' }]}>{mensaje}</Text>
      {alReintentar && (
        <Boton tamano="s" variante="secundario" alPresionar={alReintentar}>
          Reintentar
        </Boton>
      )}
    </View>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return (
    <View style={estilos.estado}>
      {typeof children === 'string' ? <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>{children}</Text> : children}
    </View>
  );
}

// ---------- Pestañas ----------
export function Pestanas<T extends string>({ opciones, valor, alCambiar }: { opciones: { valor: T; etiqueta: string }[]; valor: T; alCambiar: (v: T) => void }) {
  return (
    <View style={estilos.pestanas} accessibilityRole="tablist">
      {opciones.map((o) => {
        const activa = o.valor === valor;
        return (
          <Pressable key={o.valor} onPress={() => alCambiar(o.valor)} accessibilityRole="tab" accessibilityState={{ selected: activa }} style={[estilos.pestana, activa && { backgroundColor: colores.anil }]}>
            <Text style={[estilos.pestanaTexto, activa && { color: colores.blanco }]}>{o.etiqueta}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  chip: { borderWidth: 1.5, borderRadius: radio.total, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  chipTexto: { fontFamily: fuentes.cuerpoNegra, fontSize: 12 },
  tarjeta: { backgroundColor: colores.papel, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.l, padding: espacio.l },
  tarjetaTitulo: { fontFamily: fuentes.cuerpoNegra, fontSize: 12, letterSpacing: 1.2, color: colores.anil },
  etiqueta: { fontFamily: fuentes.cuerpoBold, fontSize: 14, color: colores.tinta },
  input: { borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.m, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colores.blanco, fontFamily: fuentes.cuerpoBold, fontSize: 16, color: colores.tinta },
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colores.tinta },
  punto: { position: 'absolute', right: -2, bottom: -2, borderWidth: 2, borderColor: colores.papel },
  papelPicado: { flexDirection: 'row', height: 18 },
  banderita: { flex: 1, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginHorizontal: 1 },
  estado: { alignItems: 'center', justifyContent: 'center', gap: espacio.s, padding: espacio.xl },
  pestanas: { flexDirection: 'row', borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.total, padding: 3, backgroundColor: colores.papel, alignSelf: 'flex-start' },
  pestana: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: radio.total },
  pestanaTexto: { fontFamily: fuentes.cuerpoNegra, color: colores.tinta },
});
