import { useState, type FormEvent } from 'react';
import type { Accion, NuevaSala, Sala } from '@loteria/core';
import { Campo, Selector } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';

interface Props {
  accion: Accion<[NuevaSala], Sala>;
  alCrear: (sala: Sala) => void;
}

const VELOCIDADES = [3000, 5000, 8000, 12000].map((ms) => ({ valor: ms, etiqueta: `Cada ${ms / 1000} segundos` }));

export function FormCrearSala({ accion, alCrear }: Props) {
  const [datos, setDatos] = useState<Required<NuevaSala>>({
    nombre: '',
    modo_cantor: 'automatico',
    velocidad_ms: 5000,
    privada: true,
    password: '',
  });
  const fijar = <K extends keyof NuevaSala>(campo: K, valor: Required<NuevaSala>[K]) => setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const sala = await accion.ejecutar({ ...datos, password: datos.password.trim() || undefined });
    if (sala) alCrear(sala);
  };

  return (
    <form onSubmit={enviar} className="pila" style={{ gap: 12 }}>
      <Campo etiqueta="Nombre de la sala" value={datos.nombre} onChange={(e) => fijar('nombre', e.target.value)} placeholder="Sala de la familia" required />
      <div className="fila" style={{ alignItems: 'flex-end' }}>
        <Selector
          etiqueta="Cantor"
          value={datos.modo_cantor}
          onChange={(e) => fijar('modo_cantor', e.target.value as NuevaSala['modo_cantor'] & string)}
          opciones={[
            { valor: 'automatico', etiqueta: 'Automático' },
            { valor: 'manual', etiqueta: 'Yo canto (manual)' },
          ]}
        />
        {datos.modo_cantor === 'automatico' && (
          <Selector etiqueta="Velocidad" value={datos.velocidad_ms} onChange={(e) => fijar('velocidad_ms', Number(e.target.value))} opciones={VELOCIDADES} />
        )}
      </div>
      <label className="fila" style={{ fontWeight: 700 }}>
        <input type="checkbox" checked={datos.privada} onChange={(e) => fijar('privada', e.target.checked)} />
        Privada (solo entran con el código; si no, sale en «Salas públicas»)
      </label>
      <Campo
        etiqueta="Contraseña (opcional)"
        value={datos.password}
        onChange={(e) => fijar('password', e.target.value)}
        placeholder="Déjala vacía si no quieres contraseña"
        minLength={3}
        maxLength={40}
      />
      {accion.error && <p style={{ color: 'var(--rojo)', fontWeight: 700, margin: 0 }}>{accion.error}</p>}
      <Boton type="submit" cargando={accion.cargando}>
        Crear sala y abrir ronda
      </Boton>
    </form>
  );
}
