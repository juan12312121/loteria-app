import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Una VITE_API_URL vacía en el entorno (p. ej. mal capturada en el panel de Vercel)
// anularía la de .env.production; si viene vacía, se ignora.
if (process.env.VITE_API_URL !== undefined && !process.env.VITE_API_URL.trim()) {
  delete process.env.VITE_API_URL;
}

export default defineConfig({
  plugins: [react()],
  // Una sola copia de React aunque @loteria/core viva en otro paquete del monorepo
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { port: 5173 },
});
