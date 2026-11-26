# Proposal

## Why

PF-06 habilita la base de juego online, pero todavía falta descubrir y emparejar rivales humanos sin abandonar una partida contra la máquina. Este incremento completa ese recorrido con salas públicas visibles, búsqueda exacta en segundo plano y una oferta bilateral segura, preservando el avance y la identidad Party aprobada.

## What Changes

- Añadir salas públicas visibles que exponen únicamente modalidad y reglas, con creación, partida rápida y búsqueda exacta mientras se juega contra la máquina.
- Procesar reservas compatibles en FIFO y retirarlas de forma idempotente al cancelar o desconectar.
- Presentar ofertas bilaterales con confirmación de ambos jugadores dentro de 20 segundos y sonido opcional.
- Crear una única partida humana sólo tras la confirmación mutua y cerrar el bot de forma neutral, sin registrar derrota ni perder avance.
- Añadir estados de cola, listado y oferta derivados de las referencias visuales aprobadas; no incluir chat, fotos, perfiles ni ranking.
- Registrar procedencia Stitch por ID exacto y snapshot; si la integración no está disponible, usar el HTML local versionado con `status: fallback_applied` y `blocking: false`.
- Mantener la verificación de UI con Playwright, estados comparables, viewports aplicables y capturas PNG comparativas anotadas trazables en Git y PR.

## Capabilities

### New Capabilities

- `public-human-matching`: descubrimiento de salas públicas, cola FIFO, compatibilidad exacta, oferta bilateral y transición neutral desde la máquina a una partida humana.

### Modified Capabilities

- `authoritative-private-online-play`: extender el servicio autoritativo con reservas públicas, idempotencia de cola, ofertas con TTL y transición única a partida humana.
- `online-room-interfaces`: añadir pantallas y estados de listado público, cola y oferta, conservando accesibilidad, temas y recuperación.
- `machine-opponent-duel-and-race`: permitir la búsqueda en segundo plano y cerrar el bot únicamente al entrar realmente en la partida humana, sin derrota.
- `visual-system-and-evidence`: extender referencias y evidencia a salas públicas, cola y oferta sin dependencia de Stitch en runtime.

## Impact

Afecta al backend Node/Fastify/WebSocket autoritativo en memoria, al motor compartido y al cliente Angular/TypeScript de salas y partidas contra la máquina. Requiere contratos versionados para cola, compatibilidad y oferta, pruebas unitarias/integración y E2E Playwright reales; no añade PostgreSQL, Redis, servicios externos, dependencias de runtime ni datos personales. PF-06 integrada es un prerrequisito explícito y el PR debe incluir escenarios Gherkin y evidencia visual reproducible.
