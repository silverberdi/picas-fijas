# PF-09 Apply evidence

- Base SHA: `274a168dbdb3e5f2b0e14666b3c5f8e32b84c163`.
- Candidate head SHA: `c3730ecf03f77a7dc9c41f7b819315c47e4b4d8f`.
- `npm run test --workspace=@picas-fijas/web`: PASS, exit 0 (21 tests), including atomic precache rejection and rollback unit coverage.
- `npm run build --workspace=@picas-fijas/web`: PASS, exit 0.
- `npx playwright test e2e/pf09-accessibility-offline.spec.ts e2e/pf08-local-progress.spec.ts --workers=1`: PASS, exit 0 (13 tests), including incomplete-update rollback coverage.
- `npx playwright test e2e/pf09-visual-evidence.spec.ts --workers=1`: PASS, exit 0 (18 tests); 18 annotated PNG comparisons are listed with SHA-256 in `evidence/visual/pf09/comparison-report.json`.
- `node evidence/pf09-audit.mjs`: PASS, 10 local resources, 0 remote shell dependencies.
- `npm run test`: PASS, exit 0 (66 tests across web/api/game-core).
- `npm run build`: PASS, exit 0 (web/api/game-core).
- `npm run e2e -- --workers=1`: PASS, exit 0 (57 Playwright tests).
- Correction rerun: `npm run e2e -- --grep "la dificultad difícil mantiene"` PASS, exit 0 (1 test), including `Confirmar` re-enabled after the six-digit hard machine calculation; the same scenario also passed in the full 57-test suite.
- `apps/web/src/pf-sw.js`: required resources stage in `pf09-shell-v3-staging`; failures reject install and remove staging, while activation copies the complete staging cache before retiring the previous version.
- Stitch contingency: `status: fallback_applied`, `blocking: false`, source `assets/references/` and IDs in `evidence/req-9-pf-09-resource-manifest.json`.
- Published evidence: none used.
