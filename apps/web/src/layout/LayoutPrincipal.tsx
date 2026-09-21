import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Coins, LogOut, Moon, Settings, Star, Volume2, WifiOff } from 'lucide-react';
import { useConexion, useSesion } from '@loteria/core';
import { Avatar, Chip, Interruptor, PapelPicado } from '../componentes/ui/basicos';
import { cambiarPreferencia, usePreferencias } from '../preferencias';
import s from './layout.module.css';

const enlaces = [
  { a: '/jugar', texto: 'Jugar' },
  { a: '/tienda', texto: 'Tienda' },
  { a: '/ranking', texto: 'Ranking' },
  { a: '/perfil', texto: 'Perfil' },
];

/** Encabezado con navegación, puntos, fichas, ajustes y sesión. */
export function LayoutPrincipal() {
  const { perfil, salir } = useSesion();
  const navegar = useNavigate();
  const conexion = useConexion();
  const { tema } = usePreferencias();

  // El modo noche solo aplica dentro del juego (la landing se queda clara)
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    return () => {
      delete document.documentElement.dataset.tema;
    };
  }, [tema]);

  const cerrarSesion = async () => {
    await salir();
    navegar('/');
  };

  return (
    <>
      <PapelPicado alto={34} />
      <header className={s.encabezado}>
        <div className={`contenedor ${s.barra}`}>
          <NavLink to="/jugar" className={s.logo}>
            ¡Lotería!
          </NavLink>
          <nav className={s.nav}>
            {enlaces.map((e) => (
              <NavLink key={e.a} to={e.a} end className={({ isActive }) => `${s.enlace} ${isActive ? s.activo : ''}`}>
                {e.texto}
              </NavLink>
            ))}
          </nav>
          {perfil && (
            <div className={s.usuario}>
              <Chip tono="amarillo" icono={<Star size={14} />}>
                {perfil.puntos} pts
              </Chip>
              <Chip icono={<Coins size={14} />}>{perfil.fichas} fichas</Chip>
              <NavLink to="/perfil" aria-label="Mi perfil" title={perfil.nombre}>
                <Avatar nombre={perfil.nombre} clave={perfil.equipo.avatar?.clave} />
              </NavLink>
              <MenuAjustes />
              <button type="button" className={s.icono} onClick={cerrarSesion} aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>
      {conexion === 'reconectando' && (
        <div className={s.sinConexion} role="status">
          <WifiOff size={16} /> Se fue la conexión… reconectando. Tus marcas están guardadas.
        </div>
      )}
      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}

/** Sonido y modo noche (se guardan en este navegador). */
function MenuAjustes() {
  const [abierto, setAbierto] = useState(false);
  const { sonido, tema } = usePreferencias();
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, [abierto]);

  return (
    <div className={s.ajustes} ref={caja}>
      <button
        type="button"
        className={s.icono}
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-label="Ajustes"
        title="Ajustes"
      >
        <Settings size={18} />
      </button>
      {abierto && (
        <div className={s.menu} role="dialog" aria-label="Ajustes">
          <Interruptor
            etiqueta={
              <>
                <Volume2 size={16} /> Sonidos
              </>
            }
            activo={sonido}
            alCambiar={(v) => cambiarPreferencia('sonido', v)}
          />
          <Interruptor
            etiqueta={
              <>
                <Moon size={16} /> Noche de feria
              </>
            }
            activo={tema === 'noche'}
            alCambiar={(v) => cambiarPreferencia('tema', v ? 'noche' : 'claro')}
          />
        </div>
      )}
    </div>
  );
}
