# deterministic-rules-and-game-cycle Specification

## Purpose

Define el contrato puro y serializable que genera secretos, valida tentativas, calcula picas y fijas y resuelve el ciclo de partida de Picas y Fijas de forma determinista y compartida.

## Requirements

### Requirement: Secretos, presets y configuración válida

El motor SHALL representar secretos y tentativas como cadenas de dígitos de longitud 3 a 6, SHALL conservar el cero inicial, SHALL permitir repetición sólo cuando la configuración lo indique y SHALL exponer los presets de la línea base sin modificar longitud, repetición ni límite. La generación uniforme SHALL recibir la fuente de aleatoriedad como dependencia inyectada y no SHALL depender de DOM, red o almacenamiento.

#### Scenario: Presets permanecen intactos
- **WHEN** se consultan los seis niveles estándar
- **THEN** Principiante es 3/sin repetición/ilimitado, Clásico 4/sin repetición/ilimitado, Intermedio 4/con repetición/ilimitado, Avanzado 5/sin repetición/20, Experto 5/con repetición/15 y Maestro 6/con repetición/12

#### Scenario: Generación uniforme con cero inicial
- **WHEN** una fuente inyectada produce el índice correspondiente al primer valor y se genera un secreto de longitud 4
- **THEN** el resultado puede ser `0123`, conserva cuatro caracteres y cada secreto permitido tiene la misma probabilidad bajo una fuente uniforme

#### Scenario: Configuración personalizada explícita
- **WHEN** se valida una configuración personalizada
- **THEN** acepta longitud 3–6, repetición sí/no y límite sin límite o entero entre 1 y 100, con duración global de carrera de 180 segundos y vencimiento de turno de duelo de 60 segundos como valores configurables explícitos, sin cambiar ningún preset

### Requirement: Validación y puntuación por frecuencias restantes

El motor SHALL validar longitud, caracteres, repetición y pertenencia a la configuración antes de consumir una oportunidad. Para una tentativa válida SHALL contar primero las fijas y después las coincidencias en posiciones restantes usando frecuencias restantes; SHALL evitar doble conteo y SHALL devolver fijas, picas y la tentativa normalizada de forma serializable.

#### Scenario: Dígitos repetidos se puntúan sin doble conteo
- **WHEN** se evalúa el secreto `1123` contra la tentativa `1211`
- **THEN** el resultado es 1 fija y 2 picas

#### Scenario: Coincidencia exacta con cero inicial
- **WHEN** se evalúa el secreto `0123` contra la tentativa `0123`
- **THEN** el resultado es 4 fijas y 0 picas

#### Scenario: Tentativa inválida no consume oportunidad
- **WHEN** se presenta una tentativa con longitud, carácter, repetición o configuración no permitida
- **THEN** el motor devuelve un error serializable sin puntuación, no agrega historial y no consume intento ni turno

### Requirement: Estados, razones finales y reloj inyectable

El contrato SHALL serializar configuración, estado, historial, oportunidades restantes, resultado individual, resultado competitivo y razón final. El reloj SHALL ser inyectable y monotónico para que vencimiento, duración y transiciones se puedan reproducir sin consultar el entorno global. En una partida contra la máquina o en una sala humana online, cada participante SHALL recibir un snapshot que excluya secretos e historial no legítimos y el servidor autoritativo SHALL validar la versión de transición.

#### Scenario: Agotamiento de intentos
- **WHEN** ambos jugadores consumen todas sus oportunidades sin acertar
- **THEN** cada resultado individual es derrota, el resultado competitivo es empate y la razón final indica agotamiento de intentos

#### Scenario: Vencimiento determinista
- **WHEN** el reloj inyectado alcanza el vencimiento de turno o la duración global configurada antes de un acierto válido
- **THEN** la transición usa ese instante, no acepta tentativas posteriores fuera de tiempo y registra la razón final de vencimiento

#### Scenario: Snapshot legítimo para la máquina
- **WHEN** la máquina solicita el estado de una partida
- **THEN** recibe su configuración, reglas e historial propio, pero no recibe ningún secreto ni historial del rival

#### Scenario: Snapshot legítimo para sala humana
- **WHEN** un participante solicita el estado de una sala humana online
- **THEN** recibe la versión autoritativa, sus datos permitidos y su historial propio, pero no recibe secretos ni historial privado del rival

### Requirement: Duelo por rondas equivalentes

El motor SHALL alternar turnos en rondas equivalentes y SHALL conservar la oportunidad del rival en la ronda en que un jugador acierta. Si ambos aciertan en la misma ronda SHALL resolver empate; si sólo uno acierta después de oportunidades equivalentes SHALL ganar ese jugador. El mismo contrato SHALL aplicarse cuando el rival sea «La máquina».

#### Scenario: Ambos resuelven en la misma ronda
- **WHEN** los dos jugadores aciertan sus secretos durante la misma ronda del duelo
- **THEN** el resultado competitivo es empate y ambos resultados individuales son victoria lógica de resolución compartida según el contrato

#### Scenario: Un jugador resuelve tras igualdad de oportunidades
- **WHEN** ambos jugadores han tenido la misma cantidad de oportunidades y sólo uno acierta
- **THEN** gana competitivamente el jugador que acertó

#### Scenario: La máquina conserva su oportunidad
- **WHEN** la persona acierta en su turno de un duelo contra la máquina
- **THEN** la máquina recibe su turno equivalente antes de cerrar el duelo, salvo que la transición ya sea empate por resolución compartida

### Requirement: Carrera por primer acierto válido

El motor SHALL evaluar tentativas de carrera contra un secreto común, SHALL ignorar tentativas inválidas sin consumir oportunidad y SHALL declarar ganador al primer acierto válido en el orden temporal del reloj inyectado. Si termina el límite sin acierto SHALL devolver empate competitivo. Los snapshots durante una carrera SHALL ocultar tentativas y feedback del rival hasta el cierre.

#### Scenario: Primer acierto válido gana la carrera
- **WHEN** dos tentativas válidas llegan y sólo la primera en el reloj inyectado es exacta
- **THEN** gana el jugador de esa tentativa y el estado final conserva el orden temporal y la razón de acierto

#### Scenario: Tentativa inválida no gana ni bloquea
- **WHEN** la primera recepción de una carrera es inválida y después llega un acierto válido dentro del límite
- **THEN** la inválida no consume oportunidad ni finaliza la carrera y el acierto válido gana

#### Scenario: Carrera contra máquina oculta el rival
- **WHEN** la máquina realiza una tentativa durante una carrera activa
- **THEN** el participante no recibe su tentativa ni feedback hasta que el resultado final cierre la carrera

#### Scenario: Carrera humana oculta el rival
- **WHEN** un participante realiza una tentativa durante una carrera humana activa
- **THEN** el otro participante no recibe el secreto común, la tentativa ni el feedback hasta que el resultado final cierre la carrera

### Requirement: Cobertura determinista y basada en propiedades

La suite SHALL cubrir exhaustivamente secretos, tentativas, repetición, cero inicial y límites para longitud 3, y SHALL usar propiedades aleatorias reproducibles para longitudes 4–6, configuraciones con repetición y sin repetición, generación uniforme, validación, reloj y resolución competitiva.

#### Scenario: Cobertura exhaustiva de tres dígitos
- **WHEN** se ejecuta la suite de reglas para longitud 3
- **THEN** prueba todos los secretos y tentativas permitidos por cada configuración, incluyendo cero inicial, y verifica simetría, límites y ausencia de doble conteo

#### Scenario: Propiedades aleatorias para longitudes mayores
- **WHEN** se ejecutan semillas reproducibles para longitudes 4, 5 y 6
- **THEN** cada caso conserva la longitud, respeta repetición y límites, puntúa dentro de los rangos válidos y produce transiciones serializables y deterministas
