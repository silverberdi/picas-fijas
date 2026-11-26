# Design

## Context

El monorepo ya contiene `apps/api` con Fastify y CORS, `apps/web` con Angular, y `packages/game-core` como motor puro compartido. PF-04 está archivado y sus contratos de reglas, reloj, duelo y carrera son la autoridad funcional. La línea base exige una instancia en memoria, sin PostgreSQL/Redis, sin cuentas ni chat, y permite operar el backend localmente como proceso Node.

La propuesta añade un límite online entre dos navegadores. Las especificaciones del cambio definen el contrato observable; este documento resuelve la autoridad, seguridad, serialización, transporte, UI y evidencia sin cambiar las reglas de PF-04.

## Goals / Non-Goals

**Goals:**

- Centralizar cada transición de sala y partida en un único actor de sala, con versión monotónica, reloj inyectable y orden determinista.
- Separar código compartible, credencial opaca de participante y datos filtrados; hacer que el secreto sólo exista en el estado privado del servidor y en el snapshot autorizado.
- Reutilizar `packages/game-core` para validación y resolución, exponiendo DTOs versionados sin compartir el estado interno completo.
- Permitir arranque y apagado explícitos desde Playwright y pruebas de integración, con puerto efímero y sin Docker.
- Implementar las ocho pantallas online a partir de las referencias Stitch exactas o del fallback local, con estados accesibles y evidencia reproducible.

**Non-Goals:**

- Persistencia durable, escalado horizontal, matchmaking público, cuentas, chat, ranking o progreso central.
- Cambios a presets, puntuación, reglas de PF-03/PF-04 o a la modalidad offline.
- Stitch, CDN, fuentes remotas u otros recursos externos como dependencia de runtime.

## Decisions

### 1. Un actor por sala y transición serializada

Cada sala mantiene configuración, participantes, fase, reloj lógico, estado privado, deduplicación reciente y `stateVersion`. Las mutaciones pasan por una cola síncrona del proceso y sólo el actor de la sala puede aplicar una transición. La respuesta de cada comando incluye `protocolVersion`, `commandId`, `accepted`, `stateVersion` y un snapshot filtrado.

Alternativas rechazadas: estado mutable compartido entre handlers (hace ambiguo el orden concurrente) y una base de datos/Redis (contradice la instancia única en memoria y el alcance de PF-05).

### 2. Transporte WebSocket sin dependencia nueva de runtime

Fastify conserva el servidor HTTP, CORS y configuración de origen. El upgrade y el framing WebSocket se encapsulan en un adaptador pequeño dentro de `apps/api`, limitado a los mensajes JSON del protocolo, con límites de tamaño y cierre controlado. No se añade una librería runtime nueva: el adaptador reutiliza las APIs de red de Node disponibles en el proyecto. Si la implementación no puede satisfacer el contrato RFC requerido con las APIs presentes, Apply debe detenerse y solicitar un `update` del cambio, no introducir una dependencia silenciosamente.

Alternativa rechazada: incorporar un plugin WebSocket no declarado, porque sería una dependencia externa de runtime no aprobada por la línea base.

### 3. Identidad privada y límites

El código de sala se genera con alfabeto no ambiguo y se trata sólo como localizador. Cada participante recibe una credencial opaca aleatoria de alta entropía, almacenada en memoria mediante una representación no reversible para validación y nunca incluida en logs. El servidor asigna apodos de un catálogo local sin datos personales. Configuración de origen, tamaño máximo de mensaje, tasa por conexión, cupo y TTL se inyecta al arranque y tiene valores moderados documentados por tests.

La IP se usa únicamente en memoria para aplicar límites si resulta necesario y no se persiste ni se escribe en logs. Los logs estructurados sólo contienen evento anónimo, sala truncada/hasheada, versión y resultado; nunca secretos, credenciales, payloads completos o intentos privados.

### 4. Contrato de comandos y filtrado

El protocolo distingue `create`, `join`, `reconnect`, `ready`, `submitGuess`, `rematch` y `leave`, cada uno con esquema cerrado, `commandId` e `idempotencyKey` donde aplique. La caché de idempotencia está acotada al TTL y conserva el resultado serializado, no el secreto. La proyección pública se construye desde el estado privado por rol y fase; en carrera activa elimina secreto común, intento y feedback rival, y sólo al cierre habilita el resumen autorizado.

### 5. Ciclo de juego

El servidor crea secretos manuales o aleatorios de duelo y el secreto común de carrera a través de las dependencias inyectadas de `game-core`. Valida turno, tiempo, reglas y límite antes de llamar al motor; los intentos inválidos no mutan el ciclo. La carrera usa un timestamp monotónico del proceso y un desempate por secuencia de recepción dentro de la misma marca. Revancha requiere confirmación de ambos y conserva la sala, pero crea un ciclo y secretos nuevos.

### 6. Reconexión, TTL y errores

La conexión WebSocket es efímera; la identidad vive sólo en la credencial opaca durante el TTL. Desconectar no penaliza automáticamente. Reconnect devuelve la proyección actual si la credencial es válida y el ciclo sigue disponible. Los errores tienen códigos estables (`ROOM_NOT_FOUND`, `ROOM_FULL`, `ORIGIN_DENIED`, `INVALID_MESSAGE`, `CREDENTIAL_DENIED`, `OUT_OF_TURN`, `EXPIRED`, entre otros), mensaje apto para UI y `recoverable` explícito, sin diferenciar datos que faciliten enumeración indebida.

### 7. UI y procedencia visual

Las pantallas nuevas se integran en el shell Angular y reutilizan estilos, tokens Party y componentes existentes. Se conservan HTML locales sólo como snapshots/fallback, nunca como código runtime. Durante design/verify se deben consultar los IDs exactos: `ca0a63e2b932407a942bfd26815ebd4c`, `2fb9e0158b5b4f3a842714601a3ba377`, `57272380a6a24ee8a1799a300728aa4e`, `68e473f7f73e4f86adca782b86da0cba`, `9416634b2446455dbec79b148f434d39`, `3838177211b144d3b6840ebf9cf7bfa7`, `464d2bb886424af0b419ce58290f3106` y `72765bd741154a1c8fbf4728f8a655dd`.

En este entorno no hay una herramienta Stitch disponible en las capacidades expuestas. Apply/design debe registrar esa indisponibilidad, guardar el manifiesto de IDs y usar los HTML versionados con `status: fallback_applied` y `blocking: false`; no se debe afirmar una consulta Stitch realizada.

### 8. Pruebas y evidencia

Las pruebas de protocolo y privacidad usan dos conexiones WebSocket reales contra un proceso API local, además de pruebas unitarias del actor y proyecciones. Playwright arranca el proceso Node en fixture, abre dos contextos/navegadores y verifica concurrencia, duplicados, reconexión, suplantación y filtrado. El executor configurado ejecuta `npm run test`, `npm run build` y `npm run e2e` según el flujo aprobado. Verify conserva capturas PNG comparativas anotadas, manifiesto, scripts, reporte y diferencias por pantalla/estado/viewport/tema; el video sólo es auxiliar.

## Risks / Trade-offs

- **[Riesgo]** Un adaptador WebSocket propio puede omitir casos del protocolo RFC. → Mantenerlo pequeño, limitar el alcance a frames JSON necesarios, cubrir handshake/máscaras/cierre con integración real y bloquear Apply si no cumple sin dependencia aprobada.
- **[Riesgo]** La memoria única pierde salas al reiniciar. → Documentar la interrupción técnica neutral, no prometer persistencia y cubrir reinicio/recuperación como comportamiento explícito.
- **[Riesgo]** Duplicados o carreras pueden producir snapshots divergentes. → Actor por sala, secuencia monotónica, deduplicación por participante y aserciones de convergencia en dos clientes.
- **[Riesgo]** Un filtro incompleto puede filtrar secreto o rival. → Construir proyecciones por fase/rol, probar inspección de cada mensaje serializado y no reutilizar el estado interno como payload.
- **[Riesgo]** Stitch puede seguir inaccesible. → Usar únicamente el fallback versionado, registrar error/procedencia y mantener `blocking: false` sólo si las capturas permiten justificar equivalencia.
- **[Riesgo]** Los límites elegidos pueden afectar UX o seguridad. → Dejarlos configurables, documentar valores iniciales en tests y ajustar mediante OpenSpec update si cambia el contrato, sin decisión silenciosa en Apply.

## Migration Plan

No hay migración de datos: el backend es nuevo y efímero. Apply añadirá el proceso API, contratos y pantallas; Verify levantará una instancia aislada y comprobará apagado limpio. El rollback consiste en no activar las rutas online y retirar el cambio completo mediante el flujo OpenSpec/PR, sin tocar los contratos archivados de PF-04.

## Open Questions

Ninguna cuestión abierta cambia el contrato: la duración máxima de carrera, la política de doble desconexión y los límites concretos deben quedar fijados y probados en Apply antes de verificar, dentro de los rangos y decisiones delegados por PRODUCT-BASELINE.
