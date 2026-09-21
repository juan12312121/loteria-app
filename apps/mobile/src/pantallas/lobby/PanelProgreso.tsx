import { StyleSheet, Text, View } from 'react-native';
import { useProgreso, type Mision } from '@loteria/core';
import { Avance, Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { colores, comunes, fuentes, radio } from '../../tema';

const PERIODOS: Record<Mision['periodo'], string> = { diaria: 'Hoy', semanal: 'Esta semana', siempre: 'Especiales' };

/** Recompensa diaria y misiones con su avance. */
export function PanelProgreso() {
  const { diario, misiones, reclamarDiario, cobrarMision } = useProgreso();
  if (!diario) return null;

  return (
    <>
      <Tarjeta titulo="Recompensa diaria">
        <View style={estilos.dias}>
          {diario.escala.map((pts, i) => {
            const dia = i + 1;
            const tope = Math.min(diario.dias_seguidos, diario.escala.length);
            const hecho = diario.disponible ? dia < diario.dias_seguidos : dia <= tope;
            const hoy = diario.disponible && dia === tope;
            return (
              <View key={dia} style={[estilos.dia, hecho && estilos.diaHecho, hoy && estilos.diaHoy]}>
                <Text style={estilos.diaNumero}>{`D${dia}`}</Text>
                <Text style={[comunes.negrita, hecho && { color: colores.verde }]}>+{pts}</Text>
              </View>
            );
          })}
        </View>
        {diario.disponible ? (
          <Boton anchoCompleto cargando={reclamarDiario.cargando} alPresionar={() => reclamarDiario.ejecutar()}>
            {`Cobrar +${diario.puntos} pts`}
          </Boton>
        ) : (
          <Text style={[comunes.textoSuave, { textAlign: 'center' }]}>{`¡Listo por hoy! Llevas ${diario.dias_seguidos} día(s) seguidos.`}</Text>
        )}
        {reclamarDiario.error && <Text style={comunes.error}>{reclamarDiario.error}</Text>}
      </Tarjeta>

      <Tarjeta titulo="Misiones">
        {cobrarMision.error && <Text style={comunes.error}>{cobrarMision.error}</Text>}
        {(['diaria', 'semanal', 'siempre'] as const).map((periodo) => (
          <View key={periodo} style={{ marginBottom: 8 }}>
            <Text style={estilos.periodo}>{PERIODOS[periodo].toUpperCase()}</Text>
            {misiones
              .filter((m) => m.periodo === periodo)
              .map((m) => (
                <View key={m.clave} style={[estilos.mision, m.cobrada && { opacity: 0.55 }]}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={comunes.negrita}>{m.titulo}</Text>
                    <Avance valor={m.progreso} total={m.meta} tono={m.completada ? 'verde' : 'rosa'} />
                    <Text style={comunes.textoSuave}>{`${m.progreso}/${m.meta}${m.skin ? ' · incluye skin exclusiva' : ''}`}</Text>
                  </View>
                  {m.cobrada ? (
                    <Chip tono="verde">✓</Chip>
                  ) : m.completada ? (
                    <Boton tamano="s" variante="exito" deshabilitado={cobrarMision.cargando} alPresionar={() => cobrarMision.ejecutar(m.clave)}>
                      {`+${m.puntos}`}
                    </Boton>
                  ) : (
                    <Chip>{`+${m.puntos}`}</Chip>
                  )}
                </View>
              ))}
          </View>
        ))}
      </Tarjeta>
    </>
  );
}

const estilos = StyleSheet.create({
  dias: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  dia: { flex: 1, alignItems: 'center', paddingVertical: 6, borderWidth: 2, borderColor: colores.grisClaro, borderRadius: radio.m, backgroundColor: colores.blanco },
  diaHecho: { borderColor: colores.verde, backgroundColor: colores.verdeSuave },
  diaHoy: { borderColor: colores.rosa },
  diaNumero: { fontFamily: fuentes.cuerpoNegra, fontSize: 10, color: colores.tintaSuave },
  periodo: { fontFamily: fuentes.cuerpoNegra, fontSize: 11, letterSpacing: 1, color: colores.tintaSuave, marginBottom: 4 },
  mision: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colores.grisClaro },
});
