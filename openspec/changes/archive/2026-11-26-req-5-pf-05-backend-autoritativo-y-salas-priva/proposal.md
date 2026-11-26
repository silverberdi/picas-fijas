# Proposal

## Why

PF-04 deja definido el ciclo de duelo y carrera, pero todavía no existe el límite de confianza que permita jugarlo entre dos navegadores sin cuentas ni exponer secretos. PF-05 incorpora una operación online local, autoritativa y reproducible para salas privadas de dos jugadores, manteniendo la privacidad, la convergencia y la identidad visual aprobada.

## What Changes

- Añadir un servidor Node local con Fastify/TypeScript y WebSockets, de instancia única en memoria, puerto configurable/efímero y sin PostgreSQL ni demonio Docker requerido para pruebas.
- Añadir creación, unión, espera, reconexión y revancha de salas privadas mediante código/enlace, credenciales opacas separadas del código, apodos automáticos, cupo de dos, TTL, origen permitido, validación estricta y límites configurables.
- Exponer un protocolo versionado, comandos idempotentes y serialización autoritativa de duelos y carreras humanas, con validación de turnos, tiempo, intentos, concurrencia y snapshots filtrados por participante.
- Evitar persistir la IP completa o registrar secretos; devolver rechazos claros y recuperables para salas inválidas, llenas, expiradas o credenciales no autorizadas.
- Añadir las pantallas online `create-room.html`, `join-room.html`, `waiting.html`, `duel-online-mobile.html`, `race-online-mobile.html`, `duel-desktop.html`, `race-desktop.html` y `results.html`, conservando la identidad Party y sin dependencias remotas de runtime.
- Añadir pruebas unitarias/integración y E2E reales con proceso Node local, incluyendo navegadores concurrentes, duplicados, suplantación, filtrado de carrera y evidencia visual Playwright trazable.

## Capabilities

### New Capabilities

- `authoritative-private-online-play`: Servidor autoritativo, salas privadas, protocolo online, privacidad, concurrencia, reconexión y ciclo humano 1v1.
- `online-room-interfaces`: Interfaces visuales y estados navegables para creación, unión, espera, duelo, carrera y resultados online.

### Modified Capabilities

- `deterministic-rules-and-game-cycle`: El ciclo existente se serializa y valida también bajo autoridad de servidor para duelo/carrera humana, sin alterar las reglas de puntuación ni los presets.
- `visual-system-and-evidence`: Se agregan las referencias online aprobadas, su fallback local y evidencia visual de los nuevos estados y viewports.

## Impact

- Afecta `apps/api`, `apps/web`, `packages/game-core`, contratos WebSocket, configuración de origen/límites/TTL y pruebas unitarias, de integración y Playwright.
- Reutiliza el motor puro compartido y las reglas archivadas de PF-04; no agrega PostgreSQL, Redis, cuentas, chat, servicios externos ni dependencias de runtime.
- Requiere registrar en design la consulta Stitch por los ocho IDs indicados y conservar snapshot/procedencia; si la integración no está disponible, usará los HTML versionados de `assets/references/` con `status: fallback_applied` y `blocking: false`.
- La ejecución se mantiene en la rama `request-5-pf-05-backend-autoritativo-y-salas-priva` y requiere PR; la entrega no autoriza cambios de producto fuera de este incremento.
