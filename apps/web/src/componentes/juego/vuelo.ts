import { useEffect } from 'react';
import { dataUriDeCarta } from '@loteria/core';

const DURACION = 700;

/**
 * La carta recién cantada "vuela" del cantor a su casilla del tablero de 54.
 * Se hace con una copia flotante encima de todo, así nada se mueve de su lugar.
 * Si el navegador tiene reducidas las animaciones, no vuela nada.
 */
export function useVueloDeCarta(cartaId: number | undefined, disparo: number | null) {
  useEffect(() => {
    if (!cartaId || !disparo) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const origen = document.querySelector<HTMLElement>('[data-vuelo-origen]');
    const destino = document.querySelector<HTMLElement>(`[data-carta="${cartaId}"]`);
    if (!origen || !destino) return;

    const a = origen.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    const copia = document.createElement('img');
    copia.src = dataUriDeCarta(cartaId);
    copia.alt = '';
    copia.ariaHidden = 'true';
    Object.assign(copia.style, {
      position: 'fixed',
      left: `${a.left}px`,
      top: `${a.top}px`,
      width: `${a.width}px`,
      height: `${a.height}px`,
      borderRadius: '8px',
      border: '2px solid #1C1A17',
      background: '#FFFDF7',
      zIndex: '65',
      pointerEvents: 'none',
    });
    document.body.appendChild(copia);

    const animacion = copia.animate(
      [
        { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
        {
          transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width}) rotate(12deg)`,
        },
      ],
      { duration: DURACION, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
    );
    animacion.onfinish = () => {
      copia.remove();
      destino.classList.add('recienCantada');
      setTimeout(() => destino.classList.remove('recienCantada'), 900);
    };
    return () => {
      animacion.cancel();
      copia.remove();
    };
  }, [cartaId, disparo]);
}
