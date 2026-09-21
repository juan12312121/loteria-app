import { io, type Socket } from 'socket.io-client';
import type { EventosSala } from '../tipos';

type NombreEvento = keyof EventosSala;
type Manejador<E extends NombreEvento> = (datos: EventosSala[E]) => void;

/**
 * Envoltura de Socket.IO: una conexión por sesión y un cuarto por sala.
 * Los manejadores viven aquí (no en el socket), así que sobreviven a
 * reconexiones y cambios de sesión; al reconectar se vuelve a unir a sus salas.
 */
export class RealtimeCliente {
  private socket: Socket | null = null;
  private readonly salas = new Set<string>();
  private readonly manejadores = new Map<NombreEvento, Set<Manejador<any>>>();

  constructor(private readonly url: string) {}

  conectar(token: string) {
    this.desconectar();
    const socket = io(this.url, { auth: { token }, transports: ['websocket'] });
    socket.on('connect', () => this.salas.forEach((id) => socket.emit('sala:unirse', id)));
    socket.onAny((evento: string, datos: unknown) => this.despachar(evento as NombreEvento, datos));
    this.socket = socket;
  }

  desconectar() {
    this.socket?.disconnect();
    this.socket = null;
  }

  unirseSala(salaId: string) {
    this.salas.add(salaId);
    this.socket?.emit('sala:unirse', salaId);
  }

  salirSala(salaId: string) {
    this.salas.delete(salaId);
    this.socket?.emit('sala:salir', salaId);
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

  private despachar(evento: NombreEvento, datos: unknown) {
    this.manejadores.get(evento)?.forEach((m) => m(datos as never));
  }
}
