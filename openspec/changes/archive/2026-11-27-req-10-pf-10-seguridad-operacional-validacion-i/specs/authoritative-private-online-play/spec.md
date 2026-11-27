# Spec Delta

## ADDED Requirements

### Requirement: Protección operacional de sesiones online

El servicio SHALL aplicar origin allowlist, validación de payload, límites configurables de conexiones, mensajes y reconexiones, TTL de salas/credenciales y limpieza determinista; los rechazos SHALL ser recuperables, no SHALL revelar secretos y no SHALL persistir la IP completa.

#### Scenario: Origin o payload rechazado
- **WHEN** llega una conexión de origin no permitido o un payload inválido, sobredimensionado o desconocido
- **THEN** el servicio rechaza la operación con un error estable, no muta la sala y no expone secretos

#### Scenario: Rate limit moderado y ajustable
- **WHEN** un cliente supera temporalmente el límite configurable de mensajes, conexiones o reconexiones
- **THEN** recibe un rechazo recuperable con límite temporal, la sala permanece consistente y no existe bloqueo permanente ni almacenamiento de la IP completa

#### Scenario: TTL y limpieza
- **WHEN** una sala, credencial, reserva o métrica temporal alcanza su TTL
- **THEN** el estado expira y se limpia de forma idempotente sin afectar partidas vigentes ni dejar credenciales reutilizables

### Requirement: Métricas operacionales anónimas

El servicio SHALL contabilizar de forma agregada sesiones, salas, búsquedas, rechazos, reconexiones, errores y activaciones de límites para diagnóstico operacional; las métricas SHALL omitir secretos, payloads completos e IP completa.

#### Scenario: Observación de actividad
- **WHEN** se crean salas, se buscan rivales, se rechazan mensajes, se reconecta un jugador o ocurre un error
- **THEN** se actualizan contadores anónimos con categoría y resultado, sin identidad persistente ni secreto

#### Scenario: Logs sanitizados
- **WHEN** se exportan logs para una prueba o PR
- **THEN** pueden correlacionar el escenario y el resultado, pero no contienen códigos privados, credenciales, payloads sensibles ni IP completa
