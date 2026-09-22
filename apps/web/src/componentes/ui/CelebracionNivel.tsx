import { useEffect } from 'react';
import { Confeti } from './Confeti';
import { Boton } from './Boton';
import s from './celebracion.module.css';

interface Props {
  nivel: number;
  insignia: { nombre: string; emoji: string };
  puntos: number;
  alCerrar: () => void;
}

const SEGUNDOS = 6000;

/** Festejo de subida de nivel: la insignia nueva en grande, con confeti. */
export function CelebracionNivel({ nivel, insignia, puntos, alCerrar }: Props) {
  useEffect(() => {
    const t = setTimeout(alCerrar, SEGUNDOS);
    return () => clearTimeout(t);
  }, [alCerrar]);

  return (
    <div className={s.fondo} role="dialog" aria-label={`Subiste al nivel ${nivel}`} onClick={alCerrar}>
      <Confeti />
      <div className={s.caja} onClick={(e) => e.stopPropagation()}>
        <span className={s.emoji} aria-hidden>
          {insignia.emoji}
        </span>
        <h2 className={s.titulo}>¡Nivel {nivel}!</h2>
        <p className={s.insignia}>{insignia.nombre}</p>
        <p className={s.puntos}>+{puntos} puntos</p>
        <Boton onClick={alCerrar}>¡Órale!</Boton>
      </div>
    </div>
  );
}
