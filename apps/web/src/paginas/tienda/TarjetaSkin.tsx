import type { CSSProperties } from 'react';
import { CalendarDays, Lock } from 'lucide-react';
import { coloresRareza, dataUriDeAvatar, dataUriDeFondo, nombresRareza, type Skin } from '@loteria/core';
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
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
/** '12-01' → '1 dic' */
const fecha = (mmdd: string) => `${Number(mmdd.slice(3))} ${MESES[Number(mmdd.slice(0, 2)) - 1]}`;

function Muestra({ skin }: { skin: Skin }) {
  switch (skin.tipo) {
    case 'ficha':
      return (
        <div className={s.muestraFicha}>
          <Ficha skin={skin.clave} />
        </div>
      );
    case 'carta':
      return (
        <div style={{ width: 80 }}>
          <Carta carta={MUESTRA} tamano="chica" skin={skin.clave} />
        </div>
      );
    case 'avatar':
      return <img className={s.muestraAvatar} src={dataUriDeAvatar(skin.clave)} alt="" />;
    case 'fondo':
      return <div className={s.muestraFondo} style={{ backgroundImage: `url("${dataUriDeFondo(skin.clave)}")` }} />;
  }
}

/** Una skin con su muestra, rareza y la acción que corresponde (canjear, equipar o equipada). */
export function TarjetaSkin({ skin, puntos, ocupado, alCanjear, alEquipar }: Props) {
  const faltan = skin.precio_puntos - puntos;
  const bloqueada = !skin.la_tengo && skin.disponible === false;
  return (
    <article
      className={`${s.skin} ${bloqueada ? s.skinBloqueada : ''}`}
      style={{ '--rareza': coloresRareza[skin.rareza] } as CSSProperties}
    >
      <Muestra skin={skin} />
      <b>{skin.nombre}</b>
      <span className="texto-suave">{skin.descripcion}</span>
      <span className="fila" style={{ justifyContent: 'center', gap: 6 }}>
        <span style={{ color: coloresRareza[skin.rareza], fontWeight: 900, fontSize: '0.8rem' }}>{nombresRareza[skin.rareza]}</span>
        {skin.temporada_inicio && skin.temporada_fin && (
          <Chip tono={skin.disponible ? 'rosa' : 'neutro'} icono={<CalendarDays size={12} />}>
            {skin.disponible ? '¡De temporada!' : `${fecha(skin.temporada_inicio)} – ${fecha(skin.temporada_fin)}`}
          </Chip>
        )}
      </span>
      {skin.equipada ? (
        <Chip tono="verde">✓ Equipada</Chip>
      ) : skin.la_tengo ? (
        <Boton tamano="s" variante="secundario" onClick={alEquipar} disabled={ocupado}>
          Equipar
        </Boton>
      ) : skin.exclusiva ? (
        <Chip icono={<Lock size={12} />}>Se gana, no se compra</Chip>
      ) : !skin.disponible ? (
        <Chip icono={<Lock size={12} />}>Vuelve el {fecha(skin.temporada_inicio ?? '01-01')}</Chip>
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
