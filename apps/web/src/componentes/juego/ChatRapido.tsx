import { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { CLAVES_FRASE, FRASES, type BurbujaFrase, type ClaveFrase, type ElementoCola } from '@loteria/core';
import { Avatar } from '../ui/basicos';
import s from './chat.module.css';

const ESPERA_MS = 1500;

/** Botones de frases fijas (nada de texto libre: no hay nada que moderar). */
export function ChatRapido({ alEnviar }: { alEnviar: (clave: ClaveFrase) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [espera, setEspera] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const enviar = (clave: ClaveFrase) => {
    alEnviar(clave);
    setAbierto(false);
    setEspera(true);
    temporizador.current = setTimeout(() => setEspera(false), ESPERA_MS);
  };

  return (
    <div className={s.chat}>
      {abierto && (
        <div className={s.frases} role="menu">
          {CLAVES_FRASE.map((clave) => (
            <button key={clave} type="button" role="menuitem" className={s.frase} onClick={() => enviar(clave)} disabled={espera}>
              {FRASES[clave]}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className={s.boton}
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-label="Chat rápido"
        title="Chat rápido"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}

/** Globitos de lo que dicen los demás, abajo a la izquierda. */
export function BurbujasChat({ burbujas }: { burbujas: ElementoCola<BurbujaFrase>[] }) {
  return (
    <div className={s.burbujas} aria-live="polite">
      {burbujas.map(({ id, valor }) => (
        <div key={id} className={s.burbuja}>
          <Avatar nombre={valor.nombre} clave={valor.avatar} tamano={28} />
          <span>
            <b>{valor.nombre}:</b> {valor.texto}
          </span>
        </div>
      ))}
    </div>
  );
}
