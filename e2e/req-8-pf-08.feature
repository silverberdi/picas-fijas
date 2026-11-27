# Escenarios PF-08: memoria local privada, estadísticas, medallas y preferencias.

Característica: Progreso local reproducible
  Escenario: Un resultado elegible se deduplica y uno neutral se descarta
    Dado un resultado terminal de victoria con dimensiones completas
    Cuando el resultado se acepta dos veces y se intenta aceptar una interrupción técnica
    Entonces el historial local contiene una sola victoria y no contiene la interrupción

  Escenario: El filtro no mezcla asistencia ni modalidad
    Dado resultados elegibles asistidos y no asistidos en modalidades distintas
    Cuando se selecciona un filtro compuesto exacto
    Entonces las métricas sólo usan el subconjunto que coincide con todas sus dimensiones

  Escenario: Las medallas y preferencias sobreviven sin conexión
    Dado historial local, medallas evaluadas y preferencias guardadas
    Cuando se recarga la aplicación sin conexión
    Entonces se muestran las mismas estadísticas, medallas y preferencias

  Escenario: Cancelar reset no cambia y confirmar conserva historial
    Dado preferencias personalizadas e historial local
    Cuando se cancela el diálogo de restablecimiento y después se confirma
    Entonces cancelar conserva las preferencias y confirmar restaura defaults sin borrar historial ni medallas
