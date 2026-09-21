import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { papelPicado } from '@loteria/core';

const PIEZAS = 40;

/** Azar reproducible (0–1) para que el render sea puro: misma pieza, misma caída. */
const azar = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Lluvia de papelitos al cantar ¡Lotería! (Animated nativo, sin librerías). */
export function Confeti() {
  const { width, height } = useWindowDimensions();
  const [avance] = useState(() => new Animated.Value(0));
  const piezas = useMemo(
    () =>
      Array.from({ length: PIEZAS }, (_, i) => {
        const inicio = azar(i, 2) * 0.4;
        const giro = (azar(i, 4) > 0.5 ? 1 : -1) * (2 + azar(i, 5) * 3);
        const lado = 8 + azar(i, 6) * 6;
        return {
          color: papelPicado[i % papelPicado.length],
          left: azar(i, 1) * width,
          lado,
          y: avance.interpolate({ inputRange: [0, inicio, 1], outputRange: [-40, -40, height + 40], extrapolate: 'clamp' }),
          x: avance.interpolate({ inputRange: [0, 1], outputRange: [0, (azar(i, 3) - 0.5) * 120] }),
          rot: avance.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${giro * 360}deg`] }),
        };
      }),
    [avance, width, height],
  );

  useEffect(() => {
    Animated.timing(avance, { toValue: 1, duration: 3200, easing: Easing.in(Easing.quad), useNativeDriver: true }).start();
  }, [avance]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {piezas.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            width: p.lado,
            height: p.lado * 1.4,
            backgroundColor: p.color,
            transform: [{ translateY: p.y }, { translateX: p.x }, { rotate: p.rot }],
          }}
        />
      ))}
    </View>
  );
}
