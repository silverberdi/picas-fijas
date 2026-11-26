# Reporte visual PF-01

El executor Playwright genera capturas con el patrón `home-{theme}-{viewport}.png` y conserva videos únicamente para flujos reproducibles de la implementación. Los artefactos pesados se publican como artefactos CI/PR bajo `playwright-report/` y `test-results/`, con retención de 14 días; los manifiestos, scripts y diferencias permanecen en Git.

La comparación usa los cuatro fallbacks exactos del contrato: home móvil, home escritorio, levels y settings. Stitch no pudo autenticarse en Apply (`UNAUTHORIZED`, `oauth_refresh_token_missing`), por lo que no se afirma snapshot Stitch y la cobertura visual sigue bloqueada para Verify.

Checks: 360×640, 390×844 y 1280×720; claro/oscuro; navegación por teclado; partida local después de desconectar la red; historial con scroll interno.
