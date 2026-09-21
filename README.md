# Lotería — web y móvil

Monorepo (npm workspaces) del frontend de Lotería. La lógica vive **una sola vez** en `packages/core`
y la usan tanto la web (React) como el celular (React Native / Expo).

```
packages/core     tipos, cliente del API, tiempo real, hooks, reglas visuales y tema
apps/web          React 19 + Vite + React Router
apps/mobile       React Native 0.86 + Expo SDK 57 + Expo Router
```

## Arrancar

```bash
npm install            # instala los tres paquetes
npm run web            # http://localhost:5173  (VITE_API_URL, por defecto http://localhost:3000)
npm run mobile         # Expo; en el teléfono define EXPO_PUBLIC_API_URL=http://<IP-de-tu-PC>:3000
npm run typecheck      # los tres paquetes
npm test               # pruebas del core
```

El backend es `loteria-backend` (Express + Supabase + Socket.IO).

## Cómo está organizado

### `@loteria/core` (compartido)
| Carpeta | Qué hay |
|---|---|
| `api/http.ts` | `HttpClient` sobre fetch: token, query string y errores → `ApiError` |
| `api/recursos.ts` | `crearApi()`: todas las rutas por recurso (`auth`, `salas`, `partidas`, `catalogo`, `skins`, `puntos`). Las pantallas nunca arman URLs |
| `realtime/` | `RealtimeCliente`: un socket por sesión, un cuarto por sala; los manejadores sobreviven a reconexiones |
| `contexto/` | `LoteriaProvider` (servicios + sesión), `useServicios()`, `useSesion()` |
| `hooks/genericos.ts` | `useConsulta` (datos sin carreras), `useAccion` (carga/error de una operación), `useCola` (toasts), `useEventoSala` |
| `hooks/` | `useLobby`, `useSala`, `usePartida` (la ronda en vivo), `useTienda`, `usePerfilJuego`, `useCartas` |
| `juego/` | coordenadas de casillas, marcas, figuras (mismas máscaras que el servidor), apariencia de skins y las 54 ilustraciones originales en SVG (`arte.ts`) |
| `tema.ts` | tokens de diseño "Lotería Tradicional": web los publica como variables CSS, móvil los usa en `StyleSheet` |
| `almacen.ts` | interfaz para guardar la sesión; cada plataforma trae la suya (localStorage / SecureStore) |

### Web y móvil
Misma estructura y mismos nombres de componentes en las dos:

- `componentes/ui`: `Boton`, `Chip`, `Tarjeta`, `Campo`, `Avatar`, `PapelPicado`, `Pestanas`, estados de carga/error
- `componentes/juego`: `Carta`, `Ficha`, `TablaLoteria`, `Cantor`, `TableroCantor`, `MiniFigura`, `BotonLoteria`, `CodigoSala`, `ListaJugadores`
- Sala: `VistaEspera` → `VistaRonda` → `VistaResultado` (cambian solas con los eventos en vivo)
- En móvil las rutas (`src/app/`) solo conectan; las pantallas viven en `src/pantallas/`

## Reglas que respeta la interfaz
- El jugador marca solo casillas cuya carta ya salió; la validación real la hace el servidor por coordenadas.
- Se gana con tabla llena. Cuatro esquinas y La O llegan como avisos y se resaltan en amarillo en la tabla.
- Con varias tablas, "¡Lotería!" grita con la tabla seleccionada (o la que lleva más marcas).
- Las 54 cartas se dibujan en SVG (`packages/core/src/juego/arte.ts`); web las usa como imagen y móvil con `react-native-svg`. Si una carta trae `imagen_url`, se usa esa imagen.
