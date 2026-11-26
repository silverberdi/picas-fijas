# machine-opponent-duel-and-race Specification

## Purpose
Define la experiencia competitiva contra «La máquina», con estrategias independientes, privacidad de información y ejecución reproducible para duelo y carrera.

## Requirements

### Requirement: Configuración de duelo y carrera contra la máquina

La aplicación SHALL permitir iniciar un duelo o una carrera contra «La máquina» usando las reglas válidas de PF-03, sin ayudas competitivas y mostrando la identidad exactamente como «La máquina».

#### Scenario: Iniciar duelo con secreto manual o aleatorio
- **WHEN** el usuario selecciona duelo contra «La máquina» y elige secreto manual o generación aleatoria válida
- **THEN** se inicia una partida con turnos alternos, reloj configurable y el secreto del usuario queda disponible sólo para el motor autorizado

#### Scenario: Iniciar carrera con secreto común oculto
- **WHEN** el usuario selecciona carrera contra «La máquina»
- **THEN** se genera un secreto común oculto, se habilitan intentos simultáneos y no se muestra feedback del rival durante la carrera

### Requirement: Estrategias independientes y entrada legítima

Cada nivel SHALL implementar una inteligencia independiente: fácil con heurística sencilla, intermedia filtrando candidatos compatibles y difícil maximizando información mediante muestreo acotado. El bot SHALL recibir sólo su historial, configuración y reglas; SHALL no recibir el secreto, el historial del rival ni ayudas competitivas.

#### Scenario: Solicitar la próxima jugada sin secreto
- **WHEN** un bot de cualquier dificultad solicita su próxima jugada
- **THEN** la decisión se calcula sólo con su historial propio y las reglas, y el secreto no forma parte de la información recibida

#### Scenario: Dificultades producen estrategias distinguibles
- **WHEN** se ejecutan las tres inteligencias con la misma semilla, configuración e historial
- **THEN** se documentan sus diferencias de estrategia y cada una respeta la configuración de repetición, longitud y límite

### Requirement: Carrera sin filtración de intentos ni feedback

Mientras una carrera esté activa, el sistema SHALL mantener privados los intentos y feedback del rival, SHALL aceptar el feedback propio necesario para continuar y SHALL publicar el resumen de ambos sólo al finalizar.

#### Scenario: Intento rival oculto durante carrera activa
- **WHEN** el rival realiza un intento o se produce feedback rival durante una carrera activa
- **THEN** la interfaz y el estado entregado al participante no muestran ese intento ni ese feedback hasta el resultado final

#### Scenario: Resumen completo al finalizar
- **WHEN** la carrera termina por acierto, agotamiento o vencimiento
- **THEN** el resultado muestra el desenlace y el historial comparativo autorizado, incluido el rival, sin haberlo expuesto antes

### Requirement: Ejecución no bloqueante y latencia reproducible

El trabajo pesado del bot SHALL ejecutarse fuera del hilo de interacción, SHALL usar reloj y semilla inyectables, SHALL simular un tiempo razonable no instantáneo y SHALL dejar la interfaz responsiva durante cálculos de hasta seis dígitos.

#### Scenario: Interfaz responsiva durante decisión difícil
- **WHEN** la dificultad difícil calcula una jugada para un secreto de seis dígitos
- **THEN** la interfaz conserva controles y reloj operables, muestra estado de cálculo y recibe el resultado cuando termina sin congelarse

#### Scenario: Simulación reproducible por semilla
- **WHEN** se repite una simulación con la misma semilla, reglas y dificultad
- **THEN** se obtienen la misma secuencia de decisiones, latencia simulada, tasa de resolución y métricas documentadas

### Requirement: Resultados y trazabilidad de simulaciones

Las partidas contra la máquina SHALL usar los resultados competitivos aprobados y las simulaciones SHALL registrar latencia, tasa de resolución, semilla, configuración y diferencias de estrategia sin exponer secretos en logs de producción.

#### Scenario: Resultado de duelo respeta oportunidad equivalente
- **WHEN** la persona acierta durante un duelo contra la máquina
- **THEN** la máquina conserva su oportunidad equivalente de la ronda y el resultado se resuelve como victoria, empate o derrota según el contrato de reglas

#### Scenario: Métricas de simulación sin secreto
- **WHEN** se guarda evidencia de una simulación reproducible
- **THEN** contiene semilla, dificultad, configuración, latencia y resolución, pero no contiene el secreto ni información privada del rival

### Requirement: Búsqueda humana en segundo plano

La aplicación SHALL permitir solicitar sala pública, partida rápida o búsqueda exacta mientras se juega contra «La máquina», sin pausar ni modificar el estado de la partida hasta que exista confirmación bilateral y entrada efectiva en una partida humana.

#### Scenario: Buscar sin interrumpir al bot
- **WHEN** el jugador inicia una búsqueda durante duelo o carrera contra «La máquina»
- **THEN** la partida continúa, el avance se conserva y la búsqueda queda observable y cancelable

#### Scenario: Oferta fallida conserva el bot
- **WHEN** la oferta expira o sólo un jugador acepta
- **THEN** la partida contra «La máquina» continúa sin interrupción ni derrota
