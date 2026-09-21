import { Link } from 'react-router-dom';
import { Coins, Flame, Star } from 'lucide-react';
import { usePerfilJuego, useSesion, type LugarRanking, type MovimientoPuntos } from '@loteria/core';
import { Avatar, Cargando, Chip, Tarjeta, Vacio } from '../../componentes/ui/basicos';
import s from '../paginas.module.css';

const ETIQUETAS: Record<MovimientoPuntos['tipo'], string> = {
  participacion: 'Participación',
  victoria: 'Victoria',
  logro: 'Figura',
  bono: 'Bono',
  penalizacion: 'Lotería falsa',
  canje: 'Canje',
  ajuste: 'Ajuste',
};

const MEDALLAS = ['🥇', '🥈', '🥉'];
const ALTURAS = [120, 150, 100];

export function PaginaPerfil() {
  const { perfil } = useSesion();
  const { ranking, historial, cargando } = usePerfilJuego();
  if (!perfil) return null;

  return (
    <div className={s.tresColumnas} style={{ marginTop: 16 }}>
      <Tarjeta titulo="Mi perfil">
        <div className="pila" style={{ alignItems: 'center', textAlign: 'center' }}>
          <Avatar nombre={perfil.nombre} tamano={84} />
          <h2>{perfil.nombre}</h2>
          <div className="fila" style={{ justifyContent: 'center' }}>
            <Chip tono="amarillo" icono={<Star size={14} />}>{perfil.puntos} pts</Chip>
            <Chip icono={<Coins size={14} />}>{perfil.fichas} fichas</Chip>
            <Chip tono="rosa" icono={<Flame size={14} />}>Racha {perfil.racha}</Chip>
          </div>
          <div className="texto-suave">
            Ficha: <b>{perfil.equipo.ficha?.nombre ?? 'Frijolito'}</b> · Cartas: <b>{perfil.equipo.carta?.nombre ?? 'Clásica'}</b>
          </div>
          <Link to="/tienda">Cambiar en la tienda</Link>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Ranking de puntos">
        {cargando ? <Cargando /> : <Ranking lugares={ranking} miId={perfil.id} />}
      </Tarjeta>

      <Tarjeta titulo="Historial de puntos">
        {!historial.length ? (
          <Vacio>Juega tu primera ronda para ganar puntos.</Vacio>
        ) : (
          historial.map((m) => (
            <div key={m.id} className={s.movimiento}>
              <span>
                <b>{ETIQUETAS[m.tipo]}</b>
                <div className="texto-suave">{m.detalle}</div>
              </span>
              <span className={m.monto >= 0 ? s.positivo : s.negativo}>
                {m.monto >= 0 ? '+' : ''}
                {m.monto}
              </span>
            </div>
          ))
        )}
      </Tarjeta>
    </div>
  );
}

function Ranking({ lugares, miId }: { lugares: LugarRanking[]; miId: string }) {
  if (!lugares.length) return <Vacio>Todavía no hay puntos.</Vacio>;
  const podio = [lugares[1], lugares[0], lugares[2]];
  return (
    <div className="pila">
      <div className={s.podio}>
        {podio.map((l, i) =>
          l ? (
            <div key={l.id}>
              <div style={{ fontSize: '1.6rem' }}>{MEDALLAS[lugares.indexOf(l)]}</div>
              <b>{l.nombre}</b>
              <div
                className={s.escalon}
                style={{ height: ALTURAS[i], background: l.id === miId ? 'var(--rosa)' : 'var(--amarillo-suave)', color: l.id === miId ? 'var(--blanco)' : 'inherit' }}
              >
                {l.puntos} pts
              </div>
            </div>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
      <ol start={4} style={{ margin: 0, paddingLeft: 24 }}>
        {lugares.slice(3).map((l) => (
          <li key={l.id} className={s.movimiento} style={{ fontWeight: l.id === miId ? 900 : 600 }}>
            <span>{l.nombre}</span>
            <span>{l.puntos} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
