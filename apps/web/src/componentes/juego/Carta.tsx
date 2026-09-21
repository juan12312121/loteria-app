import type { CSSProperties } from 'react';
import { aparienciaCarta, aparienciaFicha, dataUriDeCarta, type Carta as TipoCarta } from '@loteria/core';
import s from './juego.module.css';

export type TamanoCarta = 'mini' | 'chica' | 'mediana' | 'grande';

interface Props {
  carta: Pick<TipoCarta, 'id' | 'nombre' | 'imagen_url'>;
  tamano?: TamanoCarta;
  /** Gris: todavía no sale (tablero del cantor) */
  apagada?: boolean;
  /** Skin de carta del jugador (marco y colores) */
  skin?: string | null;
}

/** Carta de lotería con marco impreso, número, dibujo y nombre. */
export function Carta({ carta, tamano = 'chica', apagada = false, skin }: Props) {
  const a = aparienciaCarta(skin);
  const estilo = { '--fondo': a.fondo, '--marco': a.marco, '--texto': a.texto } as CSSProperties;
  return (
    <div className={`${s.carta} ${s[tamano]} ${apagada ? s.apagada : ''}`} style={estilo} title={carta.nombre}>
      <div className={s.cartaInterior}>
        <span className={s.cartaNumero}>{carta.id}</span>
        <span className={s.cartaDibujo}>
          <img src={carta.imagen_url ?? dataUriDeCarta(carta.id)} alt="" draggable={false} />
        </span>
        <span className={s.cartaNombre}>{carta.nombre}</span>
      </div>
    </div>
  );
}

/** Ficha (frijolito) con la skin del jugador. */
export function Ficha({ skin }: { skin?: string | null }) {
  const a = aparienciaFicha(skin);
  return (
    <span className={s.ficha} style={{ background: a.fondo, borderColor: a.borde }} aria-hidden>
      {a.simbolo}
    </span>
  );
}
