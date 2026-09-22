import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useProgreso, useSesion } from '@loteria/core';
import { Avance, Chip, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { CelebracionNivel } from '../../componentes/ui/CelebracionNivel';
import { sonidos } from '../../sonidos';
import { fuentes, radio, useComunes, useEstilos, type Colores } from '../../tema';

/** Nivel con insignia, pase del mes y banco de fichas. */
export function PanelNivel() {
  const comunes = useComunes();
  const estilos = useEstilos(crearEstilos);
  const { perfil } = useSesion();
  const { nivel, pase, banco, cobrarNivel, cobrarPase, cobrarBanco } = useProgreso();
  const [festejo, setFestejo] = useState<{ nivel: number; insignia: { nombre: string; emoji: string }; puntos: number } | null>(null);
  if (!nivel || !pase || !banco) return null;

  const cobrar = async (accion: () => Promise<unknown>) => {
    if (await accion()) sonidos.cobrar();
  };
  const enNivel = nivel.xp - nivel.xpNivel;
  const paraSubir = Math.max(1, nivel.xpSiguiente - nivel.xpNivel);
  const fichas = perfil?.fichas ?? banco.fichas;

  return (
    <>
      {festejo && <CelebracionNivel {...festejo} alCerrar={() => setFestejo(null)} />}
      <Tarjeta titulo="Tu nivel">
        <View style={{ gap: 8 }}>
          <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
            <Text style={estilos.insignia}>{`${nivel.insignia.emoji} ${nivel.insignia.nombre}`}</Text>
            <Chip tono="anil">{`Nivel ${nivel.nivel}`}</Chip>
          </View>
          <Avance valor={enNivel} total={paraSubir} tono="amarillo" />
          <Text style={comunes.textoSuave}>
            {`${Math.min(enNivel, paraSubir)} de ${paraSubir} puntos para el nivel ${nivel.nivel + 1}. Suman todos los puntos que ganas, aunque los gastes.`}
          </Text>
          {nivel.porCobrar > 0 ? (
            <Boton
              anchoCompleto
              cargando={cobrarNivel.cargando}
              alPresionar={async () => {
                const r = await cobrarNivel.ejecutar();
                if (r) {
                  sonidos.loteria();
                  setFestejo(r);
                }
              }}
            >
              {`Cobrar ${nivel.porCobrar} nivel(es): +${nivel.premio} pts`}
            </Boton>
          ) : (
            <Text style={comunes.textoSuave}>Ya cobraste los premios de tus niveles.</Text>
          )}
          {cobrarNivel.error && <Text style={comunes.error}>{cobrarNivel.error}</Text>}
        </View>
      </Tarjeta>

      <Tarjeta titulo={`Pase de temporada · ${pase.temporada}`} acciones={<Chip tono="rosa">Gratis</Chip>}>
        <View style={{ gap: 8 }}>
          <Text style={comunes.negrita}>{`Nivel ${pase.nivel} de ${pase.niveles}`}</Text>
          <Avance valor={pase.puntos % pase.por_nivel} total={pase.por_nivel} tono="rosa" />
          <Text style={comunes.textoSuave}>
            {`Avanza con los puntos que ganas jugando: ${pase.por_nivel} por nivel. Llevas ${pase.puntos} este mes.`}
          </Text>
          {pase.premios.map((p) => (
            <View key={p.nivel} style={[estilos.premio, p.alcanzado && estilos.premioListo, p.cobrado && { opacity: 0.6 }]}>
              <Text style={estilos.premioNivel}>{p.nivel}</Text>
              <Text style={[comunes.negrita, { flex: 1 }]}>
                {`${p.puntos ? `+${p.puntos} pts ` : ''}${p.fichas ? `+${p.fichas} fichas ` : ''}${p.insignia ? '🏅' : ''}`}
              </Text>
              {p.cobrado ? (
                <Chip tono="verde">✓</Chip>
              ) : p.alcanzado ? (
                <Boton tamano="s" variante="exito" deshabilitado={cobrarPase.cargando} alPresionar={() => cobrar(() => cobrarPase.ejecutar(p.nivel))}>
                  Cobrar
                </Boton>
              ) : (
                <Text style={comunes.textoSuave}>🔒</Text>
              )}
            </View>
          ))}
          {cobrarPase.error && <Text style={comunes.error}>{cobrarPase.error}</Text>}
        </View>
      </Tarjeta>

      <Tarjeta titulo="Banco de fichas">
        <View style={{ gap: 8 }}>
          <Text style={comunes.textoSuave}>
            {`Si te quedan menos de ${banco.minimo} fichas, el banco te presta ${banco.regala} una vez al día para que sigas jugando.`}
          </Text>
          <View style={[comunes.fila, { justifyContent: 'space-between' }]}>
            <Chip>{`${fichas} fichas`}</Chip>
            {banco.disponible ? (
              <Boton cargando={cobrarBanco.cargando} alPresionar={() => cobrar(() => cobrarBanco.ejecutar())}>
                {`Pedir ${banco.regala} fichas`}
              </Boton>
            ) : (
              <Text style={comunes.textoSuave}>
                {fichas >= banco.minimo ? 'Todavía traes fichas de sobra.' : 'Ya pediste hoy; vuelve mañana.'}
              </Text>
            )}
          </View>
          {cobrarBanco.error && <Text style={comunes.error}>{cobrarBanco.error}</Text>}
        </View>
      </Tarjeta>
    </>
  );
}

const crearEstilos = (colores: Colores) =>
  StyleSheet.create({
    insignia: { fontFamily: fuentes.cuerpoNegra, fontSize: 17, color: colores.tinta },
    premio: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 8,
      borderWidth: 2,
      borderColor: colores.grisClaro,
      borderRadius: radio.m,
      backgroundColor: colores.blanco,
    },
    premioListo: { borderColor: colores.rosa },
    premioNivel: {
      width: 26,
      height: 26,
      textAlign: 'center',
      lineHeight: 24,
      borderRadius: 13,
      borderWidth: 1.5,
      borderColor: colores.tinta,
      backgroundColor: colores.amarilloSuave,
      color: colores.tinta,
      fontFamily: fuentes.cuerpoNegra,
    },
  });
