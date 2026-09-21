import { useMemo, type CSSProperties } from 'react';
import { papelPicado } from '@loteria/core';
import s from './confeti.module.css';

const PIEZAS = 70;

/** Lluvia de papelitos de colores (solo transformaciones, sin opacidad). */
export function Confeti() {
  const piezas = useMemo(
    () =>
      Array.from({ length: PIEZAS }, (_, i) => ({
        color: papelPicado[i % papelPicado.length],
        x: Math.random() * 100,
        retraso: Math.random() * 1.2,
        duracion: 2.4 + Math.random() * 1.8,
        giro: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
        ancho: 7 + Math.random() * 7,
        deriva: (Math.random() - 0.5) * 160,
      })),
    [],
  );
  return (
    <div className={s.confeti} aria-hidden>
      {piezas.map((p, i) => (
        <span
          key={i}
          className={s.pieza}
          style={
            {
              left: `${p.x}%`,
              background: p.color,
              width: p.ancho,
              height: p.ancho * 1.4,
              animationDelay: `${p.retraso}s`,
              animationDuration: `${p.duracion}s`,
              '--giro': `${p.giro}deg`,
              '--deriva': `${p.deriva}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
