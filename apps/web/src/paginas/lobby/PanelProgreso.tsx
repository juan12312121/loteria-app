import { Gift, Target } from 'lucide-react';
import { dataUriDeAvatar, dataUriDeFicha, useProgreso, type Mision } from '@loteria/core';
import { Avance, Chip, MensajeError, Tarjeta } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { sonidos } from '../../sonidos';
import s from './lobby.module.css';

const PERIODOS: Record<Mision['periodo'], string> = { diaria: 'Hoy', semanal: 'Esta semana', siempre: 'Especiales' };

/** Recompensa diaria (con días seguidos) y misiones con su avance. */
export function PanelProgreso() {
  const { diario, misiones, cargando, error, recargar, reclamarDiario, cobrarMision } = useProgreso();
  if (error) return <MensajeError mensaje={error} alReintentar={recargar} />;
  if (cargando && !diario) return null;

  const reclamar = async () => {
    if (await reclamarDiario.ejecutar()) sonidos.cobrar();
  };
  const cobrar = async (clave: string) => {
    if (await cobrarMision.ejecutar(clave)) sonidos.cobrar();
  };

  return (
    <div className={s.progreso}>
      {diario && (
        <Tarjeta titulo="Recompensa diaria" icono={<Gift size={16} />}>
          <div className={s.dias} aria-label={`Llevas ${diario.dias_seguidos} días seguidos`}>
            {diario.escala.map((pts, i) => {
              const dia = i + 1;
              const hecho = diario.disponible ? dia < diario.dias_seguidos : dia <= Math.min(diario.dias_seguidos, diario.escala.length);
              const hoy = diario.disponible && dia === Math.min(diario.dias_seguidos, diario.escala.length);
              return (
                <div key={dia} className={`${s.dia} ${hecho ? s.diaHecho : ''} ${hoy ? s.diaHoy : ''}`}>
                  <span className={s.diaNumero}>Día {dia}</span>
                  <b>+{pts}</b>
                </div>
              );
            })}
          </div>
          {diario.disponible ? (
            <Boton anchoCompleto onClick={reclamar} cargando={reclamarDiario.cargando}>
              Cobrar +{diario.puntos} pts
            </Boton>
          ) : (
            <p className="texto-suave" style={{ margin: 0, textAlign: 'center' }}>
              ¡Listo por hoy! Vuelve mañana para seguir tu racha de {diario.dias_seguidos} día(s).
            </p>
          )}
          {reclamarDiario.error && <p className={s.error}>{reclamarDiario.error}</p>}
        </Tarjeta>
      )}

      <Tarjeta titulo="Misiones" icono={<Target size={16} />}>
        {cobrarMision.error && <p className={s.error}>{cobrarMision.error}</p>}
        {(['diaria', 'semanal', 'siempre'] as const).map((periodo) => (
          <div key={periodo} className={s.grupoMisiones}>
            <h3 className={s.periodo}>{PERIODOS[periodo]}</h3>
            {misiones
              .filter((m) => m.periodo === periodo)
              .map((m) => (
                <div key={m.clave} className={`${s.mision} ${m.cobrada ? s.misionCobrada : ''}`}>
                  <div className={s.misionInfo}>
                    <div className="fila" style={{ justifyContent: 'space-between' }}>
                      <b>{m.titulo}</b>
                      <span className="texto-suave">
                        {m.progreso}/{m.meta}
                      </span>
                    </div>
                    <Avance valor={m.progreso} total={m.meta} tono={m.completada ? 'verde' : 'rosa'} />
                  </div>
                  {m.skin && <PremioSkin clave={m.skin} />}
                  {m.cobrada ? (
                    <Chip tono="verde">✓</Chip>
                  ) : m.completada ? (
                    <Boton tamano="s" variante="exito" onClick={() => cobrar(m.clave)} disabled={cobrarMision.cargando}>
                      +{m.puntos}
                    </Boton>
                  ) : (
                    <Chip>+{m.puntos}</Chip>
                  )}
                </div>
              ))}
          </div>
        ))}
      </Tarjeta>
    </div>
  );
}

/** Muestra de la skin exclusiva que regala una misión. */
function PremioSkin({ clave }: { clave: string }) {
  const src = clave.startsWith('av_') ? dataUriDeAvatar(clave) : dataUriDeFicha(clave);
  return <img className={s.premioSkin} src={src} alt="" title="Incluye una skin exclusiva" />;
}
