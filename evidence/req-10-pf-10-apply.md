# PF-10 Apply — evidencia reproducible

## Identidad

- Change: `req-10-pf-10-seguridad-operacional-validacion-i`
- Rama/worktree: `request-10-pf-10-seguridad-operacional-validacion-i`
- Base observada: `0e58989` (PF-09 integrada en `origin/main`)
- Estado: la carpeta OpenSpec del cambio es el único estado no versionado inicial; no se modificó el remoto ni se publicó.

## Inventario

- Límites/payload/origin: `apps/api/src/online/config.ts`, `protocol.ts`, `websocket.ts`.
- Transición autoritativa, TTL, credenciales y reconexión: `apps/api/src/online/rooms.ts`.
- Búsqueda/reservas y expiración: `apps/api/src/online/public-matching.ts`.
- Health/config/métricas: `apps/api/src/server.ts`, `apps/api/src/online/metrics.ts`.
- Frontend WSS/base path: `apps/web/src/assets/runtime-config.js`, `app.component.ts`.
- Docker/healthcheck: `Dockerfile`; guía de propietario: `docs/DEPLOYMENT-PF10.md`.

## Deterministic checks

- `npm run lint --workspace=@picas-fijas/api` — PASS, exit 0.
- `npm test --workspace=@picas-fijas/api` — PASS, 25 tests, exit 0.
- `npm run build --workspace=@picas-fijas/web` — PASS, exit 0.
- `npm run check` — PASS, lint + 70 unit tests + build + 72 Playwright tests, exit 0.
- `npx playwright test e2e/pf10-visual-evidence.spec.ts --workers=1` — PASS, 15 tests, exit 0; 18 annotated PNGs validated by `node evidence/visual/run-pf10-evidence.mjs`.
- Candidate SHA: `c4f408feedf7d7a5a858f9164f37b3990bbfd075`.
- `npm run test` — first full run had one transient API WebSocket timeout; the exact test was rerun and passed (25/25). Web 22/22, game-core 23/23.
- `npm run build` — PASS, exit 0.
- `npm run e2e` — PASS, exit 0, 72/72. The reported six-digit hard-machine regression also passed in the focused test.
- `node evidence/req-10-pf-10-startup.mjs` — exit 0 at candidate `c4f408feedf7d7a5a858f9164f37b3990bbfd075`, static frontend server and configurable backend health/config PASS; the harness attempts `docker info`, image build, detached container, published port and `/health`, then cleanup when a daemon exists. Docker startup remains NOT_VERIFIED because the default daemon socket is absent and the isolated rootless attempt fails with `operation not permitted`; sanitized result is `BLOCKED` in `evidence/req-10-pf-10-startup.json`.
- `docker build --tag picas-fijas-pf10-candidate:local .` — NOT_VERIFIED: daemon ausente (`/var/run/docker.sock`).
- `node evidence/req-10-pf-10-load.mjs` — PASS, harness reproducible sin DB/servicios pagos.
- Auditoría de solicitudes/runtime/logs: PASS, ver `evidence/req-10-pf-10-audit.md`.

No se declara PASS para checks aún no ejecutados. Docker permanece NOT_VERIFIED porque el daemon no está disponible en Apply; no se simula un arranque de contenedor. Los logs de esta evidencia no contienen payloads, credenciales ni IP completa.
