# Spec Delta

## MODIFIED Requirements

### Requirement: Procedencia visual y fallback

Durante design y verify se SHALL consultar por ID las pantallas aprobadas del proyecto Stitch `7461201299918295899`: `duel-online-mobile.html` (`68e473f7f73e4f86adca782b86da0cba`), `race-online-mobile.html` (`9416634b2446455dbec79b148f434d39`), `duel-desktop.html` (`3838177211b144d3b6840ebf9cf7bfa7`), `race-desktop.html` (`464d2bb886424af0b419ce58290f3106`), `create-room.html` (`ca0a63e2b932407a942bfd26815ebd4c`), `join-room.html` (`2fb9e0158b5b4f3a842714601a3ba377`), `waiting.html` (`57272380a6a24ee8a1799a300728aa4e`), `reconnect.html` (`6d008404df5146b3a019b079d80038b6`), `results.html` (`72765bd741154a1c8fbf4728f8a655dd`), `stats.html` (`90ce202387c8418aafd3e5d829061065`) y `settings.html` (`7f2012d3be454c1e9cfd58203b1f4b87`); se SHALL registrar procedencia, estado de consulta y snapshot reproducible. Si Stitch no está disponible, se SHALL registrar `status: fallback_applied` y `blocking: false`, usar los HTML locales versionados como contingencia completa y no introducir Stitch como dependencia de runtime. PRODUCT-BASELINE SHALL prevalecer; los estados sin referencia explícita SHALL derivarse sin cambiar la identidad.

#### Scenario: Referencia Stitch disponible

- **WHEN** la integración Stitch recupera una pantalla aprobada
- **THEN** el cambio registra el ID, procedencia y snapshot reproducible, y compara la implementación con esa pantalla sin editarla ni regenerarla

#### Scenario: Referencia Stitch inaccesible

- **WHEN** la consulta por ID falla durante propose, design o verify
- **THEN** se registra el fallo, se usa el HTML versionado de `assets/references/` como respaldo y se declara bloqueo únicamente si no permite justificar la equivalencia visual; ante cobertura suficiente del fallback, la verificación no se bloquea

#### Scenario: Referencias de duelo y carrera disponibles

- **WHEN** se consultan las pantallas aprobadas de duelo y carrera contra la máquina
- **THEN** se registran sus IDs, procedencia y snapshots reproducibles para comparar la implementación sin editar ni regenerar las referencias

#### Scenario: Referencias online registradas

- **WHEN** se diseña o verifica una pantalla de sala privada online
- **THEN** se registra el ID exacto correspondiente, su snapshot y su estado de procedencia, o el fallback local con `blocking: false`

#### Scenario: Referencias locales de estadísticas, ajustes y resultados

- **WHEN** se diseña o verifica una pantalla de estadísticas, ajustes o resultados
- **THEN** se usa el ID exacto aprobado, se conserva su snapshot y se registra la procedencia Stitch o el fallback local con `status: fallback_applied` y `blocking: false`
