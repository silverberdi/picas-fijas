# Evidencia Apply PF-04

- Rama/worktree: `request-4-pf-04-duelo-y-carrera-contra-la-maquina`.
- Check completo: `npm run check` terminó con exit code `0` el 26 de noviembre de 2026.
- Cobertura del check: lint de web/API/game-core, 26 pruebas unitarias e integración, build de los tres workspaces y `12 passed` en Playwright.
- Evidencia visual: `node evidence/visual/run-evidence.mjs` terminó con exit code `0`; el manifiesto valida los cinco fallbacks PF-04 y sus SHA-256.
- Regresión corregida durante Apply: se restauró `Registrar intento local` sólo para partidas individuales en `app.component.pf03.html`; la prueba aislada pasó `1 passed` y el check completo posterior pasó `12 passed`.
- Retiro seguro: `app.component.pf03.html` es la única plantilla runtime usada por `AppComponent`; no hay una ruta PF-04 anterior suplantada ni callers adicionales que retirar. `apps/web/src/app/app.component.html` permanece como shell histórico no referenciado por `templateUrl` y no se elimina porque las pruebas de procedencia lo leen explícitamente.
- PR obligatorio: pendiente de consolidación por el coordinador. No se inventa URL ni candidate SHA durante Apply; el SHA candidato se establecerá después de consolidar este worktree.
- Estado de evidencia candidata: `NOT_VERIFIED` para la vinculación final al PR/candidate SHA hasta que exista esa identidad inmutable.
