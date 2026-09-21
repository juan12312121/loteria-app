import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSesion, useTienda, type TipoSkin } from '@loteria/core';
import { Cargando, Chip, MensajeError, Pestanas } from '../../componentes/ui/basicos';
import { TarjetaSkin } from './TarjetaSkin';
import s from '../paginas.module.css';

export function PaginaTienda() {
  const { perfil } = useSesion();
  const [tipo, setTipo] = useState<TipoSkin>('ficha');
  const tienda = useTienda(tipo);
  const error = tienda.canjear.error ?? tienda.equipar.error;

  return (
    <>
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <h1 className={s.titulo}>Tienda</h1>
        <Chip tono="amarillo" icono={<Star size={14} />}>
          {perfil?.puntos ?? 0} pts para canjear
        </Chip>
      </div>
      <p className="texto-suave" style={{ marginTop: 0 }}>
        Los puntos se ganan jugando: 5 por cada tabla, y más si ganas o haces figuras primero.
      </p>
      <div style={{ marginBottom: 16 }}>
        <Pestanas<TipoSkin>
          opciones={[
            { valor: 'ficha', etiqueta: 'Fichas' },
            { valor: 'carta', etiqueta: 'Cartas' },
          ]}
          valor={tipo}
          alCambiar={setTipo}
        />
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
              alCanjear={() => tienda.canjear.ejecutar(skin.id)}
              alEquipar={() => tienda.equipar.ejecutar(skin.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
