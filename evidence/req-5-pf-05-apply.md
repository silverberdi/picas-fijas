# Evidencia Apply PF-05

## Alcance

La implementación añade el protocolo `v1`, configuración inyectable, registro/actor de salas en memoria, credenciales opacas, snapshots filtrados, integración con `game-core`, adaptador WebSocket nativo y el flujo Angular de sala privada. Stitch no estuvo disponible en las capacidades de Apply; se conserva [pf05-visual-manifest.json](pf05-visual-manifest.json) con `status: fallback_applied` y `blocking: false`.

## Checks reproducibles

- `npm run lint` — exit 0.
- `npm test` — exit 0; API 7 tests, game-core 21 tests, web 4 tests.
- `npm run build` — exit 0.
- `npm run e2e` — exit 0; 19 escenarios pasaron, incluyendo dos contextos para el catálogo online y la fixture visual PF-05.
- `npm run check` — exit 0; lint, unit tests, builds y E2E pasaron en el gate declarado.
- `node evidence/visual/run-evidence.mjs` — exit 0; evidencia histórica PF-04 íntegra.
- `node evidence/visual/run-pf05-evidence.mjs` — exit 0; 48 PNG PF-05 (8 pantallas × 3 viewports × 2 temas), digest determinista `b1029d87fdab0a214e60ab90fc6f4a7938277a606c22920bcd9a1bb641a03ed3`.
- API incluye handshake real contra servidor Node HTTP, frame JSON enmascarado, rechazo de esquema, privacidad, TTL, deduplicación, dos conexiones reales, reconexión, abandono, interrupción técnica y revancha.

## Pendientes explícitos

Las tareas 3.3, 4.1, 4.2, 4.3, 5.2, 5.3 y 5.4 están implementadas y marcadas. No se usa evidencia publicada: `[PUBLISHED_EVIDENCE source="none"; sha=unknown]`.
