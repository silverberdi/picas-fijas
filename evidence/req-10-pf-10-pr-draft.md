# PR draft — PF-10

## Identidad

- Rama: `request-10-pf-10-seguridad-operacional-validacion-i`
- Base SHA exacta: `0e58989560c1ed906ca7e82e3117f72ffa6b179f`
- Head SHA exacta del candidato: `77a9d14b86bc0a3bf259f7965d578b7e1f088aa4`
- Merge/publicación: no realizados.

## Resumen

Centraliza límites operacionales configurables y métricas anónimas en memoria, añade healthcheck/configuración pública de WSS y documentación de despliegue sin mutar infraestructura. Conserva la autoridad de salas, TTL/reconexión neutral y juego local offline.

## Evidencia

- Unit/integration: API 25 tests PASS; web 22 tests PASS; game-core 23 tests PASS.
- Build: frontend production PASS.
- E2E real: `npm run check` PASS, 72/72 con dos contextos, offline, reconexión, accesibilidad, temas y viewports requeridos.
- Startup candidato: frontend estático + backend health/config PASS; el criterio completo permanece BLOCKED porque Docker no tiene daemon disponible y rootless falla por `operation not permitted`, conservado explícitamente.
- Harness de carga y auditoría: `evidence/req-10-pf-10-load.mjs`, `evidence/req-10-pf-10-audit.md`.
- Fallback visual Stitch: `evidence/req-10-pf-10-visual-manifest.json`, `status: fallback_applied`, `blocking: false`, 18 PNG anotados y reporte reproducible.

## Escenarios Gherkin cubiertos

- Origin/payload inválido: rechazo estable sin mutación ni secretos.
- Límite temporal: rechazo recuperable y recuperación tras la ventana.
- TTL/reconexión/reinicio: limpieza idempotente e interrupción neutral.
- Offline/local: el motor continúa sin backend.

## Pendientes honestos

 Docker no pudo arrancar porque el daemon local no está disponible y el intento rootless falla con `operation not permitted`; queda como NOT_VERIFIED para Verify. Se solicita al propietario validar explícitamente publicación, DNS, reverse proxy HTTPS/WSS, base path PWA y rollback; no se hace merge ni publicación automática.
