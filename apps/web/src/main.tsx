import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { aplicarTema } from './plataforma';
import './estilos/global.css';

aplicarTema(document);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
