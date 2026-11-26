# Tasks

## 1. Contratos y límites del backend

- [x] 1.1 Definir en `apps/api` los tipos versionados de comandos, respuestas, errores, participantes, salas, ciclos y snapshots filtrados; verificar compilación TypeScript y rechazo de campos desconocidos.
- [x] 1.2 Fijar configuración inyectable de origen permitido, tamaño de mensaje, tasa por conexión, TTL, cupo y puerto efímero, documentando valores iniciales y verificándolos con pruebas de configuración.
- [x] 1.3 Implementar el adaptador WebSocket sobre las APIs disponibles de Node, incluyendo handshake, frames JSON acotados, cierre y backpressure; verificar handshake, máscara, payload excesivo y apagado con integración real sin añadir una dependencia runtime.

## 2. Estado autoritativo de salas

- [x] 2.1 Implementar el registro en memoria y actor serializado por sala para crear, unir, llenar, expirar y eliminar salas; verificar cupo máximo de dos, TTL y errores recuperables.
- [x] 2.2 Implementar generación y validación de códigos, credenciales opacas y apodos automáticos separados, con logs seguros; verificar que no se persistan IP completa, credenciales, secretos ni intentos privados.
- [x] 2.3 Implementar esquemas estrictos, origen, límites, códigos de error y proyecciones por participante; verificar que un mensaje inválido no mute el estado y que una credencial ajena no revele identidad.
- [x] 2.4 Implementar `commandId`, `idempotencyKey`, `stateVersion` y orden determinista de transiciones; verificar duplicados, jugadas concurrentes y convergencia de dos clientes.

## 3. Ciclo humano y reconexión

- [x] 3.1 Integrar el motor de `packages/game-core` para duelo humano con secreto manual/aleatorio, turnos, tiempo, intentos y oportunidad equivalente; verificar resultados y no mutación ante intento inválido o fuera de turno.
- [x] 3.2 Integrar carrera humana con secreto común, primer acierto válido por reloj autoritativo y filtrado activo; verificar que cada cliente sólo recibe su intento/feedback y que el resumen rival aparece al finalizar.
- [ ] 3.3 Implementar `ready`, abandono, interrupción técnica, doble desconexión y revancha en la misma sala; fijar valores delegados de duración/política dentro de la línea base y verificar cada razón final.
- [x] 3.4 Implementar reconexión por credencial opaca dentro del TTL sin duplicar cupo ni penalizar; verificar recuperación de versión, rechazo de credencial vencida y limpieza al expirar.

## 4. Integración web y pantallas online

- [ ] 4.1 Integrar cliente WebSocket versionado en el shell Angular con estados de conexión, carga, rechazo, reconexión y finalización; verificar navegación por teclado, etiquetas accesibles y temas claro/oscuro.
- [ ] 4.2 Implementar `create-room.html`, `join-room.html` y `waiting.html` con código/enlace, credencial privada, apodo, cupo y recuperación de errores; verificar flujo de dos navegadores y no exposición de la identidad ajena.
- [ ] 4.3 Implementar `duel-online-mobile.html`, `race-online-mobile.html`, `duel-desktop.html`, `race-desktop.html` y `results.html`; verificar controles/reloj visibles, historial interno y ausencia de scroll general en los viewports aplicables.
- [x] 4.4 Registrar manifiesto y snapshots de las ocho referencias Stitch por ID exacto; si la integración sigue unavailable, registrar el fallo y `status: fallback_applied`, `blocking: false`, usando los HTML locales sin copiarlos como runtime.

## 5. Pruebas automatizadas y evidencia

- [x] 5.1 Añadir pruebas unitarias del registro, actor, credenciales, esquemas, errores, idempotencia, reloj y proyecciones; verificar con `npm run test --workspace=@picas-fijas/api` y los tests del motor compartido.
- [ ] 5.2 Añadir integración real con proceso Node local en puerto efímero y dos conexiones WebSocket; verificar creación/unión, sala llena/inválida, concurrencia, duplicados, suplantación, reconexión, carrera y revancha.
- [ ] 5.3 Configurar fixtures Playwright que arranquen y apaguen el proceso Node, abran dos contextos y ejecuten los escenarios Gherkin de UI; verificar con `npm run e2e` sin Docker ni demonio externo.
- [ ] 5.4 Generar capturas PNG comparativas anotadas para cada pantalla, estado, tema y viewport (360×640, 390×844, 1280×720), más manifiesto, scripts, reporte y diferencias justificadas; verificar que la evidencia queda trazable en Git/PR y que no se declara video inexistente.
- [x] 5.5 Ejecutar la comprobación declarada completa (`npm run check`) y revisar que no queden secretos, dependencias de runtime no aprobadas, scroll general en partidas ni rutas online duplicadas; conservar resultados y artefactos para Verify.

## 6. Entrega OpenSpec

- [x] 6.1 Contrastar implementación contra proposal, specs y design, registrar cualquier divergencia mediante `openspec update` antes de continuar y verificar el estado del cambio con `openspec status`.
- [x] 6.2 Preparar evidencia de PR obligatorio en la rama `request-5-pf-05-backend-autoritativo-y-salas-priva`, incluyendo pruebas, escenarios Gherkin, procedencia visual, manifiesto y límites conocidos; verificar que el incremento no modifica decisiones de producto fuera de PF-05.
