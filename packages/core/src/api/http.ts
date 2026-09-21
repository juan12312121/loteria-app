import type { Meta, Pagina } from '../tipos';

/** Error del API con el formato estándar { codigo, mensaje, detalles }. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensaje: string,
    readonly detalles: unknown[] = [],
  ) {
    super(mensaje);
    this.name = 'ApiError';
  }
}

type Metodo = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type Query = Record<string, string | number | boolean | undefined>;

interface RespuestaOk<T> {
  ok: true;
  data: T;
  meta?: Meta;
}
interface RespuestaError {
  ok: false;
  error: { codigo: string; mensaje: string; detalles?: unknown[] };
}

/**
 * Cliente HTTP mínimo sobre fetch: agrega el token, arma la query string y
 * convierte cualquier error en ApiError. No sabe nada de rutas del dominio.
 */
export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly obtenerToken: () => string | null,
  ) {}

  get<T>(ruta: string, query?: Query) {
    return this.enviar<T>('GET', ruta, undefined, query).then((r) => r.data);
  }

  pagina<T>(ruta: string, query?: Query): Promise<Pagina<T>> {
    return this.enviar<T[]>('GET', ruta, undefined, query).then((r) => ({
      data: r.data,
      meta: r.meta ?? { pagina: 1, porPagina: r.data.length, total: r.data.length },
    }));
  }

  post<T>(ruta: string, body?: unknown) {
    return this.enviar<T>('POST', ruta, body).then((r) => r.data);
  }

  patch<T>(ruta: string, body?: unknown) {
    return this.enviar<T>('PATCH', ruta, body).then((r) => r.data);
  }

  delete<T = void>(ruta: string) {
    return this.enviar<T>('DELETE', ruta).then((r) => r.data);
  }

  private async enviar<T>(metodo: Metodo, ruta: string, body?: unknown, query?: Query): Promise<RespuestaOk<T>> {
    const token = this.obtenerToken();
    let respuesta: Response;
    try {
      respuesta = await fetch(this.baseUrl + ruta + armarQuery(query), {
        method: metodo,
        headers: {
          ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new ApiError(0, 'SIN_CONEXION', 'No hay conexión con el servidor');
    }
    if (respuesta.status === 204) return { ok: true, data: undefined as T };
    const json = (await respuesta.json().catch(() => null)) as RespuestaOk<T> | RespuestaError | null;
    if (!json) throw new ApiError(respuesta.status, 'RESPUESTA_INVALIDA', 'El servidor respondió algo inesperado');
    if (!json.ok) throw new ApiError(respuesta.status, json.error.codigo, json.error.mensaje, json.error.detalles);
    return json;
  }
}

function armarQuery(query?: Query): string {
  if (!query) return '';
  const partes = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return partes.length ? `?${partes.join('&')}` : '';
}

/** Mensaje amigable para mostrar cualquier error en pantalla. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Algo salió mal';
}
