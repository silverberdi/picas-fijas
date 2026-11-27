# Proposal

## Why

PF-07 deja partidas humanas y contra máquina capaces de producir resultados, pero el producto todavía no ofrece una memoria local útil del juego ni controles persistentes para la experiencia personal. Este incremento cierra ese ciclo sin crear una cuenta, un servicio de progreso central ni una dependencia de red, respetando el funcionamiento offline y la privacidad definidos en `PRODUCT-BASELINE.md`.

## What Changes

- Añadir almacenamiento local versionado mediante IndexedDB para resultados terminales elegibles, con deduplicación idempotente, sin progreso en transmisión y sin IP.
- Separar estadísticas y récords por modalidad, dificultad/reglas, inteligencia y nivel de asistencia; mantener récords asistidos y no asistidos independientes.
- Mostrar partidas, victorias, derrotas, empates, porcentaje de victorias, promedio de intentos resueltos, mejores tiempos, mejores intentos, rachas y evolución.
- Excluir de récords y rachas las partidas contra máquina cerradas por transición humana o interrupción técnica.
- Añadir catálogo determinista de medallas locales, sin monedas, y conservar su evaluación tras recargar offline.
- Guardar tema, volumen/mute, vibración y reducción de movimiento localmente; exigir confirmación para restablecer preferencias.
- Mantener historial, medallas y preferencias después de una recarga sin conexión.
- Añadir las pantallas de estadísticas, ajustes y resultados al contrato de procedencia visual, usando Stitch por sus IDs exactos cuando esté disponible y los HTML locales como fallback documentado cuando no lo esté.
- Entregar pruebas automatizadas, escenarios Gherkin, checks Playwright reales y evidencia visual comparativa trazable en la rama `request-8-pf-08-estadisticas-locales-medallas-y-pr` y su PR obligatorio.

No se introducen cuentas, sincronización central, clasificación global, monedas, envío de progreso, persistencia de IP, dependencia de Stitch en runtime ni dependencias externas de runtime.

## Capabilities

### New Capabilities

- `local-statistics-medals-preferences`: resultados locales elegibles e idempotentes, dimensiones y filtros, estadísticas, récords, rachas, evolución, medallas deterministas y preferencias persistentes.

### Modified Capabilities

- `visual-system-and-evidence`: ampliar la procedencia y evidencia visual para `stats.html`, `settings.html` y `results.html` del proyecto Stitch aprobado, conservando el fallback local y las reglas de Playwright.

## Impact

El cambio afecta al cliente Angular/TypeScript, al modelo de resultados de partidas y a sus pantallas de resultados, estadísticas y ajustes. Añade un esquema/versionado de IndexedDB y adaptadores locales, sin cambiar el backend autoritativo ni crear almacenamiento duradero del servidor. Requiere pruebas unitarias de selección/agregación/deduplicación, pruebas de integración del ciclo de resultados y preferencias, y E2E Playwright con capturas comparativas en los viewports y temas aplicables. Apply deberá confirmar nuevamente que PF-07 está integrada antes de activar el incremento.
