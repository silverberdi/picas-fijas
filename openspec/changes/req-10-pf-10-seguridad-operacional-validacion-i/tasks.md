# Tasks

## 1. Precondiciones e inventario

- [x] 1.1 Verificar que PF-09 está integrada, registrar SHA base, rama, worktree y estado limpio, y entregar el inventario de callers/writers de límites, reconexión, configuración, healthcheck y logs como artefacto del cambio.
- [x] 1.2 Releer `docs/PRODUCT-BASELINE.md`, `assets/references/README.md` y las specs archivadas/aplicables; verificar que ninguna decisión de producto, dependencia runtime o infraestructura real se introduce en el candidato.
- [x] 1.3 Fijar en configuración de entorno los valores moderados de origin, payload, conexiones, mensajes, reconexiones y TTL; verificar los valores efectivos en una prueba de configuración sin imprimir secretos.

## 2. Protección operacional del backend

- [x] 2.1 Implementar validación de origin y payload antes de cualquier transición autoritativa; verificar rechazo estable, ausencia de mutación y ausencia de filtración mediante pruebas unitarias/integración.
- [x] 2.2 Implementar límites temporales ajustables para conexiones, mensajes y reconexiones, sin bloqueo permanente ni IP completa; verificar aceptación normal, rechazo recuperable y recuperación tras la ventana.
- [x] 2.3 Implementar TTL y limpieza idempotente de salas, credenciales, reservas y métricas temporales; verificar expiración, no reutilización y preservación de partidas vigentes.
- [x] 2.4 Añadir métricas agregadas de sesiones, salas, búsquedas, rechazos, reconexiones, errores y límites; verificar con logs sanitizados que no aparecen secretos, payloads completos ni IP completa.
- [x] 2.5 Auditar writers/callers sustituidos, retirar rutas duplicadas o logs inseguros demostrablemente obsoletos y repetir las pruebas de protección después del retiro.

## 3. Healthcheck, configuración y continuidad

- [x] 3.1 Añadir healthcheck y configuración explícita de entorno para backend Docker Ubuntu, frontend estático, base path, origin y URL WSS; verificar respuesta de salud y que el bundle frontend no contiene secretos.
- [x] 3.2 Documentar DNS, reverse proxy HTTPS/WSS, headers, GitHub Pages base path, routing PWA, arranque y rollback para el propietario; verificar que la documentación no ejecuta ni modifica infraestructura real.
- [ ] 3.3 Verificar el arranque de frontend estático y backend Docker con WSS configurable en un entorno de candidato; conservar resultado y logs sin secretos.
- [x] 3.4 Verificar reinicio del backend durante una partida online como interrupción neutral sin recuperación ficticia y comprobar que una partida local continúa iniciando, jugando y finalizando.

## 4. Pruebas de carga y seguridad operacional

- [x] 4.1 Crear harness reproducible de carga moderada para conexiones, mensajes, reconexiones, búsquedas y expiraciones; verificar límites, errores estables, TTL y limpieza sin DB ni servicios pagos.
- [x] 4.2 Ejecutar una auditoría de solicitudes y logs para confirmar ausencia de persistencia de IP completa, secretos, CDN o recursos remotos obligatorios; conservar el resultado observable.
- [x] 4.3 Verificar que la configuración ajusta límites y retención temporal sin cambiar contratos de juego, bloquear permanentemente ni contaminar métricas con datos personales.

## 5. Suite Playwright y evidencia visual

- [x] 5.1 Preparar fixtures deterministas de dos contextos, códigos de 3–6 dígitos, temas claro/oscuro, offline, reconexión, accesibilidad y viewports 360×640, 390×844 y 1280×720; verificar que cada fixture puede ser ejecutado por el executor configurado.
- [x] 5.2 Ejecutar Playwright real para arranque WSS, salas, búsquedas, reconexión, reinicio neutral, offline, accesibilidad y límites; verificar resultado observable por escenario y no delegar navegación, asincronía, viewport o concurrencia a operador/human_validation.
- [x] 5.3 Consultar Stitch por los IDs exactos aplicables o registrar error, snapshot HTML local, `status: fallback_applied` y `blocking: false`; verificar que Stitch no aparece como dependencia de runtime.
- [x] 5.4 Generar capturas PNG comparativas anotadas de cada pantalla/estado/tema/viewport aplicable, diferencias justificadas, reporte, scripts y manifiesto; verificar trazabilidad a SHA y ausencia de scroll general durante partidas.
- [x] 5.5 Conservar resultados, logs sanitizados y artefactos pesados en PR o CI con ubicación/retención documentadas; verificar que ningún check no ejecutado se declara PASS.

## 6. Cierre y entrega

- [x] 6.1 Ejecutar mediante el executor configurado los comandos declarados aplicables (`npm run test`, `npm run build`, `npm run e2e` o `npm run check`) y las pruebas de carga; conservar salida, fallos y correcciones, sin afirmar ejecución ausente.
- [x] 6.2 Repetir la suite integral y las verificaciones de retiro después de integrar todos los componentes; verificar cobertura de cada escenario de las specs y ausencia de regresiones en PF-09.
- [x] 6.3 Preparar el PR obligatorio en `request-10-pf-10-seguridad-operacional-validacion-i` con SHA base/head, escenarios Gherkin, métricas, límites, logs sanitizados, manifiesto y evidencia visual; verificar que no se hace merge ni publicación automática.
- [x] 6.4 Solicitar validación explícita del propietario para despliegue y documentar cualquier seguimiento físico post-merge sin usarlo para bloquear las comprobaciones automatizables del navegador.
