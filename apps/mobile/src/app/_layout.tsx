import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';
import { NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import { LoteriaProvider } from '@loteria/core';
import { API_URL } from '../config';
import { almacenMovil } from '../plataforma';
import { fuentes, ProveedorTema, useColores, useTemaOscuro } from '../tema';

// La pantalla de arranque se queda mientras cargan las fuentes
void SplashScreen.preventAutoHideAsync();

export default function RaizLayout() {
  const [fuentesListas] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  useEffect(() => {
    if (fuentesListas) void SplashScreen.hideAsync();
  }, [fuentesListas]);

  if (!fuentesListas) return null;

  return (
    <SafeAreaProvider>
      <LoteriaProvider apiUrl={API_URL} almacen={almacenMovil}>
        <ProveedorTema>
          <Navegacion />
        </ProveedorTema>
      </LoteriaProvider>
    </SafeAreaProvider>
  );
}

/** Pila de pantallas con los colores del tema equipado. */
function Navegacion() {
  const colores = useColores();
  const oscuro = useTemaOscuro();
  return (
    <>
      <StatusBar style={oscuro ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colores.papel },
          headerTitleStyle: { fontFamily: fuentes.titulo, color: colores.tinta },
          headerTintColor: colores.rosa,
          contentStyle: { backgroundColor: colores.crema },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="entrar" options={{ headerShown: false }} />
        <Stack.Screen name="sala/[id]" options={{ title: 'Sala' }} />
      </Stack>
    </>
  );
}
