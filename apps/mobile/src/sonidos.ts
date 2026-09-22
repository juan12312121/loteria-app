import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { preferencias } from './preferencias';

/**
 * Efectos de sonido (mismos tonos que en la web, generados como WAV).
 * Cada sonido tiene un reproductor que se reutiliza: se regresa al inicio y se toca.
 * Respetan el modo silencio del teléfono y el ajuste "Sonidos".
 */
const ARCHIVOS = {
  ficha: require('../assets/sonidos/ficha.wav'),
  carta: require('../assets/sonidos/carta.wav'),
  figura: require('../assets/sonidos/figura.wav'),
  loteria: require('../assets/sonidos/loteria.wav'),
  frase: require('../assets/sonidos/frase.wav'),
  cobrar: require('../assets/sonidos/cobrar.wav'),
} as const;

type Sonido = keyof typeof ARCHIVOS;
const reproductores = new Map<Sonido, AudioPlayer>();

function tocar(sonido: Sonido) {
  if (!preferencias().sonido) return;
  try {
    let r = reproductores.get(sonido);
    if (!r) {
      r = createAudioPlayer(ARCHIVOS[sonido]);
      reproductores.set(sonido, r);
    }
    void r.seekTo(0);
    r.play();
  } catch {
    // Sin audio disponible: el juego sigue sin sonido
  }
}

export const sonidos = {
  ficha: () => tocar('ficha'),
  carta: () => tocar('carta'),
  figura: () => tocar('figura'),
  loteria: () => tocar('loteria'),
  frase: () => tocar('frase'),
  cobrar: () => tocar('cobrar'),
};
