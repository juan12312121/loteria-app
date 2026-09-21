import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useLobby } from '@loteria/core';
import { Tarjeta } from '../../componentes/ui/basicos';
import { Carta } from '../../componentes/juego/Carta';
import { UnirseConCodigo } from './UnirseConCodigo';
import { FormCrearSala } from './FormCrearSala';
import { ListaSalas } from './ListaSalas';
import { PanelProgreso } from './PanelProgreso';
import s from '../paginas.module.css';

const ABANICO = [
  { id: 1, nombre: 'El Gallo', imagen_url: null },
  { id: 23, nombre: 'La Luna', imagen_url: null },
  { id: 46, nombre: 'El Sol', imagen_url: null },
  { id: 6, nombre: 'La Sirena', imagen_url: null },
];

export function PaginaLobby() {
  const { mias, publicas, crear, unirse } = useLobby();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const codigoInvitacion = parametros.get('codigo') ?? '';
  const irASala = (id: string) => navegar(`/sala/${id}`);

  // Enlace de invitación (/jugar?codigo=ABC123): entra directo a la sala
  const yaIntento = useRef(false);
  useEffect(() => {
    if (codigoInvitacion.length !== 6 || yaIntento.current) return;
    yaIntento.current = true;
    void unirse.ejecutar(codigoInvitacion).then((sala) => sala && navegar(`/sala/${sala.id}`, { replace: true }));
  }, [codigoInvitacion, navegar, unirse]);

  return (
    <>
      <section className={s.hero}>
        <div className="pila">
          <h1 className={s.lema}>¡Se va y se corre!</h1>
          <p className="texto-suave" style={{ fontSize: '1.05rem', margin: 0 }}>
            Crea una sala, invita con el código y jueguen. Se gana con <b>tabla llena</b>; las cuatro esquinas y La O se anuncian en vivo.
          </p>
        </div>
        <div className={s.abanico}>
          {ABANICO.map((c, i) => (
            <div key={c.id} style={{ transform: `rotate(${(i - 1.5) * 9}deg) translateY(${Math.abs(i - 1.5) * 8}px)` }}>
              <Carta carta={c} tamano="mediana" />
            </div>
          ))}
        </div>
      </section>

      <PanelProgreso />

      <div className={s.dosColumnas} style={{ marginBottom: 16 }}>
        <Tarjeta titulo="Unirse con código" icono={<Users size={16} />}>
          <UnirseConCodigo accion={unirse} codigoInicial={codigoInvitacion} alEntrar={(sala) => irASala(sala.id)} />
        </Tarjeta>
        <Tarjeta titulo="Crear sala" icono={<Plus size={16} />}>
          <FormCrearSala accion={crear} alCrear={(sala) => irASala(sala.id)} />
        </Tarjeta>
      </div>

      <div className={s.dosColumnas}>
        <Tarjeta titulo="Mis salas">
          <ListaSalas consulta={mias} vacio="Todavía no estás en ninguna sala." alEntrar={(sala) => irASala(sala.id)} />
        </Tarjeta>
        <Tarjeta titulo="Salas públicas" acciones={<button type="button" className={s.recargar} onClick={() => publicas.recargar()}>Actualizar</button>}>
          <ListaSalas
            consulta={publicas}
            vacio="No hay salas públicas abiertas. ¡Crea una y desmarca «Privada»!"
            alEntrar={async (sala) => {
              if (sala.soy_miembro) return irASala(sala.id);
              const unida = await unirse.ejecutar(sala.codigo);
              if (unida) irASala(unida.id);
            }}
          />
          {unirse.error && <p style={{ color: 'var(--rojo)', fontWeight: 700 }}>{unirse.error}</p>}
        </Tarjeta>
      </div>
    </>
  );
}
