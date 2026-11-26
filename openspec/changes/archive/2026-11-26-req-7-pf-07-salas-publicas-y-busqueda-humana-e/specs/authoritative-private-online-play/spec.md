# Spec Delta

## ADDED Requirements

### Requirement: Cola pública autoritativa e idempotente

El servicio SHALL mantener reservas públicas en memoria, serializar su entrada y retiro, asignar un identificador opaco y evitar duplicados ante reintentos o concurrencia. Una oferta SHALL tener TTL de 20 segundos y una transición confirmada SHALL crear como máximo una partida humana.

#### Scenario: Reserva duplicada
- **WHEN** un cliente reenvía la misma reserva con la misma clave de idempotencia
- **THEN** el servicio devuelve el resultado previo y conserva una sola reserva

#### Scenario: Retiro concurrente
- **WHEN** cancelación y desconexión llegan simultáneamente para una reserva
- **THEN** la reserva se retira una sola vez y no se emite una oferta fantasma

#### Scenario: Confirmación única
- **WHEN** ambos participantes confirman dentro del TTL y llegan reintentos duplicados
- **THEN** se crea una única partida humana con una transición autoritativa
