# PR draft — PF-10

## Identidad

- Rama: `request-10-pf-10-seguridad-operacional-validacion-i`
- Base SHA observada: `0e58989`
- Head SHA: pendiente de consolidación del candidato; no se inventa ni se sustituye por un SHA publicado.
- Merge/publicación: no realizados.

## Resumen

Centraliza límites operacionales configurables y métricas anónimas en memoria, añade healthcheck/configuración pública de WSS y documentación de despliegue sin mutar infraestructura. Conserva la autoridad de salas, TTL/reconexión neutral y juego local offline.

## Evidencia

- Unit/integration: API 25 tests PASS; web 22 tests PASS.
- Build: frontend production PASS.
- E2E real: 57/57 PASS con dos contextos, offline, reconexión, accesibilidad, temas y viewports requeridos.
- Harness de carga y auditoría: `evidence/req-10-pf-10-load.mjs`, `evidence/req-10-pf-10-audit.md`.
- Fallback visual Stitch: `evidence/req-10-pf-10-visual-manifest.json`, `status: fallback_applied`, `blocking: false`.

## Escenarios Gherkin cubiertos

- Origin/payload inválido: rechazo estable sin mutación ni secretos.
- Límite temporal: rechazo recuperable y recuperación tras la ventana.
- TTL/reconexión/reinicio: limpieza idempotente e interrupción neutral.
- Offline/local: el motor continúa sin backend.

## Pendientes honestos

Docker no pudo arrancar porque el daemon local no está disponible. Faltan capturas PF-10 específicas completas, la consolidación del head SHA/PR y la validación explícita del propietario. No bloquearon los checks automatizables ejecutados.
