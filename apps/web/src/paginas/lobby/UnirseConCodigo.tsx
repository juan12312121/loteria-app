import { useState, type FormEvent } from 'react';
import type { Accion, Sala } from '@loteria/core';
import { Campo } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';

const LARGO_CODIGO = 6;

interface Props {
  accion: Accion<[string, string?], Sala>;
  alEntrar: (sala: Sala) => void;
  /** Viene del enlace de invitación (/jugar?codigo=ABC123) */
  codigoInicial?: string;
}

export function UnirseConCodigo({ accion, alEntrar, codigoInicial = '' }: Props) {
  const [codigo, setCodigo] = useState(codigoInicial.toUpperCase().slice(0, LARGO_CODIGO));
  const [password, setPassword] = useState('');
  // El API contesta "pide contraseña"; hasta entonces se muestra el campo
  const pidePassword = !!accion.error?.toLowerCase().includes('contraseña');

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const sala = await accion.ejecutar(codigo, password || undefined);
    if (sala) alEntrar(sala);
  };

  return (
    <form onSubmit={enviar} className="pila" style={{ gap: 12 }}>
      <Campo
        etiqueta="Código de 6 letras"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, LARGO_CODIGO))}
        placeholder="LE2SKV"
        style={{ fontSize: '1.6rem', letterSpacing: '0.4em', textAlign: 'center', fontWeight: 900 }}
        error={accion.error}
        autoCapitalize="characters"
      />
      {pidePassword && (
        <Campo
          etiqueta="Contraseña de la sala"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="La que te pasaron"
          autoFocus
        />
      )}
      <Boton type="submit" variante="exito" disabled={codigo.length !== LARGO_CODIGO} cargando={accion.cargando}>
        Entrar a la sala
      </Boton>
    </form>
  );
}
