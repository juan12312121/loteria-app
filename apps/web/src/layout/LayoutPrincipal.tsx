import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Coins, LogOut, Palette, Settings, Star, Volume2, WifiOff } from 'lucide-react';
import { TEMA_POR_DEFECTO, useConexion, useProgreso, useSesion } from '@loteria/core';
import { Avatar, Chip, Interruptor, PapelPicado } from '../componentes/ui/basicos';
import { cambiarPreferencia, usePreferencias } from '../preferencias';
import s from './layout.module.css';

const enlaces = [
  { a: '/jugar', texto: 'Jugar' },
  { a: '/misiones', texto: 'Misiones' },
  { a: '/tienda', texto: 'Tienda' },
  { a: '/ranking', texto: 'Ranking' },
  { a: '/perfil', texto: 'Perfil' },
];

/** Encabezado con navegación, puntos, fichas, ajustes y sesión. */
export function LayoutPrincipal() {
  const { perfil, salir } = useSesion();
  const navegar = useNavigate();
  const conexion = useConexion();
  const tema = perfil?.equipo.tema?.clave ?? TEMA_POR_DEFECTO;
  const porCobrar = usePorCobrar(perfil?.puntos);

  // El tema equipado solo aplica dentro del juego (la landing se queda clásica)
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
                {e.a === '/misiones' && porCobrar > 0 && (
                  <span className={s.globito} aria-label={`${porCobrar} por cobrar`}>
                    {porCobrar}
                  </span>
                )}
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

/**
 * Cuántas cosas hay por cobrar (recompensa de hoy + misiones listas). Se revisa
 * al cambiar de página y cuando cambian los puntos (al cobrar o al terminar una ronda).
 */
function usePorCobrar(puntos: number | undefined) {
  const { porCobrar, recargar } = useProgreso();
  const { pathname } = useLocation();
  useEffect(() => {
    void recargar();
  }, [pathname, puntos, recargar]);
  return porCobrar;
}

/** Sonido (se guarda en este navegador) y atajo a los temas de la tienda. */
function MenuAjustes() {
  const [abierto, setAbierto] = useState(false);
  const { sonido } = usePreferencias();
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
          <Link to="/tienda?tipo=tema" className={s.enlaceMenu} onClick={() => setAbierto(false)}>
            <Palette size={16} /> Cambiar tema de colores
          </Link>
        </div>
      )}
    </div>
  );
}
