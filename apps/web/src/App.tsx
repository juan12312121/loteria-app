import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoteriaProvider } from '@loteria/core';
import { API_URL } from './config';
import { almacenWeb } from './plataforma';
import { LayoutPrincipal } from './layout/LayoutPrincipal';
import { RutaPrivada } from './layout/RutaPrivada';
import { PaginaLanding } from './paginas/landing/PaginaLanding';
import { PaginaEntrar } from './paginas/entrar/PaginaEntrar';
import { PaginaLobby } from './paginas/lobby/PaginaLobby';
import { PaginaSala } from './paginas/sala/PaginaSala';
import { PaginaTienda } from './paginas/tienda/PaginaTienda';
import { PaginaPerfil } from './paginas/perfil/PaginaPerfil';
import { PaginaRanking } from './paginas/ranking/PaginaRanking';
import { PaginaMisiones } from './paginas/misiones/PaginaMisiones';

export function App() {
  return (
    <LoteriaProvider apiUrl={API_URL} almacen={almacenWeb}>
      <BrowserRouter>
        <Routes>
          <Route index element={<PaginaLanding />} />
          <Route path="/entrar" element={<PaginaEntrar />} />
          <Route element={<RutaPrivada />}>
            <Route element={<LayoutPrincipal />}>
              <Route path="jugar" element={<PaginaLobby />} />
              <Route path="sala/:salaId" element={<PaginaSala />} />
              <Route path="misiones" element={<PaginaMisiones />} />
              <Route path="tienda" element={<PaginaTienda />} />
              <Route path="ranking" element={<PaginaRanking />} />
              <Route path="perfil" element={<PaginaPerfil />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LoteriaProvider>
  );
}
