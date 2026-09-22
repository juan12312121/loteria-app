import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEMAS, colores, temaDe } from '../tema';

/** Contraste WCAG entre dos colores #RRGGBB. */
function contraste(a: string, b: string) {
  const lum = (h: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

// [texto, fondo, mínimo]: texto normal 4.5, botones y chips en negritas 3
const PARES = [
  ['tinta', 'crema', 4.5], ['tinta', 'papel', 4.5], ['tintaSuave', 'papel', 4.5], ['tintaSuave', 'crema', 4.5],
  ['anil', 'papel', 4.5], ['tinta', 'amarilloSuave', 4.5], ['blanco', 'rosa', 3], ['blanco', 'anil', 3],
  ['verde', 'verdeSuave', 3], ['rojo', 'papel', 3],
] as const;

test('cada tema tiene todos los colores y buen contraste', () => {
  for (const [clave, t] of Object.entries(TEMAS)) {
    assert.deepEqual(Object.keys(t.colores).sort(), Object.keys(colores).sort(), clave);
    for (const [texto, fondo, minimo] of PARES) {
      const r = contraste(t.colores[texto], t.colores[fondo]);
      assert.ok(r >= minimo, `${clave}: ${texto} sobre ${fondo} = ${r.toFixed(2)} (mínimo ${minimo})`);
    }
  }
});

test('las claves coinciden con el catálogo del backend y hay respaldo', () => {
  assert.deepEqual(Object.keys(TEMAS).sort(), [
    'tema_barro', 'tema_cempasuchil', 'tema_clasico', 'tema_jade', 'tema_lucha', 'tema_mercado', 'tema_noche', 'tema_talavera',
  ]);
  assert.equal(temaDe('no-existe'), TEMAS.tema_clasico);
});
