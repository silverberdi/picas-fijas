# Design

## Context

El cambio se apoya en el servicio autoritativo en memoria y el protocolo WebSocket de PF-06, en el motor compartido y en las pantallas online existentes. `docs/PRODUCT-BASELINE.md` exige coincidencia exacta de modalidad y reglas, apodos automáticos sin cuentas, ausencia de datos personales, oferta bilateral de 20 segundos, cierre neutral del bot y ningún servicio persistente adicional.

La integración Stitch no está disponible en las herramientas de esta ejecución. Se adopta la contingencia vinculante: `status: fallback_applied`, `blocking: false`, uso de los HTML versionados de `assets/references/`, registro de la incidencia y conservación del manifiesto. Las extensiones cubrirán listado público, cola y oferta usando los patrones de `home`, `create-room`, `waiting`, `duel-bot` y `race-bot`; Stitch no será dependencia de runtime.

## Goals / Non-Goals

**Goals:**

- Añadir una cola autoritativa con reserva opaca, compatibilidad exacta, FIFO, cancelación idempotente y TTL de oferta de 20 segundos.
- Mantener la partida contra la máquina intacta hasta la transición efectiva a la partida humana.
- Hacer que la transición bilateral sea única, neutral y observable en cliente y servidor.
- Entregar estados de UI accesibles, claros, responsive y verificables con Playwright real.
- Preservar privacidad: sólo modalidad y reglas en el listado, sin secretos, datos personales ni logs sensibles.

**Non-Goals:**

- No añadir chat, fotos, perfiles, ranking, cuentas, persistencia PostgreSQL/Redis ni servicios externos.
- No cambiar las reglas de PF-06, el motor de juego, la identidad Party ni las pantallas aprobadas.
- No hacer que Stitch, CDN, fuentes remotas o recursos remotos sean dependencias de ejecución.

## Decisions

### Cola y compatibilidad

Se usará una única cola lógica del proceso autoritativo, con secuencia monotónica de entrada y un índice por clave canónica `(modalidad, longitud, repetición, intentos, tiempo)`. La reserva contiene sólo configuración pública, estado, timestamps y credencial opaca; nunca secretos de partida ni datos personales. El emparejador inspecciona la cola en orden y sólo combina claves idénticas. Se descarta una alternativa de búsqueda aproximada porque contradice la coincidencia exacta y podría mezclar reglas incompatibles.

### Máquina de estados de oferta

La oferta tendrá estados `offered`, `accepted_by_one`, `confirmed`, `expired`, `cancelled` y `entered_human`, con deadline monotónico de 20 segundos y comandos idempotentes por participante. La partida contra la máquina permanece activa en los estados previos; sólo `entered_human` dispara una transición atómica que crea una partida humana y marca el cierre bot como neutral. Se descarta cerrar el bot al emitir la oferta porque una aceptación unilateral o expiración debe conservar el avance.

### Integridad y concurrencia

El servidor serializará reserva, cancelación, aceptación, expiración y entrada humana bajo la misma autoridad de estado, con correlación, versión e idempotency key. Reintentos devolverán el resultado previo. La expiración será evaluada por reloj inyectable y un sweep acotado, sin timers que creen transiciones duplicadas. El cliente tratará las actualizaciones como snapshots versionados y no decidirá compatibilidad ni resultado.

### UI y accesibilidad

Se reutilizarán los componentes, tokens Party y patrones de las pantallas online existentes. El listado expone modalidad/reglas; la cola añade estado, cancelación y continuidad de partida; la oferta añade cuenta atrás bilateral, acciones accesibles y mute local. Los estados se diseñarán para 360×640, 390×844 y 1280×720 según aplique, manteniendo controles de la partida visibles y el scroll limitado al historial donde exista.

### Procedencia y evidencia visual

El manifiesto registrará las seis IDs exactas solicitadas, el proyecto `projects/7461201299918295899`, la fuente local fallback, snapshot, estado y diferencias. Verify ejecutará Playwright con dos jugadores/navegadores cuando el escenario lo requiera y generará PNG anotados por pantalla, estado, tema y viewport, además de scripts, reporte y manifiesto. La ausencia de video no bloqueará si la captura y el comportamiento reproducible satisfacen el criterio.

### Prerrequisito y entrega

Apply comprobará que PF-06 está integrada antes de activar el flujo. El cambio se implementará en la rama `request-7-pf-07-salas-publicas-y-busqueda-humana-e`, con pruebas unitarias e integración del protocolo, escenarios Gherkin, E2E Playwright y PR obligatorio. No se inventan decisiones de producto; valores no especificados se mantienen en los contratos existentes.

## Risks / Trade-offs

- [Carreras concurrentes en la cola] → serialización autoritativa, secuencia FIFO, versiones e idempotencia; probar cancelación/desconexión simultáneas.
- [Expiración cerca de 20 segundos] → reloj monotónico inyectable y deadline decidido por servidor; probar límites exactos y reintentos tardíos.
- [Cierre prematuro de la máquina] → sólo permitirlo en `entered_human`; probar aceptación unilateral, expiración y desconexión.
- [Divergencia visual por falta de Stitch] → registrar `fallback_applied`, conservar HTML y snapshots locales, comparar con baseline y dejar `blocking: false` sólo si el fallback cubre el estado.
- [Filtración de identidad o reglas privadas] → payload mínimo, validación de esquema y pruebas de snapshots por participante; no persistir IP completa ni secretos.
- [Partida interrumpida por búsqueda] → búsqueda como estado paralelo cancelable y E2E que compruebe que el bot y el avance siguen vivos antes de la transición.

## Migration Plan

1. Verificar integración de PF-06 y contratos existentes antes de activar la cola.
2. Añadir contratos y estados detrás de la capacidad de salas públicas, sin migración de datos durables.
3. Ejecutar unit/integration y Playwright con el backend efímero configurado.
4. Activar la navegación pública y la búsqueda en segundo plano sólo cuando la confirmación bilateral esté disponible.
5. Rollback: desactivar las rutas de salas públicas y cancelar reservas/ofertas en memoria; las partidas contra la máquina continúan y no requieren conversión de datos.

## Open Questions

No quedan preguntas abiertas que cambien el alcance, los contratos o la estrategia aprobada.
