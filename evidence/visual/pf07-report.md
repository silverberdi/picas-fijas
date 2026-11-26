# Reporte visual PF-07

La matriz se genera con `npx playwright test e2e/pf07-visual-evidence.spec.ts` y se valida con `node evidence/visual/run-pf07-evidence.mjs`. Cada captura es una imagen PNG real de Chromium, anotada dentro del navegador con pantalla, estado, tema y viewport.

## Cobertura

- Pantallas/estados: listado, cola activa, oferta pendiente, aceptación enviada y oferta cancelada.
- Temas: `light` y `dark`.
- Viewports: `360x640`, `390x844` y `1280x720`.
- Total: 30 PNG trazables en `evidence/visual/pf07/`.

## Diferencias justificadas

Las referencias Stitch exactas están registradas en `evidence/pf07-visual-manifest.json`; en esta ejecución la integración no está disponible y el manifiesto conserva `status: fallback_applied` y `blocking: false`. Las pantallas de listado, cola y oferta son extensiones del shell Party y de `home`, `create-room`, `waiting` y las partidas contra la máquina. La aceptación enviada y la cancelación se capturan después de la acción observable; la transición autoritativa completa permanece cubierta por las pruebas de protocolo y E2E PF-07.

No se añaden datos personales, chat, fotos, perfiles ni ranking. La banda inferior sólo es metadato de evidencia y no forma parte del runtime.

## Retención CI/PR

Los PNG de esta matriz y los dos JSON/reportes se versionan en Git y se adjuntan al PR. `test-results/` y `playwright-report/` siguen excluidos de Git y deben publicarse como artefactos de CI por 14 días. El verificador falla ante PNG ausente, dimensión incorrecta o SHA-256 distinto.
