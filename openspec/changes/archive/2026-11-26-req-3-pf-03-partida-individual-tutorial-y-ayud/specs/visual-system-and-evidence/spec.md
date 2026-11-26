# Spec Delta

## MODIFIED Requirements

### Requirement: Procedencia visual y fallback

Durante design y verify se SHALL consultar por ID las pantallas aprobadas del proyecto Stitch `7461201299918295899`: `classic-mobile.html` (`33843df735c643be803a75a306f180e6`), `classic-desktop.html` (`6bc36b0f150544e998215a212a026e4e`), `tutorial.html` (`880ed04e3a754876a4042278b377b1ec`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`); se SHALL registrar procedencia, estado de consulta y snapshot reproducible. Si Stitch no está disponible, se SHALL registrar `status: fallback_applied` y `blocking: false`, usar los HTML locales versionados como contingencia completa y no introducir Stitch como dependencia de runtime. PRODUCT-BASELINE SHALL prevalecer; los estados sin referencia explícita SHALL derivarse sin cambiar la identidad.

#### Scenario: Referencia Stitch disponible
- **WHEN** la integración Stitch recupera una pantalla aprobada
- **THEN** el cambio registra el ID, procedencia y snapshot reproducible, y compara la implementación con esa pantalla sin editarla ni regenerarla

#### Scenario: Referencia Stitch inaccesible
- **WHEN** la consulta por ID falla durante propose, design o verify
- **THEN** se registra el fallo, se usa el HTML versionado de `assets/references/` como respaldo y se declara bloqueo únicamente si no permite justificar la equivalencia visual; ante cobertura suficiente del fallback, la verificación no se bloquea

### Requirement: Evidencia UI reproducible

Verify SHALL ejecutar checks reales de navegador con el executor configurado, comparando referencia e implementación en estados, tema y viewport aplicables para configuración, partida clásica, tutorial y resultados; SHALL adjuntar capturas PNG comparativas anotadas por pantalla, estado y viewport, y conservar diferencias justificadas, reporte, scripts y manifiesto en Git y PR. Videos SHALL ser opcionales. Las partidas no SHALL tener scroll general y el historial SHALL usar scroll interno con controles visibles.

#### Scenario: Verificación visual trazable
- **WHEN** se verifica la UI en 360×640, 390×844 y 1280×720 según corresponda
- **THEN** existe evidencia por pantalla, estado, viewport y tema; las partidas no tienen scroll general y el historial usa scroll interno con controles visibles

#### Scenario: Executor automatizado de navegador
- **WHEN** se ejecutan los checks declarados para la UI con Playwright
- **THEN** el executor produce resultados observables de los estados, viewports y temas comparables, sin delegar navegación o aserciones automatizables a una persona
