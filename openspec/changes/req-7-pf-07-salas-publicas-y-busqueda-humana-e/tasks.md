# Tasks

## 1. Prerrequisitos y contratos

- [x] 1.1 Verificar en la rama y en el estado OpenSpec que PF-06 está integrada; documentar el resultado y mantener el cambio desactivado si no lo está.
- [x] 1.2 Censar los módulos de sala, protocolo WebSocket, motor de partida contra máquina y navegación UI existentes; registrar callers reutilizados y puntos de integración en el PR.
- [x] 1.3 Definir mensajes versionados para reserva, listado, cancelación, oferta, aceptación, expiración y entrada humana; verificar esquema estricto, correlación e idempotency key con pruebas de contrato.

## 2. Cola y emparejamiento autoritativos

- [x] 2.1 Implementar la reserva pública opaca en memoria con secuencia FIFO y clave canónica de modalidad, longitud, repetición, intentos y tiempo; verificar coincidencia exacta y ausencia de datos personales en los payloads.
- [x] 2.2 Implementar cancelación y desconexión idempotentes, incluyendo concurrencia y retiro sin emparejamiento fantasma; verificar con pruebas unitarias y de integración.
- [x] 2.3 Implementar el listado de salas públicas con reglas y modalidad únicamente; verificar que secretos, credenciales privadas y datos personales no aparezcan en snapshots ni logs.
- [x] 2.4 Implementar la oferta bilateral con deadline de 20 segundos, estados versionados y aceptación idempotente; verificar aceptación unilateral, expiración, rechazo y reintentos tardíos.
- [x] 2.5 Implementar la transición atómica que crea una única partida humana sólo tras confirmación mutua y marca el cierre del bot como neutral; verificar que no registra derrota ni duplica partida bajo concurrencia.

## 3. Integración con partida contra la máquina

- [x] 3.1 Integrar solicitud, estado y cancelación de búsqueda en duelo y carrera contra «La máquina» sin pausar ni mutar el avance; verificarlo con pruebas de integración.
- [x] 3.2 Cerrar el bot únicamente en la entrada efectiva a la partida humana y conservarlo ante expiración, aceptación unilateral o desconexión; verificar resultados neutrales y ausencia de derrota.
- [x] 3.3 Añadir métricas anónimas y errores observables de cola/oferta sin IP completa, secretos ni identidad personal; verificar formato y filtros de logs.

## 4. UI y referencias visuales

- [x] 4.1 Implementar listado público, creación, cola y oferta reutilizando patrones Party de home/create-room/waiting/duel-bot/race-bot, con tema, teclado, mute local y recuperación; verificar rutas y estados accesibles.
- [x] 4.2 Implementar continuidad visual de la partida contra la máquina durante la búsqueda y estados de expiración/cancelación; verificar 360×640, 390×844 y 1280×720 sin scroll general de partida.
- [x] 4.3 Registrar el manifiesto Stitch con las seis IDs exactas, procedencia y snapshots; conservar el estado `status: fallback_applied`, `blocking: false` y HTML local si la integración sigue inaccesible, sin añadir dependencia de runtime.

## 5. Pruebas y evidencia de entrega

- [x] 5.1 Añadir escenarios Gherkin y pruebas unitarias para PF-06, compatibilidad exacta, FIFO, cancelación, oferta bilateral, sonido opcional y transición neutral; verificar con el comando de test declarado.
- [x] 5.2 Añadir pruebas de integración para dos clientes, reintentos, concurrencia, expiración de 20 segundos y privacidad de snapshots; verificar con backend efímero y resultados observables.
- [x] 5.3 Asignar al executor configurado la ejecución de Playwright para listado, cola, oferta aceptada/expirada/cancelada y continuidad contra bot en temas y viewports comparables; verificar que no se delegan navegación o checks de navegador a human_validation.
- [ ] 5.4 Generar capturas PNG comparativas anotadas por pantalla, estado, tema y viewport, diferencias justificadas, scripts, reporte y manifiesto; verificar rutas en Git y artefactos pesados con ubicación/retención documentadas en el PR.
- [x] 5.5 Ejecutar el check declarado completo (`npm run check`) y corregir regresiones; verificar que incluye lint, test, build y e2e con resultado trazable.
- [x] 5.6 Preparar el PR obligatorio con escenarios, pruebas, evidencia visual, procedencia/fallback y checklist de Definition of Done; verificar que no contiene dependencias externas de runtime ni cambios de producto fuera del alcance.
