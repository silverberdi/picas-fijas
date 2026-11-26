# Proposal

## Why

PF-01 dejó disponible el paquete compartido, pero todavía no existe un contrato ejecutable para calcular reglas de Picas y Fijas ni para resolver una partida de forma determinista. PF-02 aporta ese núcleo puro ahora para que las modalidades locales y futuras partidas online compartan las mismas validaciones, transiciones y resultados sin depender de DOM, red o almacenamiento.

## What Changes

- Añade reglas puras serializables para secretos y tentativas de 3–6 dígitos, incluyendo cero inicial, repetición configurable y generación uniforme mediante una fuente de aleatoriedad inyectable.
- Añade los presets de producto sin alterarlos, configuración personalizada validada y parámetros explícitos para duración máxima de carrera, vencimiento de turno y límites de intentos.
- Calcula picas y fijas por frecuencias restantes después de contar las fijas, rechaza tentativas inválidas sin consumir oportunidad y expone estados y razón final deterministas.
- Añade un reloj inyectable y el ciclo de partida individual, duelo por rondas equivalentes y carrera por el primer acierto válido, incluyendo agotamiento, vencimiento, abandono, interrupción técnica y empates.
- Define un contrato de entrada, resultado, estado y serialización que no usa DOM, red, almacenamiento ni dependencias de runtime nuevas.
- Añade pruebas exhaustivas para todos los casos de 3 dígitos y pruebas basadas en propiedades para longitudes 4–6, repetición, límites, reloj y resolución competitiva.
- Conserva escenarios Gherkin, trazabilidad de dependencia con PF-01, comandos de verificación y evidencia requerida para el PR obligatorio.

## Capabilities

### New Capabilities

- `deterministic-rules-and-game-cycle`: reglas puras de secretos, validación, generación, puntuación, estados, reloj inyectable y resolución de partidas individuales, duelos y carreras.

### Modified Capabilities

- Ninguna. Las capacidades de PF-01 no cambian sus requisitos; PF-02 consume el `game-core` existente y agrega el contrato de juego completo.

## Impact

- Amplía el paquete compartido `game-core` y sus pruebas unitarias/property-based; los consumidores web/API sólo recibirán contratos serializables y no incorporarán lógica duplicada.
- No requiere cambios de base de datos, API remota, WebSockets, almacenamiento ni recursos visuales; no introduce dependencias externas de runtime.
- Requiere bloquear Apply si la integración archivada de PF-01 no está disponible, documentar los valores explícitos de parámetros antes de implementar y verificar el flujo con `npm run test`, `npm run check` y los checks Playwright declarados cuando el ciclo se conecte a UI.
- Los cambios son compatibles hacia adelante con los presets existentes; una diferencia en cualquier decisión de producto debe resolverse mediante OpenSpec update y no mediante una suposición de implementación.
