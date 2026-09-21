import { StyleSheet, Text, View } from 'react-native';
import type { Consulta, Sala } from '@loteria/core';
import { Cargando, Chip, MensajeError, Vacio } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { colores, comunes, radio } from '../../tema';

const ESTADO = {
  abierta: { tono: 'amarillo', texto: 'Esperando' },
  jugando: { tono: 'verde', texto: 'En juego' },
  cerrada: { tono: 'neutro', texto: 'Cerrada' },
} as const;

interface Props<T extends Sala> {
  consulta: Consulta<T[]>;
  vacio: string;
  alEntrar: (sala: T) => void;
}

export function ListaSalas<T extends Sala & { jugadores?: number }>({ consulta, vacio, alEntrar }: Props<T>) {
  if (consulta.cargando && !consulta.data) return <Cargando />;
  if (consulta.error) return <MensajeError mensaje={consulta.error} alReintentar={consulta.recargar} />;
  if (!consulta.data?.length) return <Vacio>{vacio}</Vacio>;

  return (
    <View style={{ gap: 8 }}>
      {consulta.data.map((sala) => (
        <View key={sala.id} style={estilos.fila}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={comunes.negrita}>{sala.nombre}</Text>
            <Text style={comunes.textoSuave}>
              Código {sala.codigo}
              {sala.jugadores !== undefined ? ` · ${sala.jugadores} jugadores` : ''}
            </Text>
            <Chip tono={ESTADO[sala.estado].tono}>{ESTADO[sala.estado].texto}</Chip>
          </View>
          <Boton tamano="s" variante="secundario" alPresionar={() => alEntrar(sala)}>
            Entrar
          </Boton>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderWidth: 1.5, borderColor: colores.tinta, borderRadius: radio.m, backgroundColor: colores.blanco },
});
