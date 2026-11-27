# Design

## Context

PF-08 está integrado en `HEAD` y ya aporta estadísticas, medallas y preferencias locales. La línea base exige Angular/TypeScript/Tailwind, IndexedDB local, PWA en GitHub Pages, recursos propios y juego local sin backend después de la primera carga. El contrato visual vinculante está en `docs/PRODUCT-BASELINE.md` y `assets/references/README.md`; los cinco IDs de PF-09 deben consultarse por Stitch cuando la integración exista y conservar HTML local como respaldo. La integración Stitch no está expuesta en esta sesión, por lo que la planificación deja explícita la contingencia y no inventa snapshots remotos.

## Goals / Non-Goals

**Goals:**

- Centralizar la política de sonido, mute, vibración y reduced-motion para que todos los componentes la consuman sin duplicar decisiones.
- Generar y versionar recursos WAV/OGG, SVG/CSS, licencia y manifiesto sin dependencias externas de runtime.
- Completar el shell PWA, cachés versionadas, actualización atómica y fallback offline sin ocultar indebidamente las funciones online.
- Mantener intacta la persistencia local de PF-08 y demostrar navegación, juego y consulta offline en un navegador real.
- Dejar evidencia visual reproducible y ligada a pantalla, estado, tema, viewport, candidato y commit.

**Non-Goals:**

- Cambiar reglas del motor, modos, estadísticas, catálogo de medallas o contratos de juego online.
- Añadir música, cuentas, telemetría de progreso, CDN, fuentes remotas, Capacitor o una nueva dependencia de runtime.
- Editar Stitch, regenerar sus diseños o sustituir PRODUCT-BASELINE por una referencia visual.
- Usar video como requisito de cierre cuando el estado sólo sea reproducible como captura; las capturas PNG comparativas sí son obligatorias.

## Decisions

### Recursos audiovisuales y preferencia transversal

Se mantendrá un catálogo explícito de eventos (`key`, `validate`, `feedback`, `win`, `lose`, `offer`) apuntando a archivos locales generados en el repositorio. Un adaptador de reproducción consultará mute/volumen y una capacidad de vibración opcional antes de actuar; los componentes no invocarán APIs del navegador directamente. `prefers-reduced-motion` se combinará con la preferencia persistida para seleccionar una variante sin animación. Se eligió esta frontera sobre llamadas por componente para evitar divergencias entre vistas y hacer testeable la política.

### Service worker y actualización

El service worker precacheará únicamente el shell, fallback y recursos locales declarados por el build, con nombre de caché versionado. Las navegaciones offline usarán `offline.html` cuando no haya una entrada servible; las solicitudes online sólo se degradarán cuando `navigator.onLine`/la solicitud indiquen ausencia de conexión. La nueva caché se completará antes de activar y se conservará la caché activa anterior hasta el cambio controlado. Se eligió precache local y actualización atómica sobre cachear indiscriminadamente respuestas remotas, porque el contrato prohíbe recursos remotos obligatorios y exige rollback seguro.

### Persistencia y compatibilidad

Se extenderá el registro de preferencias de PF-08 mediante una migración versionada e idempotente, con valores por defecto compatibles para instalaciones existentes. IndexedDB seguirá siendo la fuente local del historial, medallas y preferencias; no se duplicará progreso en almacenamiento remoto. El reset afectará únicamente preferencias y conservará historial/medallas.

### Accesibilidad y estados visuales

Se reutilizarán los componentes y tokens Party existentes, añadiendo nombres accesibles, regiones de estado, foco visible y etiquetas textuales P/F donde falten. El estado no dependerá únicamente de color. Las partidas conservarán controles, reloj y último intento visibles, con scroll sólo en el historial. Esta decisión preserva la identidad aprobada y evita introducir una librería de componentes externa.

### Stitch, fallback y evidencia

El manifiesto de cinco pantallas se registrará con IDs exactos, resultado de consulta, procedencia y snapshot. Si la integración falla o no está disponible, se conservará un registro `status: fallback_applied`, `blocking: false`, con el error y el HTML local correspondiente; sólo se bloqueará si el fallback no permite justificar el criterio visual. El executor configurado ejecutará Playwright para la implementación y comparará estados equivalentes; no se tratará una captura de Stitch como prueba de la aplicación.

Para esta ejecución de propose, la integración Stitch/MCP no está expuesta: `status: fallback_applied`, `blocking: false`. La procedencia de respaldo queda fijada a `assets/references/offline.html` (Stitch `1198b97d32174b1886aff9bb0bd762ec`), `assets/references/settings.html` (`7f2012d3be454c1e9cfd58203b1f4b87`), `assets/references/classic-mobile.html` (`33843df735c643be803a75a306f180e6`), `assets/references/classic-desktop.html` (`6bc36b0f150544e998215a212a026e4e`) y `assets/references/results.html` (`72765bd741154a1c8fbf4728f8a655dd`). El snapshot reproducible de referencia es el contenido versionado de esos HTML; las capturas PNG comparativas de la implementación se producirán en Verify.

### Alternativas consideradas

- CDN o biblioteca de iconos/audio: rechazado por el requisito offline y la prohibición de dependencias externas de runtime.
- Un único `localStorage` para todo: rechazado porque el baseline establece IndexedDB para historial, logros y preferencias y PF-08 ya posee ese contrato.
- Activación inmediata del nuevo service worker: rechazada porque puede mezclar shell y recursos de versiones distintas.
- Validación manual como sustituto de Playwright: rechazada porque la UI es reproducible en el Chromium configurado y exige evidencia automatizada observable.

## Risks / Trade-offs

- [Riesgo] El navegador puede bloquear autoplay o APIs de vibración → [Mitigación] reproducir sólo tras una interacción y tratar audio/vibración como mejoras opcionales sin bloquear estados.
- [Riesgo] Un precache incompleto deja una ruta offline inservible → [Mitigación] probar instalación, corte de red, recarga y fallback con Playwright, y activar sólo cachés completas.
- [Riesgo] Cambios de estilos accesibles alteran referencias aprobadas → [Mitigación] comparar los viewports/temas exigidos y registrar cada diferencia justificada antes de Verify.
- [Riesgo] Una instalación previa tiene preferencias sin los nuevos campos → [Mitigación] migración idempotente con defaults y pruebas de upgrade desde el esquema de PF-08.
- [Riesgo] Stitch continúa inaccesible → [Mitigación] aplicar la contingencia documentada con HTML versionado; no afirmar equivalencia remota ni bloquear si el fallback cubre el criterio.

## Migration Plan

1. Añadir recursos y manifiestos locales, después extender preferencias con defaults y migración idempotente.
2. Integrar accesibilidad, política audiovisual y service worker/fallback sin cambiar contratos de juego.
3. Ejecutar pruebas unitarias/integración y el flujo Playwright de primera carga, instalación, corte de red, tres modos locales y preferencias.
4. Comparar las pantallas aplicables, registrar capturas/reportes/manifiesto y verificar que no quedan solicitudes remotas obligatorias.
5. Para rollback, publicar el candidato anterior y conservar los datos IndexedDB; la migración tolerará campos adicionales y no eliminará historial ni medallas.
