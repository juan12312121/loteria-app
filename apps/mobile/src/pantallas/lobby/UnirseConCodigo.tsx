import { useState } from 'react';
import { View } from 'react-native';
import type { Accion, Sala } from '@loteria/core';
import { Campo } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { fuentes } from '../../tema';

const LARGO_CODIGO = 6;

export function UnirseConCodigo({ accion, alEntrar }: { accion: Accion<[string], Sala>; alEntrar: (sala: Sala) => void }) {
  const [codigo, setCodigo] = useState('');

  const enviar = async () => {
    const sala = await accion.ejecutar(codigo);
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
      <Boton variante="exito" anchoCompleto deshabilitado={codigo.length !== LARGO_CODIGO} cargando={accion.cargando} alPresionar={enviar}>
        Entrar a la sala
      </Boton>
    </View>
  );
}
