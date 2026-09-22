import { useEffect } from 'react';
import { Pressable, View, type ColorValue } from 'react-native';
import { router, Tabs, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgreso, useSesion } from '@loteria/core';
import { ConSesion } from '../../navegacion/ConSesion';
import { Avatar, Chip } from '../../componentes/ui/basicos';
import { fuentes, useColores } from '../../tema';

type Icono = keyof typeof Ionicons.glyphMap;
const icono = (nombre: Icono) =>
  function IconoPestana({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={nombre} color={String(color)} size={size} />;
  };

/** Puntos, fichas y avatar (lleva al perfil), igual que el encabezado de la web. */
function Encabezado() {
  const { perfil } = useSesion();
  if (!perfil) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Chip tono="amarillo">{`⭐ ${perfil.puntos} · ${perfil.fichas} fichas`}</Chip>
      <Pressable onPress={() => router.navigate('/perfil')} accessibilityLabel="Mi perfil" hitSlop={6}>
        <Avatar nombre={perfil.nombre} clave={perfil.equipo.avatar?.clave} tamano={32} />
      </Pressable>
    </View>
  );
}

/** Cuántas cosas hay por cobrar; se revisa al cambiar de pestaña y cuando cambian los puntos. */
function usePorCobrar() {
  const { perfil } = useSesion();
  const { porCobrar, recargar } = useProgreso();
  const ruta = usePathname();
  useEffect(() => {
    void recargar();
  }, [ruta, perfil?.puntos, recargar]);
  return porCobrar;
}

export default function TabsLayout() {
  return (
    <ConSesion>
      <Pestanas />
    </ConSesion>
  );
}

function Pestanas() {
  const colores = useColores();
  const porCobrar = usePorCobrar();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colores.papel },
        headerTitleStyle: { fontFamily: fuentes.titulo, color: colores.rosa, fontSize: 24 },
        headerRight: () => <Encabezado />,
        headerRightContainerStyle: { paddingRight: 12 },
        tabBarActiveTintColor: colores.rosa,
        tabBarInactiveTintColor: colores.tintaSuave,
        tabBarStyle: { backgroundColor: colores.papel, borderTopColor: colores.tinta, borderTopWidth: 2 },
        tabBarLabelStyle: { fontFamily: fuentes.cuerpoNegra },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '¡Lotería!', tabBarLabel: 'Jugar', tabBarIcon: icono('grid') }} />
      <Tabs.Screen
        name="misiones"
        options={{
          title: 'Misiones',
          tabBarIcon: icono('ribbon'),
          tabBarBadge: porCobrar > 0 ? porCobrar : undefined,
          tabBarBadgeStyle: { backgroundColor: colores.rosa, color: colores.blanco },
        }}
      />
      <Tabs.Screen name="amigos" options={{ title: 'Amigos', tabBarIcon: icono('people') }} />
      <Tabs.Screen name="tienda" options={{ title: 'Tienda', tabBarIcon: icono('storefront') }} />
      <Tabs.Screen name="ranking" options={{ title: 'Ranking', tabBarIcon: icono('trophy') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('person-circle') }} />
    </Tabs>
  );
}
