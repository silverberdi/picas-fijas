# online-room-interfaces Specification

## Purpose

Define las pantallas online de creación, unión, espera, juego y resultados que permiten recorrer una sala privada con la identidad Party aprobada y estados recuperables.

## Requirements

### Requirement: Pantallas online requeridas

La aplicación SHALL entregar `create-room.html`, `join-room.html`, `waiting.html`, `duel-online-mobile.html`, `race-online-mobile.html`, `duel-desktop.html`, `race-desktop.html`, `reconnect.html` y `results.html`, con navegación accesible por teclado, tema claro/oscuro y estados de carga, rechazo, reconexión, abandono, interrupción, revancha y finalización observables.

#### Scenario: Estado de reconexión
- **WHEN** se pierde el socket durante una partida
- **THEN** `reconnect.html` muestra la gracia restante, el estado pausado y una acción clara de reintento sin revelar secretos

#### Scenario: Resultados unificados
- **WHEN** termina una partida por victoria, derrota, empate, abandono o interrupción
- **THEN** `results.html` muestra el tipo de resultado, la razón comprensible y la acción de revancha sólo cuando corresponda

#### Scenario: Catálogo de pantallas
- **WHEN** se inspecciona el incremento online
- **THEN** existen las ocho pantallas requeridas, sus rutas son navegables y cada una identifica el estado de sala o partida sin depender sólo del color

#### Scenario: Rechazo recuperable en UI
- **WHEN** una sala está llena, es inválida o la credencial no autoriza el acceso
- **THEN** la pantalla muestra una causa clara, conserva una acción de recuperación y no muestra información de otra identidad

### Requirement: Layout de partida online sin scroll general

Las pantallas de duelo y carrera SHALL conservar controles activos, reloj y estado visibles en 360×640, 390×844 y 1280×720 según corresponda, con historial desplazable internamente y sin scroll general durante la partida. La gracia de reconexión SHALL ser visible sin ocultar controles de accesibilidad ni confundirse con una derrota.

#### Scenario: Reconexión responsive
- **WHEN** se renderiza una partida pausada por desconexión en cualquier viewport aplicable
- **THEN** la cuenta atrás, el estado de conexión y la acción de reconectar permanecen visibles, el historial mantiene scroll interno y no existe scroll general

#### Scenario: Interrupción neutral visible
- **WHEN** el cliente informa un reinicio global del backend
- **THEN** la interfaz presenta interrupción neutral y no muestra texto, color o icono que atribuya derrota a un jugador

#### Scenario: Duelo responsive
- **WHEN** se renderiza el duelo online en un viewport móvil o desktop comparable
- **THEN** controles y reloj permanecen visibles, el historial usa scroll interno y el participante puede identificar turno, resultado de su jugada y conexión

#### Scenario: Carrera privada en curso
- **WHEN** se inspecciona la carrera online activa
- **THEN** la interfaz no muestra el secreto común ni jugadas o feedback del rival y conserva el layout sin scroll general
