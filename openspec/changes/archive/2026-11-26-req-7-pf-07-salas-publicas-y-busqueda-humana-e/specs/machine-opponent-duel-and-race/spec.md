# Spec Delta

## ADDED Requirements

### Requirement: Búsqueda humana en segundo plano

La aplicación SHALL permitir solicitar sala pública, partida rápida o búsqueda exacta mientras se juega contra «La máquina», sin pausar ni modificar el estado de la partida hasta que exista confirmación bilateral y entrada efectiva en una partida humana.

#### Scenario: Buscar sin interrumpir al bot
- **WHEN** el jugador inicia una búsqueda durante duelo o carrera contra «La máquina»
- **THEN** la partida continúa, el avance se conserva y la búsqueda queda observable y cancelable

#### Scenario: Oferta fallida conserva el bot
- **WHEN** la oferta expira o sólo un jugador acepta
- **THEN** la partida contra «La máquina» continúa sin interrupción ni derrota
