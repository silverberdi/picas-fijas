# Design

## Context

PF-09 es la precondición funcional y aporta PWA offline, preferencias, accesibilidad y contrato visual. El repositorio declara `apps/api`, `apps/web`, `packages/game-core`, `playwright.config.ts` y los comandos `npm run test`, `npm run build`, `npm run e2e` y `npm run check`; el backend sigue siendo de instancia única en memoria según `docs/PRODUCT-BASELINE.md`. La motivación y los límites de producto están en `proposal.md`; este diseño define las fronteras técnicas para hacerlos verificables.

La autoridad durable permanece en la rama/worktree actual y en OpenSpec. El executor configurado es responsable de ejecutar Playwright real; la validación humana se reserva para decisiones del propietario, aprobación visual y autorización de publicación.

## Goals / Non-Goals

**Goals:**

- Centralizar una política de límites y expiración que pueda ser configurada por entorno, probada de forma determinista y aplicada antes de mutar salas.
- Proteger WebSockets y payloads sin almacenar estado durable nuevo, IP completa, secretos ni datos de progreso remoto.
- Exponer healthcheck y configuración explícita para frontend estático, backend Docker y WSS, y documentar el despliegue sin ejecutarlo.
- Producir una matriz de pruebas y evidencia reproducible que conecte escenario, candidato, viewport, tema, estado, logs sanitizados y artefactos.
- Mantener el reinicio online neutral y el juego local independiente del backend.

**Non-Goals:**

- Cambiar reglas, modalidades, resultados, contratos de reconexión de PF-09/PF-06/PF-07 o decisiones visuales de producto.
- Añadir PostgreSQL, Redis, colas externas, observabilidad SaaS, servicios pagos, CDN o dependencias runtime nuevas.
- Ejecutar DNS, reverse proxy, Docker de producción, GitHub Pages, publicación o modificación de secretos reales.
- Recuperar partidas online después del reinicio, simular una prueba no ejecutada o usar una decisión humana para sustituir una comprobación automatizable.

## Decisions

### Política operacional en memoria y por entorno

Se usará una política única de límites con valores por defecto seguros y overrides explícitos de entorno: origin permitido, tamaño y campos de payload, conexiones por ventana, mensajes por conexión, reconexiones y TTL. El rechazo ocurrirá antes de la transición autoritativa y devolverá un error estable con información mínima. Se prefieren contadores/ventanas en memoria sobre persistencia porque el baseline exige backend efímero y no permite IP completa; la configuración permite ajustar spam moderado sin bloqueo permanente.

### Sanitización y métricas agregadas

Los logs usarán categorías, resultado, correlación efímera y duración; nunca códigos de sala, credenciales, payloads completos, secretos ni IP completa. Las métricas serán contadores agregados de las categorías del spec y se reiniciarán con la instancia. Se rechaza instrumentar un servicio remoto porque añadiría dependencia, coste y superficie de secreto.

### Reinicio explícitamente no recuperable

El healthcheck sólo reportará disponibilidad de la instancia y versión/configuración no sensible. El reinicio invalidará el estado en memoria y comunicará interrupción neutral cuando el cliente lo observe; no se agregará snapshot durable ni mecanismo de reconstrucción. Esta decisión preserva la regla de no recuperación ficticia y permite que el cliente local continúe usando `packages/game-core` y IndexedDB sin backend.

### Configuración de despliegue sin mutación

La URL WSS, base path, origin permitido y healthcheck se leerán de configuración del entorno, con validación de ausencia de secretos en el bundle web. La documentación describirá el orden frontend estático → reverse proxy HTTPS/WSS → backend Docker Ubuntu, DNS, headers y routing SPA/PWA, pero Apply/Verify sólo comprobarán el candidato local y archivos declarativos. Se rechaza ejecutar infraestructura real porque la entrega requiere validación explícita del propietario.

### Suite y evidencia como matriz de ejecución

Se mantendrán escenarios Playwright que creen dos contextos cuando haya interacción online, intercepten/corten red para offline, controlen viewport/tema y registren reconexión y reinicio. Un manifiesto relacionará pantalla, estado, referencia Stitch ID o HTML fallback, viewport, tema, script, SHA y artefactos. Las capturas PNG anotadas son obligatorias; video sólo se adjunta para flujos animados realmente reproducidos. El executor configurado ejecuta toda navegación y concurrencia.

### Referencias visuales y fallback

Durante design/verify se consultarán los IDs exactos aplicables del manifiesto de `assets/references/README.md` si Stitch está disponible. En este entorno se registra `status: fallback_applied`, `blocking: false` y el HTML versionado correspondiente; PRODUCT-BASELINE prevalece. Stitch no se carga desde la aplicación.

### Retiro y compatibilidad

Se conservarán los contratos de PF-09 y del backend autoritativo; cualquier helper duplicado de límites, logs inseguros o configuración que sea sustituida se inventariará, migrará y retirará en el mismo Change, con pruebas repetidas después del retiro. No se hará refactor no trazable a los SHALL de este Change.

## Risks / Trade-offs

- [Riesgo] Los límites por instancia no coordinan múltiples réplicas → [Mitigación] el baseline fija instancia única; documentar explícitamente esa condición y no fingir escalabilidad.
- [Riesgo] Un valor demasiado bajo rompe reconexiones legítimas → [Mitigación] defaults moderados, overrides por entorno y escenarios de reconexión antes/después del umbral.
- [Riesgo] Los logs sanitizados dificultan diagnóstico → [Mitigación] conservar categorías, correlación efímera y conteos, nunca datos sensibles.
- [Riesgo] El reverse proxy o base path divergen del candidato → [Mitigación] healthcheck, configuración de ejemplo y prueba de arranque WSS; la publicación queda bloqueada hasta validación del propietario.
- [Riesgo] Stitch no está disponible → [Mitigación] fallback HTML versionado completo, estado explícito y comparación reproducible; no afirmar consulta remota ni equivalencia no ejecutada.
- [Riesgo] La suite integral es costosa o frágil → [Mitigación] fixtures deterministas, dos contextos sólo donde corresponde, aislamiento por proceso y artefactos por escenario; no reducir cobertura declarando checks no ejecutados como PASS.

## Migration Plan

1. Verificar PF-09 integrada, SHA base, rama y estado limpio; inventariar callers/writers de límites, reconexión, configuración y logs.
2. Implementar la política operacional, healthcheck, métricas sanitizadas y limpieza TTL sobre la instancia en memoria, retirando rutas duplicadas sólo cuando estén cubiertas.
3. Integrar configuración WSS/base path/origin y documentación de despliegue; comprobar que el bundle no contiene secretos y que no se modifica infraestructura real.
4. Añadir pruebas unitarias/integración/carga y Playwright real para dos contextos, offline, reconexión, reinicio, accesibilidad, temas, viewports y códigos 3–6.
5. Ejecutar checks declarados mediante el executor, generar logs sanitizados, capturas comparativas, reporte, manifiesto y diferencias; repetir pruebas relevantes después del retiro.
6. Preparar PR obligatorio con SHA, límites, resultados y evidencia. Rollback: conservar el candidato anterior y reiniciar la instancia; no migrar ni borrar datos porque PF-10 no añade persistencia.

## Open Questions

- Los valores concretos de límites moderados, TTL de recursos temporales y retención de artefactos CI deben fijarse en Apply usando configuración existente y probarse en los escenarios; no pueden alterar los contratos ya aprobados.
