# Escenarios PF-07: descubrimiento público y búsqueda humana segura.
Característica: Salas públicas y búsqueda humana

  Escenario: La cola exacta conserva la partida contra la máquina
    Dado un duelo o carrera activo contra La máquina
    Cuando el jugador solicita búsqueda pública
    Entonces la cola es observable y cancelable sin pausar ni mutar el avance

  Escenario: La oferta exige confirmación bilateral
    Dado que dos reservas tienen modalidad y reglas idénticas
    Cuando ambos aceptan dentro de 20 segundos
    Entonces se crea una única partida humana y el cierre del bot es neutral

  Escenario: La oferta expirada no derrota al jugador
    Dado que existe una oferta pendiente
    Cuando vence el deadline de 20 segundos
    Entonces ambos conservan su actividad y no se registra derrota
