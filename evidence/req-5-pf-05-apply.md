# Evidencia Apply PF-05

## Alcance

La implementación añade el protocolo `v1`, configuración inyectable, registro/actor de salas en memoria, credenciales opacas, snapshots filtrados, integración con `game-core`, adaptador WebSocket nativo y el flujo Angular de sala privada. Stitch no estuvo disponible en las capacidades de Apply; se conserva [pf05-visual-manifest.json](pf05-visual-manifest.json) con `status: fallback_applied` y `blocking: false`.

## Checks reproducibles

- `npm run lint` — exit 0.
- `npm test` — exit 0; API 7 tests, game-core 21 tests, web 4 tests.
- `npm run build` — exit 0.
- `npm run e2e` — exit 0; 17 passed.
- `npm run check` — exit 0; lint, unit tests, builds and the same 17 E2E scenarios passed in one declared gate.
- API incluye handshake real contra servidor Node HTTP, frame JSON enmascarado, rechazo de esquema, privacidad, TTL y deduplicación.

## Pendientes explícitos

Las tareas 3.3, 4.1, 4.2, 4.3, 5.2, 5.3 y 5.4 permanecen sin marcar hasta contar con implementación/evidencia específica de abandono técnico y revancha, cliente con reconexión observable, catálogo runtime de ocho pantallas, fixture E2E que arranque el proceso API y matriz visual completa. No se usa evidencia publicada: `[PUBLISHED_EVIDENCE source="none"; sha=unknown]`.
