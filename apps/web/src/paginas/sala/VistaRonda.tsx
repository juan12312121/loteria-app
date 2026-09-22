import { Megaphone, Pause, Play, Sparkles, X } from 'lucide-react';
import { useSesion } from '@loteria/core';
import { Chip, Interruptor, Tarjeta, Vacio } from '../../componentes/ui/basicos';
import { cambiarPreferencia, usePreferencias } from '../../preferencias';
import { sonidos } from '../../sonidos';
import { Boton } from '../../componentes/ui/Boton';
import { Cantor, MarcadorLlena, TableroCantor } from '../../componentes/juego/Cantor';
import { useVueloDeCarta } from '../../componentes/juego/vuelo';
import { TablaLoteria } from '../../componentes/juego/TablaLoteria';
import { ListaJugadores } from '../../componentes/juego/Sala';
import type { ContextoSala } from './tipos';
import s from '../paginas.module.css';

/** La ronda en vivo: cantor a la izquierda, mis tablas al centro, tablero y avisos a la derecha. */
export function VistaRonda({ sala, ronda, porId, cartas }: ContextoSala) {
  const { perfil } = useSesion();
  const { autoMarcar } = usePreferencias();
  // La carta recién cantada vuela del cantor a su casilla del tablero
  useVueloDeCarta(ronda.cartaActual?.id, ronda.ultimaCartaEn);
  const datosSala = sala.sala!;
  const estado = ronda.estado;
  if (!estado) return null;

  const pausada = estado.partida.estado === 'pausada';
  const skinFicha = perfil?.equipo.ficha?.clave;
  const skinCarta = perfil?.equipo.carta?.clave;
  const { marcar } = ronda.jugador;
  const tocar = (tablaId: string, indice: number) => {
    const tabla = estado.misTablas.find((t) => t.id === tablaId);
    if (tabla && ronda.cantadas.has(tabla.cartas[indice])) sonidos.ficha();
    marcar(tablaId, indice);
  };
  const { cantar, pausar, reanudar, cancelar } = ronda.anfitrion;

  return (
    <div className={s.tresColumnas}>
      <Tarjeta titulo="El cantor" icono={<Megaphone size={16} />}>
        <Cantor
          carta={ronda.cartaActual}
          ultimas={ronda.ultimas}
          velocidadMs={datosSala.modo_cantor === 'automatico' ? datosSala.velocidad_ms : undefined}
          ultimaCartaEn={ronda.ultimaCartaEn}
          pausada={pausada}
          skinCarta={skinCarta}
        />
        {sala.esAnfitrion && (
          <div className="fila" style={{ marginTop: 12 }}>
            {(datosSala.modo_cantor === 'manual' || pausada) && (
              <Boton tamano="s" onClick={() => cantar.ejecutar()} cargando={cantar.cargando} disabled={pausada}>
                Cantar siguiente
              </Boton>
            )}
            {pausada ? (
              <Boton tamano="s" variante="exito" icono={<Play size={14} />} onClick={() => reanudar.ejecutar()}>
                Reanudar
              </Boton>
            ) : (
              <Boton tamano="s" variante="secundario" icono={<Pause size={14} />} onClick={() => pausar.ejecutar()}>
                Pausar
              </Boton>
            )}
            <Boton tamano="s" variante="fantasma" icono={<X size={14} />} onClick={() => cancelar.ejecutar()}>
              Cancelar ronda
            </Boton>
          </div>
        )}
      </Tarjeta>

      <div className="pila">
        {ronda.masCerca && <MarcadorLlena faltan={ronda.masCerca.faltan} tabla={ronda.masCerca.tabla.nombre} />}
        <Tarjeta
          titulo={`Mis tablas (${estado.misTablas.length})`}
          acciones={<Interruptor etiqueta="Auto-marcar" activo={autoMarcar} alCambiar={(v) => cambiarPreferencia('autoMarcar', v)} />}
        >
          {estado.misTablas.length === 0 ? (
            <Vacio carta={14}>Llegaste con la ronda empezada. Entras en la siguiente.</Vacio>
          ) : (
            <div className={s.tablasMias}>
              {estado.misTablas.map((t) => (
                <TablaLoteria
                  key={t.id}
                  nombre={t.nombre}
                  cartas={t.cartas}
                  porId={porId}
                  cantadas={ronda.cantadas}
                  marcas={t.marcas}
                  destacadas={ronda.destacadas.get(t.id)}
                  skinFicha={skinFicha}
                  skinCarta={skinCarta}
                  alTocarCasilla={(i) => tocar(t.id, i)}
                />
              ))}
            </div>
          )}
        </Tarjeta>
        {pausada && <Chip tono="amarillo">Ronda en pausa</Chip>}
      </div>

      <div className="pila">
        <Tarjeta titulo={`Tablero del cantor (${estado.cantadas.length}/54)`}>
          <TableroCantor cartas={cartas} cantadas={ronda.cantadas} />
        </Tarjeta>
        <Tarjeta titulo="Avisos del tablero" icono={<Sparkles size={16} />}>
          {estado.logros.length === 0 ? (
            <p className="texto-suave" style={{ margin: 0 }}>
              El tablero anuncia aquí las cuatro esquinas y La O.
            </p>
          ) : (
            <div className="pila" style={{ gap: 8 }}>
              {[...estado.logros].reverse().map((l) => (
                <div key={`${l.partida_tabla_id}-${l.clave}`} className={s.avisoRonda}>
                  <span>{l.primero ? '🥇' : '🎉'}</span>
                  <span>
                    <b>{l.usuario_id === perfil?.id ? 'Hiciste' : `${l.nombre} hizo`}</b> ¡{l.figura}! · carta {l.carta}
                    {l.puntos > 0 && ` · +${l.puntos} pts`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Tarjeta>
        <Tarjeta titulo={`Jugadores (${sala.jugadores.length})`}>
          <ListaJugadores jugadores={sala.jugadores} />
        </Tarjeta>
        {skinFicha && <Chip>Ficha: {perfil?.equipo.ficha?.nombre}</Chip>}
      </div>
    </div>
  );
}
