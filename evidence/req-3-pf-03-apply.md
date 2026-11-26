# Apply PF-03 — matriz de trazabilidad

Rama: `request-3-pf-03-partida-individual-tutorial-y-ayud`

| Escenario/spec | Prueba | Evidencia |
|---|---|---|
| Configuración estándar/personalizada y offline | `e2e/shell.spec.ts`, `individual-game.spec.ts` | Playwright PASS; build local sin API |
| Entrada, borrado, validación e historial | `individual-game.spec.ts`; `packages/game-core/test/game-core.test.mjs` | teclado/tacto y contrato PF-02 PASS |
| Notas manuales | `individual-game.spec.ts` | edición de ambos campos PASS |
| Layout y scroll | `individual-game.spec.ts` | 360×640, 390×844, 1280×720 PASS |
| Tutorial accesible/local | `individual-game.spec.ts` | offline y retorno PASS |
| Ayudas sin secreto y límite | `packages/game-core/test/game-core.test.mjs`, `individual-game.spec.ts` | política pura, cuarta solicitud rechazada PASS |
| Resultado unificado | `individual-game.spec.ts` | abandono PASS; motor cubre victoria y agotamiento |
| Procedencia visual | `evidence/stitch-manifest.json`, `evidence/visual/pf03-comparison.json` | fallback aplicado, hashes deterministas |
| Entrega técnica | `npm run lint`, `npm test`, `npm run build`, `npm run e2e` | exit code 0 |
| Runtime seguro | `rg` sobre `apps/web/src` y `apps/web/dist/web/browser/main-*.js` | sin PrimeNG/CDN/fuentes remotas/Stitch/API/WebSocket |

## Resumen para PR

PF-03 compone configuración, partida individual offline, tutorial, notas, ayudas limitadas y resultado sobre `game-core`, sin API, CDN, Stitch runtime ni dependencias nuevas. Stitch quedó `fallback_applied` por autorización no disponible; los cuatro IDs y hashes locales están registrados. No se declara merge ni despliegue.
