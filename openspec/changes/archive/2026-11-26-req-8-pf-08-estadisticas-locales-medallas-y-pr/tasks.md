# Tasks

## 1. Precondiciones y contrato local

- [x] 1.1 Confirmar en la rama y en OpenSpec que PF-07 está integrada; verificar que el gate documenta el resultado y detiene Apply si falta la integración.
- [x] 1.2 Auditar los productores y consumidores actuales de resultados, historial, logros y preferencias; verificar que el inventario identifica rutas que se conservarán, migrarán o retirarán dentro de este Change.
- [x] 1.3 Definir tipos/versiones canónicas para resultado terminal, dimensiones, asistencia, preferencias y medallas; verificar compilación y pruebas de validación de esquema.

## 2. Persistencia e idempotencia

- [x] 2.1 Implementar la migración versionada de IndexedDB para resultados y preferencias sin borrar datos compatibles; verificar upgrade, downgrade seguro y conservación de datos con pruebas de migración.
- [x] 2.2 Implementar la aceptación transaccional de resultados elegibles con clave estable e idempotencia; verificar doble entrega y reintento parcial con pruebas automatizadas.
- [x] 2.3 Rechazar abandonos, interrupciones técnicas y cierres neutrales de transición bot-humano antes de persistir; verificar que no alteran historial, récords, rachas ni medallas.
- [x] 2.4 Verificar que el payload y los stores no contienen IP ni progreso transmitido y que el flujo funciona sin API después de la primera carga mediante pruebas de integración offline.

## 3. Consultas, métricas y medallas

- [x] 3.1 Implementar filtros por modalidad, reglas/dificultad, inteligencia y asistencia sin mezclar dimensiones; verificar coincidencia exacta y separación asistido/no asistido.
- [x] 3.2 Implementar partidas, victorias, derrotas, empates, porcentaje, promedio de intentos resueltos, mejores tiempos, mejores intentos, rachas y evolución; verificar estados con datos y vacío.
- [x] 3.3 Implementar el catálogo fijo de seis medallas y su primera fecha de cumplimiento; verificar determinismo al reevaluar el mismo historial y exclusión de resultados neutrales.
- [x] 3.4 Eliminar o retirar de forma segura cualquier agregador/ruta superseded que mezcle dimensiones o cuente cierres neutrales; verificar regresión de los callers restantes y pruebas completas tras la retirada.

## 4. Preferencias y pantallas

- [x] 4.1 Persistir tema, volumen/mute, vibración y reducción de movimiento con valores validados; verificar recuperación tras recarga offline.
- [x] 4.2 Implementar reset con confirmación accesible, cancelación sin cambios y conservación de historial/medallas; verificar ambos caminos con pruebas de UI.
- [x] 4.3 Implementar las vistas de resultados, estadísticas y ajustes siguiendo `PRODUCT-BASELINE.md` y las referencias aprobadas; verificar navegación, estados vacíos, filtros, medallas y controles accesibles.
- [x] 4.4 Mantener recursos locales y cero dependencia de Stitch/CDN en runtime; verificar el bundle y una ejecución offline sin solicitudes remotas no permitidas.

## 5. Pruebas y evidencia de entrega

- [x] 5.1 Añadir escenarios Gherkin y pruebas unitarias/integración para elegibilidad, idempotencia, filtros, métricas, medallas, preferencias y migración; verificar con `npm run test`.
- [x] 5.2 Ejecutar E2E Playwright real como executor configurado para estado vacío, resultados filtrados, medalla, reset, recarga offline, temas y viewports 360×640, 390×844 y 1280×720; verificar `npm run e2e` y conservar el resultado observable.
- [x] 5.3 Consultar Stitch por los IDs exactos de `stats.html`, `settings.html` y `results.html`; si falla, registrar `status: fallback_applied`, `blocking: false`, error y HTML local usado, verificando que no se afirma una recuperación inexistente.
- [x] 5.4 Generar capturas PNG comparativas anotadas por pantalla, estado, tema y viewport, con diferencias justificadas, scripts, reporte y manifiesto; verificar rutas en Git y en el PR obligatorio.
- [x] 5.5 Ejecutar la comprobación declarada completa, incluyendo lint, build y E2E, y verificar `npm run check` antes de preparar la rama `request-8-pf-08-estadisticas-locales-medallas-y-pr` para PR.
