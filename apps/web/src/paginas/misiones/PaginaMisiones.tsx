import { PanelProgreso } from '../lobby/PanelProgreso';
import s from '../paginas.module.css';

/** Recompensa diaria y misiones, fuera del lobby para que no estorben al jugar. */
export function PaginaMisiones() {
  return (
    <>
      <h1 className={s.titulo}>Misiones</h1>
      <p className="texto-suave" style={{ marginTop: 0 }}>
        Cobra tu recompensa de cada día y completa misiones para ganar puntos y skins exclusivas.
      </p>
      <PanelProgreso />
    </>
  );
}
