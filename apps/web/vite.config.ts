import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Una sola copia de React aunque @loteria/core viva en otro paquete del monorepo
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { port: 5173 },
});
