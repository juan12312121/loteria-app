import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Layers, Smartphone, Sparkles, Trophy, Users } from 'lucide-react';
import { useSesion } from '@loteria/core';
import { PapelPicado } from '../../componentes/ui/basicos';
import { Carta, Ficha } from '../../componentes/juego/Carta';
import { MiniFigura } from '../../componentes/juego/Cantor';
import { EscenaCantor } from './EscenaCantor';
import { FIGURAS_LANDING, listaCartasDemo } from './demo';
import s from './landing.module.css';

const PASOS = [
  { icono: <Users size={28} />, titulo: 'Crea tu sala', texto: 'Ponle nombre, elige si canta la máquina o cantas tú y cuántas tablas puede jugar cada quien.' },
  { icono: <Smartphone size={28} />, titulo: 'Invita con el código', texto: 'Mándalo por WhatsApp. Entran desde el celular o la compu, sin descargar nada.' },
  { icono: <Layers size={28} />, titulo: 'Llena tu tabla', texto: 'Pon tus frijolitos. Cuando alguien llena su tabla, el tablero canta ¡Lotería! solito y le da el pozo.' },
];

const FICHAS_VITRINA = ['frijol', 'maiz', 'corcholata', 'chile', 'calaverita', 'moneda_oro'];

export function PaginaLanding() {
  const { perfil } = useSesion();
  const navegar = useNavigate();
  const [codigo, setCodigo] = useState('');
  const destinoJugar = perfil ? '/jugar' : '/entrar?modo=registro';

  const entrarConCodigo = (e: FormEvent) => {
    e.preventDefault();
    navegar(`/jugar?codigo=${codigo}`);
  };

  return (
    <div className={s.pagina}>
      <PapelPicado />

      <header className={s.nav}>
        <Link to="/" className={s.logo}>
          ¡Lotería!
        </Link>
        <nav className={s.enlaces}>
          <a href="#como">Cómo se juega</a>
          <a href="#figuras">Figuras</a>
          <a href="#premios">Premios</a>
        </nav>
        <Link to={perfil ? '/jugar' : '/entrar'} className={s.botonNav}>
          {perfil ? `Hola, ${perfil.nombre}` : 'Entrar'}
        </Link>
      </header>

      {/* ---------- Hero ---------- */}
      <section className={s.hero}>
        <div className={s.heroTexto}>
          <span className={s.sello}>La de siempre, ahora en línea</span>
          <h1 className={s.titular}>
            ¡Se va <br />y se corre!
          </h1>
          <p className={s.bajada}>
            Juega lotería mexicana con tu familia y tus compas desde donde estén. El cantor canta, tú pones tus frijolitos y cuando alguien llena su tabla el tablero canta <b>¡Lotería!</b> solito.
          </p>
          <div className={s.acciones}>
            <Link to={destinoJugar} className={s.cta}>
              Crear mi sala
            </Link>
            <form onSubmit={entrarConCodigo} className={s.codigo}>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="CÓDIGO"
                aria-label="Código de sala"
                autoCapitalize="characters"
              />
              <button type="submit" disabled={codigo.length !== 6}>
                Entrar
              </button>
            </form>
          </div>
          <ul className={s.garantias}>
            <li>Gratis</li>
            <li>Sin descargar</li>
            <li>Celular o compu</li>
          </ul>
        </div>
        <EscenaCantor />
      </section>

      {/* ---------- Cinta de cartas ---------- */}
      <div className={s.cinta} aria-hidden>
        <div className={s.cintaPista}>
          {[...listaCartasDemo, ...listaCartasDemo].map((c, i) => (
            <div key={i} className={s.cintaCarta}>
              <Carta carta={c} tamano="chica" />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Cómo se juega ---------- */}
      <section id="como" className={s.seccion}>
        <h2 className={s.tituloSeccion}>Cómo se juega</h2>
        <p className={s.subtituloSeccion}>Tres pasos y ya están jugando, como en la kermés.</p>
        <ol className={s.pasos}>
          {PASOS.map((p, i) => (
            <li key={p.titulo} className={s.paso}>
              <span className={s.pasoNumero}>{i + 1}</span>
              <span className={s.pasoIcono}>{p.icono}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Figuras ---------- */}
      <section id="figuras" className={`${s.seccion} ${s.seccionPapel}`}>
        <h2 className={s.tituloSeccion}>Se gana con tabla llena</h2>
        <p className={s.subtituloSeccion}>
          Como la lotería de verdad. En el camino se anuncian las figuras y el primero que las hace se lleva puntos extra.
        </p>
        <div className={s.figuras}>
          {FIGURAS_LANDING.map((f) => (
            <article key={f.clave} className={`${s.figura} ${f.gana ? s.figuraGana : ''}`}>
              <div className={s.figuraDiagrama}>
                <MiniFigura mascara={f.mascara} />
              </div>
              <h3>{f.nombre}</h3>
              <p>{f.texto}</p>
              <span className={s.figuraPremio}>{f.premio}</span>
            </article>
          ))}
        </div>
        <p className={s.nota}>
          <Sparkles size={16} /> Nadie grita: el tablero revisa todas las tablas contra las cartas que salieron y anuncia solo. Cero trampas.
        </p>
      </section>

      {/* ---------- Premios ---------- */}
      <section id="premios" className={`${s.seccion} ${s.premios}`}>
        <div>
          <h2 className={s.tituloSeccion} style={{ textAlign: 'left' }}>
            Juega, gana puntos y presume tu ficha
          </h2>
          <ul className={s.listaPremios}>
            <li>
              <Trophy size={20} />
              <span>
                <b>+5 puntos por cada tabla</b> que juegues, ganes o no.
              </span>
            </li>
            <li>
              <Layers size={20} />
              <span>
                <b>Varias tablas a la vez:</b> más tablas, más chance y bono extra.
              </span>
            </li>
            <li>
              <Gift size={20} />
              <span>
                <b>Canjea tus puntos</b> por fichas y estilos de carta: del frijolito a la moneda de oro.
              </span>
            </li>
          </ul>
          <Link to={destinoJugar} className={s.cta}>
            Empezar a jugar
          </Link>
        </div>
        <div className={s.vitrina}>
          {FICHAS_VITRINA.map((clave) => (
            <div key={clave} className={s.vitrinaFicha}>
              <Ficha skin={clave} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className={s.cierre}>
        <PapelPicado alto={44} />
        <h2>¿Listos? ¡Se va y se corre!</h2>
        <p>Arma tu sala en un minuto y manda el código al grupo de la familia.</p>
        <Link to={destinoJugar} className={`${s.cta} ${s.ctaInvertido}`}>
          Crear mi sala gratis
        </Link>
      </section>

      <footer className={s.pie}>
        <span className={s.logo}>¡Lotería!</span>
        <span>Hecho con cariño para jugar en familia · Ilustraciones originales</span>
      </footer>
    </div>
  );
}
