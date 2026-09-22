import { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { Confeti } from './Confeti';
import { Boton } from './Boton';
import { fuentes, radio, useEstilos, type Colores } from '../../tema';

interface Props {
  nivel: number;
  insignia: { nombre: string; emoji: string };
  puntos: number;
  alCerrar: () => void;
}

const SEGUNDOS = 6000;

/** Festejo de subida de nivel: la insignia nueva en grande, con confeti. */
export function CelebracionNivel({ nivel, insignia, puntos, alCerrar }: Props) {
  const estilos = useEstilos(crearEstilos);
  const [escala] = useState(() => new Animated.Value(0.7));

  useEffect(() => {
    Animated.spring(escala, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    const t = setTimeout(alCerrar, SEGUNDOS);
    return () => clearTimeout(t);
  }, [alCerrar, escala]);

  return (
    <Modal transparent animationType="fade" onRequestClose={alCerrar}>
      <Pressable style={estilos.fondo} onPress={alCerrar}>
        <Confeti />
        <Animated.View style={[estilos.caja, { transform: [{ scale: escala }] }]}>
          <Text style={estilos.emoji}>{insignia.emoji}</Text>
          <Text style={estilos.titulo}>{`¡Nivel ${nivel}!`}</Text>
          <Text style={estilos.insignia}>{insignia.nombre}</Text>
          <Text style={estilos.puntos}>{`+${puntos} puntos`}</Text>
          <Boton alPresionar={alCerrar}>¡Órale!</Boton>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    fondo: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)', padding: 16 },
    caja: {
      alignItems: 'center',
      gap: 6,
      width: '88%',
      padding: 24,
      backgroundColor: colores.papel,
      borderWidth: 3,
      borderColor: colores.tinta,
      borderRadius: radio.l,
    },
    emoji: { fontSize: 64 },
    titulo: { fontFamily: fuentes.titulo, fontSize: 34, color: colores.rosa },
    insignia: { fontFamily: fuentes.tituloBold, fontSize: 20, color: colores.tinta },
    puntos: { fontFamily: fuentes.cuerpoNegra, color: colores.verde, marginBottom: 8 },
  });
