import { useEffect, useMemo, useState } from 'react';
import { mascaraCantadasDemo, usarMovimientoReducido } from './utilidades';
import { CANTADAS_DEMO, ESQUINAS, TABLA_DEMO, cartasDemo } from './demo';
import { Carta } from '../../componentes/juego/Carta';
import { TablaLoteria } from '../../componentes/juego/TablaLoteria';
import s from './landing.module.css';

const RITMO_MS = 1700;
const PAUSA_FINAL = 4;

/**
 * Demostración en vivo: el cantor saca cartas, los frijolitos caen solos en
 * la tabla y al completar las esquinas aparece el aviso. Se repite.
 */
export function EscenaCantor() {
  const reducido = usarMovimientoReducido();
  const [paso, setPaso] = useState(reducido ? CANTADAS_DEMO.length : 1);

  useEffect(() => {
    if (reducido) return;
    const t = setInterval(() => setPaso((p) => (p >= CANTADAS_DEMO.length + PAUSA_FINAL ? 1 : p + 1)), RITMO_MS);
    return () => clearInterval(t);
  }, [reducido]);

  const visibles = Math.min(paso, CANTADAS_DEMO.length);
  const cantadas = useMemo(() => new Set(CANTADAS_DEMO.slice(0, visibles)), [visibles]);
  const marcas = mascaraCantadasDemo(TABLA_DEMO, cantadas);
  const esquinasListas = [...ESQUINAS].every((i) => cantadas.has(TABLA_DEMO[i]));
  const actual = cartasDemo.get(CANTADAS_DEMO[visibles - 1])!;

  return (
    <div className={s.escena}>
      <div className={s.escenaTabla}>
        <TablaLoteria
          nombre="Tu tabla"
          cartas={TABLA_DEMO}
          porId={cartasDemo}
          cantadas={cantadas}
          marcas={marcas}
          destacadas={esquinasListas ? ESQUINAS : undefined}
          skinFicha="corcholata"
        />
      </div>

      <div className={s.escenaCantada} key={actual.id}>
        <span className={s.escenaEtiqueta}>El cantor dice…</span>
        <Carta carta={actual} tamano="mediana" />
        <p className={s.globo}>«{actual.verso}»</p>
      </div>

      {esquinasListas && (
        <div className={s.escenaAviso} role="status">
          🥇 <b>¡Cuatro esquinas!</b> +25 pts · la ronda sigue
        </div>
      )}
    </div>
  );
}
