import { useId } from 'react';
import { papelPicado } from '@loteria/core';
import s from './papelPicado.module.css';

interface Props {
  /** Cuántas banderitas (se recortan si no caben) */
  banderitas?: number;
  /** Alto de cada banderita en px */
  alto?: number;
  className?: string;
}

/**
 * Guirnalda de papel picado: un cordón con banderitas caladas que se mecen.
 * Cada banderita es un SVG con borde picado y huecos (máscara), no un
 * rectángulo plano.
 */
export function PapelPicado({ banderitas = 40, alto = 56, className }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={[s.guirnalda, className].filter(Boolean).join(' ')} style={{ height: alto + 14 }} aria-hidden>
      <svg width="0" height="0" className={s.defs}>
        <defs>
          <mask id={`calado-${id}`} maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="white" />
            {/* flor central */}
            <circle cx="0.5" cy="0.42" r="0.11" fill="black" />
            {[0, 60, 120, 180, 240, 300].map((g) => (
              <circle
                key={g}
                cx={0.5 + 0.2 * Math.cos((g * Math.PI) / 180)}
                cy={0.42 + 0.16 * Math.sin((g * Math.PI) / 180)}
                r="0.055"
                fill="black"
              />
            ))}
            {/* grecas de las esquinas */}
            <rect x="0.12" y="0.12" width="0.1" height="0.08" fill="black" />
            <rect x="0.78" y="0.12" width="0.1" height="0.08" fill="black" />
            <rect x="0.12" y="0.66" width="0.1" height="0.06" fill="black" />
            <rect x="0.78" y="0.66" width="0.1" height="0.06" fill="black" />
          </mask>
        </defs>
      </svg>
      <div className={s.cordon} />
      <div className={s.fila}>
        {Array.from({ length: banderitas }, (_, i) => (
          <svg
            key={i}
            className={s.banderita}
            viewBox="0 0 40 50"
            width={alto * 0.8}
            height={alto}
            style={{ animationDelay: `${(i % 7) * -0.4}s` }}
          >
            <path
              d="M0 0 H40 V42 L36 46 L32 42 L28 46 L24 42 L20 46 L16 42 L12 46 L8 42 L4 46 L0 42 Z"
              fill={papelPicado[i % papelPicado.length]}
              mask={`url(#calado-${id})`}
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
