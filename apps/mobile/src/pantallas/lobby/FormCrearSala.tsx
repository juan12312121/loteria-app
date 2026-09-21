import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import type { Accion, ModoCantor, NuevaSala, Sala } from '@loteria/core';
import { Campo, Pestanas } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { colores, comunes } from '../../tema';

const VELOCIDADES = ['3000', '5000', '8000', '12000'] as const;
type Velocidad = (typeof VELOCIDADES)[number];

/** El anfitrión solo decide nombre, cantor y privacidad; costo y tablas son reglas del juego. */
export function FormCrearSala({ accion, alCrear }: { accion: Accion<[NuevaSala], Sala>; alCrear: (sala: Sala) => void }) {
  const [nombre, setNombre] = useState('');
  const [modo, setModo] = useState<ModoCantor>('automatico');
  const [velocidad, setVelocidad] = useState<Velocidad>('5000');
  const [privada, setPrivada] = useState(true);

  const enviar = async () => {
    const sala = await accion.ejecutar({ nombre: nombre.trim(), modo_cantor: modo, velocidad_ms: Number(velocidad), privada });
    if (sala) alCrear(sala);
  };

  return (
    <View style={{ gap: 12 }}>
      <Campo etiqueta="Nombre de la sala" value={nombre} onChangeText={setNombre} placeholder="Sala de la familia" />
      <Text style={comunes.negrita}>Cantor</Text>
      <Pestanas<ModoCantor>
        opciones={[
          { valor: 'automatico', etiqueta: 'Automático' },
          { valor: 'manual', etiqueta: 'Yo canto' },
        ]}
        valor={modo}
        alCambiar={setModo}
      />
      {modo === 'automatico' && (
        <Pestanas<Velocidad> opciones={VELOCIDADES.map((v) => ({ valor: v, etiqueta: `${Number(v) / 1000} s` }))} valor={velocidad} alCambiar={setVelocidad} />
      )}
      <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
        <Text style={comunes.texto}>Privada (solo con el código)</Text>
        <Switch value={privada} onValueChange={setPrivada} trackColor={{ true: colores.rosa, false: colores.grisClaro }} />
      </View>
      {accion.error && <Text style={comunes.error}>{accion.error}</Text>}
      <Boton anchoCompleto cargando={accion.cargando} deshabilitado={!nombre.trim()} alPresionar={enviar}>
        Crear sala y abrir ronda
      </Boton>
    </View>
  );
}
