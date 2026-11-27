# Spec Delta

## Purpose

Define la protección operacional, la preparación condicionada de despliegue y la validación integral reproducible de un candidato de Picas y Fijas sin mutar infraestructura real ni introducir persistencia o dependencias de runtime prohibidas.

## ADDED Requirements

### Requirement: Preparación condicionada y despliegue documentado

El incremento SHALL iniciar sólo con PF-09 integrada y el contrato transversal leído; SHALL documentar Docker backend Ubuntu, healthcheck, configuración por entorno, URL WSS, DNS, reverse proxy HTTPS/WSS, GitHub Pages base path y routing PWA para el propietario, sin modificar infraestructura real, secretos ni publicar antes de su validación.

#### Scenario: PF-09 es precondición
- **WHEN** se intenta preparar PF-10 antes de integrar PF-09
- **THEN** el cambio no inicia Apply ni publicación y registra la dependencia pendiente

#### Scenario: Candidato documentado sin mutación real
- **WHEN** se prepara la documentación del despliegue
- **THEN** contiene los pasos y variables necesarias, no contiene secretos, no cambia infraestructura real y queda pendiente de validación del propietario

### Requirement: Suite integral reproducible

La validación SHALL ejecutar pruebas reales de navegador con dos contextos, offline, reconexión, accesibilidad, temas, códigos de 3–6 dígitos y viewports 360×640, 390×844 y 1280×720 según corresponda; SHALL conservar resultados, logs sanitizados, manifiesto, scripts, reportes y capturas en PR o artefactos CI, y no SHALL declarar pruebas no ejecutadas.

#### Scenario: Executor de navegador observable
- **WHEN** se ejecuta la suite integral
- **THEN** el executor configurado realiza navegación, asincronía, viewport y concurrencia, y entrega resultados observables por escenario sin delegarlos al operador u `human_validation`

#### Scenario: Evidencia sin secretos
- **WHEN** se inspeccionan logs y artefactos de la suite
- **THEN** no contienen secretos ni IP completa, cada resultado indica PASS/FAIL o no ejecutado de forma explícita y cada evidencia es reproducible desde su script y manifiesto

### Requirement: Arranque WSS y continuidad local

Un build de producción SHALL poder arrancar el frontend estático y el backend Docker con una URL WSS configurable y compatible; tras reiniciar el backend ninguna partida online SHALL recuperarse ficticiamente, la interrupción SHALL ser neutral y el juego local SHALL continuar operativo.

#### Scenario: Comunicación del build de producción
- **WHEN** arrancan el frontend estático y backend Docker de un build de producción con configuración válida
- **THEN** el frontend se comunica con el backend usando WSS sin secretos embebidos en el frontend

#### Scenario: Reinicio y juego local
- **WHEN** el backend se reinicia durante una partida y se comprueba después el estado
- **THEN** la partida online termina como interrupción neutral sin reconstruir estado ficticio y una partida local puede iniciar, jugar y finalizar

### Requirement: Métricas anónimas y preparación de carga

El sistema SHALL exponer observación agregada de sesiones, salas, búsquedas, rechazos, reconexiones, errores y límites; SHALL ofrecer pruebas de carga moderada, limpieza y TTL; y SHALL permitir ajustar límites sin DB, servicios pagos, almacenamiento de IP completa o bloqueo permanente.

#### Scenario: Métricas sin datos prohibidos
- **WHEN** se inspeccionan métricas y logs durante actividad normal y rechazos
- **THEN** sólo se observan agregados anónimos y no aparecen secretos ni la IP completa persistida

#### Scenario: Limpieza y límite ajustable
- **WHEN** una prueba genera entradas expiradas o spam moderado y luego aplica la configuración de límites
- **THEN** TTL y limpieza eliminan el estado temporal, los límites rechazan de forma recuperable y un cambio de configuración ajusta el umbral sin bloqueo permanente
