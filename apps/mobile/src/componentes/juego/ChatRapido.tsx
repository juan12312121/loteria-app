import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CLAVES_FRASE, FRASES, type BurbujaFrase, type ClaveFrase, type ElementoCola } from '@loteria/core';
import { Avatar } from '../ui/basicos';
import { fuentes, radio, type Colores, useEstilos } from '../../tema';

const ESPERA_MS = 1500;

/** Botón flotante con frases fijas (nada de texto libre). */
export function ChatRapido({ alEnviar, abajo = 0 }: { alEnviar: (clave: ClaveFrase) => void; abajo?: number }) {
  const estilos = useEstilos(crearEstilos);
  const [abierto, setAbierto] = useState(false);
  const [espera, setEspera] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const enviar = (clave: ClaveFrase) => {
    alEnviar(clave);
    setAbierto(false);
    setEspera(true);
    temporizador.current = setTimeout(() => setEspera(false), ESPERA_MS);
  };

  return (
    <View style={[estilos.chat, { bottom: 16 + abajo }]} pointerEvents="box-none">
      {abierto && (
        <View style={estilos.frases}>
          {CLAVES_FRASE.map((clave) => (
            <Pressable key={clave} onPress={() => enviar(clave)} disabled={espera} style={[estilos.frase, espera && { opacity: 0.5 }]}>
              <Text style={estilos.fraseTexto}>{FRASES[clave]}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <Pressable onPress={() => setAbierto((a) => !a)} style={estilos.boton} accessibilityLabel="Chat rápido" accessibilityRole="button">
        <Text style={estilos.botonTexto}>💬</Text>
      </Pressable>
    </View>
  );
}

/** Globitos de lo que dicen los demás. */
export function BurbujasChat({ burbujas, arriba = 60 }: { burbujas: ElementoCola<BurbujaFrase>[]; arriba?: number }) {
  const estilos = useEstilos(crearEstilos);
  if (!burbujas.length) return null;
  return (
    <View style={[estilos.burbujas, { top: arriba }]} pointerEvents="none">
      {burbujas.map(({ id, valor }) => (
        <View key={id} style={estilos.burbuja}>
          <Avatar nombre={valor.nombre} clave={valor.avatar} tamano={26} />
          <Text style={estilos.fraseTexto}>
            <Text style={{ fontFamily: fuentes.cuerpoNegra }}>{valor.nombre}: </Text>
            {valor.texto}
          </Text>
        </View>
      ))}
    </View>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
  chat: { position: 'absolute', right: 16, alignItems: 'flex-end', gap: 8 },
  boton: { width: 54, height: 54, borderRadius: 27, borderWidth: 3, borderColor: colores.tinta, backgroundColor: colores.rosa, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  botonTexto: { fontSize: 24 },
  frases: { gap: 6, padding: 10, backgroundColor: colores.papel, borderWidth: 2, borderColor: colores.tinta, borderRadius: radio.l, elevation: 6 },
  frase: { borderWidth: 1.5, borderColor: colores.tinta, borderRadius: radio.total, backgroundColor: colores.amarilloSuave, paddingHorizontal: 14, paddingVertical: 6 },
  fraseTexto: { fontFamily: fuentes.cuerpoBold, color: colores.tinta, fontSize: 14, flexShrink: 1 },
  burbujas: { position: 'absolute', left: 12, right: 80, gap: 6 },
  burbuja: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 6, paddingLeft: 6, paddingRight: 12, backgroundColor: colores.papel, borderWidth: 2, borderColor: colores.tinta, borderRadius: 16, borderBottomLeftRadius: 4, elevation: 4 },
});
