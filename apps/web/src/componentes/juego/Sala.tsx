import { useState } from 'react';
import { Bot, Check, Copy, Crown, MessageCircle, X } from 'lucide-react';
import type { JugadorSala } from '@loteria/core';
import { Avatar, Chip } from '../ui/basicos';
import { Boton } from '../ui/Boton';
import s from './juego.module.css';

/** Código de invitación en casillas, con copiar y compartir por WhatsApp. */
export function CodigoSala({ codigo, nombreSala }: { codigo: string; nombreSala: string }) {
  const [copiado, setCopiado] = useState(false);
  const enlace = `${window.location.origin}/jugar?codigo=${codigo}`;
  const texto = `¡Vente a jugar lotería a "${nombreSala}"! Entra aquí: ${enlace} (código ${codigo})`;

  const copiar = async () => {
    await navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="pila" style={{ gap: 12 }}>
      <div className={s.codigo} aria-label={`Código ${codigo}`}>
        {[...codigo].map((l, i) => (
          <span key={i} className={s.letra}>
            {l}
          </span>
        ))}
      </div>
      <div className="fila" style={{ justifyContent: 'center' }}>
        <Boton variante="secundario" tamano="s" icono={copiado ? <Check size={16} /> : <Copy size={16} />} onClick={copiar}>
          {copiado ? '¡Copiado!' : 'Copiar'}
        </Boton>
        <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer">
          <Boton variante="exito" tamano="s" icono={<MessageCircle size={16} />}>
            Compartir por WhatsApp
          </Boton>
        </a>
      </div>
    </div>
  );
}

interface ListaProps {
  jugadores: JugadorSala[];
  /** Texto extra por jugador (p. ej. "3 tablas") */
  detalle?: (j: JugadorSala) => string | undefined;
  /** Solo el anfitrión, fuera de ronda: quitar un bot */
  alQuitarBot?: (botId: string) => void;
}

/** Jugadores de la sala con su avatar y estado de conexión. */
export function ListaJugadores({ jugadores, detalle, alQuitarBot }: ListaProps) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {jugadores.map((j) => (
        <li key={j.id} className={s.jugador}>
          <Avatar nombre={j.nombre} clave={j.avatar} conectado={j.conectado} />
          <span className={s.jugadorNombre}>
            {j.nombre}
            {detalle?.(j) && <span className={s.jugadorDetalle}> · {detalle(j)}</span>}
          </span>
          {j.rol === 'anfitrion' && (
            <Chip tono="amarillo" icono={<Crown size={14} />}>
              Anfitrión
            </Chip>
          )}
          {j.bot && (
            <Chip icono={<Bot size={14} />}>Bot</Chip>
          )}
          {j.bot && alQuitarBot && (
            <button type="button" className={s.quitar} onClick={() => alQuitarBot(j.id)} aria-label={`Quitar a ${j.nombre}`} title="Quitar bot">
              <X size={16} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
