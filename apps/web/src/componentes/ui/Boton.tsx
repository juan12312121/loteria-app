import type { ButtonHTMLAttributes, ReactNode } from 'react';
import s from './ui.module.css';

type Variante = 'primario' | 'secundario' | 'exito' | 'peligro' | 'fantasma';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamano?: 's' | 'm' | 'l';
  anchoCompleto?: boolean;
  cargando?: boolean;
  icono?: ReactNode;
}

export function Boton({
  variante = 'primario',
  tamano = 'm',
  anchoCompleto = false,
  cargando = false,
  icono,
  children,
  disabled,
  className,
  type = 'button',
  ...resto
}: Props) {
  const clases = [s.boton, s[variante], s[tamano], anchoCompleto && s.ancho, className].filter(Boolean).join(' ');
  return (
    <button type={type} className={clases} disabled={disabled || cargando} aria-busy={cargando} {...resto}>
      {icono}
      {cargando ? 'Un momento…' : children}
    </button>
  );
}
