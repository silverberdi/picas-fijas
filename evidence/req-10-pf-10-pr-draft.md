# PR draft — PF-10

## Identidad

- Rama: `request-10-pf-10-seguridad-operacional-validacion-i`
- Base SHA observada: `0e58989`
- Head SHA: pendiente de consolidación del candidato; el Apply observado es `4b9a65e7c5681d28edefbdab4914b7b810ef5d39`, pero no se presenta como head final mientras existan cambios de Apply sin consolidar.
- Merge/publicación: no realizados.

## Resumen

Centraliza límites operacionales configurables y métricas anónimas en memoria, añade healthcheck/configuración pública de WSS y documentación de despliegue sin mutar infraestructura. Conserva la autoridad de salas, TTL/reconexión neutral y juego local offline.

## Evidencia

- Unit/integration: API 25 tests PASS; web 22 tests PASS; game-core 23 tests PASS.
- Build: frontend production PASS.
- E2E real: `npm run check` PASS, 72/72 con dos contextos, offline, reconexión, accesibilidad, temas y viewports requeridos.
- Startup candidato: frontend estático + backend health/config PASS; Docker NOT_VERIFIED por daemon ausente, conservado explícitamente.
- Harness de carga y auditoría: `evidence/req-10-pf-10-load.mjs`, `evidence/req-10-pf-10-audit.md`.
- Fallback visual Stitch: `evidence/req-10-pf-10-visual-manifest.json`, `status: fallback_applied`, `blocking: false`, 18 PNG anotados y reporte reproducible.

## Escenarios Gherkin cubiertos

- Origin/payload inválido: rechazo estable sin mutación ni secretos.
- Límite temporal: rechazo recuperable y recuperación tras la ventana.
- TTL/reconexión/reinicio: limpieza idempotente e interrupción neutral.
- Offline/local: el motor continúa sin backend.

## Pendientes honestos

 Docker no pudo arrancar porque el daemon local no está disponible; queda como NOT_VERIFIED para la consolidación/Verify. El head SHA final queda a cargo de la consolidación del candidato. Se solicita al propietario validar explícitamente publicación, DNS, reverse proxy HTTPS/WSS, base path PWA y rollback; no se hace merge ni publicación automática.
