# Proposal

## Why

PF-08 deja disponibles estadísticas y preferencias locales, pero el producto aún necesita completar el contrato transversal de calidad audiovisual, accesibilidad y funcionamiento offline para que las partidas sigan siendo utilizables sin red y por teclado, lector de pantalla o usuarios con reducción de movimiento. Este incremento cierra esa experiencia sin introducir dependencias de runtime, música, recursos remotos ni cambios en las reglas de Picas y Fijas.

## What Changes

- Añadir efectos sonoros originales y locales, iconos PWA/favicon e ilustraciones SVG/CSS propias, con licencia y manifiesto de procedencia.
- Hacer accesibles los controles y estados de todas las vistas: nombres accesibles, etiquetas P/F, foco visible, contraste, uso por teclado, lector de pantalla, información no dependiente sólo del color, `reduced-motion` y vibración opcional.
- Añadir un service worker con caché segura del shell y recursos locales, actualización controlada, instalación PWA y `offline.html`; conservar la funcionalidad local tras cortar internet y limitar las funciones online únicamente cuando no haya conexión.
- Integrar mute, volumen, vibración y reducción de movimiento con las preferencias locales existentes de PF-08, aplicándolas de forma consistente en todas las vistas y recargas offline.
- Registrar la contingencia Stitch exigida: el proyecto `7461201299918295899` y los cinco IDs solicitados se consultarán mediante la integración disponible; en esta sesión, si no está disponible, se usará el HTML versionado de `assets/references/` con `status: fallback_applied` y `blocking: false`, sin convertir Stitch en dependencia de runtime.
- Añadir pruebas automatizadas unitarias/integración y Playwright real para offline, accesibilidad, preferencias, sonidos y PWA, más capturas PNG comparativas anotadas, manifiesto, scripts, reporte y diferencias trazables por estado, tema y viewport.

## Capabilities

### New Capabilities

- `audiovisual-accessibility-and-offline-pwa`: Efectos y recursos locales, accesibilidad transversal, preferencias audiovisuales y operación PWA offline tras la primera carga.

### Modified Capabilities

- `visual-system-and-evidence`: Extiende el contrato visual para incluir los estados accesibles/offline, el manifiesto de las referencias exactas de PF-09 y evidencia Playwright de PWA, reduced-motion, mute y ausencia de recursos remotos.
- `local-statistics-medals-preferences`: Extiende la persistencia y aplicación transversal de preferencias de mute, volumen, vibración y reducción de movimiento, preservando estadísticas y medallas durante recargas offline.

## Impact

- Afecta la aplicación web, sus componentes de interacción, estilos, estados de accesibilidad, recursos locales, manifest/service worker y fallback offline.
- Afecta pruebas de navegador y artefactos de evidencia visual; el executor configurado deberá ejecutar Playwright y conservar resultados observables en Apply/Verify.
- No cambia el motor de reglas, los contratos online ni el modelo de producto; las operaciones online pueden degradarse sólo por falta de conexión.
- No añade dependencias externas de runtime ni CDN. La referencia Stitch y sus HTML son sólo insumos de diseño/verificación; PRODUCT-BASELINE y `assets/references/README.md` prevalecen.
