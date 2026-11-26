# Spec Delta

## ADDED Requirements

### Requirement: Pantallas de salas públicas, cola y oferta

La aplicación SHALL ofrecer estados navegables para listado público, creación, cola y oferta, con modalidad y reglas visibles sin datos personales, acciones claras de buscar, cancelar, aceptar y rechazar, teclado, tema claro/oscuro y recuperación ante expiración o desconexión.

#### Scenario: Listado público
- **WHEN** existen salas públicas visibles
- **THEN** la pantalla muestra sus reglas y modalidad sin datos personales ni funcionalidades excluidas

#### Scenario: Cola en segundo plano
- **WHEN** el jugador busca mientras juega contra la máquina
- **THEN** la UI muestra el estado de búsqueda y permite cancelarla sin ocultar ni interrumpir la partida actual

#### Scenario: Oferta expirable
- **WHEN** se presenta una oferta bilateral
- **THEN** la UI muestra la cuenta atrás de 20 segundos, acciones de confirmación y el control de sonido opcional

### Requirement: Layout de búsqueda sin scroll general

Las pantallas de listado, cola y oferta SHALL conservar controles y estado visibles en 360×640, 390×844 y 1280×720 según corresponda, sin introducir scroll general en las partidas contra la máquina.

#### Scenario: Oferta responsive
- **WHEN** se renderiza una oferta en un viewport aplicable
- **THEN** la cuenta atrás y las acciones permanecen visibles y la partida contra la máquina conserva sus controles
