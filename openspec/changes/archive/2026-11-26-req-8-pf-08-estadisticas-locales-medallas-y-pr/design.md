# Design

## Context

La línea base ya exige IndexedDB para preferencias, historial y logros, juego offline después de la primera carga y ausencia de progreso central. PF-07 está archivada y sus modalidades humanas están disponibles; Apply debe comprobar esa integración antes de activar este incremento. Las pantallas nuevas siguen el contrato Party y las referencias exactas de `assets/references/README.md`.

## Goals / Non-Goals

**Goals:**

- Definir una única frontera local para aceptar resultados terminales, deduplicarlos y derivar estadísticas y medallas de manera reproducible.
- Mantener las dimensiones de análisis explícitas y evitar que resultados neutrales o asistidos contaminen récords de otro contexto.
- Versionar el esquema local para futuras migraciones sin perder el historial existente.
- Hacer que resultados, estadísticas, medallas y preferencias sean consultables tras una recarga offline.
- Entregar evidencia Playwright comparable por pantalla, estado, tema y viewport, con fallback visual trazable.

**Non-Goals:**

- No se añade sincronización, cuenta, ranking, API de progreso, IP, monedas, publicidad ni nueva dependencia de runtime.
- No se cambia el motor de reglas ni el contrato autoritativo de PF-07.
- No se editan ni regeneran pantallas en Stitch.

## Decisions

### Almacenamiento y contrato de resultado

Se usará la capa IndexedDB ya permitida por la línea base, con una versión de base explícita y dos stores lógicos: `game-results` y `preferences`. Cada resultado persistido contendrá un identificador estable de partida, resultado terminal, modalidad, dificultad/reglas normalizadas, inteligencia, asistencia, tiempo, intentos, timestamp local y versión del esquema. La clave de idempotencia será el identificador de resultado terminal; si el productor no lo entrega, se calculará a partir de la representación canónica completa, nunca de IP ni de progreso.

Se aceptarán sólo `victory`, `defeat` y `draw` elegibles. `abandonment`, `technical-interruption` y la transición neutral de bot a humano se descartan antes de escribir. Las escrituras usarán una transacción que compruebe la clave y cree el registro como operación única.

Alternativa descartada: `localStorage`, porque no ofrece transacciones, versionado ni un límite razonable para el historial. Alternativa descartada: enviar resultados al backend, porque contradice el requisito de progreso sólo local.

### Agregación y medallas

Las funciones de consulta recibirán un filtro compuesto por modalidad, reglas, inteligencia y asistencia. El filtro se aplica antes de cualquier agregación; récords y rachas no compartirán acumuladores entre filtros. La evolución se ordenará por timestamp y el empate temporal se resolverá por identificador estable.

Las medallas se derivarán del historial en cada lectura o migración, sin store independiente obligatorio. El catálogo de la spec es la autoridad: primera victoria, tres victorias, cinco victorias consecutivas dentro del filtro exacto, una victoria en cada modalidad aprobada, victoria en el mínimo de intentos permitido y victoria en 30 segundos o menos. La fecha será la primera marca temporal que satisface el criterio. Si el historial cambia por migración, el resultado se vuelve a derivar de forma determinista.

### Preferencias y restablecimiento

Las preferencias usarán un registro singleton versionado con valores validados y defaults de la aplicación. El diálogo de reset será una confirmación accesible; cancelar no escribe. Confirmar sólo reemplaza el registro de preferencias, nunca elimina `game-results`.

### Referencias visuales y evidencia

Design y Verify intentarán recuperar directamente `stats.html` (`90ce202387c8418aafd3e5d829061065`), `settings.html` (`7f2012d3be454c1e9cfd58203b1f4b87`) y `results.html` (`72765bd741154a1c8fbf4728f8a655dd`) del proyecto Stitch `7461201299918295899`. En esta sesión la integración Stitch no está disponible, por lo que el estado de planificación queda documentado como `status: fallback_applied`, `blocking: false`, usando los HTML versionados como respaldo; Apply/Verify deberá conservar el manifiesto y snapshot que realmente se obtengan. La implementación usará recursos locales y no importará HTML, CDN ni fuentes remotas como runtime.

Playwright será ejecutado por el executor configurado en `npm run e2e` y, según el alcance existente, por `npm run test`/`npm run check`. Se cubrirán estado vacío, historial filtrado, medalla obtenida, reset confirmado/cancelado y recarga offline en tema claro y oscuro, con 360×640, 390×844 y 1280×720 donde aplique. Se conservarán PNG comparativos anotados, diferencias justificadas, scripts, reporte y manifiesto en Git/PR; video sólo si el flujo de referencia es reproducible.

## Risks / Trade-offs

- [Riesgo] Un resultado duplicado o parcialmente escrito puede inflar estadísticas → Mitigación: clave estable, transacción IndexedDB y pruebas de reentrega.
- [Riesgo] Cambios futuros en reglas alteran la interpretación de récords → Mitigación: persistir la configuración normalizada y su versión, y filtrar por igualdad exacta.
- [Riesgo] Un historial grande puede hacer costosa la agregación → Mitigación: consultas locales acotadas por filtro, agregación determinista y medición con un historial representativo.
- [Riesgo] El fallback visual puede no cubrir una interacción dinámica → Mitigación: registrar la diferencia y bloquear sólo si no permite justificar equivalencia; no fabricar evidencia Stitch.
- [Riesgo] La integración PF-07 no está disponible en el candidato Apply → Mitigación: gate explícito que detiene Apply antes de activar el cambio.

## Migration Plan

1. Crear o actualizar la base IndexedDB en una transacción de upgrade, conservando stores y datos existentes de preferencias/historial cuando sus campos sean compatibles.
2. Normalizar registros antiguos sin inventar dimensiones; los que no tengan una dimensión necesaria quedan fuera de récords nuevos y se reportan como no elegibles para ese filtro.
3. Ejecutar pruebas de migración, deduplicación y recarga offline antes de habilitar navegación a las nuevas pantallas.
4. Si falla la migración, mantener la versión anterior y mostrar estado local no disponible sin borrar datos; el rollback de código se hace por el PR/OpenSpec, no mediante borrado destructivo del navegador.

## Open Questions

No quedan preguntas abiertas que cambien la spec o el enfoque. Los valores del catálogo de medallas y la elegibilidad están fijados en esta propuesta de diseño y en la delta spec para que Apply pueda probarlos sin decisiones adicionales.
