# Spec Delta

## ADDED Requirements

### Requirement: Evidencia visual integral de PF-10

Verify SHALL comparar implementación y referencia Stitch por ID exacto, o HTML local con `status: fallback_applied` y `blocking: false` cuando Stitch no esté disponible, para estados operacionales, offline, reconexión, accesibilidad, temas y despliegue; SHALL conservar capturas PNG anotadas, diferencias, reporte, scripts y manifiesto por pantalla, estado y viewport.

#### Scenario: Fallback visual completo
- **WHEN** la integración Stitch no está disponible durante propose/design/verify
- **THEN** se registra el error, el ID, el HTML versionado usado y `status: fallback_applied` con `blocking: false`, sin hacer de Stitch una dependencia de runtime

#### Scenario: Comparación trazable
- **WHEN** se verifica una pantalla aplicable en 360×640, 390×844 o 1280×720 y en los temas correspondientes
- **THEN** existe captura de referencia y de implementación, comparación PNG anotada, diferencia justificada, script, manifiesto y resultado trazable al candidato

### Requirement: Evidencia de interacción y layout operacional

La evidencia SHALL cubrir dos contextos, modo offline, reconexión, errores y límites recuperables, accesibilidad y estados de health/deployment cuando tengan UI; durante partidas SHALL demostrar controles y reloj visibles, historial con scroll interno y ausencia de scroll general.

#### Scenario: Dos contextos y reconexión
- **WHEN** se ejecuta el flujo online con dos contextos y se reinicia o desconecta el backend
- **THEN** la evidencia muestra la transición observable, el resultado neutral o reconectable y la ausencia de recuperación ficticia, sin revelar secretos ajenos

#### Scenario: Layout sin scroll general
- **WHEN** se verifican partidas y estados de reconexión en los viewports exigidos
- **THEN** los controles, estado y reloj permanecen visibles, sólo el historial se desplaza y la evidencia registra viewport, tema y estado
