import { PanelProgreso } from '../lobby/PanelProgreso';
import { PanelNivel } from '../lobby/PanelNivel';
import s from '../paginas.module.css';

/** Recompensa diaria y misiones, fuera del lobby para que no estorben al jugar. */
export function PaginaMisiones() {
  return (
    <>
      <h1 className={s.titulo}>Misiones</h1>
      <p className="texto-suave" style={{ marginTop: 0 }}>
        Tu nivel, el pase del mes, la recompensa diaria y las misiones. Todo se gana jugando.
      </p>
      <PanelNivel />
      <PanelProgreso />
    </>
  );
}
