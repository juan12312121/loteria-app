import { useState } from 'react';
import { View } from 'react-native';
import type { Accion, Sala } from '@loteria/core';
import { Campo } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { fuentes } from '../../tema';

const LARGO_CODIGO = 6;

export function UnirseConCodigo({ accion, alEntrar }: { accion: Accion<[string, string?], Sala>; alEntrar: (sala: Sala) => void }) {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  // El API contesta "pide contraseña"; hasta entonces se muestra el campo
  const pidePassword = !!accion.error?.toLowerCase().includes('contraseña');

  const enviar = async () => {
    const sala = await accion.ejecutar(codigo, password || undefined);
    if (sala) alEntrar(sala);
  };

  return (
    <View style={{ gap: 12 }}>
      <Campo
        etiqueta="Código de 6 letras"
        value={codigo}
        onChangeText={(t) => setCodigo(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, LARGO_CODIGO))}
        placeholder="LE2SKV"
        autoCapitalize="characters"
        autoCorrect={false}
        style={{ fontSize: 26, letterSpacing: 8, textAlign: 'center', fontFamily: fuentes.cuerpoNegra }}
        error={accion.error}
      />
      {pidePassword && (
        <Campo
          etiqueta="Contraseña de la sala"
          value={password}
          onChangeText={setPassword}
          placeholder="La que te pasaron"
          secureTextEntry
          autoFocus
        />
      )}
      <Boton variante="exito" anchoCompleto deshabilitado={codigo.length !== LARGO_CODIGO} cargando={accion.cargando} alPresionar={enviar}>
        Entrar a la sala
      </Boton>
    </View>
  );
}
