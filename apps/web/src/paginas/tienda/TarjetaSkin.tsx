import type { CSSProperties } from 'react';
import { coloresRareza, nombresRareza, type Skin } from '@loteria/core';
import { Chip } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import { Carta, Ficha } from '../../componentes/juego/Carta';
import s from '../paginas.module.css';

interface Props {
  skin: Skin;
  puntos: number;
  ocupado: boolean;
  alCanjear: () => void;
  alEquipar: () => void;
}

const MUESTRA = { id: 1, nombre: 'El Gallo', imagen_url: null };

/** Una skin con su muestra, rareza y la acción que corresponde (canjear, equipar o equipada). */
export function TarjetaSkin({ skin, puntos, ocupado, alCanjear, alEquipar }: Props) {
  const faltan = skin.precio_puntos - puntos;
  return (
    <article className={s.skin} style={{ '--rareza': coloresRareza[skin.rareza] } as CSSProperties}>
      {skin.tipo === 'ficha' ? (
        <div className={s.muestraFicha}>
          <Ficha skin={skin.clave} />
        </div>
      ) : (
        <div style={{ width: 80 }}>
          <Carta carta={MUESTRA} tamano="chica" skin={skin.clave} />
        </div>
      )}
      <b>{skin.nombre}</b>
      <span className="texto-suave">{skin.descripcion}</span>
      <span style={{ color: coloresRareza[skin.rareza], fontWeight: 900, fontSize: '0.8rem' }}>{nombresRareza[skin.rareza]}</span>
      {skin.equipada ? (
        <Chip tono="verde">✓ Equipada</Chip>
      ) : skin.la_tengo ? (
        <Boton tamano="s" variante="secundario" onClick={alEquipar} disabled={ocupado}>
          Equipar
        </Boton>
      ) : faltan > 0 ? (
        <Boton tamano="s" variante="secundario" disabled>
          Te faltan {faltan} pts
        </Boton>
      ) : (
        <Boton tamano="s" onClick={alCanjear} disabled={ocupado}>
          {skin.precio_puntos ? `Canjear por ${skin.precio_puntos} pts` : 'Gratis'}
        </Boton>
      )}
    </article>
  );
}
