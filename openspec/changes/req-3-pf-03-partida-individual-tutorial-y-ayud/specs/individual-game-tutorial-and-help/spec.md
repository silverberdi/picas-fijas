# Spec Delta

## Purpose

Define la experiencia observable de configuración y partida individual clásica offline, incluyendo tutorial, ayudas de deducción limitadas y resultado unificado, sobre las reglas deterministas ya aprobadas.

## ADDED Requirements

### Requirement: Configuración individual y comienzo offline

La aplicación SHALL permitir seleccionar individual clásico, nivel estándar o configuración personalizada válida y confirmar el comienzo de una partida sin depender de la API después de la primera carga. SHALL conservar exactamente las longitudes, repetición y límites de la línea base.

#### Scenario: Configurar una partida estándar
- **WHEN** el usuario selecciona individual clásico, nivel Clásico y confirma
- **THEN** se inicia una partida con código de cuatro dígitos, sin repetición y límite ilimitado, usando el motor compartido sin modificar el preset

#### Scenario: Configurar una partida personalizada
- **WHEN** el usuario selecciona Personalizado, elige longitud 3–6, repetición sí/no y límite sin límite o permitido, y confirma
- **THEN** se inicia una partida con exactamente esa configuración y se rechazan valores fuera de la línea base antes de comenzar

#### Scenario: Continuar sin conexión
- **WHEN** la aplicación pierde la API después de la primera carga y el usuario inicia una partida individual
- **THEN** la configuración, generación del secreto y ciclo local continúan disponibles sin solicitud de red ni secreto expuesto

### Requirement: Entrada, validación e historial de la partida

La partida SHALL aceptar dígitos desde controles táctiles y teclado físico, SHALL permitir borrar y confirmar, y SHALL mostrar tentativas válidas en historial descendente con la más reciente visible inmediatamente. Tentativas inválidas SHALL mostrar el error sin consumir intento ni alterar el historial.

#### Scenario: Introducir y confirmar una tentativa
- **WHEN** el usuario introduce una cadena válida mediante teclado físico o fichas táctiles y pulsa confirmar
- **THEN** la tentativa se puntúa con `game-core`, se agrega al historial descendente y se actualizan fijas, picas, intentos y tiempo

#### Scenario: Borrar antes de confirmar
- **WHEN** el usuario introduce uno o más dígitos y pulsa borrar
- **THEN** se elimina el último dígito de la entrada activa sin modificar historial, intentos ni cronómetro

#### Scenario: Rechazar entrada inválida
- **WHEN** el usuario confirma una entrada incompleta, con caracteres no permitidos o repetición prohibida
- **THEN** se muestra un mensaje accesible, no se consume intento y la entrada permanece corregible

### Requirement: Layout estable y cronómetro visible durante la partida

Durante una partida SHALL permanecer visibles la entrada, confirmar, borrar, reloj y resultado reciente en viewports 360×640, 390×844 y 1280×720. En móvil los controles activos SHALL estar arriba y en escritorio a la izquierda; sólo el historial SHALL tener desplazamiento interno y no SHALL existir scroll general.

#### Scenario: Partida móvil con historial extenso
- **WHEN** se muestra una partida de seis dígitos con 20 filas en viewport 360×640 o 390×844
- **THEN** los controles, reloj, resultado reciente y entrada siguen visibles, el historial se desplaza internamente y la página no tiene scroll general

#### Scenario: Partida de escritorio con historial extenso
- **WHEN** se muestra la misma partida en viewport 1280×720
- **THEN** los controles están a la izquierda, el historial a la derecha con scroll interno y la entrada, reloj y resultado reciente permanecen visibles sin scroll general

### Requirement: Notas manuales de deducción

La interfaz SHALL permitir registrar y editar notas manuales de dígitos y posiciones asociadas a la partida. Las notas SHALL ser opcionales, locales a la partida y no SHALL validarse o completarse automáticamente a partir del secreto.

#### Scenario: Registrar una nota manual
- **WHEN** el usuario escribe una nota sobre un dígito o posición
- **THEN** la nota queda visible y editable junto al contexto de la partida sin consumir intento ni alterar la puntuación

#### Scenario: No deducir automáticamente
- **WHEN** cambia el historial o se consulta una nota
- **THEN** el sistema conserva el texto y estado introducidos por el usuario y no marca automáticamente un dígito o posición como correcto o incorrecto

### Requirement: Tutorial local y accesible

La aplicación SHALL ofrecer un tutorial local que explique el objetivo, fijas, picas, flujo de entrada y uso responsable de notas y ayudas. El tutorial SHALL poder recorrerse con teclado, exponer foco y etiquetas accesibles, y no SHALL requerir red ni revelar un secreto de una partida activa.

#### Scenario: Recorrer el tutorial
- **WHEN** el usuario abre tutorial y avanza sus secciones con teclado o control táctil
- **THEN** cada sección explica su concepto, el foco es visible y el usuario puede volver al inicio o a la configuración

#### Scenario: Tutorial sin dependencia externa
- **WHEN** el tutorial se abre sin conexión
- **THEN** se muestran sus contenidos y recursos locales sin CDN, fuente remota ni consulta a Stitch

### Requirement: Ayudas de orientación limitadas al historial

La partida individual SHALL ofrecer ayudas de orientación y estrategia calculadas únicamente desde el historial y la configuración visible, SHALL impedir acceso al secreto y SHALL no ofrecer una pista directa. SHALL mostrar contador de usos, permitir como máximo tres ayudas por partida y rechazar la cuarta solicitud.

#### Scenario: Usar una ayuda válida
- **WHEN** el usuario solicita una ayuda con menos de tres usos consumidos
- **THEN** se muestra una orientación o estrategia derivada del historial, se incrementa el contador visible y el secreto permanece inaccesible

#### Scenario: Bloquear la cuarta ayuda
- **WHEN** el usuario solicita una cuarta ayuda en la misma partida
- **THEN** la ayuda no está disponible, el contador conserva tres usos y no se revela información directa sobre el secreto

#### Scenario: Historial insuficiente
- **WHEN** el usuario solicita una ayuda sin suficiente historial para justificar una orientación
- **THEN** se muestra una explicación neutral de que no hay orientación disponible, sin inventar una pista ni consultar el secreto

### Requirement: Resultado unificado de partida terminada

Cuando la partida termina por victoria, derrota o abandono, la aplicación SHALL mostrar el código, tiempo e intentos, identificar el resultado y ofrecer volver a jugar, cambiar nivel e ir al inicio. El resultado SHALL ser accesible y no SHALL confundir abandono con derrota técnica.

#### Scenario: Resultado por victoria
- **WHEN** el usuario acierta el código
- **THEN** se muestra resultado de victoria con código, tiempo, intentos y las tres acciones de continuación

#### Scenario: Resultado por derrota
- **WHEN** se agotan los intentos sin acertar
- **THEN** se muestra resultado de derrota con código, tiempo, intentos y las tres acciones de continuación

#### Scenario: Resultado por abandono
- **WHEN** el usuario abandona una partida activa
- **THEN** se muestra resultado de abandono con código, tiempo, intentos y las tres acciones de continuación, diferenciándolo de victoria y derrota
