# Spec Delta

## ADDED Requirements

### Requirement: Evidencia accesible y offline de PF-09

Durante propose/design/verify se SHALL registrar la procedencia de `offline.html` (`1198b97d32174b1886aff9bb0bd762ec`), `settings.html` (`7f2012d3be454c1e9cfd58203b1f4b87`), `classic-mobile.html` (`33843df735c643be803a75a306f180e6`), `classic-desktop.html` (`6bc36b0f150544e998215a212a026e4e`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`) del proyecto Stitch `7461201299918295899`; si la integración no está disponible, SHALL registrar `status: fallback_applied`, `blocking: false`, el error y el snapshot HTML local correspondiente. Verify SHALL ejecutar Playwright real con estados offline, ajustes, partida clásica y resultado, temas y viewports aplicables, y SHALL conservar capturas PNG comparativas anotadas, manifiesto, scripts, reporte y diferencias justificadas.

#### Scenario: Stitch disponible o fallback reproducible
- **WHEN** propose o design intenta recuperar una pantalla por su ID exacto
- **THEN** se registra el ID, procedencia y snapshot recuperado, o el error junto con `status: fallback_applied` y `blocking: false` usando el HTML versionado, sin editar ni regenerar la referencia

#### Scenario: Verificación visual accesible y offline
- **WHEN** verify compara la implementación en 360×640, 390×844 y 1280×720 según corresponda
- **THEN** existe evidencia trazable por pantalla, estado, tema y viewport, con foco/contraste/etiquetas verificables, sin scroll general durante partidas y con diferencias justificadas
