# Spec Delta

## ADDED Requirements

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
