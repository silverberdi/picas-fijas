# Inventario PF-03

- Shell: `apps/web/src/app/app.component.ts`, `apps/web/src/app/app.component.pf03.html`, `apps/web/src/styles.css` y `apps/web/src/pf03.css`.
- Motor y exports: `packages/game-core/src/index.ts`; presets/transiciones consumidos por `configFromLevel`, `createIndividualState` y `submitIndividualAttempt`.
- Callers/rutas: PF-01 tenía un único `pf-root` sin router ni ruta individual separada; PF-03 se integra en el mismo shell con estados `configuration`, `tutorial`, `game` y `result`.
- Almacenamiento: `localStorage` sólo conserva preferencias de modo/nivel/tema/configuración; el secreto vive en memoria de la partida y no se serializa en la política de ayuda.
- PF-01/PF-02: presentes en `openspec/changes/archive/` y `openspec/specs/`; pruebas y build pasan sin duplicar reglas.
