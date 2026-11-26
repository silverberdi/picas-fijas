# Tasks

## 1. Contratos y ciclo determinista

- [x] 1.1 Extender los tipos serializables de partida para identificar duelo/carrera contra «La máquina», dificultad, semilla, reloj y estado de cálculo; verificar compilación de `game-core` y compatibilidad de presets PF-03.
- [x] 1.2 Implementar snapshots por participante que excluyan secreto, historial y feedback no legítimos; verificar con pruebas negativas de serialización para duelo y carrera activa.
- [x] 1.3 Integrar la oportunidad equivalente del duelo y el orden temporal del primer acierto de carrera sin alterar puntuación ni validación; verificar escenarios de las deltas de `deterministic-rules-and-game-cycle`.

## 2. Inteligencias de «La máquina»

- [x] 2.1 Implementar la estrategia fácil como heurística determinista basada sólo en historial y reglas; verificar decisiones reproducibles y ausencia de acceso al secreto.
- [x] 2.2 Implementar la estrategia intermedia filtrando candidatos compatibles; verificar repetición, longitud, límites y descarte de candidatos imposibles.
- [x] 2.3 Implementar la estrategia difícil con maximización de información y muestreo acotado; verificar límite de trabajo, semilla reproducible y resultados distinguibles de las otras dificultades.
- [x] 2.4 Ejecutar las decisiones fuera del hilo de interacción con latencia simulada, cancelación y estado de progreso; verificar responsividad con configuración de seis dígitos en navegador.

## 3. Sesiones de duelo y carrera

- [x] 3.1 Añadir inicio de duelo con secreto manual o aleatorio y reloj configurable, reutilizando la configuración válida; verificar turnos, vencimiento y empate por resolución compartida.
- [x] 3.2 Añadir inicio de carrera con secreto común oculto e intentos simultáneos; verificar que ningún intento o feedback rival aparece hasta el resultado final.
- [x] 3.3 Integrar resultados victoria/derrota/empate/abandono/interrupción técnica con la pantalla unificada; verificar que la carrera conserva el orden temporal y publica el resumen sólo al cerrar.

## 4. Interfaz Party

- [x] 4.1 Implementar estados de configuración, duelo, carrera activa, cálculo del bot y resultado con identidad «La máquina» y sin ayudas competitivas; verificar accesibilidad de controles, reloj y estados.
- [x] 4.2 Adaptar layouts móvil y escritorio al manifiesto de referencias, manteniendo historial con scroll interno y sin scroll general; verificar 360×640, 390×844 y 1280×720 en claro y oscuro.
- [x] 4.3 Registrar en el manifiesto la procedencia de las cinco pantallas Stitch solicitadas y el fallback local con `status: fallback_applied` y `blocking: false`; verificar que no se añade dependencia Stitch/CDN al runtime.

## 5. Simulaciones y pruebas automatizadas

- [x] 5.1 Crear simulaciones por semilla para las tres dificultades y longitudes 3–6; verificar latencia, tasa de resolución, diferencias de estrategia y ausencia de secretos en métricas/logs.
- [x] 5.2 Completar pruebas unitarias e integración de snapshots, privacidad, turnos, reloj, carrera simultánea, inválidos y seis dígitos; verificar `npm run test` mediante el executor configurado.
- [x] 5.3 Añadir escenarios Gherkin del Request #4 y casos de regresión de PF-03; verificar que los escenarios ejecutables cubren cada Requirement de las deltas.

## 6. Verificación y entrega

- [x] 6.1 Implementar checks Playwright para duelo, carrera activa, resultado, temas y viewports comparables a las referencias; verificar `npm run e2e` mediante el executor configurado, sin delegar navegación o concurrencia a una persona.
- [x] 6.2 Generar capturas comparativas anotadas PNG, reporte, scripts y manifiesto trazable por pantalla/estado/viewport; verificar diferencias justificadas y ubicación de artefactos pesados en CI/PR.
- [x] 6.3 Ejecutar `npm run check`, revisar retiro seguro de rutas sustituidas y documentar resultados deterministas de pruebas; verificar que la evidencia queda enlazada al PR obligatorio de la rama `request-4-pf-04-duelo-y-carrera-contra-la-maquina`.
  - Apply técnico verificado: `npm run check` terminó con exit code 0; lint, 26 pruebas unitarias/integración, build y 15 escenarios Playwright pasaron. `node evidence/visual/run-evidence.mjs` también terminó con exit code 0 y valida tres PNG PF-04 por SHA-256.
  - Corrección verificada: la cobertura Playwright incluye cálculo difícil de seis dígitos y resultado final de carrera; la evidencia PNG cubre duelo activo, carrera activa y resultado final.
  - Retiro seguro verificado: no existe ruta PF-04 suplantada que retirar; se conserva `app.component.html` porque las pruebas de procedencia lo consumen explícitamente, mientras `AppComponent` usa `app.component.pf03.html`.
  - PR/candidate SHA: pendiente de consolidación del coordinador; no se inventa URL ni SHA durante Apply. La vinculación final queda `NOT_VERIFIED` hasta disponer de la identidad inmutable.
