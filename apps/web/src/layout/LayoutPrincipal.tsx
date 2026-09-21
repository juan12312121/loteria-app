import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Coins, LogOut, Star } from 'lucide-react';
import { useSesion } from '@loteria/core';
import { Avatar, Chip, PapelPicado } from '../componentes/ui/basicos';
import s from './layout.module.css';

const enlaces = [
  { a: '/jugar', texto: 'Jugar' },
  { a: '/tienda', texto: 'Tienda' },
  { a: '/perfil', texto: 'Perfil y ranking' },
];

/** Encabezado con navegación, puntos, fichas y sesión. */
export function LayoutPrincipal() {
  const { perfil, salir } = useSesion();
  const navegar = useNavigate();

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
              <Avatar nombre={perfil.nombre} />
              <button type="button" className={s.salir} onClick={cerrarSesion} aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
