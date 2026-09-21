import { Tarjeta, Vacio } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { CodigoSala, ListaJugadores } from '../../componentes/juego/Sala';
import type { ContextoSala } from './tipos';
import s from '../paginas.module.css';

/** Sala sin ronda abierta (recién creada o la anterior se canceló). */
export function SinRonda({ sala }: ContextoSala) {
  return (
    <div className={s.dosColumnas}>
      <Tarjeta titulo="Invita a jugar">
        <CodigoSala codigo={sala.sala!.codigo} nombreSala={sala.sala!.nombre} />
        <Vacio>
          {sala.esAnfitrion ? (
            <Boton tamano="l" onClick={() => sala.nuevaRonda.ejecutar()} cargando={sala.nuevaRonda.cargando}>
              Abrir nueva ronda
            </Boton>
          ) : (
            'Esperando a que el anfitrión abra la ronda…'
          )}
        </Vacio>
      </Tarjeta>
      <Tarjeta titulo={`Jugadores (${sala.jugadores.length})`}>
        <ListaJugadores jugadores={sala.jugadores} alQuitarBot={sala.esAnfitrion ? (id) => void sala.bots.quitar.ejecutar(id) : undefined} />
      </Tarjeta>
    </div>
  );
}
