import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { dataUriDeFondo, useCartas, useChatSala, useEventoSala, usePartida, useSala, useSesion } from '@loteria/core';
import { Cargando, Chip, MensajeError } from '../../componentes/ui/basicos';
import { BurbujasChat, ChatRapido } from '../../componentes/juego/ChatRapido';
import { usePreferencias } from '../../preferencias';
import { sonidos } from '../../sonidos';
import { VistaEspera } from './VistaEspera';
import { VistaRonda } from './VistaRonda';
import { VistaResultado } from './VistaResultado';
import { SinRonda } from './SinRonda';
import { AvisosDeRonda } from './AvisosDeRonda';
import s from '../paginas.module.css';

/**
 * Una sala = un espacio de juego independiente. La vista cambia sola según
 * el estado de la ronda (llega en vivo): espera → ronda → resultado.
 */
export function PaginaSala() {
  const { salaId = '' } = useParams();
  const { perfil } = useSesion();
  const { autoMarcar, tema } = usePreferencias();
  const sala = useSala(salaId);
  const ronda = usePartida(sala.partida?.id ?? null, { autoMarcar });
  const { porId, cartas } = useCartas();
  const chat = useChatSala(salaId, sala.jugadores);

  // Sonidos de la ronda
  useEventoSala('carta:cantada', () => sonidos.carta());
  useEventoSala('figura:lograda', () => sonidos.figura());
  useEventoSala('partida:ganadores', (e) => e.ganadores.length > 0 && sonidos.loteria());
  useEventoSala('sala:frase', (e) => e.usuarioId !== perfil?.id && sonidos.frase());

  useFondoDeSala(perfil?.equipo.fondo?.clave, tema === 'noche');

  if (sala.cargando && !sala.sala) return <Cargando texto="Entrando a la sala…" />;
  if (!sala.sala) return <MensajeError mensaje={sala.error ?? 'No encontramos la sala'} />;

  // El estado más reciente: el de la ronda en vivo si es la misma partida
  const estado = (ronda.estado?.partida.id === sala.partida?.id ? ronda.estado?.partida.estado : undefined) ?? sala.partida?.estado;
  const contexto = { sala, ronda, porId, cartas };

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between', margin: '8px 0 16px' }}>
        <div className="fila">
          <Link to="/jugar" aria-label="Volver al lobby" className="fila" style={{ fontWeight: 800 }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className={s.titulo} style={{ margin: 0 }}>
            {sala.sala.nombre}
          </h1>
          {sala.partida && <Chip tono="anil">Ronda {sala.partida.numero}</Chip>}
        </div>
        <div className="fila">
          {sala.figuraFinal && <Chip tono="rosa">Gana: {sala.figuraFinal.nombre}</Chip>}
          <Chip>Código {sala.sala.codigo}</Chip>
        </div>
      </div>

      {!sala.partida || estado === 'cancelada' ? (
        <SinRonda {...contexto} />
      ) : estado === 'preparando' ? (
        <VistaEspera {...contexto} />
      ) : estado === 'cantando' || estado === 'pausada' ? (
        <VistaRonda {...contexto} />
      ) : (
        <VistaResultado {...contexto} />
      )}

      <AvisosDeRonda avisos={ronda.avisos.items} />
      <BurbujasChat burbujas={chat.burbujas} />
      <ChatRapido alEnviar={chat.enviar} />
    </>
  );
}

/** Pone detrás de la sala el fondo que el jugador trae equipado (y lo quita al salir). */
function useFondoDeSala(clave: string | undefined, noche: boolean) {
  useEffect(() => {
    const cuerpo = document.body.style;
    const mosaico = `url("${dataUriDeFondo(clave)}")`;
    // De noche se oscurece con un velo para que no deslumbre
    cuerpo.backgroundImage = noche ? `linear-gradient(rgb(27 21 48 / 0.88), rgb(27 21 48 / 0.88)), ${mosaico}` : mosaico;
    cuerpo.backgroundAttachment = 'fixed';
    return () => {
      cuerpo.backgroundImage = '';
      cuerpo.backgroundAttachment = '';
    };
  }, [clave, noche]);
}
