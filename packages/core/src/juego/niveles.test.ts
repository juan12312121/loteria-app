import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INSIGNIAS, nivelDe, xpParaNivel } from './niveles';

test('los niveles coinciden con los del servidor', () => {
  assert.equal(nivelDe(0), 1);
  assert.equal(nivelDe(xpParaNivel(2)), 2);
  assert.equal(nivelDe(xpParaNivel(7) - 1), 6);
});

/**
 * Las reglas están copiadas del backend (no se puede importar de otro repo):
 * si allá cambian, esta prueba avisa. La ruta es la del workspace del autor;
 * si no está el archivo, la prueba se salta.
 */
test('la tabla de insignias sigue igual a la del backend', () => {
  const ruta = new URL('../../../../../loteria-backend/src/juego/Niveles.ts', import.meta.url);
  let fuente: string;
  try {
    fuente = readFileSync(ruta, 'utf8');
  } catch {
    return; // sin el backend al lado, no hay nada que comparar
  }
  for (const i of INSIGNIAS) {
    assert.ok(
      fuente.includes(`{ desde: ${i.desde}, clave: '${i.clave}', nombre: '${i.nombre}', emoji: '${i.emoji}' }`),
      `la insignia ${i.clave} cambió en el backend`,
    );
  }
  assert.ok(fuente.includes('const XP_BASE = 120;'), 'cambió el costo de los niveles en el backend');
});
