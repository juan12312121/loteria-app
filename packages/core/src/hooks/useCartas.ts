import { useMemo } from 'react';
import { useServicios } from '../contexto/LoteriaProvider';
import type { LoteriaApi } from '../api/recursos';
import type { Carta } from '../tipos';
import { useConsulta } from './genericos';

/** Las 54 cartas casi nunca cambian: se piden una vez por cliente y se comparten. */
const cache = new WeakMap<LoteriaApi, Promise<Carta[]>>();

function cartasDe(api: LoteriaApi) {
  let promesa = cache.get(api);
  if (!promesa) {
    promesa = api.catalogo.cartas().catch((e) => {
      cache.delete(api);
      throw e;
    });
    cache.set(api, promesa);
  }
  return promesa;
}

/** Baraja completa indexada por id, para dibujar tablas que solo traen números. */
export function useCartas() {
  const { api } = useServicios();
  const consulta = useConsulta(() => cartasDe(api), [api]);
  const porId = useMemo(() => new Map((consulta.data ?? []).map((c) => [c.id, c])), [consulta.data]);
  return { cartas: consulta.data ?? [], porId, cargando: consulta.cargando };
}
