# visual-system-and-evidence Specification

## Purpose
Establece el sistema visual local, la persistencia de tema y la trazabilidad de referencias aprobadas para que la UI sea coherente con Party y verificable en un navegador real sin depender de Stitch en runtime.

## Requirements

### Requirement: Temas y recursos locales

La UI SHALL ofrecer tema claro y oscuro, conservar la preferencia tras recargar, usar CSS/SVG y recursos locales, y SHALL funcionar sin PrimeNG, CDN, fuentes remotas ni ilustraciones remotas en runtime.

#### Scenario: Preferencia de tema persistente

- **WHEN** el usuario cambia entre tema claro y oscuro, recarga la aplicación y vuelve a abrirla
- **THEN** la interfaz conserva el tema elegido y todos los estados visibles mantienen contraste y etiquetas comprensibles

### Requirement: Procedencia visual y fallback

Durante design y verify se SHALL consultar por ID las pantallas aprobadas del proyecto Stitch `7461201299918295899`: home móvil `1b0e461f4c614b87bb38919c75f0fa64`, home escritorio `fb108f500648468392d871cac3c1b714`, levels `11123e53ada04a2ba7297f0eeb884f36` y settings `7f2012d3be454c1e9cfd58203b1f4b87`; se SHALL registrar procedencia y snapshot, usar el HTML local correspondiente sólo como fallback ante fallo y usar el fallback contractual sin bloquear cuando la cobertura sea suficiente.

#### Scenario: Referencia Stitch disponible

- **WHEN** la integración Stitch recupera una pantalla aprobada
- **THEN** el cambio registra el ID, procedencia y snapshot reproducible, y compara la implementación con esa pantalla sin editarla ni regenerarla

#### Scenario: Referencia Stitch inaccesible

- **WHEN** la consulta por ID falla durante propose, design o verify
- **THEN** se registra el fallo, se usa el HTML versionado de `assets/references/` como respaldo y se declara bloqueo únicamente si no permite justificar la equivalencia visual; ante cobertura suficiente del fallback, la verificación no se bloquea

### Requirement: Evidencia UI reproducible

Verify SHALL ejecutar checks reales de navegador con el executor configurado, comparando referencia e implementación en estados, tema y viewport aplicables; SHALL conservar capturas, videos sólo cuando sean reproducibles, diferencias justificadas, reporte, scripts y manifiesto, con artefactos pesados ubicados y retenidos en CI/PR.

#### Scenario: Verificación visual trazable

- **WHEN** se verifica la UI en 360×640, 390×844 y 1280×720 según corresponda
- **THEN** existe evidencia por pantalla, estado, viewport y tema; las partidas no tienen scroll general y el historial usa scroll interno con controles visibles
