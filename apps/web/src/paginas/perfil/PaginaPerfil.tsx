import { Link } from 'react-router-dom';
import { CalendarCheck, Coins, Flame, Star } from 'lucide-react';
import { usePerfilJuego, useSesion, type MovimientoPuntos, type PerfilJuego, type TipoSkin } from '@loteria/core';
import { Avance, Avatar, Cargando, Chip, MensajeError, Tarjeta, Vacio } from '../../componentes/ui/basicos';
import { Carta } from '../../componentes/juego/Carta';
import s from '../paginas.module.css';

const ETIQUETAS: Record<MovimientoPuntos['tipo'], string> = {
  participacion: 'Participación',
  victoria: 'Victoria',
  logro: 'Figura',
  bono: 'Bono',
  penalizacion: 'Penalización',
  canje: 'Canje',
  ajuste: 'Ajuste',
  diario: 'Recompensa diaria',
  mision: 'Misión',
  ranking: 'Ranking semanal',
};

const NOMBRES_TIPO: Record<TipoSkin, string> = { ficha: 'Fichas', carta: 'Cartas', avatar: 'Avatares', fondo: 'Fondos', tema: 'Temas' };

const formatoFecha = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export function PaginaPerfil() {
  const { perfil: sesion } = useSesion();
  const { perfil, movimientos, cargando, error } = usePerfilJuego();
  if (!sesion) return null;
  if (cargando && !perfil) return <Cargando />;
  if (error || !perfil) return <MensajeError mensaje={error ?? 'No se pudo cargar tu perfil'} />;

  return (
    <div className="pila" style={{ marginTop: 16 }}>
      <div className={s.tresColumnas}>
        <Tarjeta titulo="Mi perfil">
          <div className="pila" style={{ alignItems: 'center', textAlign: 'center', gap: 10 }}>
            <Avatar nombre={perfil.nombre} clave={perfil.avatar} tamano={96} />
            <h2>{perfil.nombre}</h2>
            <div className="fila" style={{ justifyContent: 'center' }}>
              <Chip tono="amarillo" icono={<Star size={14} />}>{perfil.puntos} pts</Chip>
              <Chip icono={<Coins size={14} />}>{sesion.fichas} fichas</Chip>
            </div>
            <div className="fila" style={{ justifyContent: 'center' }}>
              <Chip tono="rosa" icono={<Flame size={14} />}>Racha {perfil.racha} (mejor {perfil.mejor_racha})</Chip>
              <Chip tono="verde" icono={<CalendarCheck size={14} />}>{perfil.dias_seguidos} día(s) seguidos</Chip>
            </div>
            <div className="texto-suave">
              Ficha: <b>{sesion.equipo.ficha?.nombre ?? 'Frijolito'}</b> · Cartas: <b>{sesion.equipo.carta?.nombre ?? 'Clásica'}</b>
              <br />
              Fondo: <b>{sesion.equipo.fondo?.nombre ?? 'Feria'}</b> · Tema: <b>{sesion.equipo.tema?.nombre ?? 'Clásico'}</b>
            </div>
            <Link to="/tienda">Cambiar en la tienda</Link>
          </div>
        </Tarjeta>

        <Tarjeta titulo="Estadísticas">
          <Estadisticas perfil={perfil} />
        </Tarjeta>

        <Tarjeta titulo="Colección">
          <div className="pila" style={{ gap: 10 }}>
            <div className="fila" style={{ justifyContent: 'space-between' }}>
              <b>Total</b>
              <span>
                {perfil.skins}/{perfil.skins_total}
              </span>
            </div>
            <Avance valor={perfil.skins} total={perfil.skins_total} tono="verde" />
            {perfil.coleccion.map((c) => (
              <div key={c.tipo}>
                <div className="fila" style={{ justifyContent: 'space-between' }}>
                  <span>{NOMBRES_TIPO[c.tipo]}</span>
                  <span className="texto-suave">
                    {c.tengo}/{c.total}
                  </span>
                </div>
                <Avance valor={c.tengo} total={c.total} />
              </div>
            ))}
            <Link to="/tienda">Completar el álbum</Link>
          </div>
        </Tarjeta>
      </div>

      <div className={s.dosColumnas}>
        <Tarjeta titulo="Últimas partidas">
          {!perfil.historial.length ? (
            <Vacio>Juega tu primera ronda para ver tu historial.</Vacio>
          ) : (
            perfil.historial.map((h) => (
              <div key={h.partida_id} className={s.movimiento}>
                <span>
                  <b>{h.gano ? '🏆 Ganaste' : 'Jugaste'}</b> en {h.sala}
                  <div className="texto-suave">
                    {formatoFecha.format(new Date(h.terminada_en))} · {h.tablas} tabla(s)
                  </div>
                </span>
                <span className={s.positivo}>+{h.puntos}</span>
              </div>
            ))
          )}
        </Tarjeta>

        <Tarjeta titulo="Movimientos de puntos">
          {!movimientos.length ? (
            <Vacio>Aquí verás lo que ganas y canjeas.</Vacio>
          ) : (
            movimientos.map((m) => (
              <div key={m.id} className={s.movimiento}>
                <span>
                  <b>{ETIQUETAS[m.tipo] ?? m.tipo}</b>
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
    </div>
  );
}

function Estadisticas({ perfil }: { perfil: PerfilJuego }) {
  const datos = [
    { etiqueta: 'Partidas', valor: perfil.partidas },
    { etiqueta: 'Victorias', valor: perfil.victorias },
    { etiqueta: 'Efectividad', valor: `${perfil.efectividad} %` },
    { etiqueta: 'Tablas jugadas', valor: perfil.tablas },
    { etiqueta: 'Figuras logradas', valor: perfil.logros },
    { etiqueta: 'Puntos ganados', valor: perfil.puntos_ganados },
  ];
  return (
    <div className="pila" style={{ gap: 12 }}>
      <div className={s.estadisticas}>
        {datos.map((d) => (
          <div key={d.etiqueta} className={s.estadistica}>
            <b>{d.valor}</b>
            <span className="texto-suave">{d.etiqueta}</span>
          </div>
        ))}
      </div>
      {perfil.carta_suerte ? (
        <div className="fila" style={{ flexWrap: 'nowrap' }}>
          <div style={{ width: 70, flexShrink: 0 }}>
            <Carta carta={{ id: perfil.carta_suerte.id, nombre: perfil.carta_suerte.nombre, imagen_url: null }} tamano="chica" />
          </div>
          <span>
            <b>Carta de la suerte</b>
            <div className="texto-suave">
              {perfil.carta_suerte.nombre}: con ella llenaste tu tabla {perfil.carta_suerte.veces} vez/veces
            </div>
          </span>
        </div>
      ) : (
        <p className="texto-suave" style={{ margin: 0 }}>Gana una partida para descubrir tu carta de la suerte.</p>
      )}
      {perfil.figura_favorita && (
        <p className="texto-suave" style={{ margin: 0 }}>
          Figura que más haces: <b>{perfil.figura_favorita.nombre}</b> ({perfil.figura_favorita.veces})
        </p>
      )}
    </div>
  );
}
