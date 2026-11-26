# Design

## Context

PF-05 deja un backend autoritativo en memoria, protocolo versionado, snapshots filtrados y una base de pantallas online. Este cambio debe completar el ciclo de vida sin cambiar la línea base de producto: una caída de red es recuperable, una renuncia es abandono, y un reinicio global es neutral. Las reglas existentes ya usan reloj inyectable, serialización e idempotencia. Ver `proposal.md` y los deltas de `specs/` para el contrato observable.

## Goals / Non-Goals

**Goals:**

- Modelar explícitamente desconectado, gracia pausada, reconectado, abandono e interrupción, con transiciones serializadas e idempotentes.
- Restaurar identidad, snapshot permitido y reloj sin duplicar comandos ni filtrar secretos.
- Producir resultados unificados y una revancha con ciclo criptográfico nuevo.
- Mantener el layout Party accesible y verificable en navegador real, con evidencia reproducible.

**Non-Goals:**

- Persistencia durable, multi-instancia, clasificación global, cuentas, chat o notificaciones externas.
- Cambios en reglas de puntuación, presets, modalidades o identidad visual aprobada.
- Stitch en runtime, regeneración o edición de las pantallas aprobadas.

## Decisions

### Máquina de estados y reloj

Se añadirá una transición de desconexión por participante que conserva `disconnectedAt` y un estado de gracia de sala. Mientras exista al menos un participante potencialmente reconectable, se congela el reloj competitivo y no se aceptan jugadas que dependan del turno. Un reloj monotónico inyectado calcula el vencimiento de 60 segundos; el mismo evento de vencimiento se serializa con jugadas y comandos de abandono.

Alternativas consideradas: dejar correr el reloj (contradice la decisión de pausar durante gracia) o resolver inmediatamente (confunde caída de red con renuncia).

### Clasificación de finalización

El resultado se representa con un discriminador único: `victoria`, `derrota`, `empate`, `abandono` o `interrupción`, acompañado por una razón (`renuncia`, `gracia_vencida`, `reinicio_backend`, `agotamiento`, etc.) y participantes afectados. La renuncia se emite como comando explícito; una desconexión vencida sólo es abandono si el rival está presente. Ausencia simultánea sin retorno es interrupción neutral.

Alternativas consideradas: inferir abandono sólo desde el socket (pierde la distinción requerida) o conservar códigos de resultado dispersos (hace inconsistente la UI y la revancha).

### Credenciales, snapshots y revancha

La reconexión reusa la credencial privada opaca de la partida sólo dentro de su TTL de 60 segundos y devuelve el snapshot filtrado por participante. La aceptación bilateral de revancha crea un ciclo nuevo, rota credenciales y secretos, reinicia versiones y conserva únicamente el vínculo de sala permitido. Las idempotency keys se mantienen por ciclo para que un reintento no duplique la transición.

Alternativas consideradas: reutilizar la credencial de sala o secretos anteriores (facilita suplantación y filtración) y crear una nueva sala (rompe la expectativa de revancha en la misma sala).

### Reinicio global

El backend publicará una condición de sesión reiniciada que el cliente podrá confirmar. El resultado neutral se construye como transición terminal segura y no depende de que el proceso conserve estado en memoria. No se intenta reconstruir una partida después de perder la autoridad del servidor.

Alternativas consideradas: restaurar desde almacenamiento externo (prohibido por la arquitectura) o atribuir derrota al jugador desconectado (contradice la línea base).

### UI y procedencia visual

`reconnect.html` será la referencia del estado de gracia y `results.html` la base de todos los finales. La consulta directa Stitch de ambos IDs falló con `UNAUTHORIZED`; se conservará en el manifiesto de design el estado `fallback_applied`, `blocking: false`, error y rutas de los HTML locales usados. Estados sin pantalla exacta se derivarán de esos patrones sin alterar identidad, densidad, colores ni reglas de accesibilidad.

La verificación usará Playwright configurado, con estados deterministas para gracia, abandono, interrupción y revancha, en 360×640, 390×844 y 1280×720 cuando aplique. Las capturas de referencia/implementación serán PNG anotados; el vídeo sólo se añadirá cuando el flujo de referencia sea reproducible.

## Risks / Trade-offs

- [Riesgo] Carrera entre reconexión, renuncia y vencimiento → [Mitigación] reloj inyectado, cola autoritativa, versionado e idempotency key; pruebas en los límites exactos antes/después de 60 s.
- [Riesgo] Snapshot demasiado amplio tras reconexión → [Mitigación] reutilizar el filtro por participante de PF-05 y pruebas negativas de secretos, historial y credenciales ajenas.
- [Riesgo] Confundir reinicio global con caída individual → [Mitigación] evento explícito de sesión reiniciada y escenario E2E que verifica interrupción sin derrota.
- [Riesgo] Deriva visual por fallback histórico → [Mitigación] registrar procedencia, comparar con PRODUCT-BASELINE, conservar manifiesto y bloquear sólo si el fallback no cubre el criterio.
- [Riesgo] Revancha que reutilice estado sensible → [Mitigación] generación y rotación verificables de secretos/credenciales, con prueba de desigualdad y aislamiento por ciclo.

## Migration Plan

1. Añadir el contrato de estados/resultados y pruebas de reloj al motor compartido.
2. Extender protocolo y sala con reconexión, renuncia, reinicio neutral y revancha rotada, manteniendo compatibilidad de mensajes versionados.
3. Añadir las pantallas/estados UI y checks Playwright; conservar recursos locales y snapshots de referencia/fallback.
4. Ejecutar unitarias, integración y E2E; generar evidencia visual y actualizar el manifiesto del PR.
5. Si una transición falla en candidate, retirar la ruta nueva y volver al comportamiento de PF-05 sin migración de datos, porque el estado es sólo memoria.

## Open Questions

Ninguna: los valores y casos que afectarían el contrato (60 segundos, pausa, doble desconexión, reinicio neutral y resultados) quedan resueltos en los deltas.
