/**
 * URL del backend. En producción se define VITE_API_URL al construir (Vercel).
 * Se normaliza para tolerar errores comunes al capturarla: sin https:// o con / al final.
 */
function normalizarUrl(valor: string | undefined): string {
  if (!valor?.trim()) return 'http://localhost:3000';
  const sinBarra = valor.trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(sinBarra) ? sinBarra : `https://${sinBarra}`;
}

export const API_URL = normalizarUrl(import.meta.env.VITE_API_URL);

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error('Falta VITE_API_URL: la web no sabe dónde está el backend. Defínela en Vercel y vuelve a desplegar.');
}
