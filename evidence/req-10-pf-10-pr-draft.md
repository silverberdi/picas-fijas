# PR draft — PF-10

## Identidad

- Rama: `request-10-pf-10-seguridad-operacional-validacion-i`
- Base SHA exacta: `0e58989560c1ed906ca7e82e3117f72ffa6b179f`
- Head SHA observada durante Apply: `cf74a769c5e60072624284a61bf31050a7119d68`
- Merge/publicación: no realizados.

## Resumen

Centraliza límites operacionales configurables y métricas anónimas en memoria, añade healthcheck/configuración pública de WSS y documentación de despliegue sin mutar infraestructura. Conserva la autoridad de salas, TTL/reconexión neutral y juego local offline.

## Evidencia

- Unit/integration: API 25 tests PASS; web 22 tests PASS; game-core 23 tests PASS.
- Build: frontend production PASS.
- E2E real: `npm run e2e` PASS, 72/72 con dos contextos, offline, reconexión, accesibilidad, temas y viewports requeridos. La regresión de cálculo difícil de seis dígitos fue corregida y verificada en E2E enfocado y en la suite integral.
- Startup candidato `cf74a769c5e60072624284a61bf31050a7119d68`: frontend estático + backend health/config PASS; el criterio completo permanece BLOCKED porque Docker no tiene daemon disponible y el intento aislado como usuario sin privilegios falla porque `dockerd` requiere root, conservado explícitamente en `evidence/req-10-pf-10-startup.json`.
- Harness de carga y auditoría: `evidence/req-10-pf-10-load.mjs`, `evidence/req-10-pf-10-audit.md`.
- Fallback visual Stitch: `evidence/req-10-pf-10-visual-manifest.json`, `status: fallback_applied`, `blocking: false`, 18 PNG anotados y reporte reproducible.

## Escenarios Gherkin cubiertos

- Origin/payload inválido: rechazo estable sin mutación ni secretos.
- Límite temporal: rechazo recuperable y recuperación tras la ventana.
- TTL/reconexión/reinicio: limpieza idempotente e interrupción neutral.
- Offline/local: el motor continúa sin backend.

## Pendientes honestos

 Docker no pudo arrancar porque el daemon local no está disponible y el intento aislado como usuario sin privilegios falla porque `dockerd` requiere root; queda como NOT_VERIFIED para Verify. Se solicita al propietario validar explícitamente publicación, DNS, reverse proxy HTTPS/WSS, base path PWA y rollback; no se hace merge ni publicación automática.
