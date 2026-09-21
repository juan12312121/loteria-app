import { preferencias } from './preferencias';

/**
 * Efectos de sonido sintetizados con Web Audio (sin archivos que descargar).
 * No suenan si el jugador los apagó o si el navegador aún no permite audio.
 */

let contexto: AudioContext | null = null;

function audio(): AudioContext | null {
  if (!preferencias().sonido) return null;
  try {
    contexto ??= new AudioContext();
    if (contexto.state === 'suspended') void contexto.resume();
    return contexto;
  } catch {
    return null;
  }
}

interface Nota {
  frecuencia: number;
  /** Segundos desde ahora */
  inicio?: number;
  duracion: number;
  tipo?: OscillatorType;
  volumen?: number;
  /** Frecuencia final (glissando) */
  hasta?: number;
}

function tocar(notas: Nota[]) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  for (const n of notas) {
    const osc = ac.createOscillator();
    const vol = ac.createGain();
    const inicio = t0 + (n.inicio ?? 0);
    osc.type = n.tipo ?? 'sine';
    osc.frequency.setValueAtTime(n.frecuencia, inicio);
    if (n.hasta) osc.frequency.exponentialRampToValueAtTime(n.hasta, inicio + n.duracion);
    vol.gain.setValueAtTime(0.0001, inicio);
    vol.gain.exponentialRampToValueAtTime(n.volumen ?? 0.2, inicio + 0.01);
    vol.gain.exponentialRampToValueAtTime(0.0001, inicio + n.duracion);
    osc.connect(vol).connect(ac.destination);
    osc.start(inicio);
    osc.stop(inicio + n.duracion + 0.05);
  }
}

export const sonidos = {
  /** Frijolito que cae en la casilla */
  ficha: () => tocar([{ frecuencia: 420, hasta: 180, duracion: 0.08, tipo: 'triangle', volumen: 0.25 }]),

  /** Campanita del cantor al sacar carta */
  carta: () =>
    tocar([
      { frecuencia: 1320, duracion: 0.5, volumen: 0.12 },
      { frecuencia: 1980, duracion: 0.35, volumen: 0.05 },
    ]),

  /** Alguien hizo una figura intermedia */
  figura: () =>
    tocar([
      { frecuencia: 660, duracion: 0.12, tipo: 'square', volumen: 0.06 },
      { frecuencia: 880, inicio: 0.1, duracion: 0.18, tipo: 'square', volumen: 0.06 },
    ]),

  /** ¡Lotería! Fanfarria de trompeta */
  loteria: () =>
    tocar(
      [523, 659, 784, 1047, 784, 1047].map((f, i) => ({
        frecuencia: f,
        inicio: i * 0.13,
        duracion: i === 5 ? 0.7 : 0.14,
        tipo: 'sawtooth' as const,
        volumen: 0.08,
      })),
    ),

  /** Globito del chat rápido */
  frase: () => tocar([{ frecuencia: 700, hasta: 1100, duracion: 0.09, volumen: 0.1 }]),

  /** Monedas al cobrar puntos */
  cobrar: () =>
    tocar([
      { frecuencia: 988, duracion: 0.1, tipo: 'square', volumen: 0.05 },
      { frecuencia: 1319, inicio: 0.08, duracion: 0.25, tipo: 'square', volumen: 0.05 },
    ]),
};
