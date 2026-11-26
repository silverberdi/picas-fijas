# Proposal

## Why

PF-01 dejó el shell navegable y PF-02 dejó el motor determinista, pero todavía no existe una ruta completa para configurar y jugar individualmente sin conexión. Este incremento conecta ambos contratos en una experiencia familiar verificable: tutorial, partida clásica, ayudas limitadas y resultado unificado, manteniendo las reglas y la identidad Party ya aprobadas.

## What Changes

- Añade el flujo de configuración individual para los niveles aprobados y la configuración personalizada permitida, con confirmación antes de iniciar.
- Implementa la partida clásica individual offline sobre `game-core`: entrada táctil y teclado físico, borrar, confirmar, historial descendente, notas manuales de dígitos y posiciones y cronómetro sin límite por defecto.
- Mantiene visibles controles, reloj, resultado reciente e ingreso en 360×640, 390×844 y 1280×720; sólo el historial usa scroll interno, con controles arriba en móvil y a la izquierda en escritorio.
- Añade tutorial local basado en la referencia aprobada y estados accesibles de ayuda para explicar orientación y estrategia a partir del historial, sin acceso al secreto ni pistas directas; limita a tres usos por partida y muestra el contador.
- Añade resultado unificado para victoria, derrota y abandono con código, tiempo, intentos y acciones para volver a jugar, cambiar nivel o ir al inicio.
- Define la procedencia Stitch para `classic-mobile.html`, `classic-desktop.html`, `tutorial.html` y `results.html`; si la integración no está disponible, registra `fallback_applied` y `blocking: false` usando los HTML versionados.
- Añade pruebas automatizadas y evidencia Playwright por pantalla, estado, tema y viewport aplicable, incluyendo capturas comparativas anotadas y trazabilidad para el PR obligatorio.
- No añade dependencias externas de runtime, no cambia reglas de producto ni implementa modalidades online, inteligencia de máquina o persistencia remota.

## Capabilities

### New Capabilities

- `individual-game-tutorial-and-help`: Configuración, partida individual clásica offline, controles de entrada, historial, notas, cronómetro, tutorial, ayudas de deducción limitadas y resultado unificado.

### Modified Capabilities

- `visual-system-and-evidence`: Amplía la procedencia Stitch y la evidencia visual obligatoria para las cuatro pantallas de PF-03 y sus estados/viewport aplicables.

## Impact

- Afecta la aplicación web y sus adaptadores de UI, reutilizando `game-core` sin duplicar reglas; añade pruebas unitarias/integración y escenarios Playwright reales.
- Usa almacenamiento local ya aprobado sólo para preferencias necesarias; la partida continúa disponible offline tras la primera carga y no requiere API, Stitch ni recursos remotos en runtime.
- Añade artefactos de referencia, manifiesto, scripts y reportes de evidencia al cambio/PR; no requiere migraciones de base de datos ni cambios de backend.
- Apply debe asignar al executor configurado la ejecución de `npm run test`, `npm run build` y `npm run e2e` con evidencia observable. Las comprobaciones exclusivamente físicas quedan como seguimiento posterior y no bloquean la cobertura automatizable del navegador.
