import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useColeccion, useSesion, useTienda, type TipoSkin } from '@loteria/core';
import { Avance, Cargando, Chip, MensajeError, Pestanas } from '../../componentes/ui/basicos';
import { sonidos } from '../../sonidos';
import { TarjetaSkin } from './TarjetaSkin';
import s from '../paginas.module.css';

const TIPOS: { valor: TipoSkin; etiqueta: string }[] = [
  { valor: 'ficha', etiqueta: 'Fichas' },
  { valor: 'carta', etiqueta: 'Cartas' },
  { valor: 'avatar', etiqueta: 'Avatares' },
  { valor: 'fondo', etiqueta: 'Fondos de sala' },
  { valor: 'tema', etiqueta: 'Temas' },
];

export function PaginaTienda() {
  const { perfil } = useSesion();
  const [parametros] = useSearchParams();
  const inicial = TIPOS.find((t) => t.valor === parametros.get('tipo'))?.valor ?? 'ficha';
  const [tipo, setTipo] = useState<TipoSkin>(inicial);
  const tienda = useTienda(tipo);
  const { coleccion, recargar: recargarColeccion } = useColeccion();
  const error = tienda.canjear.error ?? tienda.equipar.error;
  const tengo = coleccion.reduce((t, c) => t + c.tengo, 0);
  const total = coleccion.reduce((t, c) => t + c.total, 0);

  const canjear = async (id: string) => {
    if (await tienda.canjear.ejecutar(id)) {
      sonidos.cobrar();
      void recargarColeccion();
    }
  };

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1 className={s.titulo}>Tienda</h1>
        <Chip tono="amarillo" icono={<Star size={14} />}>
          {perfil?.puntos ?? 0} pts para canjear
        </Chip>
      </div>
      <p className="texto-suave" style={{ marginTop: 0 }}>
        Los puntos se ganan jugando, con la recompensa diaria y con misiones. Las de temporada solo se venden en sus fechas y las
        exclusivas se ganan.
      </p>

      {total > 0 && (
        <section className={s.album} aria-label="Álbum de colección">
          <div className="fila" style={{ justifyContent: 'space-between' }}>
            <b>Álbum de colección</b>
            <span className="texto-suave">
              {tengo} de {total} ({Math.round((tengo / total) * 100)} %)
            </span>
          </div>
          <Avance valor={tengo} total={total} tono="verde" />
          <div className={s.albumTipos}>
            {TIPOS.map((t) => {
              const c = coleccion.find((x) => x.tipo === t.valor);
              return (
                <span key={t.valor} className="texto-suave">
                  {t.etiqueta}: <b>{c ? `${c.tengo}/${c.total}` : '–'}</b>
                </span>
              );
            })}
          </div>
        </section>
      )}

      <div style={{ margin: '16px 0' }}>
        <Pestanas<TipoSkin> opciones={TIPOS} valor={tipo} alCambiar={setTipo} />
      </div>
      {error && <MensajeError mensaje={error} />}
      {tienda.cargando && !tienda.skins.length ? (
        <Cargando />
      ) : tienda.error ? (
        <MensajeError mensaje={tienda.error} />
      ) : (
        <div className={s.gridSkins}>
          {tienda.skins.map((skin) => (
            <TarjetaSkin
              key={skin.id}
              skin={skin}
              puntos={perfil?.puntos ?? 0}
              ocupado={tienda.canjear.cargando || tienda.equipar.cargando}
              alCanjear={() => canjear(skin.id)}
              alEquipar={() => tienda.equipar.ejecutar(skin.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
