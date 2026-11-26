# Escenarios Gherkin ejecutables por los checks de game-core y Playwright del mismo cambio.
Característica: Duelo y carrera contra La máquina

  Escenario: El snapshot de carrera activa no filtra al rival
    Dado una carrera contra La máquina con secreto común oculto
    Cuando se solicita el snapshot de la persona durante la carrera
    Entonces no contiene el secreto ni el historial del rival

  Escenario: La persona conserva la oportunidad equivalente del duelo
    Dado un duelo contra La máquina con turnos alternos
    Cuando la persona acierta durante su turno
    Entonces la máquina recibe su turno antes del cierre

  Escenario: La carrera conserva el primer acierto válido
    Dado una carrera con reloj monotónico inyectado
    Cuando llega una tentativa inválida y después un acierto válido
    Entonces la inválida no consume oportunidad y gana el acierto válido

  Escenario: La dificultad difícil no congela la interfaz
    Dado una configuración de seis dígitos y dificultad difícil
    Cuando se calcula la siguiente jugada
    Entonces se informa progreso, latencia reproducible y cancelación
