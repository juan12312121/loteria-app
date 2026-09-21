import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartasIlustradas, dataUriDeCarta, svgDeCarta } from './arte';
import { fichasIlustradas, svgDeFicha } from './fichas';
import { aparienciaCarta, svgDeMarcoCarta } from './apariencias';
import { avataresIlustrados, svgDeAvatar } from './avatares';
import { fondosIlustrados, svgDeFondo, svgMosaicoFondo } from './fondos';

test('las 54 cartas tienen ilustración', () => {
  assert.deepEqual(cartasIlustradas().sort((a, b) => a - b), Array.from({ length: 54 }, (_, i) => i + 1));
});

test('cada SVG es un documento cerrado y sin atributos rotos', () => {
  for (const id of cartasIlustradas()) {
    const svg = svgDeCarta(id);
    assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'), `carta ${id}`);
    assert.ok(svg.endsWith('</svg>'), `carta ${id}`);
    assert.ok(!/undefined|NaN/.test(svg), `carta ${id} trae undefined/NaN`);
    const abiertas = (svg.match(/<g[ >]/g) ?? []).length;
    const cerradas = (svg.match(/<\/g>/g) ?? []).length;
    assert.equal(abiertas, cerradas, `carta ${id} grupos desbalanceados`);
  }
});

test('data URI codificado para <img>', () => {
  assert.ok(dataUriDeCarta(1).startsWith('data:image/svg+xml;charset=utf-8,%3Csvg'));
});

// Mismas claves que el catálogo del backend (loteria-backend/src/juego/skins.ts)
const FICHAS_TIENDA = [
  'aguila', 'ajolote', 'calaverita', 'cempasuchil', 'chile', 'colibri', 'corcholata', 'corona_oro', 'frijol', 'jaguar', 'maiz',
  'mariposa_monarca', 'moneda_oro', 'piedrita', 'pinata', 'quetzal', 'sol_azteca', 'tortuga', 'tricolor', 'xolo',
];
const CARTAS_TIENDA = [
  'ajolote_lago', 'alebrije', 'bellas_artes', 'caribe', 'chichen_itza', 'clasica', 'dia_muertos', 'lucha_libre', 'monarca',
  'neon', 'papel_picado', 'patria', 'posada', 'selva_jaguar', 'talavera', 'xochimilco',
];
const AVATARES_TIENDA = ['av_ajolote', 'av_cantor', 'av_catrina', 'av_charro', 'av_gallo', 'av_jaguar', 'av_luchador', 'av_monarca', 'av_xolo'];
const FONDOS_TIENDA = ['altar', 'cantina', 'feria', 'kermes', 'noche_feria', 'panteon', 'playa'];

test('todas las fichas de la tienda tienen dibujo y una clave desconocida cae en frijol', () => {
  assert.deepEqual(fichasIlustradas().sort(), FICHAS_TIENDA);
  for (const clave of fichasIlustradas()) {
    const svg = svgDeFicha(clave);
    assert.ok(svg.endsWith('</svg>') && !/undefined|NaN/.test(svg), clave);
  }
  assert.equal(svgDeFicha('no-existe'), svgDeFicha('frijol'));
  assert.equal(svgDeFicha(null), svgDeFicha('frijol'));
});

test('cada skin de carta tiene apariencia propia y, salvo la clásica, marco dibujado', () => {
  for (const clave of CARTAS_TIENDA) {
    if (clave !== 'clasica') assert.notEqual(aparienciaCarta(clave), aparienciaCarta('clasica'), clave);
    const marco = svgDeMarcoCarta(clave);
    if (clave === 'clasica') assert.equal(marco, null);
    else assert.ok(marco?.endsWith('</svg>') && !/undefined|NaN/.test(marco), clave);
  }
});

test('avatares y fondos de la tienda tienen dibujo válido', () => {
  assert.deepEqual(avataresIlustrados().sort(), AVATARES_TIENDA);
  assert.deepEqual(fondosIlustrados().sort(), FONDOS_TIENDA);
  for (const clave of AVATARES_TIENDA) {
    const svg = svgDeAvatar(clave);
    assert.ok(svg.endsWith('</svg>') && !/undefined|NaN/.test(svg), clave);
    assert.equal((svg.match(/<svg/g) ?? []).length, (svg.match(/<\/svg>/g) ?? []).length, `${clave} svg anidado desbalanceado`);
  }
  for (const clave of FONDOS_TIENDA) {
    assert.ok(!/undefined|NaN/.test(svgMosaicoFondo(clave) + svgDeFondo(clave)), clave);
  }
  assert.equal(svgDeAvatar('no-existe'), svgDeAvatar('av_gallo'));
});
