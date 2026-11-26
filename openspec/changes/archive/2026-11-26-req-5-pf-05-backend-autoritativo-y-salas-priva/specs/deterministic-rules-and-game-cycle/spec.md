# Spec Delta

## MODIFIED Requirements

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

### Requirement: Carrera por primer acierto válido

El motor SHALL evaluar tentativas de carrera contra un secreto común, SHALL ignorar tentativas inválidas sin consumir oportunidad y SHALL declarar ganador al primer acierto válido en el orden temporal del reloj inyectado. Si termina el límite sin acierto SHALL devolver empate competitivo. Los snapshots durante una carrera SHALL ocultar tentativas y feedback del rival hasta el cierre, tanto para la máquina como para una sala humana.

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
