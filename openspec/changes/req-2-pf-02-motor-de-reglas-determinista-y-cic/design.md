# Design

## Context

PF-01 archivó un `game-core` TypeScript compartido y el catálogo de presets; este Change añade comportamiento sin alterar ese catálogo. El contrato debe servir a cliente y servidor, pero el alcance actual no implementa transporte, persistencia ni una UI completa. La motivación y los límites de producto están en `proposal.md` y el comportamiento observable en la spec de esta Change.

## Goals / Non-Goals

**Goals:**

- Mantener una sola implementación pura para configuración, generación, validación, puntuación y transiciones.
- Hacer reproducibles aleatoriedad, tiempo, orden de recepción y serialización para pruebas y futuros adaptadores.
- Documentar valores configurables explícitos sin mutar presets: carrera global 180 s, turno de duelo 60 s y límite personalizado sin límite o entero 1–100.
- Cubrir la matemática de frecuencias restantes, los límites exactos y las decisiones de empate con pruebas exhaustivas y basadas en propiedades.

**Non-Goals:**

- No crear endpoints, WebSockets, almacenamiento, sesiones, autenticación, matchmaking ni lógica de UI.
- No implementar inteligencias de máquina, reconexión, salas, estadísticas o despliegue.
- No cambiar nombres, longitudes, repetición o máximos de los seis presets existentes.

## Decisions

### Contrato puro y datos inmutables

El paquete expondrá tipos de configuración, secreto/tentativa, evaluación, estado de partida y resultado final compuestos sólo por valores serializables. Las operaciones recibirán estado y devolverán nuevo estado/evento o error tipado; no leerán `window`, DOM, reloj global, red, almacenamiento ni variables ocultas. Se elige este límite frente a clases con estado interno porque permite compartir el mismo resultado entre web/API y repetir una transición con la misma entrada.

### Generación uniforme y fuentes inyectadas

La generación usará una fuente que entregue índices enteros en un rango declarado; el algoritmo construirá el espacio permitido según longitud y repetición y seleccionará uniformemente sin convertir números en cadenas que pierdan ceros iniciales. En modo sin repetición se excluye cada dígito ya usado; en modo con repetición cada posición conserva los diez dígitos. La fuente inyectada se prefirió a `Math.random()` directo para reproducir semillas y probar distribución sin acoplar el core al entorno.

### Puntuación en dos pasadas

Primero se cuentan posiciones iguales y se retiran esas posiciones de ambas cadenas. Después se construyen frecuencias de los dígitos restantes y se suma el mínimo entre secreto y tentativa por dígito. Este orden hace explícita la regla de fijas primero y evita doble conteo en casos repetidos como `1123`/`1211`; se rechaza comparar sólo con búsquedas de inclusión porque sobrecuenta.

### Máquina de estados y reloj

Las transiciones recibirán un `now` proveniente de un reloj monotónico inyectable y validarán que no retroceda. El estado conservará ronda, jugador activo, intentos consumidos, historial, deadline y estado final; una tentativa inválida devuelve error sin transición. Se fijan 180 segundos para carrera y 60 segundos por turno de duelo, ambos reemplazables por configuración válida. Frente a temporizadores internos, la entrada explícita permite pruebas sin espera y evita carreras entre callback y recepción de tentativa.

### Resolución competitiva

El duelo se modelará por rondas: cada jugador recibe una oportunidad equivalente antes de avanzar; un acierto no termina hasta evaluar la oportunidad equivalente del rival. Dos aciertos en la ronda empatan; un solo acierto gana. La carrera usa un secreto común y ordena aciertos por timestamp monotónico; el primer acierto válido gana, mientras que errores inválidos no reservan el primer lugar. Agotamiento de ambos produce empate competitivo y derrota individual, tal como exige la línea base.

### Pruebas y compatibilidad

Se reutilizarán los runners y scripts ya declarados por PF-01; no se agregará una dependencia de runtime. Para longitud 3 se enumerará el espacio completo permitido por configuración; para 4–6 se usarán propiedades con semillas reproducibles, incluyendo invariantes de rango, serialización, idempotencia de evaluación y límites. Los casos Gherkin de la spec serán la matriz de integración del contrato. Cualquier cambio de API pública que no pueda conservar compatibilidad deberá pasar por `openspec update` antes de Apply.

## Risks / Trade-offs

- [Un generador que no trate el índice como rango uniforme puede sesgar secretos] → Validar límites de la fuente, probar distribución por conteos y conservar la fuente inyectada en la API.
- [Las reglas de empate pueden divergir entre duelo y carrera] → Mantener resolutores separados con escenarios explícitos y pruebas de igualdad de oportunidades/orden temporal.
- [Un reloj no monotónico puede reabrir un turno] → Rechazar timestamps retrocedidos y probar deadlines en los bordes exactos.
- [La enumeración exhaustiva de longitud 3 puede crecer si se reutiliza sin límites] → Restringirla a longitud 3 y reservar propiedades reproducibles para 4–6.
- [El contrato puede mezclarse con adaptadores web/API de PF-01] → Revisar imports y manifiestos para garantizar que `game-core` no conoce DOM, red o almacenamiento.

## Migration Plan

1. Confirmar en Apply que la integración archivada de PF-01 y el `game-core` actual están presentes.
2. Añadir contratos y reglas al paquete compartido, conservar el catálogo existente y conectar sólo pruebas del core.
3. Ejecutar tests, lint/build y checks declarados; inspeccionar que el contrato serializa y no añade runtime externo.
4. Si una transición contradice la spec, detener Apply y actualizar primero los artefactos OpenSpec; rollback consiste en retirar el commit del Change porque no hay migraciones ni estado durable.

## Open Questions

Ninguna: los valores delegados de duración de carrera, vencimiento de turno y rango de límites personalizados quedan resueltos en este diseño y deben probarse antes de implementar.
