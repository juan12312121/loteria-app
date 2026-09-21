import { bitsDeMascara, TOTAL_CARTAS, type Carta as TipoCarta, type CartaCantada } from '@loteria/core';
import { Carta } from './Carta';
import { Chip } from '../ui/basicos';
import s from './juego.module.css';

interface CantorProps {
  carta: CartaCantada | null;
  ultimas: CartaCantada[];
  /** Solo en modo automático: cuánto falta para la siguiente */
  velocidadMs?: number;
  ultimaCartaEn: number | null;
  pausada?: boolean;
  skinCarta?: string | null;
}

/** La carta que acaba de salir en grande, su verso, el tiempo y las anteriores. */
export function Cantor({ carta, ultimas, velocidadMs, ultimaCartaEn, pausada, skinCarta }: CantorProps) {
  if (!carta) return <p className="texto-suave">El cantor está por empezar… ¡Se va y se corre!</p>;
  return (
    <div className={s.cantor}>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <Chip tono="verde">¡Recién cantada!</Chip>
        <Chip tono="anil">
          Carta {carta.orden} de {TOTAL_CARTAS}
        </Chip>
      </div>
      <Carta carta={carta} tamano="grande" skin={skinCarta} />
      {carta.verso && <p className={s.verso}>«{carta.verso}»</p>}
      {velocidadMs && !pausada && (
        <div className={s.barra} aria-label="Tiempo para la siguiente carta">
          <div key={ultimaCartaEn ?? carta.orden} className={s.barraRelleno} style={{ animationDuration: `${velocidadMs}ms` }} />
        </div>
      )}
      {pausada && <Chip tono="amarillo">En pausa</Chip>}
      {ultimas.length > 0 && (
        <div>
          <p className="texto-suave" style={{ margin: '0 0 6px', fontWeight: 800 }}>
            Últimas cantadas
          </p>
          <div className={s.fila5}>
            {ultimas.map((c) => (
              <Carta key={c.orden} carta={c} tamano="chica" skin={skinCarta} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Las 54 cartas: a color las que ya salieron, en gris las que faltan. */
export function TableroCantor({ cartas, cantadas }: { cartas: TipoCarta[]; cantadas: ReadonlySet<number> }) {
  return (
    <div className={s.tablero}>
      {cartas.map((c) => (
        <Carta key={c.id} carta={c} tamano="mini" apagada={!cantadas.has(c.id)} />
      ))}
    </div>
  );
}

/** Diagrama 4×4 de una figura (qué casillas hay que llenar). */
export function MiniFigura({ mascara }: { mascara: number }) {
  return (
    <div className={s.miniFigura} aria-hidden>
      {bitsDeMascara(mascara).map((activa, i) => (
        <span key={i} className={`${s.miniCasilla} ${activa ? s.miniActiva : ''}`} />
      ))}
    </div>
  );
}

/**
 * Cuánto le falta a mi tabla más cercana. Nadie grita: cuando faltan 0 el
 * tablero anuncia ¡Lotería! solo (lo decide el servidor, sin trampas).
 */
export function MarcadorLlena({ faltan, tabla }: { faltan: number; tabla: string }) {
  const urgente = faltan <= 2;
  return (
    <div className={`${s.marcador} ${urgente ? s.marcadorUrgente : ''}`} role="status" aria-live="polite">
      <span className={s.marcadorNumero}>{faltan}</span>
      <span>
        <b>{faltan === 1 ? '¡Te falta una carta!' : `Te faltan ${faltan} cartas`}</b> para llenar {tabla}
        <span className={s.marcadorNota}>El tablero canta ¡Lotería! solito cuando se llena una tabla. Nadie tiene que gritar.</span>
      </span>
    </div>
  );
}
