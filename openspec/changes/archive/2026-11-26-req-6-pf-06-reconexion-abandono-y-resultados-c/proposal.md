# Proposal

## Why

PF-05 ya está integrada y entrega salas humanas autoritativas, pero todavía falta cerrar el ciclo real de una partida cuando se pierde la conexión, vence la gracia, se reinicia el backend o se solicita una revancha. PF-06 convierte esos estados en resultados competitivos coherentes y observables, evitando derrotas causadas por fallos globales y evitando pérdida de identidad, estado o reloj.

## What Changes

- Añadir una ventana de reconexión de 60 segundos con credencial privada opaca, snapshot seguro por participante y restauración idempotente de identidad, estado y reloj.
- Distinguir pérdida de red, abandono voluntario, vencimiento de reconexión, doble desconexión y reinicio global del backend; pausar la competición durante la gracia y resolver la ausencia de ambos sin retorno como interrupción neutral.
- Unificar la salida competitiva como victoria, derrota, empate, abandono o interrupción, incluyendo reglas deterministas para reloj, doble desconexión y agotamiento de la gracia.
- Evitar que un reinicio global del servidor produzca una derrota y registrar una interrupción neutral informada por el cliente.
- Crear revancha únicamente con aceptación de ambos participantes, nuevo ciclo y nuevos secretos/credenciales, sin reutilizar secretos de la partida anterior.
- Extender las pantallas de reconexión y resultados con estados de gracia, abandono, interrupción, revancha y tema/layout accesibles, sin scroll general durante la partida.
- Ejecutar la verificación UI mediante Playwright con estados, temas y viewports comparables, capturas PNG anotadas, manifiesto, scripts, reporte y diferencias justificadas.
- Durante propose/design se intentaron consultar directamente las pantallas Stitch `reconnect.html` (`6d008404df5146b3a019b079d80038b6`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`) del proyecto `7461201299918295899`; la integración devolvió `UNAUTHORIZED`, por lo que se aplica el fallback local versionado con `status: fallback_applied` y `blocking: false`.

## Capabilities

### New Capabilities

Ninguna. El incremento completa y modifica contratos ya existentes de juego online, ciclo determinista, interfaces y evidencia visual.

### Modified Capabilities

- `authoritative-private-online-play`: reconexión, gracia, abandono, interrupción neutral, resultados unificados y revancha sin reutilización de secretos.
- `deterministic-rules-and-game-cycle`: pausa y reloj durante gracia, doble desconexión, reinicio neutral y resolución determinista de razones/resultados.
- `online-room-interfaces`: estados observables de reconexión, abandono, interrupción, resultados y revancha.
- `visual-system-and-evidence`: referencias exactas de reconexión/resultados, fallback documentado y evidencia visual obligatoria del incremento.

## Impact

- Motor compartido cliente/servidor, máquina de estados de sala, protocolo WebSocket versionado e idempotencia.
- Snapshots filtrados, credenciales privadas y ciclo de vida de secretos en el backend Node/Fastify en memoria.
- Componentes/rutas Angular y estilos locales para reconexión y resultados, manteniendo la identidad Party y los recursos sin dependencias externas de runtime.
- Pruebas unitarias, integración, escenarios Gherkin y checks Playwright ejecutados por el executor configurado; evidencia reproducible almacenada en Git y referenciada en el PR.
- No cambia la arquitectura vinculante, no añade PostgreSQL/Redis/servicios externos ni convierte Stitch en dependencia de ejecución.
