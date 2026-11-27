# Evidencia visual PF-10

- Resultado: PASS (18/18 capturas anotadas generadas por Playwright real).
- Stitch: status: fallback_applied; blocking: false; se usaron los HTML locales versionados como referencia.
- Matriz: claro/oscuro, 360×640, 390×844 y 1280×720; partida, resultado por interrupción, offline y ajustes.
- Trazabilidad: el manifiesto registra SHA-256 de cada PNG, referencia, implementación y SHA observado al generar.
- Diferencias justificadas: la referencia Stitch es estática; la captura de implementación demuestra el estado funcional real, accesible, sin dependencia remota y con scroll general bloqueado durante partida.
- Comando: npx playwright test e2e/pf10-visual-evidence.spec.ts --workers=1; validador: node evidence/visual/run-pf10-evidence.mjs.
