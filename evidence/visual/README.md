# Evidencia visual PF-01

Los artefactos pesados (capturas y videos) deben publicarse en CI/PR con retención documentada; no se inventan snapshots. El executor Playwright identifica pantalla, estado, tema y viewport en el nombre del artefacto. Las referencias locales de `assets/references/` son fallback histórico.

El manifiesto ejecutable es `evidence/visual/comparison.json`; se valida con `node evidence/visual/run-evidence.mjs`. El reporte de diferencias y la política de retención están en `report.md`.
