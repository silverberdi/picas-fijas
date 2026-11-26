# Tasks

## 1. Auditoría y contrato de integración

- [x] 1.1 Inventariar rutas, componentes, servicios, callers y exports actuales del shell, `game-core` y almacenamiento local; verificar en un reporte que PF-01/PF-02 están disponibles y que no se duplica una ruta individual.
- [x] 1.2 Definir el estado serializable de configuración, partida, entrada, notas, ayudas y resultado; verificar round-trip JSON y ausencia del secreto en los tipos/entradas de la política de ayudas.
- [x] 1.3 Confirmar que los presets y transiciones consumidos coinciden con la spec de PF-02; verificar con pruebas de contrato que no cambian longitud, repetición, límites, reloj ni razones finales.

## 2. Configuración y partida individual offline

- [x] 2.1 Implementar la selección de individual clásico, niveles estándar y configuración personalizada válida con confirmación; verificar escenarios de presets, límites inválidos y comienzo sin API.
- [x] 2.2 Conectar teclado físico y controles táctiles a un único adaptador de dígitos, borrar y confirmar; verificar que ambos canales producen las mismas transiciones y errores accesibles.
- [x] 2.3 Renderizar historial descendente, último resultado, contador de intentos y cronómetro sobre el estado de `game-core`; verificar tentativa válida, inválida, cero inicial y agotamiento sin duplicar puntuación.
- [x] 2.4 Añadir notas manuales de dígitos y posiciones separadas del evaluador; verificar edición, persistencia durante la partida y ausencia de cambios automáticos tras nuevas tentativas.

## 3. Layout, accesibilidad y tutorial

- [x] 3.1 Implementar el layout de partida con controles arriba en móvil, izquierda en escritorio y overflow sólo en el historial; verificar con Playwright 360×640, 390×844 y 1280×720 que no existe scroll general y que reloj/entrada/resultado permanecen visibles con 20 filas.
- [x] 3.2 Aplicar nombres accesibles, foco visible, mensajes asociados y estados que no dependan sólo del color; verificar navegación por teclado y aserciones de accesibilidad en configuración, partida, ayuda y resultado.
- [x] 3.3 Implementar tutorial local con navegación táctil y de teclado, contenido de objetivo/fijas/picas/entrada/notas/ayudas y retorno a inicio/configuración; verificar apertura offline y ausencia de recursos remotos en el bundle.

## 4. Ayudas y resultado unificado

- [x] 4.1 Implementar la política pura de orientación/estrategia basada sólo en configuración visible, historial y contador; verificar con secretos distintos que la misma entrada pública no filtra el secreto y que no existe pista directa.
- [x] 4.2 Integrar contador visible de ayudas y límite de tres usos por partida; verificar primera, segunda y tercera ayuda, historial insuficiente y rechazo de la cuarta solicitud sin cambio de estado.
- [x] 4.3 Implementar la pantalla común de victoria, derrota y abandono con código, tiempo, intentos y acciones de revancha, cambio de nivel e inicio; verificar las tres razones y que cada acción conserva o reinicia el estado según corresponda.

## 5. Referencias visuales y evidencia

- [x] 5.1 Crear el manifiesto de procedencia con proyecto Stitch `7461201299918295899`, los cuatro IDs exactos y sus HTML locales; verificar que, sin integración Stitch disponible, registra `status: fallback_applied`, `blocking: false` y las cuatro rutas de fallback.
- [x] 5.2 Implementar la comparación de referencia e implementación para configuración/partida, tutorial y resultado en tema claro y oscuro; verificar que no se editan ni regeneran los diseños aprobados y que las diferencias quedan justificadas.
- [x] 5.3 Añadir scripts y fixtures Playwright para estados reproducibles, entrada táctil/teclado, ayudas, resultados, viewports y scroll; verificar capturas PNG anotadas por pantalla/estado/viewport y conservar reporte/manifiesto en Git/PR.

## 6. Retiro seguro y verificación de entrega

- [x] 6.1 Migrar callers a la ruta nueva y retirar sólo rutas o componentes sustituidos demostrablemente obsoletos; verificar búsqueda de referencias, navegación existente y repetición de las pruebas después del retiro.
- [x] 6.2 Ejecutar mediante el executor configurado `npm run lint`, `npm run test`, `npm run build` y `npm run e2e`; verificar resultados observables y registrar comandos, versiones, artefactos y fallos sin delegar checks automatizables a una persona.
- [x] 6.3 Inspeccionar manifests y bundles para confirmar ausencia de PrimeNG, CDN, fuentes/recursos remotos, Stitch runtime, API necesaria para jugar offline y dependencias nuevas no aprobadas; verificar con búsqueda reproducible y build limpio.
- [x] 6.4 Preparar la matriz Gherkin/spec → prueba → evidencia y el resumen del PR obligatorio desde la rama `request-3-pf-03-partida-individual-tutorial-y-ayud`; verificar que el resultado queda listo para `openspec verify` y posterior archive, sin declarar merge o despliegue no ejecutado.
