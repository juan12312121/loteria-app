import type { HttpClient } from './http';
import type {
  Carta, CartaCantada, Coleccion, EstadoRonda, Equipo, Figura, JugadorSala, LugarRanking, MiTabla,
  MovimientoPuntos, NuevaSala, Partida, Perfil, PerfilJuego, RankingSemanal, ResumenAmigos, ResumenProgreso,
  Revanchas, Sala, SalaMia, SalaPublica, Sesion, Skin, Tabla, TipoSkin,
} from '../tipos';

/**
 * Todas las rutas del API agrupadas por recurso. Las pantallas nunca arman
 * URLs: llaman a estas funciones.
 */
export function crearApi(http: HttpClient) {
  return {
    auth: {
      registro: (datos: { nombre: string; correo: string; password: string }) => http.post<Sesion>('/auth/registro', datos),
      login: (correo: string, password: string) => http.post<Sesion>('/auth/login', { correo, password }),
      yo: () => http.get<Perfil>('/auth/yo'),
    },

    salas: {
      mias: () => http.get<SalaMia[]>('/salas/mias'),
      publicas: () => http.get<SalaPublica[]>('/salas/publicas'),
      obtener: (id: string) => http.get<Sala>(`/salas/${id}`),
      crear: (datos: NuevaSala) => http.post<Sala>('/salas', datos),
      unirse: (codigo: string, password?: string) =>
        http.post<Sala>(`/salas/unirse/${codigo.trim().toUpperCase()}`, password ? { password } : undefined),
      salir: (id: string) => http.post<void>(`/salas/${id}/salir`),
      jugadores: (id: string) => http.get<JugadorSala[]>(`/salas/${id}/jugadores`),
      agregarBot: (id: string) => http.post<{ id: string; nombre: string }>(`/salas/${id}/bots`),
      quitarBot: (id: string, botId: string) => http.delete(`/salas/${id}/bots/${botId}`),
    },

    partidas: {
      /** La ronda más reciente de la sala (o null si nunca se ha abierto una). */
      actualDeSala: async (salaId: string) => {
        const p = await http.pagina<Partida>('/partidas', { sala_id: salaId, orden: '-numero', porPagina: 1 });
        return p.data[0] ?? null;
      },
      crear: (salaId: string) => http.post<Partida>('/partidas', { sala_id: salaId }),
      estado: (id: string) => http.get<EstadoRonda>(`/partidas/${id}/estado`),
      iniciar: (id: string) => http.post<Partida>(`/partidas/${id}/iniciar`),
      pausar: (id: string) => http.post<Partida>(`/partidas/${id}/pausar`),
      reanudar: (id: string) => http.post<Partida>(`/partidas/${id}/reanudar`),
      cancelar: (id: string) => http.post<Partida>(`/partidas/${id}/cancelar`),
      cantar: (id: string) => http.post<{ carta: CartaCantada; quedan: number }>(`/partidas/${id}/cantar`),
      elegirTabla: (id: string, tablaId: string) => http.post<MiTabla>(`/partidas/${id}/tablas`, { tabla_id: tablaId }),
      soltarTabla: (partidaTablaId: string) => http.delete(`/partida-tablas/${partidaTablaId}`),
      marcar: (partidaTablaId: string, marcas: number) => http.patch<MiTabla>(`/partida-tablas/${partidaTablaId}/marcas`, { marcas }),
    },

    catalogo: {
      cartas: () => http.pagina<Carta>('/cartas', { porPagina: 54 }).then((p) => p.data),
      figuras: () => http.pagina<Figura>('/figuras', { porPagina: 50 }).then((p) => p.data),
      tablasOficiales: () => http.pagina<Tabla>('/tablas', { oficial: true, porPagina: 50, orden: 'nombre' }).then((p) => p.data),
    },

    skins: {
      catalogo: (tipo?: TipoSkin) => http.get<Skin[]>('/skins/catalogo', { tipo }),
      coleccion: () => http.get<Coleccion[]>('/skins/coleccion'),
      canjear: (id: string) => http.post<{ skin: Skin; puntos_restantes: number }>(`/skins/${id}/canjear`),
      equipar: (id: string) => http.post<Equipo>(`/skins/${id}/equipar`),
      quitar: (tipo: TipoSkin) => http.delete<Equipo>(`/skins/equipo/${tipo}`),
    },

    puntos: {
      ranking: (limite = 20) => http.get<LugarRanking[]>('/puntos/ranking', { limite }),
      mios: () => http.pagina<MovimientoPuntos>('/puntos/mios', { porPagina: 30 }).then((p) => p.data),
    },

    progreso: {
      resumen: () => http.get<ResumenProgreso>('/progreso'),
      reclamarDiario: () => http.post<{ dias_seguidos: number; puntos: number; saldo: number }>('/progreso/diario'),
      cobrarMision: (clave: string) => http.post<{ puntos: number; saldo: number; skin: Skin | null }>(`/progreso/misiones/${clave}/cobrar`),
      ranking: (limite = 20) => http.get<RankingSemanal>('/progreso/ranking', { limite }),
      perfil: (usuarioId?: string) => http.get<PerfilJuego>(usuarioId ? `/progreso/perfil/${usuarioId}` : '/progreso/perfil'),
      cobrarNivel: () => http.post<{ nivel: number; insignia: { nombre: string; emoji: string }; puntos: number }>('/progreso/nivel'),
      cobrarPase: (nivel: number) => http.post<{ nivel: number; puntos: number; fichas: number }>(`/progreso/pase/${nivel}`),
      cobrarBanco: () => http.post<{ fichas: number; regalo: number }>('/progreso/banco'),
    },

    amigos: {
      resumen: () => http.get<ResumenAmigos>('/amigos'),
      solicitar: (codigo: string) => http.post<{ estado: 'pendiente' | 'aceptada'; amigo: { id: string; nombre: string } }>(
        '/amigos/solicitudes',
        { codigo: codigo.trim().toUpperCase() },
      ),
      aceptar: (id: string) => http.post<ResumenAmigos>(`/amigos/solicitudes/${id}/aceptar`),
      quitar: (id: string) => http.delete(`/amigos/${id}`),
      revanchas: (id: string) => http.get<Revanchas>(`/amigos/${id}/historial`),
    },

    avisos: {
      registrar: (token: string) => http.post<void>('/avisos/dispositivos', { token }),
      quitar: (token: string) => http.delete(`/avisos/dispositivos/${encodeURIComponent(token)}`),
    },
  };
}

export type LoteriaApi = ReturnType<typeof crearApi>;
