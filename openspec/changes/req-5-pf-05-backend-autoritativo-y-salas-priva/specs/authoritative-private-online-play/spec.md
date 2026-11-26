# Spec Delta

## Purpose

Define una operación online privada, autoritativa y reproducible para dos jugadores sin cuentas, con secretos filtrados por participante y convergencia ante concurrencia o reintentos.

## ADDED Requirements

### Requirement: Servidor local autoritativo y ciclo de vida de sala

El sistema SHALL ofrecer un servicio Node local de instancia única en memoria que acepte WebSockets en un puerto configurable, cree salas privadas de dos participantes y mantenga el estado de una sala hasta su TTL, sin PostgreSQL ni un demonio Docker para la operación local o E2E.

#### Scenario: Arranque aislado en puerto efímero
- **WHEN** el executor inicia el servicio para una prueba local o E2E
- **THEN** el proceso Node escucha en un puerto efímero comunicado por configuración y puede apagarse sin depender de Docker ni de otro demonio persistente

#### Scenario: Sala privada con cupo
- **WHEN** un jugador crea una sala de duelo o carrera humana con reglas válidas
- **THEN** recibe un código/enlace compartible y una credencial privada opaca, la sala admite como máximo dos participantes y el servidor conserva el estado autoritativo en memoria

#### Scenario: Sala llena, inválida o expirada
- **WHEN** se intenta crear o usar una sala llena, inválida o vencida
- **THEN** el servidor devuelve un rechazo claro, versionado y recuperable sin revelar secretos ni identidad ajena

### Requirement: Acceso privado, configuración y privacidad operativa

El sistema SHALL permitir crear o unirse mediante código o enlace, asignar un apodo automático, exigir credencial privada opaca separada del código, validar origen y esquema estricto, aplicar límites moderados configurables y TTL, y SHALL no persistir la IP completa ni registrar secretos.

#### Scenario: Unión legítima con apodo
- **WHEN** un segundo navegador presenta un código válido y su propia credencial de unión
- **THEN** se incorpora como segundo participante, recibe un apodo automático y sólo obtiene el snapshot autorizado para esa credencial

#### Scenario: Código no suplantable
- **WHEN** un tercero intenta usar sólo el código de sala para asumir la identidad de un participante
- **THEN** el servidor exige la credencial opaca correspondiente, rechaza el intento y no entrega el snapshot ni el apodo de la identidad ajena

#### Scenario: Origen, esquema y límite rechazados
- **WHEN** un cliente usa un origen no permitido, un mensaje con campos desconocidos o supera un límite configurable
- **THEN** el servidor rechaza el mensaje con un error estable y no muta el estado de la sala

### Requirement: Protocolo versionado y comandos idempotentes

El protocolo SHALL declarar su versión, correlación y resultado, y SHALL aplicar como máximo una vez cada comando válido por participante aunque llegue duplicado o concurrente; los errores no válidos SHALL ser observables sin desincronizar la sala.

#### Scenario: Comando duplicado
- **WHEN** un participante reenvía el mismo comando válido con la misma identidad e idempotency key
- **THEN** el servidor devuelve el resultado previamente aceptado, no consume otro intento ni produce una segunda transición

#### Scenario: Jugadas concurrentes
- **WHEN** dos navegadores envían jugadas válidas simultáneamente
- **THEN** el servidor las serializa según su reloj/orden de recepción autoritativo, acepta sólo las transiciones permitidas y ambos snapshots convergen al mismo número de versión

### Requirement: Duelo y carrera humana autoritativos

El servidor SHALL iniciar el duelo con secreto manual o aleatorio según contrato, iniciar la carrera con un secreto común, validar turno, reloj e intentos, emitir revancha en la misma sala y cerrar con resultado de victoria, derrota, empate, abandono o interrupción técnica conforme al motor compartido.

#### Scenario: Duelo con oportunidad equivalente
- **WHEN** un participante acierta durante su turno
- **THEN** el servidor conserva la oportunidad equivalente del rival y sólo después resuelve el resultado competitivo según el contrato de duelo

#### Scenario: Carrera sin filtración del rival
- **WHEN** un participante recibe snapshots durante una carrera activa
- **THEN** el snapshot contiene sólo su intento y feedback propios, no contiene el secreto común ni jugadas o feedback del rival, y el resumen de ambos aparece únicamente al finalizar

#### Scenario: Revancha
- **WHEN** ambos participantes solicitan una revancha válida
- **THEN** el servidor crea un nuevo ciclo en la misma sala con reglas compatibles, nuevos secretos según modalidad y versión de estado inicial reiniciada

### Requirement: Reconexión y snapshots por participante

El servidor SHALL permitir reconexión dentro del TTL usando la credencial opaca, conservar el estado sin penalización automática y filtrar cada snapshot por participante, sin exponer secretos propios de otra identidad ni secretos comunes durante carrera activa.

#### Scenario: Reconexión legítima
- **WHEN** un participante desconectado vuelve dentro de la ventana configurada con su credencial opaca
- **THEN** recupera su apodo, estado y versión autoritativa sin duplicar su cupo ni reiniciar la partida

#### Scenario: Credencial desconocida
- **WHEN** se intenta reconectar con una credencial ausente, alterada o vencida
- **THEN** el servidor rechaza la reconexión sin revelar si existe otra identidad ni el contenido de la sala

