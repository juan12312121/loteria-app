import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';
import { NunitoSans_400Regular, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import { LoteriaProvider } from '@loteria/core';
import { API_URL } from '../config';
import { almacenMovil } from '../plataforma';
import { Cargando } from '../componentes/ui/basicos';
import { colores, fuentes } from '../tema';

export default function RaizLayout() {
  const [fuentesListas] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    NunitoSans_400Regular,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });

  if (!fuentesListas) return <Cargando />;

  return (
    <SafeAreaProvider>
      <LoteriaProvider apiUrl={API_URL} almacen={almacenMovil}>
        <StatusBar style="dark" />
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
      </LoteriaProvider>
    </SafeAreaProvider>
  );
}
