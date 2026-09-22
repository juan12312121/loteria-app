import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { mensajeDeError, useSesion } from '@loteria/core';
import { Campo, PapelPicado, Pestanas } from '../componentes/ui/basicos';
import { Boton } from '../componentes/ui/Boton';
import { Carta } from '../componentes/juego/Carta';
import { espacio, useComunes } from '../tema';

type Modo = 'entrar' | 'registro';

const ABANICO = [
  { id: 1, nombre: 'El Gallo', imagen_url: null },
  { id: 23, nombre: 'La Luna', imagen_url: null },
  { id: 46, nombre: 'El Sol', imagen_url: null },
];

export function PantallaEntrar() {
  const comunes = useComunes();
  const { entrar, registrarse } = useSesion();
  const [modo, setModo] = useState<Modo>('entrar');
  const [datos, setDatos] = useState({ nombre: '', correo: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const cambiar = (campo: keyof typeof datos) => (valor: string) => setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = async () => {
    setEnviando(true);
    setError(null);
    try {
      if (modo === 'entrar') await entrar(datos.correo.trim(), datos.password);
      else await registrarse({ ...datos, correo: datos.correo.trim() });
      router.replace('/');
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={comunes.pantalla}>
      <PapelPicado />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={comunes.contenido} keyboardShouldPersistTaps="handled">
          <Text style={[comunes.lema, { textAlign: 'center', marginTop: espacio.l }]}>¡Lotería!</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: espacio.m }}>
            {ABANICO.map((c, i) => (
              <View key={c.id} style={{ width: 90, marginHorizontal: -8, transform: [{ rotate: `${(i - 1) * 9}deg` }] }}>
                <Carta carta={c} tamano="mediana" />
              </View>
            ))}
          </View>
          <Pestanas<Modo>
            opciones={[
              { valor: 'entrar', etiqueta: 'Iniciar sesión' },
              { valor: 'registro', etiqueta: 'Registrarse' },
            ]}
            valor={modo}
            alCambiar={(m) => {
              setModo(m);
              setError(null);
            }}
          />
          {modo === 'registro' && <Campo etiqueta="Nombre o apodo" value={datos.nombre} onChangeText={cambiar('nombre')} autoComplete="nickname" />}
          <Campo etiqueta="Correo" value={datos.correo} onChangeText={cambiar('correo')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Campo etiqueta="Contraseña" value={datos.password} onChangeText={cambiar('password')} secureTextEntry autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} error={error} />
          <Boton tamano="l" anchoCompleto cargando={enviando} alPresionar={enviar}>
            {modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
          </Boton>
          <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>🎁 Al registrarte recibes 100 fichas de regalo</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
