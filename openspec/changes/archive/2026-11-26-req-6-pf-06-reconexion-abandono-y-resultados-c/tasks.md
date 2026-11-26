# Tasks

## 1. Contrato determinista

- [x] 1.1 Extender el estado serializable y las razones finales con `victoria`, `derrota`, `empate`, `abandono` e `interrupción`; verificar con pruebas unitarias de cada transición y razón.
- [x] 1.2 Implementar la gracia de reconexión de 60 segundos con reloj monotónico inyectable, pausa y reanudación sin consumo; verificar límites exactos antes, durante y después de 60 s.
- [x] 1.3 Resolver renuncia, caída vencida, doble desconexión y reinicio neutral; verificar que sólo el rival presente gana por abandono y que la ausencia doble/reinicio no produce derrota.
- [x] 1.4 Cubrir revancha con aceptación bilateral, ciclo nuevo y secretos/credenciales no reutilizados; verificar aislamiento por ciclo e idempotencia.

## 2. Backend autoritativo y protocolo

- [x] 2.1 Añadir comandos versionados de desconexión, reconexión, renuncia, reinicio informado y revancha con correlación e idempotency key; verificar duplicados y concurrencia sin doble transición.
- [x] 2.2 Conectar la máquina de estados de sala con snapshots seguros por participante y TTL de credencial; verificar que ningún snapshot revela secreto, historial o identidad ajena.
- [x] 2.3 Integrar el cierre de sala y resultados unificados con el ciclo de duelo/carrera; verificar integración de abandono, interrupción y revancha en pruebas de servicio.

## 3. UI y referencias visuales

- [x] 3.1 Implementar estados de reconexión y gracia en `reconnect.html`/ruta equivalente, con cuenta atrás, pausa, reintento y accesibilidad; verificar tema claro/oscuro y teclado.
- [x] 3.2 Implementar variantes de `results.html` para victoria, derrota, empate, abandono e interrupción, incluida revancha bilateral; verificar que reinicio neutral no comunica derrota.
- [x] 3.3 Registrar en el manifiesto de referencias los IDs Stitch exactos, el error `UNAUTHORIZED`, `status: fallback_applied`, `blocking: false`, snapshots HTML locales y procedencia; verificar que no exista dependencia Stitch/CDN en runtime.
- [x] 3.4 Ejecutar Playwright con el executor configurado para reconexión, abandono, interrupción, revancha y resultados en 360×640, 390×844 y 1280×720 según corresponda, ambos temas; verificar capturas PNG comparativas anotadas, scroll interno y ausencia de scroll general.

## 4. Evidencia y cierre

- [x] 4.1 Añadir escenarios Gherkin y pruebas unitarias/integración para caída de red, renuncia, vencimiento, doble desconexión, reloj durante gracia y reinicio; verificar con `npm run test`.
- [x] 4.2 Ejecutar los checks browser declarados y conservar scripts, manifiesto, reporte, capturas y diferencias justificadas en Git/PR; verificar con `npm run e2e` y el resultado observable del executor.
- [x] 4.3 Ejecutar la comprobación completa (`npm run check`) y documentar el resultado, artefactos y cualquier diferencia visual justificada antes de solicitar verify.
