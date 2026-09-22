import { ScrollView } from 'react-native';
import { Tarjeta, Vacio } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { CodigoSala, ListaJugadores } from '../../componentes/juego/Sala';
import { useComunes } from '../../tema';
import type { ContextoSala } from './tipos';

export function SinRonda({ sala }: ContextoSala) {
  const comunes = useComunes();
  return (
    <ScrollView contentContainerStyle={comunes.contenido}>
      <Tarjeta titulo="Invita a jugar">
        <CodigoSala codigo={sala.sala!.codigo} nombreSala={sala.sala!.nombre} />
      </Tarjeta>
      {sala.esAnfitrion ? (
        <Boton tamano="l" anchoCompleto cargando={sala.nuevaRonda.cargando} alPresionar={() => sala.nuevaRonda.ejecutar()}>
          Abrir nueva ronda
        </Boton>
      ) : (
        <Vacio>Esperando a que el anfitrión abra la ronda…</Vacio>
      )}
      <Tarjeta titulo={`Jugadores (${sala.jugadores.length})`}>
        <ListaJugadores jugadores={sala.jugadores} alQuitarBot={sala.esAnfitrion ? (id) => void sala.bots.quitar.ejecutar(id) : undefined} />
      </Tarjeta>
    </ScrollView>
  );
}
