import { io, type Socket } from 'socket.io-client';
import type { EventosSala } from '../tipos';

type NombreEvento = keyof EventosSala;
type Manejador<E extends NombreEvento> = (datos: EventosSala[E]) => void;

/** 'desconectado' = sin sesión; 'reconectando' = se cayó y está intentando volver. */
export type EstadoConexion = 'desconectado' | 'conectando' | 'conectado' | 'reconectando';

/**
 * Envoltura de Socket.IO: una conexión por sesión y un cuarto por sala.
 * Los manejadores viven aquí (no en el socket), así que sobreviven a
 * reconexiones y cambios de sesión; al reconectar se vuelve a unir a sus salas
 * y avisa para que las pantallas recarguen lo que se perdieron.
 */
export class RealtimeCliente {
  private socket: Socket | null = null;
  private readonly salas = new Set<string>();
  private readonly manejadores = new Map<NombreEvento, Set<Manejador<any>>>();
  private readonly oyentesConexion = new Set<(estado: EstadoConexion) => void>();
  private readonly oyentesReconexion = new Set<() => void>();
  private _estado: EstadoConexion = 'desconectado';
  private yaConecto = false;

  constructor(private readonly url: string) {}

  get estado() {
    return this._estado;
  }

  conectar(token: string) {
    this.desconectar();
    this.yaConecto = false;
    this.fijarEstado('conectando');
    const socket = io(this.url, { auth: { token }, transports: ['websocket'] });
    socket.on('connect', () => {
      this.salas.forEach((id) => socket.emit('sala:unirse', id));
      this.fijarEstado('conectado');
      if (this.yaConecto) this.oyentesReconexion.forEach((f) => f());
      this.yaConecto = true;
    });
    socket.on('disconnect', () => this.socket === socket && this.fijarEstado('reconectando'));
    socket.io.on('reconnect_attempt', () => this.fijarEstado('reconectando'));
    socket.onAny((evento: string, datos: unknown) => this.despachar(evento as NombreEvento, datos));
    this.socket = socket;
  }

  desconectar() {
    const s = this.socket;
    this.socket = null;
    s?.disconnect();
    this.fijarEstado('desconectado');
  }

  unirseSala(salaId: string) {
    this.salas.add(salaId);
    this.socket?.emit('sala:unirse', salaId);
  }

  salirSala(salaId: string) {
    this.salas.delete(salaId);
    this.socket?.emit('sala:salir', salaId);
  }

  /** Chat rápido: el servidor solo acepta claves de frases fijas. */
  enviarFrase(salaId: string, clave: string) {
    this.socket?.emit('sala:frase', { salaId, clave });
  }

  /** Suscribe un manejador; devuelve la función para quitarlo. */
  on<E extends NombreEvento>(evento: E, manejador: Manejador<E>): () => void {
    const lista = this.manejadores.get(evento) ?? new Set();
    lista.add(manejador);
    this.manejadores.set(evento, lista);
    return () => {
      lista.delete(manejador);
    };
  }

  alCambiarConexion(oyente: (estado: EstadoConexion) => void): () => void {
    this.oyentesConexion.add(oyente);
    return () => {
      this.oyentesConexion.delete(oyente);
    };
  }

  /** Se llama cada vez que vuelve la conexión después de haberse caído. */
  alReconectar(oyente: () => void): () => void {
    this.oyentesReconexion.add(oyente);
    return () => {
      this.oyentesReconexion.delete(oyente);
    };
  }

  private fijarEstado(estado: EstadoConexion) {
    if (estado === this._estado) return;
    this._estado = estado;
    this.oyentesConexion.forEach((f) => f(estado));
  }

  private despachar(evento: NombreEvento, datos: unknown) {
    this.manejadores.get(evento)?.forEach((m) => m(datos as never));
  }
}
