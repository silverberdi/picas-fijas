# PF-09 Apply evidence

- Base SHA: `274a168dbdb3e5f2b0e14666b3c5f8e32b84c163`.
- Candidate head SHA: `unknown` until coordinator creates the immutable candidate after Apply.
- `npm run test --workspace=@picas-fijas/web`: PASS, exit 0 (19 tests).
- `npm run build --workspace=@picas-fijas/web`: PASS, exit 0.
- `npx playwright test e2e/pf09-accessibility-offline.spec.ts e2e/pf08-local-progress.spec.ts --workers=1`: PASS, exit 0 (12 tests).
- `node evidence/pf09-audit.mjs`: PASS, 10 local resources, 0 remote shell dependencies.
- Stitch contingency: `status: fallback_applied`, `blocking: false`, source `assets/references/` and IDs in `evidence/req-9-pf-09-resource-manifest.json`.
- Published evidence: none used.
