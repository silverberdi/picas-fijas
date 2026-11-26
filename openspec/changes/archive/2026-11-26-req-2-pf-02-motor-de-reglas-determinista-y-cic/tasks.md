# Tasks

## 1. Contrato y configuración del motor

- [x] 1.1 Auditar el `game-core` archivado de PF-01 y documentar sus exports/callers antes de añadir código; verificar que Apply se detiene si el paquete o la integración de PF-01 no están presentes.
- [x] 1.2 Definir los tipos serializables de configuración, secreto, tentativa, evaluación, historial, estado y resultado; verificar compilación TypeScript y round-trip JSON sin DOM, red ni almacenamiento.
- [x] 1.3 Conservar los seis presets de PF-01 y añadir configuración personalizada con longitud 3–6, repetición y límite sin límite o 1–100; fijar 180 s para carrera y 60 s por turno de duelo y verificar con pruebas que ningún preset cambia.
- [x] 1.4 Implementar generación uniforme con fuente de índices inyectada, cero inicial y exclusión de repetidos cuando corresponda; verificar rangos, reproducibilidad con semilla y distribución en el espacio pequeño de 3 dígitos.

## 2. Validación y puntuación pura

- [x] 2.1 Implementar validación de longitud, dígitos, cero inicial, repetición y límite; verificar que cada rechazo devuelve error serializable sin modificar estado, historial, intento ni turno.
- [x] 2.2 Implementar puntuación en dos pasadas: fijas primero y frecuencias restantes después; verificar `1123`/`1211` = 1 fija/2 picas, `0123`/`0123` = 4 fijas/0 picas y ausencia de doble conteo.
- [x] 2.3 Añadir enumeración exhaustiva para todas las combinaciones permitidas de longitud 3 y probar invariantes de rango/simetría; verificar que la suite cubre cero inicial y ambos modos de repetición.
- [x] 2.4 Añadir property-based tests con semillas reproducibles para longitudes 4–6, repetición, generación, validación y serialización; verificar que cada semilla respeta configuración y límites.

## 3. Ciclo de partida y resolución competitiva

- [x] 3.1 Implementar reloj monotónico inyectable y transiciones puras de estado con deadlines exactos; verificar bordes de 0/60/180 segundos, timestamps retrocedidos y tentativas posteriores al vencimiento.
- [x] 3.2 Implementar ciclo individual con razones finales de acierto, agotamiento, vencimiento, abandono e interrupción técnica; verificar resultado individual y contador de oportunidades en cada transición.
- [x] 3.3 Implementar duelo por rondas equivalentes, oportunidad conservada del rival y reglas de empate; verificar empate en la misma ronda, victoria del único acertante tras oportunidades iguales y empate competitivo por agotamiento.
- [x] 3.4 Implementar carrera con secreto común y orden temporal del reloj; verificar que el primer acierto válido gana, una tentativa inválida no consume oportunidad y el límite sin acierto produce empate.

## 4. Integración, retiro y evidencia

- [x] 4.1 Conectar los consumidores existentes de `game-core` al contrato sin duplicar reglas; verificar con búsqueda de callers y tests que no quedan rutas antiguas de cálculo o validación.
- [x] 4.2 Ejecutar `npm run test`, lint y build declarados, además de la suite Playwright configurada cuando el flujo sea observable; verificar salida reproducible y registrar comandos/resultados en la evidencia del PR.
- [x] 4.3 Inspeccionar manifiestos y bundles para confirmar ausencia de dependencias externas de runtime, DOM, red o almacenamiento en el motor; verificar que el contrato se puede serializar y restaurar.
- [x] 4.4 Preparar la evidencia Gherkin y la trazabilidad spec → test → resultado en el PR obligatorio desde la rama `request-<n>-<slug>`; verificar que no se afirma integración o despliegue sin evidencia real.
