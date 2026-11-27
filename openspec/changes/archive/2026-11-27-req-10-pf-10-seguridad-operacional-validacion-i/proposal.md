# Proposal

## Why

PF-09 deja integrada la base audiovisual, accesible y offline, pero el incremento aún necesita cerrar la seguridad operacional, la validación integral y la preparación documentada del despliegue para que el propietario pueda validar el candidato sin alterar infraestructura real ni exponer secretos. PF-10 depende de PF-09 integrada y debe convertir el contrato transversal en límites observables, pruebas reproducibles y evidencia suficiente para un PR obligatorio.

## What Changes

- Añadir protección operacional configurable para origin, payload, conexiones, reconexiones, TTL y rate limit moderado, con métricas anónimas agregadas, límites ajustables y rechazo recuperable sin persistir la IP completa ni secretos.
- Consolidar healthcheck, configuración por entorno, comunicación WSS entre build estático y backend Docker Ubuntu, y documentación para el propietario sobre DNS, reverse proxy HTTPS/WSS, GitHub Pages base path y routing PWA, sin cambiar infraestructura real ni publicar automáticamente.
- Definir y ejecutar pruebas de carga, limpieza y reinicio que demuestren límites, TTL, ausencia de recuperación ficticia de partidas y continuidad del juego local; no usar DB, servicios pagos ni dependencias externas de runtime.
- Entregar una suite integral reproducible con Playwright real, dos contextos, offline, reconexión, accesibilidad, temas, códigos de 3–6 dígitos y viewports 360×640, 390×844 y 1280×720, delegando navegación, asincronía, viewport y concurrencia al executor configurado.
- Registrar resultados, logs sin secretos, manifiesto, scripts, reportes y capturas PNG comparativas anotadas por pantalla, estado, tema y viewport en Git, PR o artefactos CI; no declarar pruebas no ejecutadas.
- Mantener la preparación condicionada a PF-09 integrada y a la validación del propietario, con rama `request-10-pf-10-seguridad-operacional-validacion-i`, PR obligatorio y sin modificar decisiones de producto.

## Capabilities

### New Capabilities

- `operational-security-release-validation`: Protección operacional configurable, healthcheck, configuración de despliegue, pruebas integrales, evidencia reproducible y documentación de preparación sin mutar infraestructura real.

### Modified Capabilities

- `authoritative-private-online-play`: Extiende los límites operacionales, observabilidad anónima, limpieza TTL, protección de conexiones/reconexiones y comportamiento seguro ante reinicio sin cambiar la autoridad ni persistir estado prohibido.
- `visual-system-and-evidence`: Extiende la evidencia visual y funcional para la suite PF-10, incluyendo estados de seguridad, despliegue, reconexión, offline, temas y los tres viewports exigidos, conservando procedencia Stitch/fallback.

## Impact

- Afecta el backend Fastify/WebSockets en memoria, sus validadores, límites, healthcheck, métricas anónimas y harnesses de carga/limpieza.
- Afecta la configuración del frontend estático/PWA, la URL WSS configurable, la documentación de Docker Ubuntu, reverse proxy, DNS, GitHub Pages y despliegue del propietario; no modifica infraestructura real ni secretos.
- Afecta pruebas unitarias, integración, carga y Playwright, además de scripts, manifiestos, logs sanitizados, capturas y reportes de evidencia.
- Requiere PF-09 integrada como precondición. No añade PostgreSQL, Redis, servicios pagos, CDN, almacenamiento de IP completa ni dependencia de Stitch en runtime.
