import { Lock } from 'lucide-react';
import type { Consulta, Sala } from '@loteria/core';
import { Cargando, Chip, MensajeError, Vacio } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import s from '../paginas.module.css';

interface Props<T extends Sala> {
  consulta: Consulta<T[]>;
  vacio: string;
  alEntrar: (sala: T) => void;
}

const ESTADO = {
  abierta: { tono: 'amarillo', texto: 'Esperando' },
  jugando: { tono: 'verde', texto: 'En juego' },
  cerrada: { tono: 'neutro', texto: 'Cerrada' },
} as const;

export function ListaSalas<T extends Sala & { jugadores?: number; anfitrion?: string; con_password?: boolean }>({
  consulta,
  vacio,
  alEntrar,
}: Props<T>) {
  if (consulta.cargando && !consulta.data) return <Cargando />;
  if (consulta.error) return <MensajeError mensaje={consulta.error} alReintentar={consulta.recargar} />;
  if (!consulta.data?.length) return <Vacio>{vacio}</Vacio>;

  return (
    <ul className={s.lista}>
      {consulta.data.map((sala) => (
        <li key={sala.id} className={s.filaSala}>
          <div className={s.filaSalaInfo}>
            <div className={s.filaSalaNombre}>
              {sala.nombre}
              {sala.con_password && <Lock size={14} aria-label="Pide contraseña" />}
            </div>
            <div className="texto-suave">
              {sala.anfitrion ? `De ${sala.anfitrion}` : `Código ${sala.codigo}`}
              {sala.jugadores !== undefined && ` · ${sala.jugadores}/${sala.max_jugadores} jugadores`}
              {sala.costo_tabla > 0 && ` · ${sala.costo_tabla} fichas por tabla`}
            </div>
          </div>
          <Chip tono={ESTADO[sala.estado].tono}>{ESTADO[sala.estado].texto}</Chip>
          <Boton tamano="s" variante="secundario" onClick={() => alEntrar(sala)}>
            Entrar
          </Boton>
        </li>
      ))}
    </ul>
  );
}
