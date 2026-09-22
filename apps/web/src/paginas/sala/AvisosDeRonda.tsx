import type { AvisoRonda, ElementoCola } from '@loteria/core';
import { Aviso, Avisos } from '../../componentes/ui/basicos';

/** Toasts en vivo: figuras que el tablero detectó (la ronda sigue hasta tabla llena). */
export function AvisosDeRonda({ avisos }: { avisos: ElementoCola<AvisoRonda>[] }) {
  return (
    <Avisos>
      {avisos.map(({ id, valor: { evento, mio } }) => (
        <Aviso key={id} icono={evento.primero ? '🥇' : '🎉'}>
          {mio ? 'Hiciste' : `${evento.nombre} hizo`} <b>¡{evento.figura.nombre}!</b>
          {evento.puntos > 0 && ` +${evento.puntos} pts`} · Ya nadie más puede hacerla; sigue la ronda hasta tabla llena
        </Aviso>
      ))}
    </Avisos>
  );
}
