import { Bot, Check } from 'lucide-react';
import { dataUriDeCarta, MAX_TABLAS_POR_JUGADOR, useSesion, type Tabla } from '@loteria/core';
import { Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { MiniFigura } from '../../componentes/juego/Cantor';
import { CodigoSala, ListaJugadores } from '../../componentes/juego/Sala';
import type { ContextoSala } from './tipos';
import s from '../paginas.module.css';

/** Antes de iniciar: invitar, ver las reglas y elegir tablas. */
export function VistaEspera({ sala, ronda }: ContextoSala) {
  const { perfil } = useSesion();
  const datosSala = sala.sala!;
  const estado = ronda.estado;
  const misTablas = estado?.misTablas ?? [];
  const ocupadas = estado?.tablasOcupadas ?? [];
  const tablasDe = (usuarioId: string) => ocupadas.filter((t) => t.usuario_id === usuarioId).length;
  const lleno = misTablas.length >= MAX_TABLAS_POR_JUGADOR;
  const { elegirTabla, soltarTabla } = ronda.jugador;

  const alTocar = (tabla: Tabla) => {
    const mia = misTablas.find((t) => t.tabla_id === tabla.id);
    if (mia) void soltarTabla.ejecutar(mia.id);
    else void elegirTabla.ejecutar(tabla.id);
  };

  return (
    <div className={s.tresColumnas}>
      <div className="pila">
        <Tarjeta titulo="Invita con el código">
          <CodigoSala codigo={datosSala.codigo} nombreSala={datosSala.nombre} />
        </Tarjeta>
        <Tarjeta titulo="Reglas de la ronda">
          {sala.figuraFinal && (
            <div className={s.regla}>
              <MiniFigura mascara={sala.figuraFinal.mascaras[0]} />
              <div>
                <b>Se gana con: {sala.figuraFinal.nombre}</b>
                <div className="texto-suave">El tablero canta ¡Lotería! solito; nadie tiene que gritar</div>
              </div>
            </div>
          )}
          {sala.figurasAnunciadas.map((f) => (
            <div key={f.id} className={s.regla}>
              <MiniFigura mascara={f.mascaras[0]} />
              <div>
                <b>Se anuncia: {f.nombre}</b>
                <div className="texto-suave">+{f.puntos} pts al primero · la ronda sigue</div>
              </div>
            </div>
          ))}
          <div className="fila" style={{ marginTop: 8 }}>
            <Chip>{datosSala.modo_cantor === 'automatico' ? `Cantor cada ${datosSala.velocidad_ms / 1000} s` : 'Canta el anfitrión'}</Chip>
            {datosSala.costo_tabla > 0 && <Chip>{datosSala.costo_tabla} fichas por tabla</Chip>}
            <Chip tono="amarillo">Pozo: {estado?.partida.pozo ?? 0} fichas</Chip>
          </div>
        </Tarjeta>
      </div>

      <Tarjeta titulo={`Elige tus tablas (${misTablas.length} de ${MAX_TABLAS_POR_JUGADOR})`}>
        <p className="texto-suave" style={{ marginTop: 0 }}>
          Juega las que quieras: cada tabla cuesta {datosSala.costo_tabla} fichas y te da +5 pts al terminar.
        </p>
        {(elegirTabla.error || soltarTabla.error) && (
          <p style={{ color: 'var(--rojo)', fontWeight: 700, marginTop: 0 }}>{elegirTabla.error ?? soltarTabla.error}</p>
        )}
        <div className={s.selectorTablas}>
          {sala.tablasOficiales.map((t) => {
            const mia = misTablas.some((m) => m.tabla_id === t.id);
            const deOtro = ocupadas.find((o) => o.tabla_id === t.id && o.usuario_id !== perfil?.id);
            return (
              <button
                key={t.id}
                type="button"
                className={`${s.opcionTabla} ${mia ? s.opcionMia : ''}`}
                disabled={!!deOtro || (!mia && lleno) || elegirTabla.cargando || soltarTabla.cargando}
                onClick={() => alTocar(t)}
                aria-pressed={mia}
              >
                <div className="fila" style={{ justifyContent: 'space-between' }}>
                  {t.nombre}
                  {mia && <Check size={16} color="var(--rosa)" />}
                </div>
                <div className={s.miniRejilla} aria-hidden>
                  {t.cartas.map((c) => (
                    <img key={c} src={dataUriDeCarta(c)} alt="" loading="lazy" />
                  ))}
                </div>
                {deOtro && <div className="texto-suave">de {deOtro.nombre}</div>}
              </button>
            );
          })}
        </div>
      </Tarjeta>

      <div className="pila">
        <Tarjeta titulo={`Jugadores (${sala.jugadores.length}/${datosSala.max_jugadores})`}>
          <ListaJugadores
            jugadores={sala.jugadores}
            detalle={(j) => `${tablasDe(j.id)} tabla(s)`}
            alQuitarBot={sala.esAnfitrion ? (id) => void sala.bots.quitar.ejecutar(id) : undefined}
          />
          {sala.esAnfitrion && (
            <div style={{ marginTop: 10 }}>
              <Boton
                variante="secundario"
                tamano="s"
                icono={<Bot size={16} />}
                onClick={() => sala.bots.agregar.ejecutar()}
                cargando={sala.bots.agregar.cargando}
                disabled={sala.jugadores.length >= datosSala.max_jugadores}
              >
                Agregar bot
              </Boton>
              <p className="texto-suave" style={{ margin: '6px 0 0' }}>
                ¿Faltan jugadores? Los bots eligen sus tablas y el tablero los revisa igual que a todos.
              </p>
              {(sala.bots.agregar.error || sala.bots.quitar.error) && (
                <p style={{ color: 'var(--rojo)', fontWeight: 700, margin: '6px 0 0' }}>{sala.bots.agregar.error ?? sala.bots.quitar.error}</p>
              )}
            </div>
          )}
        </Tarjeta>
        {sala.esAnfitrion ? (
          <>
            <Boton tamano="l" anchoCompleto onClick={() => ronda.anfitrion.iniciar.ejecutar()} cargando={ronda.anfitrion.iniciar.cargando} disabled={!ocupadas.length}>
              Iniciar ronda
            </Boton>
            {ronda.anfitrion.iniciar.error && <p style={{ color: 'var(--rojo)', fontWeight: 700 }}>{ronda.anfitrion.iniciar.error}</p>}
          </>
        ) : (
          <p className="texto-suave" style={{ textAlign: 'center' }}>
            Esperando a que el anfitrión inicie…
          </p>
        )}
      </div>
    </div>
  );
}
