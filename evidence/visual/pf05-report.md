# Reporte visual PF-05

La suite `e2e/pf05-visual.spec.ts` genera una matriz real de las ocho pantallas online, en 360×640, 390×844 y 1280×720, con tema claro y oscuro. `run-pf05-evidence.mjs` valida firma PNG, dimensiones, cardinalidad y existencia de cada artefacto.

Las referencias Stitch permanecen en `evidence/pf05-visual-manifest.json` con `status: fallback_applied` y `blocking: false`; la integración no estuvo disponible y no se afirma un snapshot remoto. Las diferencias justificadas son que el catálogo comparte el shell Angular, los estados se expresan con texto/atributos además de color y el backend se conecta sólo en las acciones de sala.

No se declara video como evidencia contractual; Playwright conserva video sólo como auxiliar de ejecución.
