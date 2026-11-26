# Escenarios PF-06: reconexión, abandono, interrupción neutral, revancha y resultados.
Característica: Cierre competitivo y reconexión

  Escenario: La caída pausa el reloj durante la gracia
    Dado un duelo humano activo y una caída de red de un participante
    Cuando transcurre menos de 60 segundos y el participante reconecta
    Entonces conserva identidad, versión, turno y oportunidades sin consumir

  Escenario: El rival presente gana por gracia vencida
    Dado un participante desconectado y un rival presente
    Cuando el reloj monotónico alcanza 60 segundos sin reconexión
    Entonces el resultado es victoria del rival por abandono y no se aceptan jugadas posteriores

  Escenario: La doble desconexión termina neutral
    Dado que ambos participantes están desconectados durante la gracia
    Cuando se alcanza el límite de 60 segundos
    Entonces el resultado es interrupción para ambos sin victoria ni derrota

  Escenario: El reinicio global es neutral
    Dado una partida online activa
    Cuando el cliente informa un reinicio del backend
    Entonces results.html comunica interrupción y no comunica derrota

  Escenario: La revancha exige aceptación bilateral y rota credenciales
    Dado una partida finalizada con dos participantes
    Cuando ambos aceptan la revancha
    Entonces inicia un ciclo nuevo con credenciales y secretos distintos
