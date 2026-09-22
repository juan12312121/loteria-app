import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useServicios, useSesion } from '@loteria/core';

/**
 * Avisos al celular: pide permiso, registra el token del aparato en el servidor
 * y deja que lleguen aunque la app esté abierta. Solo corre en un teléfono real
 * y con sesión iniciada.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function obtenerToken() {
  if (!Device.isDevice) return null; // en emulador no hay avisos
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Avisos del juego',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 200, 150, 200],
      lightColor: '#E4007C',
    });
  }
  const permiso = await Notifications.getPermissionsAsync();
  const estado = permiso.granted ? permiso : await Notifications.requestPermissionsAsync();
  if (!estado.granted) return null;
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}

/** Registra este celular para recibir avisos mientras haya sesión. */
export function useAvisos() {
  const { api } = useServicios();
  const { perfil } = useSesion();
  const usuarioId = perfil?.id;

  useEffect(() => {
    if (!usuarioId) return;
    let token: string | null = null;
    void obtenerToken()
      .then(async (t) => {
        token = t;
        if (t) await api.avisos.registrar(t);
      })
      .catch(() => undefined);
    return () => {
      // Al cerrar sesión se deja de avisar a este aparato
      if (token) void api.avisos.quitar(token).catch(() => undefined);
    };
  }, [api, usuarioId]);
}
