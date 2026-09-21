import { useEffect, useState } from 'react';

/** Máscara de casillas cuya carta ya salió (en la demo los frijolitos caen solos). */
export const mascaraCantadasDemo = (tabla: number[], cantadas: ReadonlySet<number>) =>
  tabla.reduce((m, carta, i) => (cantadas.has(carta) ? m | (1 << i) : m), 0);

/** Respeta "reducir movimiento" del sistema operativo. */
export function usarMovimientoReducido() {
  const consulta = '(prefers-reduced-motion: reduce)';
  const [reducido, setReducido] = useState(() => typeof window !== 'undefined' && window.matchMedia(consulta).matches);
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const alCambiar = () => setReducido(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);
  return reducido;
}
