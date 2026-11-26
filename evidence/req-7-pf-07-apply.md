# Apply PF-07

- Change: `req-7-pf-07-salas-publicas-y-busqueda-humana-e`.
- Prerrequisito: PF-06 está integrado en la base `727656b` y sus pruebas existentes pasan.
- Implementación: contrato v1 estricto, `PublicMatchRegistry` en memoria, FIFO por clave canónica, idempotencia, cancelación/desconexión, TTL de 20 s, oferta bilateral y entrada humana única; WebSocket `reserve/list/cancel/accept/reject/enterHuman`; rutas HTTP de listado y métricas anónimas.
- Privacidad: el listado sólo serializa id opaco, modalidad, reglas y estado; no incluye participante, credencial, secreto ni IP.
- UI: rutas públicas separadas del catálogo PF-06, búsqueda cancelable durante partida contra La máquina, oferta con cuenta atrás y mute local.
- Evidencia automatizada: `npm run check` terminó con exit code 0; lint, tests (7 web + 18 API + 23 game-core), build y Playwright (25 passed en 360×640, 390×844 y 1280×720).
- Stitch: `[PUBLISHED_EVIDENCE source="local assets/references fallback; Stitch unavailable"; sha=unknown]`; manifiesto `evidence/pf07-visual-manifest.json` conserva las seis IDs y `status: fallback_applied`, `blocking: false`.
- Artefactos Playwright pesados: `test-results/` y `playwright-report/` siguen siendo artefactos de ejecución, no evidencia candidata inmutable; las capturas PNG comparativas anotadas requieren generación/retención del PR.
- No se hizo merge, push ni se inventó SHA candidato.
