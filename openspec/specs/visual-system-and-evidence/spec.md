# visual-system-and-evidence Specification

## Purpose
Establece el sistema visual local, la persistencia de tema y la trazabilidad de referencias aprobadas para que la UI sea coherente con Party y verificable en un navegador real sin depender de Stitch en runtime.

## Requirements

### Requirement: Temas y recursos locales

La UI SHALL ofrecer tema claro y oscuro, conservar la preferencia tras recargar, usar CSS/SVG y recursos locales, y SHALL funcionar sin PrimeNG, CDN, fuentes remotas ni ilustraciones remotas en runtime. Las pantallas de duelo y carrera contra la máquina SHALL conservar controles, reloj e historial interno visibles en los viewports aplicables.

#### Scenario: Preferencia de tema persistente

- **WHEN** el usuario cambia entre tema claro y oscuro, recarga la aplicación y vuelve a abrirla
- **THEN** la interfaz conserva el tema elegido y todos los estados visibles mantienen contraste y etiquetas comprensibles

#### Scenario: Partida contra máquina sin scroll general
- **WHEN** se muestra un duelo o carrera contra la máquina con historial extenso
- **THEN** controles y reloj permanecen visibles y sólo el historial tiene desplazamiento interno

### Requirement: Procedencia visual y fallback

Durante design y verify se SHALL consultar por ID las pantallas aprobadas del proyecto Stitch `7461201299918295899`: `duel-online-mobile.html` (`68e473f7f73e4f86adca782b86da0cba`), `race-online-mobile.html` (`9416634b2446455dbec79b148f434d39`), `duel-desktop.html` (`3838177211b144d3b6840ebf9cf7bfa7`), `race-desktop.html` (`464d2bb886424af0b419ce58290f3106`), `create-room.html` (`ca0a63e2b932407a942bfd26815ebd4c`), `join-room.html` (`2fb9e0158b5b4f3a842714601a3ba377`), `waiting.html` (`57272380a6a24ee8a1799a300728aa4e`), `reconnect.html` (`6d008404df5146b3a019b079d80038b6`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`); se SHALL registrar procedencia, estado de consulta y snapshot reproducible. Si Stitch no está disponible, se SHALL registrar `status: fallback_applied` y `blocking: false`, usar los HTML locales versionados como contingencia completa y no introducir Stitch como dependencia de runtime. PRODUCT-BASELINE SHALL prevalecer; los estados sin referencia explícita SHALL derivarse sin cambiar la identidad.

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

### Requirement: Evidencia UI reproducible

Verify SHALL ejecutar checks reales de navegador con el executor configurado, comparando referencia e implementación en estados, tema y viewport aplicables; SHALL conservar capturas, videos sólo cuando sean reproducibles, diferencias justificadas, reporte, scripts y manifiesto, con artefactos pesados ubicados y retenidos en CI/PR.

#### Scenario: Verificación visual trazable

- **WHEN** se verifica la UI en 360×640, 390×844 y 1280×720 según corresponda
- **THEN** existe evidencia por pantalla, estado, viewport y tema; las partidas no tienen scroll general y el historial usa scroll interno con controles visibles

#### Scenario: Evidencia de estados contra máquina
- **WHEN** se verifica el duelo, la carrera activa y el resultado final contra la máquina
- **THEN** cada estado tiene captura comparativa anotada, manifiesto, reporte y diferencias justificadas trazables en Git y en el PR

#### Scenario: Evidencia de estados online
- **WHEN** se verifica creación, unión, espera, duelo, carrera y resultado online en un navegador real
- **THEN** cada pantalla aplicable tiene captura comparativa PNG anotada, estado, tema, viewport, script, manifiesto y resultado trazable en Git y PR

### Requirement: Procedencia visual de salas públicas

Durante design y verify se SHALL extender las referencias `home-mobile.html` (`1b0e461f4c614b87bb38919c75f0fa64`), `home-desktop.html` (`fb108f500648468392d871cac3c1b714`), `create-room.html` (`ca0a63e2b932407a942bfd26815ebd4c`), `waiting.html` (`57272380a6a24ee8a1799a300728aa4e`), `duel-bot-mobile.html` (`8fdefea15f054e4fab10978d9e263d5f`) y `race-bot-mobile.html` (`578efe96cf894d879cfb976c3c868417`) para derivar listado, cola y oferta. Se SHALL registrar ID, procedencia y snapshot; si Stitch no está disponible, se SHALL registrar `status: fallback_applied` y `blocking: false`, usando los HTML locales, sin dependencia de runtime.

#### Scenario: Stitch disponible o fallback
- **WHEN** se consulta una pantalla aprobada durante propose o design
- **THEN** se registra su ID y snapshot, o el error y el HTML local con `status: fallback_applied`, `blocking: false`

#### Scenario: Estado sin referencia exacta
- **WHEN** se diseña el listado público, la cola o la oferta
- **THEN** se deriva del patrón aprobado sin cambiar la identidad Party ni inventar una pantalla antigua

### Requirement: Evidencia visual de búsqueda humana

Verify SHALL ejecutar Playwright con estados de listado, cola, oferta aceptada, oferta expirada y búsqueda cancelada, en tema y viewports comparables, y SHALL conservar capturas PNG comparativas anotadas, diferencias justificadas, scripts, reporte y manifiesto en Git y PR.

#### Scenario: Capturas trazables
- **WHEN** se verifica la UI de salas públicas y búsqueda
- **THEN** existe evidencia por pantalla, estado, tema y viewport, sin scroll general durante la partida contra la máquina
