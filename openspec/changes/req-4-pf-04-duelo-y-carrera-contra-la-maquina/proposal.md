# Proposal

## Why

PF-03 deja preparado el ciclo determinista, pero falta convertirlo en una experiencia competitiva contra «La máquina» con tres estrategias independientes, privacidad estricta y dos ritmos de juego distintos. Este incremento entrega PF-04 como valor vertical completo, respetando que el trabajo pesado no bloquee la interfaz y que la carrera no revele información del rival antes del cierre.

## What Changes

- Añadir duelo contra «La máquina» con secreto manual o aleatorio, turnos, reloj configurable y resultados equivalentes a las reglas aprobadas.
- Añadir carrera contra «La máquina» con secreto común oculto, intentos simultáneos y publicación diferida de intentos y feedback del rival hasta el resultado final.
- Añadir tres inteligencias independientes: fácil heurística, intermedia con filtrado de candidatos y difícil con maximización de información mediante muestreo acotado.
- Ejecutar la decisión del bot fuera del hilo de interacción, con latencia simulada reproducible por semilla, sin entregar el secreto ni ayudas competitivas al bot.
- Añadir simulaciones reproducibles que documenten latencia, resolución y diferencias de estrategia, incluida la comprobación de seis dígitos sin congelar la UI.
- Integrar estados y resultados en las pantallas Party aprobadas, manteniendo controles, reloj, historial interno y ausencia de scroll general durante la partida.
- Registrar la procedencia de las referencias visuales Stitch solicitadas; en esta ejecución, usar el fallback HTML local versionado con `status: fallback_applied` y `blocking: false` porque la integración Stitch no está disponible.

## Capabilities

### New Capabilities

- `machine-opponent-duel-and-race`: configuración, estrategias, privacidad de información, ejecución no bloqueante, simulaciones y resultados de duelo/carrera contra «La máquina».

### Modified Capabilities

- `deterministic-rules-and-game-cycle`: ampliar el contrato de duelo/carrera para oponente máquina, turnos/reloj y ocultación de feedback sin alterar la puntuación ni los presets.
- `visual-system-and-evidence`: incorporar las pantallas y estados de PF-04 y la trazabilidad de las cinco referencias solicitadas, conservando la política Stitch/fallback y la evidencia Playwright existente.

## Impact

- Afecta al motor compartido `game-core`, la aplicación web y sus contratos serializables de partida; el alcance incluye pruebas unitarias, integración y Playwright.
- No requiere dependencias externas de runtime, servicios de IA, almacenamiento nuevo ni cambios en la arquitectura aprobada. La semilla y el reloj serán dependencias inyectables.
- Las referencias visuales son insumos de diseño/verificación, no recursos de runtime. El executor configurado deberá ejecutar los checks de navegador durante Apply/Verify y conservar la evidencia en Git/PR.
