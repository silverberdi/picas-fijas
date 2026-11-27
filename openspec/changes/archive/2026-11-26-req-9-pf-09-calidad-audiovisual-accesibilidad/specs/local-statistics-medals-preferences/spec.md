# Spec Delta

## ADDED Requirements

### Requirement: Preferencias audiovisuales persistentes y offline

Las preferencias locales SHALL incluir mute o volumen, vibración y reducción de movimiento, SHALL aplicarse a todas las vistas y efectos, y SHALL conservarse junto con el historial y las medallas después de recargar sin conexión. Un cambio o reset de preferencias SHALL no borrar estadísticas ni medallas.

#### Scenario: Persistir mute y reduced-motion
- **WHEN** el usuario activa mute y reduced-motion, recarga sin conexión y visita tutorial, partida, resultados y estadísticas
- **THEN** no se reproducen efectos audibles, no se muestran animaciones no permitidas y el historial y las medallas permanecen disponibles

#### Scenario: Vibración opcional
- **WHEN** el usuario desactiva vibración y ejecuta una interacción táctil o celebración
- **THEN** la interacción conserva su indicación visual y no solicita vibración, incluso después de una recarga offline

#### Scenario: Reset sin pérdida de progreso
- **WHEN** el usuario confirma el reset de preferencias
- **THEN** mute/volumen, vibración y reducción de movimiento vuelven a sus valores predeterminados, mientras el historial y las medallas no cambian
