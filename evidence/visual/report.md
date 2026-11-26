# Reporte visual PF-04

El executor Playwright genera las capturas comparativas PF-04 `pf04-{state}-{viewport}-{theme}.png` y conserva videos únicamente para flujos reproducibles de la implementación. Los artefactos pesados se publican como artefactos CI/PR bajo `playwright-report/` y `test-results/`, con retención de 14 días; los PNG comparativos, manifiestos, scripts y diferencias permanecen en Git.

La cobertura PF-04 incluye duelo activo en móvil claro (390×844), carrera activa en móvil claro (390×844) y resultado final de carrera en móvil claro (390×844). Cada estado tiene PNG generado en el worktree para consolidación, fallback HTML exacto, SHA-256 de referencia, SHA-256 del PNG y diferencia justificada en `comparison.json`. Stitch no pudo autenticarse en Apply (`UNAUTHORIZED`, `oauth_refresh_token_missing`), por lo que no se afirma snapshot Stitch; la cobertura contractual local es suficiente para Verify.

Checks: 360×640, 390×844 y 1280×720; claro/oscuro; navegación por teclado; partida local después de desconectar la red; historial con scroll interno; cálculo difícil de seis dígitos y resultado final de carrera contra La máquina.
