import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mensajeDeError, useSesion } from '@loteria/core';
import { Campo, PapelPicado, Pestanas } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { Carta } from '../../componentes/juego/Carta';
import s from './entrar.module.css';

type Modo = 'entrar' | 'registro';

const ASOMADAS = [
  { id: 1, nombre: 'El Gallo', imagen_url: null },
  { id: 46, nombre: 'El Sol', imagen_url: null },
  { id: 6, nombre: 'La Sirena', imagen_url: null },
];

const TEXTOS: Record<Modo, { titulo: string; bajada: string; boton: string }> = {
  entrar: { titulo: '¡Qué gusto verte!', bajada: 'Entra para seguir jugando con tu gente.', boton: 'Entrar' },
  registro: { titulo: 'Arma tu primera tabla', bajada: 'Crea tu cuenta en 20 segundos. Te regalamos 100 fichas.', boton: 'Crear cuenta' },
};

export function PaginaEntrar() {
  const { perfil, entrar, registrarse } = useSesion();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const destino = (useLocation().state as { desde?: string } | null)?.desde ?? '/jugar';
  const [modo, setModo] = useState<Modo>(parametros.get('modo') === 'registro' ? 'registro' : 'entrar');
  const [datos, setDatos] = useState({ nombre: '', correo: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (perfil) return <Navigate to={destino} replace />;

  const texto = TEXTOS[modo];
  const cambiar = (campo: keyof typeof datos) => (e: ChangeEvent<HTMLInputElement>) => setDatos((d) => ({ ...d, [campo]: e.target.value }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      if (modo === 'entrar') await entrar(datos.correo, datos.password);
      else await registrarse(datos);
      navegar(destino, { replace: true });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={s.pagina}>
      <PapelPicado />
      <Link to="/" className={s.volver}>
        <ArrowLeft size={18} /> Volver
      </Link>

      <main className={s.centro}>
        <div className={s.asomadas} aria-hidden>
          {ASOMADAS.map((c) => (
            <div key={c.id} className={s.asomada}>
              <Carta carta={c} tamano="mediana" />
            </div>
          ))}
        </div>

        <form onSubmit={enviar} className={s.tarjeta}>
          <Link to="/" className={s.logo}>
            ¡Lotería!
          </Link>
          <h1 className={s.titulo}>{texto.titulo}</h1>
          <p className={s.bajada}>{texto.bajada}</p>

          <div className={s.pestanas}>
            <Pestanas<Modo>
              opciones={[
                { valor: 'entrar', etiqueta: 'Iniciar sesión' },
                { valor: 'registro', etiqueta: 'Soy nuevo' },
              ]}
              valor={modo}
              alCambiar={(m) => {
                setModo(m);
                setError(null);
              }}
            />
          </div>

          {modo === 'registro' && (
            <Campo etiqueta="¿Cómo te dicen?" value={datos.nombre} onChange={cambiar('nombre')} required minLength={2} autoComplete="nickname" placeholder="Lupe" />
          )}
          <Campo etiqueta="Correo" type="email" value={datos.correo} onChange={cambiar('correo')} required autoComplete="email" placeholder="tu@correo.com" />
          <Campo
            etiqueta="Contraseña"
            type="password"
            value={datos.password}
            onChange={cambiar('password')}
            required
            minLength={6}
            autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
            placeholder={modo === 'registro' ? 'Mínimo 6 caracteres' : ''}
          />
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
          <Boton type="submit" tamano="l" anchoCompleto cargando={enviando}>
            {texto.boton}
          </Boton>
        </form>

        <p className={s.pie}>🎁 Cuentas nuevas reciben 100 fichas · Tus puntos se guardan para canjear skins</p>
      </main>
    </div>
  );
}
