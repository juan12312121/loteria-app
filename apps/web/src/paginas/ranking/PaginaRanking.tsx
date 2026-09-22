import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy } from 'lucide-react';
import { dataUriDeFicha, nivelYInsignia, useRankingSemanal, useSesion, type FilaRankingSemanal } from '@loteria/core';
import { Avatar, Cargando, Chip, Insignia, MensajeError, Tarjeta, Vacio } from '../../componentes/ui/basicos';
import s from '../paginas.module.css';

const MEDALLAS = ['🥇', '🥈', '🥉'];
const ALTURAS = [120, 160, 100];

/** Cuánto falta para el cierre (el lunes a las 00:00 de México). */
function useCuentaRegresiva(cierra: string | undefined) {
  const [ahora, setAhora] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (!cierra) return '';
  const ms = Date.parse(`${cierra}T00:00:00-06:00`) - ahora;
  if (ms <= 0) return 'cerrando…';
  const dias = Math.floor(ms / 86_400_000);
  const horas = Math.floor((ms % 86_400_000) / 3_600_000);
  return dias ? `${dias} d ${horas} h` : `${horas} h ${Math.floor((ms % 3_600_000) / 60_000)} min`;
}

export function PaginaRanking() {
  const { perfil } = useSesion();
  const { ranking, cargando, error, recargar } = useRankingSemanal(20);
  const falta = useCuentaRegresiva(ranking?.cierra);

  if (cargando && !ranking) return <Cargando />;
  if (error || !ranking) return <MensajeError mensaje={error ?? 'Sin ranking'} alReintentar={recargar} />;

  const { filas, premios, anterior } = ranking;
  const miLugar = filas.findIndex((f) => f.usuario_id === perfil?.id);

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1 className={s.titulo}>Ranking de la semana</h1>
        <Chip tono="anil" icono={<Clock size={14} />}>
          Cierra en {falta}
        </Chip>
      </div>
      <p className="texto-suave" style={{ marginTop: 0 }}>
        Cuentan los puntos ganados jugando esta semana (participación, figuras y victorias). Cada lunes se reinicia y se premia solo.
      </p>

      <div className={s.tresColumnas}>
        <Tarjeta titulo="Premios" icono={<Trophy size={16} />}>
          {premios.map((p) => (
            <div key={p.lugar} className={s.movimiento}>
              <span>
                {MEDALLAS[p.lugar - 1]} <b>Lugar {p.lugar}</b>
              </span>
              <span className="fila" style={{ gap: 6 }}>
                <b>+{p.puntos} pts</b>
                {p.skin && <img src={dataUriDeFicha(p.skin)} alt="" width={28} height={28} title="Ficha exclusiva Corona de oro" />}
              </span>
            </div>
          ))}
          <p className="texto-suave">El 1.er lugar se lleva la ficha exclusiva Corona de oro.</p>
          {miLugar >= 0 ? (
            <Chip tono="rosa">Vas en el lugar {miLugar + 1}</Chip>
          ) : (
            <p className="texto-suave" style={{ margin: 0 }}>
              Todavía no sales en el ranking. <Link to="/jugar">¡Juega una ronda!</Link>
            </p>
          )}
        </Tarjeta>

        <Tarjeta titulo="Esta semana">
          <Tabla filas={filas} miId={perfil?.id} />
        </Tarjeta>

        <Tarjeta titulo="Ganadores de la semana pasada">
          {anterior?.ganadores.length ? (
            anterior.ganadores.map((g) => (
              <div key={g.usuario_id} className={s.movimiento}>
                <span className="fila">
                  {MEDALLAS[g.lugar - 1]}
                  <Avatar nombre={g.nombre} clave={g.avatar} tamano={28} />
                  <b>{g.nombre}</b>
                </span>
                <span>{g.puntos} pts</span>
              </div>
            ))
          ) : (
            <Vacio carta={23}>Aún no se ha cerrado ninguna semana.</Vacio>
          )}
        </Tarjeta>
      </div>
    </>
  );
}

function Tabla({ filas, miId }: { filas: FilaRankingSemanal[]; miId?: string }) {
  if (!filas.length) return <Vacio carta={35}>Nadie ha jugado esta semana. ¡Sé el primero!</Vacio>;
  const podio = [filas[1], filas[0], filas[2]];
  return (
    <div className="pila">
      <div className={s.podio}>
        {podio.map((l, i) =>
          l ? (
            <div key={l.usuario_id} className="pila" style={{ gap: 4, alignItems: 'center' }}>
              <div style={{ fontSize: '1.6rem' }}>{MEDALLAS[filas.indexOf(l)]}</div>
              <Avatar nombre={l.nombre} clave={l.avatar} tamano={48} />
              <b>{l.nombre}</b>
              <Insignia {...nivelYInsignia(l.xp)} chico />
              <div
                className={s.escalon}
                style={{
                  height: ALTURAS[i],
                  width: '100%',
                  background: l.usuario_id === miId ? 'var(--rosa)' : 'var(--amarillo-suave)',
                  color: l.usuario_id === miId ? 'var(--blanco)' : 'inherit',
                }}
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
        {filas.slice(3).map((l) => (
          <li key={l.usuario_id} className={s.movimiento} style={{ fontWeight: l.usuario_id === miId ? 900 : 600 }}>
            <span className="fila">
              <Avatar nombre={l.nombre} clave={l.avatar} tamano={26} />
              {l.nombre}
              <Insignia {...nivelYInsignia(l.xp)} chico />
            </span>
            <span>{l.puntos} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
