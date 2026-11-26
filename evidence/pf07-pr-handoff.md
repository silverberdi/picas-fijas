# Handoff PR PF-07

## Escenarios

- Reserva exacta y FIFO sin datos personales.
- Cancelación/desconexión idempotente y expiración de oferta a 20 s.
- Aceptación bilateral, entrada humana única y cierre neutral del bot.
- Listado/cola/oferta accesibles en los tres viewports declarados.
- Matriz visual anotada: 30 PNG en `evidence/visual/pf07/`, manifiesto SHA-256 `evidence/pf07-visual-evidence.json`, reporte y diferencias en `evidence/visual/pf07-report.md`.

## Checks

`npm run check` → exit code 0, incluyendo lint, unit/integration (8 web + 21 API + 23 game-core), build y 26 E2E Playwright.

`npx playwright test e2e/pf07-visual-evidence.spec.ts` → exit code 0; `node evidence/visual/run-pf07-evidence.mjs` → exit code 0. Los PNG y reportes se versionan en Git/PR; `test-results/` y `playwright-report/` se retienen como artefactos CI por 14 días.

## Revisión de alcance

No se agregan PostgreSQL, Redis, servicios externos, chat, perfiles, fotos, ranking, dependencias Stitch/CDN ni cambios al catálogo histórico PF-06. El PR debe adjuntar las capturas PNG comparativas anotadas y su ubicación/retención CI antes de Verify.
