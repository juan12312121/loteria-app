import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, MessageCircle, Swords, UserPlus, X } from 'lucide-react';
import { nivelYInsignia, useAmigos, useRevanchas, type Amigo } from '@loteria/core';
import { Avatar, Cargando, Chip, MensajeError, Tarjeta, Vacio } from '../../componentes/ui/basicos';
import { Boton } from '../../componentes/ui/Boton';
import s from './amigos.module.css';
import p from '../paginas.module.css';

const LARGO_CODIGO = 6;

export function PaginaAmigos() {
  const { miCodigo, amigos, pendientes, enviadas, cargando, error, recargar, intervaloMs, solicitar, aceptar, quitar } = useAmigos();
  const navegar = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);

  // La presencia cambia sola: se vuelve a preguntar cada tanto
  useEffect(() => {
    const t = setInterval(() => void recargar(), intervaloMs);
    return () => clearInterval(t);
  }, [intervaloMs, recargar]);

  const agregar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await solicitar.ejecutar(codigo);
    if (!r) return;
    setCodigo('');
    setAviso(r.estado === 'aceptada' ? `¡${r.amigo.nombre} ya es tu amigo!` : `Le mandamos la solicitud a ${r.amigo.nombre}`);
  };

  if (cargando && !miCodigo) return <Cargando />;

  return (
    <>
      <h1 className={p.titulo}>Amigos</h1>

      <div className={p.dosColumnas} style={{ marginBottom: 16 }}>
        <Tarjeta titulo="Tu código" icono={<UserPlus size={16} />}>
          <MiCodigo codigo={miCodigo} />
        </Tarjeta>

        <Tarjeta titulo="Agregar con su código">
          <form onSubmit={agregar} className="pila" style={{ gap: 12 }}>
            <input
              className={s.campoCodigo}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, LARGO_CODIGO))}
              placeholder="ABC123"
              aria-label="Código de tu amigo"
              autoCapitalize="characters"
            />
            <Boton type="submit" disabled={codigo.length !== LARGO_CODIGO} cargando={solicitar.cargando}>
              Mandar solicitud
            </Boton>
            {solicitar.error && <p className={s.error}>{solicitar.error}</p>}
            {aviso && !solicitar.error && <p className={s.aviso}>{aviso}</p>}
          </form>
        </Tarjeta>
      </div>

      {error && <MensajeError mensaje={error} alReintentar={recargar} />}

      {pendientes.length > 0 && (
        <Tarjeta titulo={`Te quieren agregar (${pendientes.length})`} className={s.tarjeta}>
          {pendientes.map((x) => (
            <div key={x.id} className={s.fila}>
              <Avatar nombre={x.nombre} clave={x.avatar} />
              <b className={s.nombre}>{x.nombre}</b>
              <Boton tamano="s" variante="exito" icono={<Check size={14} />} onClick={() => aceptar.ejecutar(x.id)} disabled={aceptar.cargando}>
                Aceptar
              </Boton>
              <Boton tamano="s" variante="fantasma" icono={<X size={14} />} onClick={() => quitar.ejecutar(x.id)} disabled={quitar.cargando}>
                No
              </Boton>
            </div>
          ))}
        </Tarjeta>
      )}

      <Tarjeta titulo={`Mis amigos (${amigos.length})`} className={s.tarjeta}>
        {!amigos.length ? (
          <Vacio>Todavía no agregas a nadie. Pásale tu código a tus compas.</Vacio>
        ) : (
          amigos.map((a) => <FilaAmigo key={a.id} amigo={a} alEntrar={(id) => navegar(`/sala/${id}`)} alQuitar={() => quitar.ejecutar(a.id)} />)
        )}
      </Tarjeta>

      {enviadas.length > 0 && (
        <Tarjeta titulo="Solicitudes que mandaste" className={s.tarjeta}>
          {enviadas.map((x) => (
            <div key={x.id} className={s.fila}>
              <Avatar nombre={x.nombre} clave={x.avatar} />
              <b className={s.nombre}>{x.nombre}</b>
              <Chip>Esperando</Chip>
              <Boton tamano="s" variante="fantasma" onClick={() => quitar.ejecutar(x.id)}>
                Cancelar
              </Boton>
            </div>
          ))}
        </Tarjeta>
      )}
    </>
  );
}

/** Tu código para que te agreguen, con copiar y compartir. */
function MiCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);
  const texto = `Agrégame en la Lotería: mi código es ${codigo}`;
  const copiar = async () => {
    await navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };
  return (
    <div className="pila" style={{ gap: 12 }}>
      <div className={s.codigo}>{codigo}</div>
      <p className="texto-suave" style={{ margin: 0, textAlign: 'center' }}>
        Pásalo para que te agreguen. Nadie puede buscarte sin él.
      </p>
      <div className="fila" style={{ justifyContent: 'center' }}>
        <Boton tamano="s" variante="secundario" icono={copiado ? <Check size={16} /> : <Copy size={16} />} onClick={copiar}>
          {copiado ? '¡Copiado!' : 'Copiar'}
        </Boton>
        <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noreferrer">
          <Boton tamano="s" variante="exito" icono={<MessageCircle size={16} />}>
            Compartir
          </Boton>
        </a>
      </div>
    </div>
  );
}

interface FilaProps {
  amigo: Amigo;
  alEntrar: (salaId: string) => void;
  alQuitar: () => void;
}

function FilaAmigo({ amigo, alEntrar, alQuitar }: FilaProps) {
  const [verRevanchas, setVerRevanchas] = useState(false);
  const { insignia, nivel } = nivelYInsignia(amigo.puntos_ganados);
  return (
    <div className={s.amigo}>
      <div className={s.fila}>
        <Avatar nombre={amigo.nombre} clave={amigo.avatar} conectado={amigo.en_linea} />
        <span className={s.nombre}>
          <b>{amigo.nombre}</b>
          <span className="texto-suave">
            {' '}
            {insignia.emoji} {insignia.nombre} · nivel {nivel}
          </span>
          <div className="texto-suave">
            {amigo.sala_nombre ? `Jugando en "${amigo.sala_nombre}"` : amigo.en_linea ? 'En línea' : 'Desconectado'}
          </div>
        </span>
        {amigo.sala_id && (
          <Boton tamano="s" onClick={() => alEntrar(amigo.sala_id!)}>
            Caerle
          </Boton>
        )}
        <Boton tamano="s" variante="secundario" icono={<Swords size={14} />} onClick={() => setVerRevanchas((v) => !v)}>
          Revanchas
        </Boton>
        <Boton tamano="s" variante="fantasma" onClick={alQuitar} aria-label={`Quitar a ${amigo.nombre}`}>
          <X size={14} />
        </Boton>
      </div>
      {verRevanchas && <Revanchas amigoId={amigo.id} />}
    </div>
  );
}

function Revanchas({ amigoId }: { amigoId: string }) {
  const { revanchas, cargando } = useRevanchas(amigoId);
  if (cargando || !revanchas) return <p className="texto-suave">Contando…</p>;
  const { juntas, gane, gano } = revanchas;
  if (!juntas) return <p className="texto-suave">Todavía no juegan una ronda juntos.</p>;
  return (
    <div className={s.revanchas}>
      <span>
        <b>{gane}</b> tú
      </span>
      <span className="texto-suave">{juntas} partida(s) juntos</span>
      <span>
        <b>{gano}</b> {revanchas.amigo.nombre}
      </span>
    </div>
  );
}
