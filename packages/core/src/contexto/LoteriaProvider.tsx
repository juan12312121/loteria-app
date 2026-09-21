import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { HttpClient } from '../api/http';
import { crearApi, type LoteriaApi } from '../api/recursos';
import { RealtimeCliente } from '../realtime/RealtimeCliente';
import type { Almacen } from '../almacen';
import type { Perfil, Sesion } from '../tipos';

const CLAVE_TOKEN = 'loteria.token';

interface Servicios {
  api: LoteriaApi;
  realtime: RealtimeCliente;
}

interface EstadoSesion {
  perfil: Perfil | null;
  /** true mientras se revisa si había una sesión guardada */
  iniciando: boolean;
  entrar: (correo: string, password: string) => Promise<void>;
  registrarse: (datos: { nombre: string; correo: string; password: string }) => Promise<void>;
  salir: () => Promise<void>;
  /** Vuelve a pedir el perfil (fichas, puntos, equipo) después de jugar o canjear. */
  refrescar: () => Promise<void>;
}

const ServiciosContext = createContext<Servicios | null>(null);
const SesionContext = createContext<EstadoSesion | null>(null);

interface Props {
  apiUrl: string;
  almacen: Almacen;
  children: ReactNode;
}

/** Crea el cliente del API y el de tiempo real, y maneja la sesión. */
export function LoteriaProvider({ apiUrl, almacen, children }: Props) {
  const token = useRef<string | null>(null);
  const servicios = useMemo<Servicios>(() => {
    const http = new HttpClient(apiUrl, () => token.current);
    return { api: crearApi(http), realtime: new RealtimeCliente(apiUrl) };
  }, [apiUrl]);
  const { api, realtime } = servicios;

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [iniciando, setIniciando] = useState(true);

  const cerrarLocal = useCallback(async () => {
    token.current = null;
    realtime.desconectar();
    setPerfil(null);
    await almacen.borrar(CLAVE_TOKEN);
  }, [almacen, realtime]);

  const abrir = useCallback(
    async (nuevoToken: string) => {
      token.current = nuevoToken;
      realtime.conectar(nuevoToken);
      setPerfil(await api.auth.yo());
    },
    [api, realtime],
  );

  const guardarYAbrir = useCallback(
    async (sesion: Sesion) => {
      await almacen.guardar(CLAVE_TOKEN, sesion.token);
      await abrir(sesion.token);
    },
    [abrir, almacen],
  );

  // Recuperar la sesión guardada al abrir la app
  useEffect(() => {
    let vigente = true;
    almacen
      .leer(CLAVE_TOKEN)
      .then((guardado) => (guardado ? abrir(guardado) : undefined))
      .catch(() => cerrarLocal())
      .finally(() => vigente && setIniciando(false));
    return () => {
      vigente = false;
    };
  }, [abrir, almacen, cerrarLocal]);

  const sesion = useMemo<EstadoSesion>(
    () => ({
      perfil,
      iniciando,
      entrar: async (correo, password) => guardarYAbrir(await api.auth.login(correo, password)),
      registrarse: async (datos) => guardarYAbrir(await api.auth.registro(datos)),
      salir: cerrarLocal,
      refrescar: async () => {
        if (token.current) setPerfil(await api.auth.yo());
      },
    }),
    [api, cerrarLocal, guardarYAbrir, iniciando, perfil],
  );

  return (
    <ServiciosContext.Provider value={servicios}>
      <SesionContext.Provider value={sesion}>{children}</SesionContext.Provider>
    </ServiciosContext.Provider>
  );
}

export function useServicios(): Servicios {
  const s = useContext(ServiciosContext);
  if (!s) throw new Error('useServicios debe usarse dentro de <LoteriaProvider>');
  return s;
}

export function useSesion(): EstadoSesion {
  const s = useContext(SesionContext);
  if (!s) throw new Error('useSesion debe usarse dentro de <LoteriaProvider>');
  return s;
}
