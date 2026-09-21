import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSesion } from '@loteria/core';
import { ConSesion } from '../../navegacion/ConSesion';
import { Chip } from '../../componentes/ui/basicos';
import { colores, fuentes } from '../../tema';

type Icono = keyof typeof Ionicons.glyphMap;
const icono = (nombre: Icono) => ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={nombre} color={String(color)} size={size} />;

function PuntosEnEncabezado() {
  const { perfil } = useSesion();
  return perfil ? <Chip tono="amarillo">{`⭐ ${perfil.puntos} · ${perfil.fichas} fichas`}</Chip> : null;
}

export default function TabsLayout() {
  return (
    <ConSesion>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colores.papel },
          headerTitleStyle: { fontFamily: fuentes.titulo, color: colores.rosa, fontSize: 24 },
          headerRight: () => <PuntosEnEncabezado />,
          headerRightContainerStyle: { paddingRight: 12 },
          tabBarActiveTintColor: colores.rosa,
          tabBarInactiveTintColor: colores.tintaSuave,
          tabBarStyle: { backgroundColor: colores.papel, borderTopColor: colores.tinta, borderTopWidth: 2 },
          tabBarLabelStyle: { fontFamily: fuentes.cuerpoNegra },
        }}
      >
        <Tabs.Screen name="index" options={{ title: '¡Lotería!', tabBarLabel: 'Jugar', tabBarIcon: icono('grid') }} />
        <Tabs.Screen name="tienda" options={{ title: 'Tienda', tabBarIcon: icono('storefront') }} />
        <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarLabel: 'Perfil', tabBarIcon: icono('trophy') }} />
      </Tabs>
    </ConSesion>
  );
}
