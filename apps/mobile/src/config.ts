/**
 * URL del backend. En el celular "localhost" es el propio teléfono: define
 * EXPO_PUBLIC_API_URL con la IP de tu computadora (p. ej. http://192.168.1.50:3000)
 * o la URL pública del servidor.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

/** Web pública: los enlaces de invitación abren ahí y entran directo a la sala. */
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://web-phi-three-89.vercel.app';
