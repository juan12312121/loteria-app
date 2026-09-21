import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alternarBit, bitsDeMascara, casillasDeTabla, contarMarcas, indicesDeCasillas, progresoTabla } from './tabla';

const tabla = Array.from({ length: 16 }, (_, i) => i + 1);

test('casillas con coordenadas, cantadas y marcas', () => {
  const casillas = casillasDeTabla(tabla, new Set([1, 16]), 0b1);
  assert.deepEqual(casillas[0], { indice: 0, fila: 0, col: 0, carta: 1, cantada: true, marcada: true, destacada: false });
  assert.deepEqual(casillas[15], { indice: 15, fila: 3, col: 3, carta: 16, cantada: true, marcada: false, destacada: false });
});

test('progreso y marcas', () => {
  assert.equal(progresoTabla(tabla, new Set([1, 2, 99])), 2);
  assert.equal(contarMarcas(alternarBit(alternarBit(0, 3), 5)), 2);
  assert.equal(alternarBit(alternarBit(0, 3), 3), 0);
});

test('cuatro esquinas como índices y bits', () => {
  const esquinas = [
    { fila: 0, col: 0, carta: 1 },
    { fila: 0, col: 3, carta: 4 },
    { fila: 3, col: 0, carta: 13 },
    { fila: 3, col: 3, carta: 16 },
  ];
  assert.deepEqual([...indicesDeCasillas(esquinas)], [0, 3, 12, 15]);
  assert.deepEqual(bitsDeMascara(0x9009).map((b, i) => (b ? i : -1)).filter((i) => i >= 0), [0, 3, 12, 15]);
});
