# Tasks

## 1. Workspace y configuración base

- [x] 1.1 Crear el workspace, lockfile y manifiestos de web, API y `game-core`; verificar que la instalación limpia usa sólo el lockfile y que los tres paquetes tienen scripts de build, test y lint.
- [x] 1.2 Configurar Angular, TypeScript, Tailwind CSS 4, PWA y Fastify sin PrimeNG ni base de datos; verificar dependencias y bundles con una inspección reproducible de manifiestos.
- [x] 1.3 Crear la configuración pública de API, el servidor en memoria y el despliegue Pages estático/Docker; verificar que una configuración de ejemplo no contiene secretos ni URLs sensibles.
- [x] 1.4 Implementar el contrato tipado inicial de `game-core` para modalidades y niveles; verificar con pruebas unitarias la cantidad exacta, longitudes, repetición y límites definidos en la línea base.

## 2. Shell inicial y navegación

- [x] 2.1 Implementar el shell de inicio con identidad Beastie Studio y exactamente cinco modalidades; verificar mediante prueba de componente que no aparecen opciones adicionales.
- [x] 2.2 Implementar el selector de seis niveles y Personalizado con sus reglas y valores permitidos; verificar selección, renderizado de reglas y validación de configuración personalizada.
- [x] 2.3 Implementar navegación por teclado, foco visible, nombres accesibles y estados no dependientes sólo del color; verificar con tests de accesibilidad y navegación de teclado en navegador.

## 3. Sistema visual local y PWA offline

- [x] 3.1 Implementar tokens de la paleta aprobada, componentes propios, CSS/SVG locales y layouts móvil/escritorio; verificar ausencia de CDN, fuentes remotas, ilustraciones remotas y PrimeNG en el artefacto.
- [x] 3.2 Implementar tema claro/oscuro con persistencia y fallback cuando el almacenamiento no esté disponible; verificar cambio, recarga, contraste y etiquetas en Playwright.
- [x] 3.3 Configurar cacheado PWA y estado local suficiente para continuar el shell y juego local después de perder API tras la primera carga; verificar el escenario offline en un navegador real.

## 4. Referencias visuales y trazabilidad

- [ ] 4.1 Consultar mediante la integración Stitch las cuatro pantallas exactas de PF-01 por sus IDs y registrar procedencia, respuesta y snapshots; verificar el manifiesto de referencias sin editar ni regenerar Stitch.
- [x] 4.2 Si alguna consulta Stitch falla, registrar el error y asociar el HTML versionado de `assets/references/` como fallback; verificar que la evidencia marca explícitamente cobertura insuficiente como bloqueo.
- [x] 4.3 Comparar las pantallas aprobadas o fallback con la implementación y resolver discrepancias funcionales según `PRODUCT-BASELINE`; verificar que no se copian dependencias remotas de los HTML históricos.

## 5. Checks reproducibles y entrega

- [x] 5.1 Declarar comandos de build, lint, unit/integration y navegador para web, API y `game-core`; verificar ejecución limpia completa y reportes reproducibles.
- [x] 5.2 Implementar checks Playwright con el executor configurado para estados, temas y viewports 360×640, 390×844 y 1280×720; verificar controles visibles, historial con scroll interno y ausencia de scroll general durante partidas.
- [x] 5.3 Generar capturas comparativas para referencias estáticas y videos sólo de flujos realmente reproducibles; verificar que cada artefacto identifica pantalla, estado, tema y viewport y que no se inventa evidencia.
- [x] 5.4 Registrar diferencias justificadas, scripts, manifiesto y reporte en Git, y ubicar archivos pesados en artefactos CI/PR con ruta y retención documentadas; verificar enlaces y metadatos de entrega.
- [x] 5.5 Ejecutar la suite final desde una rama `request-<n>-<slug>`, inspeccionar bundles y artefactos para secretos/dependencias prohibidas y preparar el PR obligatorio; verificar que el resultado coincide con proposal, specs y design.

> Apply note 4.1: el 2026-11-26T03:44:31Z se ejecutaron mediante `mcp__codex_apps__google_stitch_get_screen` las cuatro consultas exactas del proyecto `7461201299918295899`. Todas fallaron con `UNAUTHORIZED`: `This app connection requires reauthentication. Reconnect the app and try again.` `evidence/stitch-manifest.json` registra cada request, respuesta, ausencia de snapshot y SHA-256 del fallback versionado correspondiente. 4.1 permanece pendiente y bloqueada para Verify hasta disponer de autenticación y snapshots Stitch reproducibles; no se afirma equivalencia visual ni snapshot Stitch.
> Apply note 4.1 (reintento): el 2026-11-26T04:41:36Z se repitieron las cuatro consultas exactas mediante `mcp__codex_apps__google_stitch_get_screen`; las cuatro devolvieron nuevamente `UNAUTHORIZED` con reautenticación requerida. El manifiesto conserva ambos intentos, los cuatro IDs, los fallbacks y sus SHA-256; no se capturaron snapshots, por lo que 4.1 sigue sin evidencia suficiente y permanece pendiente.
> Apply note 4.1 (sesión actual): el 2026-11-26T04:56:32Z se repitieron las cuatro consultas exactas mediante `mcp__codex_apps__google_stitch_get_screen`; las cuatro devolvieron `UNAUTHORIZED` con reautenticación requerida. No se capturaron snapshots autenticados y 4.1 permanece sin evidencia suficiente; no se marca como completada.
> Apply note 4.1 (sesión actual, reintento): el 2026-11-26T05:02:13Z se repitieron las cuatro consultas exactas mediante `mcp__codex_apps__google_stitch_get_screen`; las cuatro devolvieron `UNAUTHORIZED` con reautenticación requerida. No se capturaron snapshots autenticados y 4.1 permanece sin evidencia suficiente; no se marca como completada.
