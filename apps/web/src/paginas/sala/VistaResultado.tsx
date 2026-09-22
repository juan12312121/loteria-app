import { useNavigate } from 'react-router-dom';
import { CASILLAS, indicesDeCasillas, useSesion, type Casilla, type Ganador } from '@loteria/core';
import { Avatar, Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { TablaLoteria } from '../../componentes/juego/TablaLoteria';
import { Confeti } from '../../componentes/ui/Confeti';
import type { ContextoSala } from './tipos';
import s from '../paginas.module.css';

/** Las 16 cartas en orden si la figura cubre toda la tabla (tabla llena). */
const cartasDeCasillas = (casillas: Casilla[] = []) => {
  if (casillas.length !== CASILLAS) return null;
  const cartas = new Array<number>(CASILLAS);
  for (const c of casillas) cartas[c.fila * 4 + c.col] = c.carta;
  return cartas;
};

/** Fin de la ronda: el tablero cantó ¡Lotería!, quién ganó, premio, puntos y figuras. */
export function VistaResultado({ sala, ronda, porId }: ContextoSala) {
  const { perfil } = useSesion();
  const navegar = useNavigate();
  const estado = ronda.estado;
  const ganadores: Ganador[] = ronda.resultado?.ganadores ?? estado?.ganadores ?? [];
  // Si gané, muestro mi tabla y mis puntos; si no, los del primer ganador
  const destacado = ganadores.find((g) => g.usuario_id === perfil?.id) ?? ganadores[0];
  const cartasGanadoras = cartasDeCasillas(destacado?.casillas);
  const nombres = ganadores.map((g) => (g.usuario_id === perfil?.id ? 'Tú' : g.nombre)).join(' y ');
  const carta = ronda.resultado?.carta ?? estado?.partida.indice;
  // El festejo solo cuando se vio en vivo (no al volver a entrar a una ronda vieja)
  const enVivo = !!ronda.resultado && ganadores.length > 0;
  const avatarDe = (usuarioId: string) => estado?.tablasOcupadas.find((t) => t.usuario_id === usuarioId)?.avatar ?? null;

  return (
    <div className="pila">
      {enVivo && <Confeti />}
      <div className={s.resultado}>
        <h2 className={s.grandeTitulo}>{ganadores.length ? '¡LOTERÍA!' : 'Se acabó el mazo'}</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: '8px 0 0' }}>
          {ganadores.length
            ? `El tablero lo cantó: ${nombres} ${ganadores.length > 1 ? 'llenaron' : 'llenó'} la tabla en la carta ${carta}`
            : 'Nadie llenó su tabla; se regresaron las fichas.'}
        </p>
      </div>

      <div className={s.dosColumnas}>
        <div className="pila">
          {cartasGanadoras && destacado && (
            <TablaLoteria
              nombre={`${destacado.tabla ?? 'Tabla ganadora'} de ${destacado.nombre}`}
              cartas={cartasGanadoras}
              porId={porId}
              cantadas={ronda.cantadas}
              marcas={0xffff}
              destacadas={indicesDeCasillas(destacado.casillas!)}
              encender={enVivo}
            />
          )}
          {ganadores.map((g) => (
            <Tarjeta key={g.usuario_id} titulo="Premio del pozo">
              <div className="fila" style={{ justifyContent: 'space-between' }}>
                <span className="fila">
                  <Avatar nombre={g.nombre} clave={avatarDe(g.usuario_id)} />
                  <b>{g.nombre}</b>
                </span>
                <Chip tono="amarillo">+{g.premio} fichas</Chip>
              </div>
            </Tarjeta>
          ))}
        </div>

        <div className="pila">
          {destacado?.puntos && (
            <Tarjeta titulo={`Puntos de ${destacado.usuario_id === perfil?.id ? 'tu victoria' : destacado.nombre}: +${destacado.puntos.total}`}>
              <table className={s.desglose}>
                <tbody>
                  <tr><td>Figura</td><td>+{destacado.puntos.figura}</td></tr>
                  <tr><td>Bono por varias tablas</td><td>+{destacado.puntos.multiTabla}</td></tr>
                  <tr><td>Rapidez</td><td>+{destacado.puntos.rapidez}</td></tr>
                  <tr><td>Racha</td><td>+{destacado.puntos.racha}</td></tr>
                </tbody>
              </table>
            </Tarjeta>
          )}
          <Tarjeta titulo="Figuras de la ronda">
            {estado?.logros.length ? (
              <ul className={s.lista}>
                {estado.logros.map((l) => (
                  <li key={`${l.partida_tabla_id}-${l.clave}`} className={s.avisoRonda}>
                    Carta {l.carta} · <b>{l.nombre}</b> · {l.figura}
                    {l.puntos > 0 && ` · +${l.puntos}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="texto-suave" style={{ margin: 0 }}>Nadie hizo figuras intermedias.</p>
            )}
            <p className="texto-suave">Todos suman +5 pts por cada tabla jugada.</p>
          </Tarjeta>
          <div className="fila">
            {sala.esAnfitrion && (
              <Boton tamano="l" onClick={() => sala.nuevaRonda.ejecutar()} cargando={sala.nuevaRonda.cargando}>
                Siguiente ronda
              </Boton>
            )}
            <Boton variante="fantasma" onClick={() => navegar('/jugar')}>
              Volver al lobby
            </Boton>
          </div>
          {!sala.esAnfitrion && <p className="texto-suave">El anfitrión abre la siguiente ronda.</p>}
        </div>
      </div>
    </div>
  );
}
