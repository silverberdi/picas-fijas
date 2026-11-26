# Design

## Context

PF-01 aporta el shell web, tema y recursos locales; PF-02 aporta el contrato determinista compartido para configuración, puntuación, reloj y razones finales. Este Change debe conectar esos contratos en la web sin duplicar reglas ni introducir una dependencia de backend, red o Stitch en tiempo de ejecución. La motivación y el comportamiento observable están en `proposal.md` y en las deltas de `specs/`.

En esta ejecución no hay una integración Stitch callable expuesta al agente. Los cuatro HTML versionados existen y cubren la contingencia completa; el manifiesto de procedencia del Change registrará `status: fallback_applied`, `blocking: false`, los IDs exactos y las rutas locales. Si el executor de design/verify dispone de Stitch, debe consultar esos mismos IDs y reemplazar el estado de contingencia por el snapshot recuperado, sin editar ni regenerar las pantallas.

## Goals / Non-Goals

**Goals:**

- Componer configuración, partida individual, tutorial, ayudas y resultado sobre el contrato de `game-core`, con una sola fuente para validación, puntuación, reloj y finalización.
- Mantener una UI usable en los tres viewports contractuales, con layout estable, scroll exclusivamente interno del historial y controles accesibles por tacto y teclado.
- Aislar la ayuda en un servicio/función que reciba sólo configuración, historial y estado visible; impedir que el secreto sea parte de su entrada o de su salida.
- Mantener tutorial, estilos, iconografía y recursos en el bundle local; guardar únicamente preferencias/estado local permitido por la línea base.
- Dejar una matriz reproducible de pruebas y evidencia visual para estados de configuración, partida, ayuda y resultado.

**Non-Goals:**

- No implementar duelo, carrera, juego humano online, salas, matchmaking ni inteligencia de máquina.
- No cambiar presets, reglas de picas/fijas, límites, decisiones de abandono ni contrato del motor de PF-02.
- No introducir API, WebSockets, base de datos, autenticación, CDN, fuentes remotas, Stitch runtime ni nueva dependencia de recursos.
- No automatizar notas ni convertirlas en recomendaciones que revelen el secreto.

## Decisions

### Orquestación web del contrato existente

La ruta individual mantendrá un estado de pantalla pequeño: configuración, tutorial, partida activa y resultado. La capa de presentación traducirá eventos de teclado/tacto a comandos del contrato de `game-core`, conservará sólo el estado serializable necesario y renderizará sus resultados. Se elige este adaptador frente a reimplementar reglas en componentes porque evita divergencia entre validación de UI y motor, y permite probar cada transición con reloj y secreto deterministas.

### Entrada unificada y accesibilidad

Teclado físico y controles táctiles alimentarán la misma entrada activa, con comandos explícitos para dígito, borrar y confirmar. Los controles tendrán nombres accesibles, foco visible, estados no dependientes sólo del color y mensajes de error asociados a la entrada. La distribución usará un contenedor de viewport fijo durante la partida: controles arriba/historial debajo en móvil y controles izquierda/historial derecha en escritorio; el historial tendrá el único `overflow` permitido.

### Ayudas sin acceso al secreto

Las ayudas se implementarán como una política pura que reciba configuración, historial y contador de usos, y devuelva orientación neutral o indisponibilidad. La API no incluirá el secreto; la pantalla de partida sólo podrá invocarla con el estado público. El contador será parte del estado de sesión de la partida y se bloqueará en tres usos, incluyendo la cuarta solicitud. Se descarta una función que reciba el estado completo del motor porque crearía una vía accidental para filtrar el secreto.

### Notas separadas de deducción

Las notas vivirán en un modelo de presentación local a la partida, con campos explícitos para dígito/posición y texto libre. No pasarán al evaluador de tentativas ni se recalcularán al cambiar el historial. Esta separación conserva la naturaleza manual exigida y evita que una inferencia de UI se convierta en regla de producto.

### Resultado único y acciones de continuación

Victoria, derrota y abandono convergerán en un modelo de resultado con razón final, código, duración e intentos, renderizado por una pantalla común basada en `results.html`. Las acciones iniciarán una nueva configuración, conservarán el nivel para revancha o navegarán al inicio según la selección; ninguna acción mutará el secreto o historial ya terminado.

### Referencias y evidencia visual

El manifiesto de referencia usará proyecto `7461201299918295899` y sólo los IDs de PF-03. En fallback se servirán los cuatro HTML locales como referencia histórica, nunca como código productivo. Verify ejecutará Playwright con estados controlados, tema claro/oscuro y viewports aplicables, guardará capturas de referencia e implementación, comparación anotada, diferencias justificadas, scripts y manifiesto. La ausencia de video no bloquea si la captura cubre el criterio; no se confundirá una captura Stitch con una prueba de la app.

### Compatibilidad, errores y retiro

Antes de aplicar se inventariarán rutas y callers del shell que PF-03 sustituya. Se reutilizarán componentes/servicios existentes cuando su contrato sea compatible y se retirarán rutas duplicadas sólo después de migrar sus consumidores y repetir las pruebas. Errores de configuración, entrada inválida, ayuda agotada y desconexión se mostrarán de forma explícita y serializable; cualquier contradicción con PF-02 o PRODUCT-BASELINE requiere `openspec update` antes de código.

## Risks / Trade-offs

- [Un layout aparentemente estable puede introducir scroll del documento en un viewport bajo] → Fijar alturas de la pantalla de partida, medir `scrollHeight`/`clientHeight` en Playwright y hacer fallar la prueba si el documento desplaza; permitir overflow sólo al historial.
- [Una ayuda puede filtrar el secreto por una derivación demasiado específica] → Revisar entradas/salidas de la política, prohibir el secreto en tipos de UI y probar caja negra con secretos distintos e historial igual.
- [El HTML de referencia puede contener recursos remotos o diferencias históricas] → Usarlo sólo para comparación, sustituir recursos en implementación por locales y registrar diferencias justificadas; no copiar CDN ni declarar equivalencia automática.
- [La integración de teclado y tacto puede divergir] → Probar los mismos escenarios con ambos canales sobre el mismo adaptador de comandos.
- [Retirar el shell anterior puede romper navegación existente] → Censar callers, migrar rutas, ejecutar build/e2e y conservar la ruta sólo si la evidencia demuestra que aún es consumidor válido.

## Migration Plan

1. Auditar el shell y `game-core` presentes, sus callers y scripts declarados; confirmar que PF-01/PF-02 están disponibles y que no existe una ruta individual duplicada no cubierta.
2. Implementar el adaptador de configuración y partida individual, después tutorial, notas, ayudas y resultado común, manteniendo todo el cálculo en `game-core` o funciones puras sin secreto para las ayudas.
3. Añadir pruebas unitarias/integración para transiciones, entradas, contador, notas y razones finales; añadir Playwright para canales de entrada, viewports, scroll, temas y resultado.
4. Registrar el manifiesto Stitch/fallback, snapshots o HTML de referencia, capturas anotadas, reporte y diferencias en la evidencia del PR.
5. Ejecutar `npm run lint`, `npm run test`, `npm run build` y `npm run e2e` mediante el executor configurado; repetir Playwright después de retirar rutas sustituidas.
6. Rollback: revertir el commit del Change y conservar los artefactos OpenSpec; no hay migración durable de base de datos. El estado local incompatible se versionará o invalidará mediante una versión explícita, sin borrar historial de usuario.

## Open Questions

Ninguna. Los detalles delegados que afectan este Change quedan resueltos por la línea base: individual sin límite de reloj por defecto, ayudas máximas de tres usos, notas manuales y resultado unificado.
