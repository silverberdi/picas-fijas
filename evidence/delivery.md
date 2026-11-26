# Entrega PF-01

- Rama de trabajo: `request-1-pf-01-fundaciones-del-monorepo-pwa-y-sis`.
- Alcance: proposal, design y specs de este Change; no se introducen requisitos nuevos.
- Checks: `npm run test`, `npm run lint`, `npm run build`, `PLAYWRIGHT_BROWSERS_PATH=/opt/minime/runtime/playwright-browsers npm run e2e`, `node evidence/visual/run-evidence.mjs`.
- Última ejecución Apply: `npm run test && npm run lint && npm run build && PLAYWRIGHT_BROWSERS_PATH=/opt/minime/runtime/playwright-browsers npm run e2e && node evidence/visual/run-evidence.mjs` terminó con exit code 0; unitarios, lint y build pasaron, y Playwright/Chromium reportó 4 passed en 360×640, 390×844 y 1280×720, incluida la partida offline con historial interno.
- Stitch: las cuatro consultas `get_screen` por ID devolvieron `UNAUTHORIZED` por reautenticación requerida; no se inventan snapshots. `evidence/stitch-manifest.json` conserva IDs, respuestas, fallbacks y SHA-256; la cobertura contractual del fallback local es suficiente y no bloquea Verify.
- Artefactos pesados: `test-results/` y `playwright-report/`, excluidos de Git y destinados a artefactos CI/PR con retención de 14 días.
- PR: este archivo sirve como handoff reproducible para que el coordinador cree el PR sobre el candidato consolidado; no se hace merge ni se inventa un SHA candidato durante Apply.
