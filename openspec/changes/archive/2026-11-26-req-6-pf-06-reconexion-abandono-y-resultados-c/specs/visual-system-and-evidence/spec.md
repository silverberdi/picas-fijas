# Spec Delta

## MODIFIED Requirements

### Requirement: Procedencia visual y fallback

Durante design y verify se SHALL consultar por ID las pantallas aprobadas del proyecto Stitch `7461201299918295899`: `reconnect.html` (`6d008404df5146b3a019b079d80038b6`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`); se SHALL registrar procedencia, estado de consulta y snapshot reproducible. Si Stitch no está disponible, se SHALL registrar `status: fallback_applied` y `blocking: false`, usar los HTML locales versionados como contingencia completa y no introducir Stitch como dependencia de runtime. PRODUCT-BASELINE SHALL prevalecer y los estados sin referencia explícita SHALL derivarse sin cambiar la identidad.

#### Scenario: Consulta Stitch de PF-06
- **WHEN** propose o design consulta las dos pantallas por sus IDs exactos
- **THEN** el artefacto registra los IDs y la procedencia de cada snapshot sin editar ni regenerar Stitch

#### Scenario: Fallback por reautenticación
- **WHEN** la integración devuelve `UNAUTHORIZED` al consultar una pantalla aprobada
- **THEN** se registra `status: fallback_applied`, `blocking: false`, se usa el HTML local correspondiente y Stitch no se añade al runtime

#### Scenario: Referencia Stitch disponible
- **WHEN** la integración Stitch recupera una pantalla aprobada
- **THEN** el cambio registra el ID, procedencia y snapshot reproducible, y compara la implementación con esa pantalla sin editarla ni regenerarla

#### Scenario: Referencia de estados online
- **WHEN** se diseña o verifica una pantalla de sala privada online
- **THEN** se registra el ID exacto correspondiente, su snapshot y su estado de procedencia, o el fallback local con `blocking: false`

#### Scenario: Referencia Stitch inaccesible
- **WHEN** la consulta por ID falla durante propose, design o verify
- **THEN** se registra el fallo, se usa el HTML versionado de `assets/references/` como respaldo y se declara bloqueo únicamente si no permite justificar la equivalencia visual; ante cobertura suficiente del fallback, la verificación no se bloquea

#### Scenario: Referencias de duelo y carrera disponibles
- **WHEN** se consultan las pantallas aprobadas de duelo y carrera contra la máquina
- **THEN** se registran sus IDs, procedencia y snapshots reproducibles para comparar la implementación sin editar ni regenerar las referencias

#### Scenario: Referencias online registradas
- **WHEN** se diseña o verifica una pantalla de sala privada online
- **THEN** se registra el ID exacto correspondiente, su snapshot y su estado de procedencia, o el fallback local con `blocking: false`

### Requirement: Evidencia UI reproducible

Verify SHALL ejecutar checks reales de navegador con el executor configurado, comparando referencia e implementación en estados de reconexión, abandono, interrupción, revancha y resultados, tema y viewport aplicables; SHALL conservar capturas PNG anotadas, diferencias justificadas, reporte, scripts y manifiesto, con artefactos pesados ubicados y retenidos en CI/PR. La ausencia de vídeo no SHALL invalidar la verificación cuando la referencia sea estática.

#### Scenario: Evidencia de reconexión y resultado
- **WHEN** se verifica el incremento en 360×640, 390×844 y 1280×720 según corresponda
- **THEN** existe evidencia trazable por pantalla, estado, tema y viewport para reconexión y resultados, con capturas comparativas anotadas y sin scroll general en partida

#### Scenario: Verificación sin vídeo de referencia
- **WHEN** la referencia local es estática y no permite reproducir un flujo de vídeo equivalente
- **THEN** se conservan captura de referencia, captura de implementación, reporte, scripts y manifiesto; la falta de vídeo no bloquea por sí sola

#### Scenario: Evidencia de estados contra máquina
- **WHEN** se verifica el duelo, la carrera activa y el resultado final contra la máquina
- **THEN** cada estado tiene captura comparativa anotada, manifiesto, reporte y diferencias justificadas trazables en Git y en el PR

#### Scenario: Verificación visual trazable
- **WHEN** se verifica la UI en 360×640, 390×844 y 1280×720 según corresponda
- **THEN** existe evidencia por pantalla, estado, viewport y tema; las partidas no tienen scroll general y el historial usa scroll interno con controles visibles

#### Scenario: Evidencia de estados online
- **WHEN** se verifica creación, unión, espera, duelo, carrera y resultado online en un navegador real
- **THEN** cada pantalla aplicable tiene captura comparativa PNG anotada, estado, tema, viewport, script, manifiesto y resultado trazable en Git y PR
