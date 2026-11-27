# local-statistics-medals-preferences Specification

## Purpose
Define la memoria local, privada y reproducible del progreso de juego, incluyendo estadísticas filtrables, récords, medallas y preferencias que sobreviven a una recarga offline.

## Requirements

### Requirement: Resultados locales elegibles e idempotentes
La aplicación SHALL procesar resultados terminales mediante almacenamiento local versionado. Sólo SHALL persistir victorias, derrotas y empates terminales elegibles; SHALL excluir abandonos, interrupciones técnicas y una partida contra máquina cerrada por transición humana. El registro SHALL ser idempotente para el mismo resultado, no SHALL transmitir progreso y no SHALL guardar la IP.

#### Scenario: Guardar un resultado elegible una sola vez
- **WHEN** el mismo resultado terminal elegible se procesa dos veces
- **THEN** el historial contiene un solo registro con su modalidad, reglas, inteligencia, asistencia, tiempo, intentos y resultado

#### Scenario: Rechazar un resultado no elegible
- **WHEN** se procesa un abandono, una interrupción técnica o un cierre neutral por transición de bot a humano
- **THEN** no se crea registro y no cambian récords, rachas ni medallas

### Requirement: Dimensiones separadas y filtros exactos
Las estadísticas SHALL conservar separadas modalidad, dificultad y reglas, inteligencia y nivel de asistencia. Los filtros SHALL seleccionar sólo registros que coincidan con todas las dimensiones elegidas; los récords asistidos y no asistidos SHALL ser independientes.

#### Scenario: Filtrar sin mezclar dimensiones
- **WHEN** el usuario filtra por modalidad, reglas, inteligencia y asistencia
- **THEN** cada métrica se calcula únicamente con resultados que coinciden exactamente con esos valores y no mezcla partidas asistidas con no asistidas

### Requirement: Estadísticas, récords, rachas y evolución
La pantalla SHALL mostrar partidas, victorias, derrotas, empates, porcentaje de victorias, promedio de intentos resueltos, mejores tiempos, mejores intentos, rachas y evolución para el filtro activo. El porcentaje de victorias SHALL usar partidas elegibles como denominador; las métricas sin datos SHALL mostrar estado vacío y no cero engañoso.

#### Scenario: Mostrar resumen del historial filtrado
- **WHEN** existen resultados elegibles de un filtro activo
- **THEN** se muestran todas las métricas solicitadas calculadas desde ese subconjunto y la evolución se ordena cronológicamente

#### Scenario: No contaminar récords por cierre neutral
- **WHEN** una partida bot se cierra por transición humana o interrupción técnica y luego se consulta el historial
- **THEN** esa partida no altera mejores tiempos, mejores intentos, rachas, porcentaje ni evolución

### Requirement: Catálogo determinista de medallas locales
La aplicación SHALL evaluar sin red este catálogo fijo sobre resultados elegibles: `Primer triunfo` (primera victoria), `Tres triunfos` (tres victorias), `Racha de cinco` (cinco victorias consecutivas dentro del mismo filtro exacto), `Polivalente` (al menos una victoria en cada una de las cinco modalidades aprobadas), `Precisión` (una victoria en el mínimo de intentos permitido por las reglas de esa partida) y `Velocista` (una victoria en 30 segundos o menos). Cada medalla SHALL mostrar nombre, criterio, estado y fecha del primer cumplimiento; una medalla no SHALL otorgar monedas ni recompensa económica.

#### Scenario: Evaluar medallas de forma reproducible
- **WHEN** se reevalúa el mismo historial elegible en dos recargas offline
- **THEN** el catálogo, estado, criterio y fecha de cumplimiento de cada medalla son idénticos

#### Scenario: Excluir resultados neutrales de medallas
- **WHEN** se añade un cierre neutral de bot o una interrupción técnica al flujo de resultados
- **THEN** ninguna medalla cambia hasta que exista un resultado elegible que cumpla su criterio

### Requirement: Preferencias locales y reset confirmado
La aplicación SHALL guardar localmente tema, volumen o mute, vibración y reducción de movimiento. Un reset SHALL requerir confirmación explícita y, sólo después de confirmarse, restaurar los valores predeterminados sin borrar historial ni medallas.

#### Scenario: Persistir preferencias tras recarga
- **WHEN** el usuario cambia tema, volumen o mute, vibración y reducción de movimiento, y recarga sin conexión
- **THEN** se restauran los valores guardados

#### Scenario: Cancelar o confirmar reset
- **WHEN** el usuario solicita reset y cancela la confirmación
- **THEN** las preferencias permanecen iguales; cuando confirma, vuelven a sus valores predeterminados y el historial y las medallas permanecen intactos

### Requirement: Persistencia offline observable
El historial elegible, el estado derivado de medallas y las preferencias SHALL estar disponibles después de una recarga sin conexión tras la primera carga de la aplicación. La interfaz SHALL indicar un estado vacío cuando no haya historial y no SHALL requerir backend para consultar estos datos.

#### Scenario: Recargar sin conexión conserva el estado
- **WHEN** existen resultados locales, medallas evaluadas y preferencias guardadas y la aplicación se recarga sin conexión
- **THEN** el usuario puede consultar las mismas estadísticas, medallas y preferencias sin una solicitud de red
