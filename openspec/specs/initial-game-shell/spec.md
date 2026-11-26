# initial-game-shell Specification

## Purpose
Define el shell inicial navegable de Beastie Studio y expone las modalidades y reglas de nivel que la línea base necesita para iniciar el producto sin alterar sus decisiones de juego.

## Requirements

### Requirement: Shell de inicio y modalidades

Al navegar al inicio, la aplicación SHALL mostrar la identidad Beastie Studio y exactamente estas cinco modalidades: individual clásico, duelo máquina, carrera máquina, duelo humano 1v1 y carrera humana 1v1.

#### Scenario: Inicio muestra el catálogo aprobado

- **WHEN** un usuario abre la ruta de inicio
- **THEN** ve el shell de Beastie Studio y exactamente cinco opciones de modalidad con esos nombres y sin modalidades adicionales

### Requirement: Niveles y selector personalizado

El selector SHALL mostrar los niveles Principiante (3, sin repetición, ilimitado), Clásico (4, sin repetición, ilimitado), Intermedio (4, con repetición, ilimitado), Avanzado (5, sin repetición, máximo 20), Experto (5, con repetición, máximo 15) y Maestro (6, con repetición, máximo 12), además de Personalizado.

#### Scenario: Selección de nivel conserva reglas

- **WHEN** el usuario abre el selector y selecciona cada nivel estándar
- **THEN** cada opción muestra y aplica exactamente la longitud, repetición y límite de intentos de la línea base, y Personalizado permite configurar los valores permitidos 3–6, repetición y límite o ninguno

### Requirement: Navegación accesible del shell

El shell SHALL permitir navegar con teclado, exponer estados mediante etiquetas que no dependan sólo del color y mantener controles activos identificables en viewports móviles y de escritorio.

#### Scenario: Navegación por teclado

- **WHEN** el usuario recorre inicio, modalidad y nivel usando teclado
- **THEN** el foco es visible, el orden es determinista y cada control tiene nombre accesible y estado observable
