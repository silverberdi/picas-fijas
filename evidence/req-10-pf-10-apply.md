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
- `npm run e2e` — PASS, 57 tests, exit 0.
- `docker build --tag picas-fijas-pf10-candidate:local .` — NOT_VERIFIED: daemon ausente (`/var/run/docker.sock`).
- `node evidence/req-10-pf-10-load.mjs` — PASS, harness reproducible sin DB/servicios pagos.
- Auditoría de solicitudes/runtime/logs: PASS, ver `evidence/req-10-pf-10-audit.md`.

No se declara PASS para checks aún no ejecutados. Los logs de esta evidencia no contienen payloads, credenciales ni IP completa.
