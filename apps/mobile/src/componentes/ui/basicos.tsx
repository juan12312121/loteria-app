import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { papelPicado, svgDeAvatar, svgDeCarta } from '@loteria/core';
import { espacio, fuentes, radio, type Colores, useColores, useComunes, useEstilos } from '../../tema';
import { Boton } from './Boton';

// ---------- Chip ----------
type Tono = 'amarillo' | 'verde' | 'rosa' | 'anil' | 'neutro';
const tonosDe = (colores: Colores): Record<Tono, { fondo: string; texto: string; borde: string }> => ({
  amarillo: { fondo: colores.amarilloSuave, texto: colores.tinta, borde: colores.tinta },
  verde: { fondo: colores.verdeSuave, texto: colores.verde, borde: colores.verde },
  rosa: { fondo: colores.rosa, texto: colores.blanco, borde: colores.tinta },
  anil: { fondo: colores.anil, texto: colores.blanco, borde: colores.tinta },
  neutro: { fondo: colores.papel, texto: colores.tinta, borde: colores.tinta },
});

export function Chip({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) {
  const colores = useColores();
  const estilos = useEstilos(crearEstilos);
  const t = tonosDe(colores)[tono];
  return (
    <View style={[estilos.chip, { backgroundColor: t.fondo, borderColor: t.borde }]}>
      <Text style={[estilos.chipTexto, { color: t.texto }]}>{children}</Text>
    </View>
  );
}

// ---------- Tarjeta ----------
export function Tarjeta({ titulo, acciones, children }: { titulo?: string; acciones?: ReactNode; children: ReactNode }) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
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
  const colores = useColores();
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
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

interface AvatarProps {
  nombre: string;
  /** Clave de la skin de avatar; sin ella se usa la inicial en un círculo de color */
  clave?: string | null;
  tamano?: number;
  conectado?: boolean;
}

export function Avatar({ nombre, clave, tamano = 36, conectado }: AvatarProps) {
  const colores = useColores();
  const estilos = useEstilos(crearEstilos);
  const punto = conectado !== undefined && (
    <View style={[estilos.punto, { backgroundColor: conectado ? colores.verde : colores.gris, width: tamano * 0.3, height: tamano * 0.3, borderRadius: tamano }]} />
  );
  if (clave)
    return (
      <View style={{ width: tamano, height: tamano }}>
        <SvgXml xml={svgDeAvatar(clave)} width="100%" height="100%" />
        {punto}
      </View>
    );
  return (
    <View style={[estilos.avatar, { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: colorDe(nombre) }]}>
      <Text style={{ color: colores.blanco, fontFamily: fuentes.cuerpoNegra, fontSize: tamano * 0.42 }}>{nombre.trim().charAt(0).toUpperCase()}</Text>
      {punto}
    </View>
  );
}

// ---------- Interruptor ----------
export function Interruptor({ etiqueta, activo, alCambiar }: { etiqueta: string; activo: boolean; alCambiar: (v: boolean) => void }) {
  const colores = useColores();
  const comunes = useComunes();
  return (
    <View style={[comunes.fila, { flexWrap: 'nowrap' }]}>
      <Switch value={activo} onValueChange={alCambiar} trackColor={{ true: colores.verde, false: colores.grisClaro }} thumbColor={colores.blanco} accessibilityLabel={etiqueta} />
      <Text style={comunes.negrita}>{etiqueta}</Text>
    </View>
  );
}

// ---------- Barra de avance ----------
export function Avance({ valor, total, tono = 'rosa' }: { valor: number; total: number; tono?: 'rosa' | 'verde' | 'amarillo' }) {
  const colores = useColores();
  const estilos = useEstilos(crearEstilos);
  const pct = total ? Math.min(100, Math.round((valor / total) * 100)) : 0;
  return (
    <View style={estilos.avance} accessibilityRole="progressbar" accessibilityValue={{ now: valor, min: 0, max: total }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: colores[tono] }} />
    </View>
  );
}

// ---------- Papel picado ----------
export function PapelPicado({ banderitas = 14 }: { banderitas?: number }) {
  const estilos = useEstilos(crearEstilos);
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
  const colores = useColores();
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  return (
    <View style={estilos.estado}>
      <ActivityIndicator color={colores.rosa} size="large" />
      <Text style={comunes.textoSuave}>{texto}</Text>
    </View>
  );
}

export function MensajeError({ mensaje, alReintentar }: { mensaje: string; alReintentar?: () => void }) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
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

/**
 * Estado vacío con una carta de la baraja como ilustración, para que no se
 * sienta un hueco. `carta` es el número de carta (1 = El Gallo).
 */
export function Vacio({ carta, children }: { carta?: number; children: ReactNode }) {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  return (
    <View style={estilos.estado}>
      {carta ? (
        <View style={estilos.dibujoVacio}>
          <SvgXml xml={svgDeCarta(carta)} width="100%" height="100%" />
        </View>
      ) : null}
      {typeof children === 'string' ? <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>{children}</Text> : children}
    </View>
  );
}

// ---------- Pestañas ----------
export function Pestanas<T extends string>({ opciones, valor, alCambiar }: { opciones: { valor: T; etiqueta: string }[]; valor: T; alCambiar: (v: T) => void }) {
  const colores = useColores();
  const estilos = useEstilos(crearEstilos);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
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
    </ScrollView>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
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
  dibujoVacio: { width: 84, height: 84, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.m, overflow: 'hidden', opacity: 0.85 },
  avance: { height: 10, borderWidth: 1.5, borderColor: colores.tinta, borderRadius: radio.total, backgroundColor: colores.blanco, overflow: 'hidden' },
});
