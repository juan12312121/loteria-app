import type { CSSProperties } from 'react';
import { casillasDeTabla, contarMarcas, type Carta as TipoCarta } from '@loteria/core';
import { Carta, Ficha } from './Carta';
import { Chip } from '../ui/basicos';
import s from './juego.module.css';

interface Props {
  nombre: string;
  cartas: number[];
  porId: Map<number, TipoCarta>;
  cantadas: ReadonlySet<number>;
  marcas?: number;
  destacadas?: ReadonlySet<number>;
  skinFicha?: string | null;
  skinCarta?: string | null;
  /** Si viene, las casillas se pueden tocar (marcar frijolito) */
  alTocarCasilla?: (indice: number) => void;
  /** Festejo: las casillas destacadas se encienden una tras otra */
  encender?: boolean;
}

/** Tabla 4×4: cartas, frijolitos del jugador y figuras logradas resaltadas. */
export function TablaLoteria({ nombre, cartas, porId, cantadas, marcas = 0, destacadas, skinFicha, skinCarta, alTocarCasilla, encender }: Props) {
  const casillas = casillasDeTabla(cartas, cantadas, marcas, destacadas);

  return (
    <article className={s.tabla} aria-label={nombre}>
      <header className={s.tablaEncabezado}>
        <span>{nombre}</span>
        <Chip tono="verde">{contarMarcas(marcas)}/16</Chip>
      </header>
      <div className={s.rejilla}>
        {casillas.map((c) => {
          const carta = porId.get(c.carta) ?? { id: c.carta, nombre: `Carta ${c.carta}`, imagen_url: null };
          const porMarcar = c.cantada && !c.marcada && !!alTocarCasilla;
          return (
            <button
              key={c.indice}
              type="button"
              className={[s.casilla, porMarcar && s.casillaPorMarcar, c.destacada && s.casillaDestacada, encender && c.destacada && s.casillaEncendida]
                .filter(Boolean)
                .join(' ')}
              style={encender ? ({ '--orden': c.indice } as CSSProperties) : undefined}
              onClick={() => alTocarCasilla?.(c.indice)}
              disabled={!alTocarCasilla || !c.cantada}
              aria-label={`${carta.nombre}, fila ${c.fila + 1} columna ${c.col + 1}${c.marcada ? ', marcada' : ''}`}
              aria-pressed={c.marcada}
            >
              <Carta carta={carta} tamano="chica" skin={skinCarta} />
              {c.marcada && <Ficha skin={skinFicha} />}
            </button>
          );
        })}
      </div>
    </article>
  );
}
