# public-human-matching Specification

## Purpose

Permite descubrir salas públicas y encontrar un rival humano compatible en segundo plano, con privacidad, orden FIFO y transición bilateral segura desde una partida contra la máquina.

## Requirements

### Requirement: Dependencia y alcance de la búsqueda humana

El sistema SHALL habilitar este incremento sólo cuando PF-06 esté integrada. Las salas públicas SHALL mostrar modalidad y reglas sin datos personales, y el alcance SHALL excluir chat, fotos, perfiles y ranking.

#### Scenario: PF-06 no integrada
- **WHEN** se evalúa iniciar el incremento antes de integrar PF-06
- **THEN** el sistema no inicia la funcionalidad de salas públicas ni búsqueda humana

#### Scenario: Datos y funcionalidades excluidas
- **WHEN** un jugador consulta una sala pública
- **THEN** sólo observa modalidad y reglas, sin datos personales, chat, fotos, perfiles ni ranking

### Requirement: Compatibilidad exacta y cola FIFO

El sistema SHALL aceptar creación de sala pública, partida rápida y búsqueda exacta mientras se juega contra la máquina. La compatibilidad SHALL coincidir exactamente en modalidad y reglas —longitud, repetición, intentos y tiempo— y las reservas compatibles SHALL procesarse en FIFO según su entrada.

#### Scenario: Reservas compatibles en orden
- **WHEN** varias reservas con la misma modalidad y reglas entran en la cola
- **THEN** se procesan en el orden de entrada

#### Scenario: Reglas distintas
- **WHEN** dos jugadores tienen distinta modalidad o cualquier regla distinta
- **THEN** no se emparejan

#### Scenario: Cancelación o desconexión en cola
- **WHEN** una reserva cancela o se desconecta antes de una oferta
- **THEN** la reserva se elimina de forma idempotente y no produce un emparejamiento fantasma

### Requirement: Oferta bilateral con vencimiento

El sistema SHALL presentar una oferta a ambos jugadores y exigir confirmación bilateral dentro de 20 segundos. El sonido SHALL ser opcional y controlable por cada jugador. Una aceptación unilateral o expiración SHALL devolver a ambos a su actividad sin perder avance.

#### Scenario: Oferta aceptada por ambos
- **WHEN** ambos jugadores aceptan la oferta dentro de 20 segundos
- **THEN** se crea una única partida humana

#### Scenario: Aceptación unilateral
- **WHEN** sólo un jugador acepta o vence la oferta
- **THEN** ambos pueden continuar jugando o buscando, conservan su avance y la partida contra la máquina no se interrumpe

#### Scenario: Sonido opcional
- **WHEN** se muestra una oferta
- **THEN** cada jugador puede silenciar o activar su sonido sin cambiar la validez ni el vencimiento de la oferta

### Requirement: Transición neutral desde la máquina

El sistema SHALL cerrar la partida contra la máquina únicamente cuando ambos jugadores hayan confirmado y entren en la partida humana. Ese cierre SHALL ser neutral y no SHALL registrar derrota.

#### Scenario: Entrada humana confirmada
- **WHEN** ambos jugadores confirman y entran efectivamente en la partida humana
- **THEN** se cierra el bot sólo en ese momento, se conserva el avance y no se registra derrota
