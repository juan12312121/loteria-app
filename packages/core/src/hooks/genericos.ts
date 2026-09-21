import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';
import { mensajeDeError } from '../api/http';
import { useServicios } from '../contexto/LoteriaProvider';
import type { EventosSala } from '../tipos';

export interface Consulta<T> {
  data: T | undefined;
  error: string | null;
  cargando: boolean;
  recargar: () => Promise<void>;
  /** Actualiza los datos locales sin volver a pedirlos (eventos en vivo, optimismo). */
  fijar: (actualizar: (actual: T | undefined) => T | undefined) => void;
}

/**
 * Carga datos al montar y cuando cambian las dependencias. Ignora respuestas
 * viejas si llega una más nueva (evita carreras al cambiar de pantalla).
 */
export function useConsulta<T>(cargar: () => Promise<T>, deps: DependencyList): Consulta<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const ultima = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recargar = useCallback(async () => {
    const id = ++ultima.current;
    setCargando(true);
    setError(null);
    try {
      const nuevo = await cargar();
      if (id === ultima.current) setData(nuevo);
    } catch (e) {
      if (id === ultima.current) setError(mensajeDeError(e));
    } finally {
      if (id === ultima.current) setCargando(false);
    }
  }, deps);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const fijar = useCallback((actualizar: (actual: T | undefined) => T | undefined) => setData((d) => actualizar(d)), []);

  return { data, error, cargando, recargar, fijar };
}

export interface Accion<A extends unknown[], R> {
  ejecutar: (...args: A) => Promise<R | undefined>;
  cargando: boolean;
  error: string | null;
  limpiarError: () => void;
}

/** Envuelve una operación (crear, canjear, cantar…) con su estado de carga y error. */
export function useAccion<A extends unknown[], R>(operacion: (...args: A) => Promise<R>): Accion<A, R> {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const actual = useRef(operacion);
  useEffect(() => {
    actual.current = operacion;
  });

  const ejecutar = useCallback(async (...args: A) => {
    setCargando(true);
    setError(null);
    try {
      return await actual.current(...args);
    } catch (e) {
      setError(mensajeDeError(e));
      return undefined;
    } finally {
      setCargando(false);
    }
  }, []);

  const limpiarError = useCallback(() => setError(null), []);
  return { ejecutar, cargando, error, limpiarError };
}

export interface ElementoCola<T> {
  id: number;
  valor: T;
}

/** Cola de avisos que se quitan solos (toasts). */
export function useCola<T>(duracionMs = 4500) {
  const [items, setItems] = useState<ElementoCola<T>[]>([]);
  const siguiente = useRef(0);

  const quitar = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const agregar = useCallback(
    (valor: T) => {
      const id = ++siguiente.current;
      setItems((xs) => [...xs, { id, valor }]);
      setTimeout(() => quitar(id), duracionMs);
    },
    [duracionMs, quitar],
  );

  return { items, agregar, quitar };
}

/** Escucha un evento de la sala mientras el componente esté montado. */
export function useEventoSala<E extends keyof EventosSala>(evento: E, manejador: (datos: EventosSala[E]) => void) {
  const { realtime } = useServicios();
  const actual = useRef(manejador);
  useEffect(() => {
    actual.current = manejador;
  });
  useEffect(() => realtime.on(evento, (d) => actual.current(d)), [realtime, evento]);
}
