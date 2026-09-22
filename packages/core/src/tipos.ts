/** Tipos del dominio, espejo de lo que devuelve la API de Lotería. */

export type Rol = 'jugador' | 'admin' | 'bot';
export const TIPOS_SKIN = ['ficha', 'carta', 'avatar', 'fondo', 'tema'] as const;
export type TipoSkin = (typeof TIPOS_SKIN)[number];
export type Rareza = 'comun' | 'rara' | 'epica' | 'legendaria';
export type ModoCantor = 'automatico' | 'manual';
export type EstadoSala = 'abierta' | 'jugando' | 'cerrada';
export type EstadoPartida = 'preparando' | 'cantando' | 'pausada' | 'terminada' | 'cancelada';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  fichas: number;
  puntos: number;
  racha: number;
  mejor_racha?: number;
  dias_seguidos?: number;
}

export interface SkinResumen {
  id: string;
  clave: string;
  nombre: string;
  imagen_url: string | null;
}

export type Equipo = Record<TipoSkin, SkinResumen | null>;

export interface Perfil extends Usuario {
  equipo: Equipo;
}

export interface Sesion {
  usuario: Usuario;
  token: string;
}

export interface Carta {
  id: number;
  nombre: string;
  verso: string;
  imagen_url: string | null;
}

export interface Figura {
  id: number;
  clave: string;
  nombre: string;
  mascaras: number[];
  descripcion: string;
  puntos: number;
  intermedia: boolean;
}

export interface Tabla {
  id: string;
  nombre: string;
  cartas: number[];
  oficial: boolean;
}

export interface Sala {
  id: string;
  codigo: string;
  nombre: string;
  anfitrion_id: string;
  figura_id: number;
  modo_cantor: ModoCantor;
  velocidad_ms: number;
  max_jugadores: number;
  /** Fijo para todas las salas (reglas del juego) */
  costo_tabla: number;
  privada: boolean;
  estado: EstadoSala;
  creado_en: string;
}

export interface SalaMia extends Sala {
  mi_rol: 'anfitrion' | 'jugador';
  jugadores: number;
}

/** Sala pública del lobby (para entrar sin código). */
export interface SalaPublica extends Sala {
  anfitrion: string;
  jugadores: number;
  soy_miembro: boolean;
}

/** Lo que decide el anfitrión. Costo y tablas por jugador son reglas fijas del juego. */
export interface NuevaSala {
  nombre: string;
  modo_cantor?: ModoCantor;
  velocidad_ms?: number;
  privada?: boolean;
}

export interface JugadorSala {
  id: string;
  nombre: string;
  rol: 'anfitrion' | 'jugador';
  conectado: boolean;
  bot: boolean;
  avatar: string | null;
}

export interface Partida {
  id: string;
  sala_id: string;
  numero: number;
  figura_id: number;
  indice: number;
  pozo: number;
  estado: EstadoPartida;
  iniciada_en: string | null;
  terminada_en: string | null;
}

export interface CartaCantada extends Carta {
  orden: number;
}

export interface MiTabla {
  id: string;
  tabla_id: string;
  nombre: string;
  cartas: number[];
  marcas: number;
  quemada: boolean;
}

export interface TablaOcupada {
  tabla_id: string;
  usuario_id: string;
  nombre: string;
  skin_ficha: string | null;
  skin_carta: string | null;
  avatar: string | null;
  bot: boolean;
}

export interface LogroRonda {
  usuario_id: string;
  nombre: string;
  partida_tabla_id: string;
  clave: string;
  figura: string;
  carta: number;
  primero: boolean;
  puntos: number;
  /** Casillas de la figura (bit i = casilla i) */
  mascara: number;
}

export interface Ganador {
  usuario_id: string;
  nombre: string;
  premio: number;
  /** Solo en el anuncio en vivo: la tabla ganadora, sus casillas y sus puntos */
  tabla?: string;
  casillas?: Casilla[];
  puntos?: DesglosePuntos;
}

export interface EstadoRonda {
  partida: Partida;
  figuraFinal: Figura;
  cantadas: CartaCantada[];
  misTablas: MiTabla[];
  tablasOcupadas: TablaOcupada[];
  logros: LogroRonda[];
  ganadores: Ganador[];
}

/** Coordenada de una casilla de la tabla (0–3) y la carta que tiene. */
export interface Casilla {
  fila: number;
  col: number;
  carta: number;
}

export interface DesglosePuntos {
  figura: number;
  multiTabla: number;
  rapidez: number;
  racha: number;
  total: number;
}

export interface Skin {
  id: string;
  tipo: TipoSkin;
  clave: string;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  precio_puntos: number;
  rareza: Rareza;
  /** 'MM-DD': solo se vende en esas fechas */
  temporada_inicio: string | null;
  temporada_fin: string | null;
  /** Solo se gana (misión o ranking) */
  exclusiva: boolean;
  /** Se puede comprar hoy */
  disponible?: boolean;
  la_tengo?: boolean;
  equipada?: boolean;
}

export interface Coleccion {
  tipo: TipoSkin;
  tengo: number;
  total: number;
}

export interface MovimientoPuntos {
  id: string;
  tipo: 'participacion' | 'victoria' | 'logro' | 'bono' | 'penalizacion' | 'canje' | 'ajuste' | 'diario' | 'mision' | 'ranking';
  monto: number;
  saldo_despues: number;
  detalle: string;
  creado_en: string;
}

export interface LugarRanking {
  id: string;
  nombre: string;
  puntos: number;
  racha: number;
  skin_ficha: string | null;
}

// ---------- progreso ----------

export interface Diario {
  disponible: boolean;
  dias_seguidos: number;
  /** Lo que da hoy (o lo que dio si ya lo cobró) */
  puntos: number;
  escala: number[];
}

export interface Mision {
  clave: string;
  periodo: 'diaria' | 'semanal' | 'siempre';
  titulo: string;
  meta: number;
  puntos: number;
  skin?: string;
  progreso: number;
  completada: boolean;
  cobrada: boolean;
}

export interface ResumenProgreso {
  diario: Diario;
  misiones: Mision[];
  por_cobrar: number;
}

export interface FilaRankingSemanal {
  usuario_id: string;
  nombre: string;
  avatar: string | null;
  puntos: number;
}

export interface RankingSemanal {
  semana: string;
  cierra: string;
  premios: { lugar: number; puntos: number; skin?: string }[];
  filas: FilaRankingSemanal[];
  anterior: { semana: string; ganadores: (FilaRankingSemanal & { lugar: number; premio: number })[] } | null;
}

export interface PartidaHistorial {
  partida_id: string;
  terminada_en: string;
  sala: string;
  tablas: number;
  gano: boolean;
  puntos: number;
}

export interface PerfilJuego {
  id: string;
  nombre: string;
  avatar: string | null;
  skin_ficha: string | null;
  skin_carta: string | null;
  puntos: number;
  racha: number;
  mejor_racha: number;
  dias_seguidos: number;
  creado_en: string;
  puntos_ganados: number;
  skins: number;
  skins_total: number;
  partidas: number;
  tablas: number;
  victorias: number;
  logros: number;
  efectividad: number;
  carta_suerte: { id: number; nombre: string; veces: number } | null;
  figura_favorita: { clave: string; nombre: string; veces: number } | null;
  historial: PartidaHistorial[];
  coleccion: Coleccion[];
}

export interface Meta {
  pagina: number;
  porPagina: number;
  total: number;
}

export interface Pagina<T> {
  data: T[];
  meta: Meta;
}

// ---------- eventos en tiempo real ----------

export interface EventoCartaCantada {
  partida_id: string;
  orden: number;
  carta: Carta;
  quedan: number;
}

export interface EventoFiguraLograda {
  partida_id: string;
  usuario_id: string;
  nombre: string;
  partida_tabla_id: string;
  tabla: string;
  figura: { clave: string; nombre: string };
  carta: number;
  casillas: Casilla[];
  primero: boolean;
  puntos: number;
}

/** El tablero declaró ¡Lotería! (o se acabó el mazo sin ganador). */
export interface EventoGanadores {
  partida_id: string;
  ganadores: Ganador[];
  figura?: string;
  carta?: number;
  motivo?: string;
}

export interface EventosSala {
  'carta:cantada': EventoCartaCantada;
  'figura:lograda': EventoFiguraLograda;
  'partida:estado': Partida;
  /** Alguien tomó o soltó una tabla (antes de iniciar) */
  'partida:tablas': { partida_id: string };
  'partida:ganadores': EventoGanadores;
  'jugador:entro': { id: string; nombre: string; bot?: boolean };
  /** Chat rápido: solo la clave de una frase fija */
  'sala:frase': { usuarioId: string; clave: string; en: number };
  'jugador:salio': { id: string };
  'jugador:conectado': { usuarioId: string };
  'jugador:desconectado': { usuarioId: string };
}
