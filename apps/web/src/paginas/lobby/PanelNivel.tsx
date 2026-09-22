import { Coins, Sparkles, TicketPercent } from 'lucide-react';
import { useProgreso, useSesion } from '@loteria/core';
import { Avance, Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { sonidos } from '../../sonidos';
import s from './lobby.module.css';

const formatoFecha = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' });

/** Nivel con insignia, pase del mes y banco de fichas. */
export function PanelNivel() {
  const { perfil } = useSesion();
  const { nivel, pase, banco, cobrarNivel, cobrarPase, cobrarBanco } = useProgreso();
  if (!nivel || !pase || !banco) return null;

  const cobrar = async (accion: () => Promise<unknown>) => {
    if (await accion()) sonidos.cobrar();
  };
  const enNivel = nivel.xp - nivel.xpNivel;
  const paraSubir = Math.max(1, nivel.xpSiguiente - nivel.xpNivel);

  return (
    <div className={s.progreso}>
      <Tarjeta titulo="Tu nivel" icono={<Sparkles size={16} />}>
        <div className="pila" style={{ gap: 10 }}>
          <div className="fila" style={{ justifyContent: 'space-between' }}>
            <span className={s.insignia}>
              <span className={s.insigniaEmoji}>{nivel.insignia.emoji}</span>
              <b>{nivel.insignia.nombre}</b>
            </span>
            <Chip tono="anil">Nivel {nivel.nivel}</Chip>
          </div>
          <Avance valor={enNivel} total={paraSubir} tono="amarillo" />
          <span className="texto-suave">
            {Math.min(enNivel, paraSubir)} de {paraSubir} puntos para el nivel {nivel.nivel + 1}. Suman todos los puntos que ganas,
            aunque los gastes en la tienda.
          </span>
          {nivel.porCobrar > 0 ? (
            <Boton anchoCompleto onClick={() => cobrar(() => cobrarNivel.ejecutar())} cargando={cobrarNivel.cargando}>
              Cobrar {nivel.porCobrar} nivel(es): +{nivel.premio} pts
            </Boton>
          ) : (
            <span className="texto-suave">Ya cobraste los premios de tus niveles.</span>
          )}
          {cobrarNivel.error && <p className={s.error}>{cobrarNivel.error}</p>}
        </div>
      </Tarjeta>

      <Tarjeta
        titulo={`Pase de temporada · ${pase.temporada}`}
        icono={<TicketPercent size={16} />}
        acciones={<Chip tono="rosa">Gratis</Chip>}
      >
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <b>
            Nivel {pase.nivel} de {pase.niveles}
          </b>
          <span className="texto-suave">Termina el {formatoFecha.format(new Date(`${pase.termina}T12:00:00`))}</span>
        </div>
        <Avance valor={pase.puntos % pase.por_nivel} total={pase.por_nivel} tono="rosa" />
        <p className="texto-suave" style={{ marginTop: 6 }}>
          Avanza con los puntos que ganas jugando: {pase.por_nivel} por nivel. Llevas {pase.puntos} este mes.
        </p>
        <div className={s.pase}>
          {pase.premios.map((p) => (
            <div key={p.nivel} className={`${s.premio} ${p.alcanzado ? s.premioListo : ''} ${p.cobrado ? s.premioCobrado : ''}`}>
              <span className={s.premioNivel}>{p.nivel}</span>
              <span className={s.premioQue}>
                {p.puntos ? `+${p.puntos} pts` : ''}
                {p.fichas ? `+${p.fichas} fichas` : ''}
                {p.insignia ? '🏅' : ''}
              </span>
              {p.cobrado ? (
                <Chip tono="verde">✓</Chip>
              ) : p.alcanzado ? (
                <Boton tamano="s" variante="exito" onClick={() => cobrar(() => cobrarPase.ejecutar(p.nivel))} disabled={cobrarPase.cargando}>
                  Cobrar
                </Boton>
              ) : (
                <span className="texto-suave">🔒</span>
              )}
            </div>
          ))}
        </div>
        {cobrarPase.error && <p className={s.error}>{cobrarPase.error}</p>}
      </Tarjeta>

      <Tarjeta titulo="Banco de fichas" icono={<Coins size={16} />}>
        <p className="texto-suave" style={{ marginTop: 0 }}>
          Si te quedan menos de {banco.minimo} fichas, el banco te presta {banco.regala} una vez al día para que sigas jugando.
        </p>
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <Chip icono={<Coins size={14} />}>{perfil?.fichas ?? banco.fichas} fichas</Chip>
          {banco.disponible ? (
            <Boton onClick={() => cobrar(() => cobrarBanco.ejecutar())} cargando={cobrarBanco.cargando}>
              Pedir {banco.regala} fichas
            </Boton>
          ) : (
            <span className="texto-suave">
              {(perfil?.fichas ?? banco.fichas) >= banco.minimo ? 'Todavía traes fichas de sobra.' : 'Ya pediste hoy; vuelve mañana.'}
            </span>
          )}
        </div>
        {cobrarBanco.error && <p className={s.error}>{cobrarBanco.error}</p>}
      </Tarjeta>
    </div>
  );
}
