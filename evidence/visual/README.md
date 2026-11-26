# Evidencia visual PF-04 y PF-05

PF-05 añade `e2e/pf05-visual.spec.ts`, la matriz `pf05/` y el verificador `node evidence/visual/run-pf05-evidence.mjs`. La matriz cubre las ocho pantallas, tres viewports y ambos temas; `pf05-report.md` conserva las diferencias justificadas.

Los PNG `pf04-*.png` son capturas comparativas reales generadas por `e2e/pf04-visual.spec.ts` para duelo activo, carrera activa y resultado final. Los artefactos pesados adicionales (capturas y videos) deben publicarse en CI/PR con retención documentada. El executor Playwright identifica pantalla, estado, tema y viewport en el nombre del artefacto. Las referencias locales de `assets/references/` son fallback histórico.

El manifiesto ejecutable es `evidence/visual/comparison.json`; se valida con `node evidence/visual/run-evidence.mjs`. El reporte de diferencias y la política de retención están en `report.md`.
