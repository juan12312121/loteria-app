import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartasIlustradas, dataUriDeCarta, svgDeCarta } from './arte';
import { fichasIlustradas, svgDeFicha } from './fichas';

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

test('las 7 fichas de la tienda tienen dibujo y una clave desconocida cae en frijol', () => {
  assert.deepEqual(fichasIlustradas().sort(), ['calaverita', 'chile', 'corcholata', 'frijol', 'maiz', 'moneda_oro', 'piedrita']);
  for (const clave of fichasIlustradas()) {
    const svg = svgDeFicha(clave);
    assert.ok(svg.endsWith('</svg>') && !/undefined|NaN/.test(svg), clave);
  }
  assert.equal(svgDeFicha('no-existe'), svgDeFicha('frijol'));
  assert.equal(svgDeFicha(null), svgDeFicha('frijol'));
});
