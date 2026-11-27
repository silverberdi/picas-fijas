# Apply PF-08

- Change: `req-8-pf-08-estadisticas-locales-medallas-y-pr`.
- Precondición PF-07: integrada en esta rama; `evidence/req-7-pf-07-apply.md` registra el gate con `npm run check` exit 0, y `apps/web/src/app/app.component.ts` conserva las rutas públicas, cancelación y oferta bilateral.
- Inventario: el único writer previo de preferencias era `pf-session` en `AppComponent`; se conserva para compatibilidad de sesión y se complementa con el store singleton `preferences`. No existía writer/aggregator de historial local ni medallas; PF-08 añade `local-progress.ts` como frontera única. No hay ruta superseded que retirar; ledger de retiro: `NONE`.
- Contrato: `local-progress.ts` define resultado terminal versionado, dimensiones exactas, elegibilidad, clave estable, estadísticas, seis medallas y preferencias validadas. IndexedDB usa `picas-fijas-local` versión 2 con `game-results` y `preferences`; la actualización crea sólo stores ausentes y no borra datos.
- Evidencia técnica: `npm run build --workspace=@picas-fijas/web` exit 0; `npm test --workspace=@picas-fijas/web` exit 0 (12 tests); `npx playwright test e2e/pf08-local-progress.spec.ts` exit 0 (4 passed, viewports 360×640, 390×844 y 1280×720).
- E2E observable: estado vacío, seed local de victoria, filtro exacto, medalla, reset cancelado/confirmado, recarga offline y tema oscuro cubiertos por `e2e/pf08-local-progress.spec.ts`.
- Stitch: consulta de `stats.html` (`90ce202387c8418aafd3e5d829061065`), `settings.html` (`7f2012d3be454c1e9cfd58203b1f4b87`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`) no disponible por reautenticación; se usa fallback HTML versionado y se registra `status: fallback_applied`, `blocking: false` en `evidence/req-8-pf-08-visual-manifest.json`.
- `[PUBLISHED_EVIDENCE source="local assets/references fallback; Stitch unavailable"; sha=unknown]` — sólo evidencia de procedencia visual, no candidata a sustituir SHA de Apply.
- Capturas generadas por Playwright: `evidence/visual/pf08/`; el executor PF-08 pasó 7 escenarios, incluyendo `results.html` en claro/oscuro para 360×640, 390×844 y 1280×720; manifiesto y hashes candidato-bound en `evidence/req-8-pf-08-visual-manifest.json`.
