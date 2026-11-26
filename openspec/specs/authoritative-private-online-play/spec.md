# authoritative-private-online-play Specification

## Purpose

Define una operación online privada, autoritativa y reproducible para dos jugadores sin cuentas, con secretos filtrados por participante y convergencia ante concurrencia o reintentos.

## Requirements

### Requirement: Servidor local autoritativo y ciclo de vida de sala

El sistema SHALL ofrecer un servicio Node local de instancia única en memoria que acepte WebSockets en un puerto configurable, cree salas privadas de dos participantes y mantenga el estado de una sala hasta su TTL. Un reinicio global del servicio SHALL cerrar la partida activa como interrupción neutral, sin convertirla en derrota ni abandono, y la operación local o E2E no dependerá de PostgreSQL ni de un demonio Docker.

#### Scenario: Arranque aislado en puerto efímero
- **WHEN** el executor inicia el servicio para una prueba local o E2E
- **THEN** el proceso Node escucha en un puerto efímero comunicado por configuración y puede apagarse sin depender de Docker ni de otro demonio persistente

#### Scenario: Reinicio neutral del backend
- **WHEN** el backend pierde su estado por un reinicio global durante una partida y el cliente informa esa condición
- **THEN** el resultado competitivo es interrupción para ambos, no se registra derrota y la sala no se resuelve por abandono

#### Scenario: Sala privada con cupo
- **WHEN** un jugador crea una sala de duelo o carrera humana con reglas válidas
- **THEN** recibe un código/enlace compartible y una credencial privada opaca, la sala admite como máximo dos participantes y el servidor conserva el estado autoritativo en memoria

#### Scenario: Sala llena, inválida o expirada
- **WHEN** se intenta crear o usar una sala llena, inválida o vencida
- **THEN** el servidor devuelve un rechazo claro, versionado y recuperable sin revelar secretos ni identidad ajena

### Requirement: Acceso privado, configuración y privacidad operativa

El sistema SHALL permitir crear o unirse mediante código o enlace, asignar un apodo automático, exigir credencial privada opaca separada del código, validar origen y esquema estricto, aplicar límites moderados configurables y TTL, y SHALL no persistir la IP completa ni registrar secretos. La credencial de reconexión SHALL ser privada, no reutilizable entre revancha y partida anterior, y válida sólo durante la ventana de 60 segundos desde la desconexión.

#### Scenario: Reconexión con credencial privada
- **WHEN** un participante vuelve antes de 60 segundos con su credencial opaca privada y el snapshot seguro asociado
- **THEN** recupera exclusivamente su identidad, estado y reloj autoritativos sin duplicar cupo ni exponer secretos ajenos

#### Scenario: Credencial de revancha no reutilizable
- **WHEN** ambos participantes aceptan una revancha y después se presenta una credencial de la partida anterior
- **THEN** el servidor rechaza esa credencial y exige la credencial nueva del ciclo de revancha

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

El protocolo SHALL declarar su versión, correlación y resultado, y SHALL aplicar como máximo una vez cada comando válido por participante aunque llegue duplicado o concurrente. Reconexión, abandono, renuncia, aceptación de revancha e información de reinicio SHALL ser comandos idempotentes y sus errores SHALL ser observables sin desincronizar la sala.

#### Scenario: Comando de reconexión duplicado
- **WHEN** un participante reenvía el mismo comando válido de reconexión con la misma identidad e idempotency key
- **THEN** el servidor devuelve el resultado previamente aceptado y no duplica identidad, reloj ni transición

#### Scenario: Doble desconexión durante gracia
- **WHEN** ambos participantes quedan desconectados dentro de la ventana de 60 segundos
- **THEN** la competición permanece pausada y, si ninguno retorna antes del vencimiento, el servidor resuelve una interrupción neutral

#### Scenario: Comando duplicado
- **WHEN** un participante reenvía el mismo comando válido con la misma identidad e idempotency key
- **THEN** el servidor devuelve el resultado previamente aceptado, no consume otro intento ni produce una segunda transición

#### Scenario: Jugadas concurrentes
- **WHEN** dos navegadores envían jugadas válidas simultáneamente
- **THEN** el servidor las serializa según su reloj/orden de recepción autoritativo, acepta sólo las transiciones permitidas y ambos snapshots convergen al mismo número de versión

### Requirement: Duelo y carrera humana autoritativos

El servidor SHALL iniciar el duelo con secreto manual o aleatorio según contrato, iniciar la carrera con un secreto común, validar turno, reloj e intentos, pausar la competición durante la gracia de reconexión, emitir revancha en la misma sala y cerrar con resultado de victoria, derrota, empate, abandono o interrupción técnica conforme al motor compartido. Una renuncia voluntaria SHALL distinguirse de una caída de red; si el rival está presente, la renuncia o el vencimiento de la gracia de un solo jugador SHALL dar la victoria al rival por abandono.

#### Scenario: Renuncia voluntaria con rival presente
- **WHEN** un participante elige renunciar mientras el rival permanece presente
- **THEN** el rival gana por abandono y el resultado identifica la renuncia, no una caída de red

#### Scenario: Desconexión vencida con rival presente
- **WHEN** un jugador permanece desconectado durante más de 60 segundos y el rival está presente
- **THEN** gana el rival por abandono al vencer la gracia

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

El servidor SHALL permitir reconexión dentro de 60 segundos usando la credencial opaca, conservar el estado sin penalización automática y filtrar cada snapshot por participante, sin exponer secretos propios de otra identidad ni secretos comunes durante carrera activa. Mientras al menos un participante pueda reconectar, la competición SHALL estar pausada y el reloj competitivo SHALL reanudarse de forma determinista al retorno o al vencimiento; una ausencia doble sin retorno SHALL terminar en interrupción neutral.

#### Scenario: Reconexión legítima
- **WHEN** un participante desconectado vuelve dentro de la ventana configurada con su credencial opaca
- **THEN** recupera su apodo, estado y versión autoritativa sin duplicar su cupo ni reiniciar la partida

#### Scenario: Credencial desconocida
- **WHEN** se intenta reconectar con una credencial ausente, alterada o vencida
- **THEN** el servidor rechaza la reconexión sin revelar si existe otra identidad ni el contenido de la sala

#### Scenario: Ausencia doble sin retorno
- **WHEN** ambos jugadores permanecen ausentes hasta vencer la gracia
- **THEN** la partida termina como interrupción neutral y ningún jugador recibe derrota o victoria por abandono
