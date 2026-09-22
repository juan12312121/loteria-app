import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { dataUriDeAvatar, papelPicado } from '@loteria/core';
import s from './ui.module.css';

// ---------- Chip ----------
type Tono = 'amarillo' | 'verde' | 'rosa' | 'anil' | 'neutro';

export function Chip({ tono = 'neutro', icono, children }: { tono?: Tono; icono?: ReactNode; children: ReactNode }) {
  return (
    <span className={`${s.chip} ${s[`tono-${tono}`]}`}>
      {icono}
      {children}
    </span>
  );
}

// ---------- Tarjeta ----------
interface TarjetaProps {
  titulo?: ReactNode;
  icono?: ReactNode;
  acciones?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Tarjeta({ titulo, icono, acciones, className, children }: TarjetaProps) {
  return (
    <section className={[s.tarjeta, className].filter(Boolean).join(' ')}>
      {(titulo || acciones) && (
        <header className={s.tarjetaEncabezado}>
          {titulo && (
            <h2 className={s.tarjetaTitulo}>
              {icono}
              {titulo}
            </h2>
          )}
          {acciones}
        </header>
      )}
      {children}
    </section>
  );
}

// ---------- Campos ----------
interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string;
  error?: string | null;
}

export function Campo({ etiqueta, error, id, ...resto }: CampoProps) {
  const campoId = id ?? `campo-${etiqueta.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className={s.campo} htmlFor={campoId}>
      {etiqueta}
      <input id={campoId} aria-invalid={!!error} {...resto} />
      {error && <span className={s.campoError}>{error}</span>}
    </label>
  );
}

interface SelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  etiqueta: string;
  opciones: { valor: string | number; etiqueta: string }[];
}

export function Selector({ etiqueta, opciones, id, ...resto }: SelectorProps) {
  const campoId = id ?? `sel-${etiqueta.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className={s.campo} htmlFor={campoId}>
      {etiqueta}
      <select id={campoId} {...resto}>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
    </label>
  );
}

// ---------- Avatar ----------
const colorDe = (texto: string) => papelPicado[[...texto].reduce((a, c) => a + c.charCodeAt(0), 0) % papelPicado.length];

interface AvatarProps {
  nombre: string;
  /** Clave de la skin de avatar; sin ella se usa la inicial en un círculo de color */
  clave?: string | null;
  tamano?: number;
  conectado?: boolean;
}

export function Avatar({ nombre, clave, tamano = 36, conectado }: AvatarProps) {
  const punto = conectado !== undefined && (
    <span className={s.punto} style={{ background: conectado ? 'var(--verde)' : 'var(--gris)' }} />
  );
  if (clave)
    return (
      <span className={s.avatarDibujo} style={{ width: tamano, height: tamano }} aria-hidden>
        <img src={dataUriDeAvatar(clave)} alt="" draggable={false} />
        {punto}
      </span>
    );
  return (
    <span className={s.avatar} style={{ width: tamano, height: tamano, background: colorDe(nombre), fontSize: tamano * 0.42 }} aria-hidden>
      {nombre.trim().charAt(0).toUpperCase()}
      {punto}
    </span>
  );
}

// ---------- Insignia ----------
interface InsigniaProps {
  insignia: { nombre: string; emoji: string };
  nivel: number;
  /** Versión chica, para ir junto a un nombre en una lista */
  chico?: boolean;
}

/** Insignia y nivel del jugador (sale de los puntos que ha ganado en su vida). */
export function Insignia({ insignia, nivel, chico }: InsigniaProps) {
  return (
    <span className={`${s.insignia} ${chico ? s.insigniaChica : ''}`} title={`${insignia.nombre} · nivel ${nivel}`}>
      <span aria-hidden>{insignia.emoji}</span>
      {!chico && insignia.nombre}
      <b>{nivel}</b>
    </span>
  );
}

// ---------- Interruptor ----------
export function Interruptor({ etiqueta, activo, alCambiar }: { etiqueta: ReactNode; activo: boolean; alCambiar: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={activo} className={s.interruptor} onClick={() => alCambiar(!activo)}>
      <span className={`${s.riel} ${activo ? s.rielActivo : ''}`}>
        <span className={s.perilla} />
      </span>
      {etiqueta}
    </button>
  );
}

// ---------- Barra de avance ----------
export function Avance({ valor, total, tono = 'rosa' }: { valor: number; total: number; tono?: 'rosa' | 'verde' | 'amarillo' }) {
  const pct = total ? Math.min(100, Math.round((valor / total) * 100)) : 0;
  return (
    <span className={s.avance} role="progressbar" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={total}>
      <span className={s.avanceRelleno} style={{ width: `${pct}%`, background: `var(--${tono})` }} />
    </span>
  );
}

// ---------- Papel picado ----------
export { PapelPicado } from './PapelPicado';

// ---------- Estados de carga ----------
export function Cargando({ texto = 'Barajando…' }: { texto?: string }) {
  return (
    <div className={s.estado} role="status">
      <span className={s.girando} />
      {texto}
    </div>
  );
}

export function MensajeError({ mensaje, alReintentar }: { mensaje: string; alReintentar?: () => void }) {
  return (
    <div className={`${s.estado} ${s.estadoError}`} role="alert">
      {mensaje}
      {alReintentar && (
        <button type="button" onClick={alReintentar} className={`${s.boton} ${s.secundario} ${s.s}`}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <div className={s.estado}>{children}</div>;
}

// ---------- Pestañas ----------
interface PestanasProps<T extends string> {
  opciones: { valor: T; etiqueta: string }[];
  valor: T;
  alCambiar: (v: T) => void;
}

export function Pestanas<T extends string>({ opciones, valor, alCambiar }: PestanasProps<T>) {
  return (
    <div className={s.pestanas} role="tablist">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="tab"
          aria-selected={o.valor === valor}
          className={`${s.pestana} ${o.valor === valor ? s.pestanaActiva : ''}`}
          onClick={() => alCambiar(o.valor)}
        >
          {o.etiqueta}
        </button>
      ))}
    </div>
  );
}

// ---------- Avisos flotantes ----------
export function Avisos({ children }: { children: ReactNode }) {
  return (
    <div className={s.avisos} aria-live="polite">
      {children}
    </div>
  );
}

export function Aviso({ icono, error, children }: { icono?: ReactNode; error?: boolean; children: ReactNode }) {
  return (
    <div className={`${s.aviso} ${error ? s.avisoError : ''}`}>
      {icono}
      <span>{children}</span>
    </div>
  );
}
