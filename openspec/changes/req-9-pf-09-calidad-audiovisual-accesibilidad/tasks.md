# Tasks

## 1. Inventario y contratos locales

- [x] 1.1 Revisar PF-08, `docs/PRODUCT-BASELINE.md`, `assets/references/README.md`, los callers de preferencias/estadísticas y el estado de la rama; verificar que el inventario de implementación queda ligado al SHA base y no introduce cambios de producto.
- [x] 1.2 Definir y versionar el manifiesto de recursos, licencia y catálogo de efectos/iconos/ilustraciones locales; verificar que cada recurso requerido tiene ruta, formato, licencia y consumidor documentados.

## 2. Recursos y política audiovisual

- [x] 2.1 Generar o sintetizar localmente los efectos WAV/OGG de teclas, validación, picas/fijas, ganar/perder y oferta, sin música; verificar reproducción determinista y ausencia de solicitudes remotas en pruebas.
- [x] 2.2 Añadir iconos PWA/favicon e ilustraciones propias SVG/CSS respetando los tokens Party; verificar tamaños, referencias locales y licencia mediante el manifiesto.
- [x] 2.3 Implementar el adaptador transversal de sonido, mute/volumen y vibración opcional, con fallback silencioso para APIs bloqueadas; verificar eventos, mute y ausencia de bloqueo con pruebas unitarias/integración.
- [x] 2.4 Integrar `prefers-reduced-motion` con la preferencia persistida en microanimaciones y celebraciones; verificar que reduced-motion elimina o reduce animaciones sin eliminar acciones ni estados.

## 3. Accesibilidad transversal

- [x] 3.1 Auditar y corregir nombres accesibles, roles, foco visible, orden de teclado y regiones de estado en inicio, tutorial, ajustes, juego, resultados y estadísticas; verificar con checks Playwright/DOM y escenarios de teclado.
- [x] 3.2 Añadir etiquetas textuales P/F, mensajes de estado y señales no basadas sólo en color; verificar navegación con lector de pantalla mediante nombres/roles expuestos y contraste en claro/oscuro.
- [x] 3.3 Confirmar que las partidas mantienen controles, reloj y último intento visibles y sólo el historial usa scroll interno; verificarlo en 360×640, 390×844 y 1280×720 según corresponda.

## 4. Preferencias y PWA offline

- [x] 4.1 Extender la migración versionada de IndexedDB de PF-08 para mute/volumen, vibración y reduced-motion con defaults idempotentes; verificar upgrade desde datos PF-08 y preservación de historial/medallas.
- [x] 4.2 Implementar manifest, registro de service worker, precache versionado del shell/recursos locales y actualización atómica; verificar que una caché incompleta no se activa y que la versión anterior permite rollback.
- [x] 4.3 Implementar `offline.html` y la degradación de funciones online sólo ante falta de conexión; verificar instalación, primera carga, corte de red, recarga, fallback y ausencia de CDN/fuentes/audio/imagen remotos.
- [x] 4.4 Verificar en navegador real que los tres modos locales, tutorial, estadísticas, preferencias y sonidos funcionan después de cortar internet; delegar navegación, viewport, asincronía y concurrencia al executor Playwright, no a operador/human_validation.

## 5. Referencias y evidencia visual

- [x] 5.1 Consultar por ID las cinco pantallas Stitch de PF-09 cuando la integración esté disponible; conservar snapshot y procedencia, o registrar error, `status: fallback_applied`, `blocking: false` y el HTML local exacto de `assets/references/`.
- [x] 5.2 Crear/actualizar scripts, manifiesto y reporte de comparación para offline, settings, classic mobile/desktop y results; verificar que cada caso identifica pantalla, estado, tema, viewport, SHA y procedencia.
- [x] 5.3 Ejecutar Playwright real con estados comparables, generar capturas PNG comparativas anotadas y registrar diferencias justificadas; verificar que no se usa una captura de Stitch como prueba de la aplicación y que el video sólo se adjunta cuando sea reproducible.
- [x] 5.4 Auditar el árbol y las solicitudes de red offline para confirmar que no quedan dependencias remotas obligatorias; verificar con el comando de auditoría y el resultado observable guardado como evidencia.

## 6. Cierre del incremento

- [x] 6.1 Ejecutar `npm run test`, `npm run build` y `npm run e2e` mediante el executor configurado, corregir regresiones y conservar resultados; verificar que las pruebas unitarias, integración y navegador cubren cada escenario de las specs.
- [x] 6.2 Ejecutar la verificación visual completa y revisar manifest/report/scripts/capturas en Git; verificar trazabilidad por pantalla, estado, viewport y tema y ausencia de diferencias no justificadas.
- [x] 6.3 Preparar evidencia para el PR obligatorio en la rama `request-9-pf-09-calidad-audiovisual-accesibilidad`, incluyendo SHA base/head, límites offline, pruebas y contingencia Stitch; verificar que no se hace merge automático.
