# Design

## Context

PF-03 ya define el motor puro de secretos, puntuación, reloj y resolución competitiva. PF-04 debe reutilizar ese contrato en web y motor compartido, manteniendo la arquitectura Angular/TypeScript/Fastify aprobada, sin servicios de IA ni dependencias externas de runtime. La máquina necesita snapshots por participante, cálculo aislado y una fuente de tiempo/aleatoriedad controlable.

La referencia visual exacta solicitada es Stitch project `7461201299918295899` con cinco IDs: duelo móvil `8fdefea15f054e4fab10978d9e263d5f`, carrera móvil `578efe96cf894d879cfb976c3c868417`, duelo escritorio `3838177211b144d3b6840ebf9cf7bfa7`, carrera escritorio `464d2bb886424af0b419ce58290f3106` y resultados `72765bd741154a1c8fbf4728f8a655dd`. La integración Stitch no está expuesta en esta ejecución; se registra `status: fallback_applied`, `blocking: false` y se usan los HTML locales correspondientes como snapshot de contingencia.

## Goals / Non-Goals

**Goals:**

- Entregar duelo y carrera contra «La máquina» usando el ciclo de PF-03 sin alterar presets ni puntuación.
- Aislar la información legítima mediante snapshots separados para persona y máquina, incluyendo ocultación de carrera.
- Mantener la UI responsiva con trabajo pesado fuera del hilo de interacción y latencia reproducible por semilla.
- Cubrir las tres estrategias con pruebas deterministas, simulaciones y evidencia Playwright en estados, temas y viewports definidos.

**Non-Goals:**

- No introducir modelos, servicios de IA, dependencias remotas, cuentas, chat, clasificación ni persistencia central.
- No modificar reglas de PF-03, ayudas individuales, juego humano online ni decisiones de producto fuera de PF-04.
- No editar ni regenerar pantallas Stitch; el HTML local sólo es referencia de diseño/verificación.

## Decisions

### 1. Estrategias puras y contrato de decisión restringido

Las tres inteligencias implementarán una interfaz compartida que recibe únicamente configuración, historial propio, reloj lógico y fuente de aleatoriedad. La fácil elegirá mediante una heurística sencilla; la intermedia filtrará candidatos compatibles; la difícil puntuará ganancia de información sobre un muestreo acotado. Se elige esta separación sobre un único algoritmo parametrizado para que las diferencias sean auditables y no haya filtración accidental del secreto.

### 2. Snapshots y autoridad de transición

El motor será la autoridad de validación y transición. La capa de sesión construirá un snapshot para cada participante, eliminando secreto ajeno, historial rival y feedback de carrera mientras esté activa. Los eventos de carrera se ordenarán con el reloj inyectable; el cierre materializará el resumen comparativo autorizado. Se rechaza compartir el estado completo y ocultar campos sólo en la UI porque permitiría filtración por red o estado serializado.

### 3. Scheduler no bloqueante con simulación controlada

La decisión del bot se ejecutará en el mecanismo asíncrono ya disponible del runtime, con cancelación al finalizar la partida y latencia derivada de semilla/reloj. El hilo de UI sólo coordinará estado, progreso y resultado. La simulación usará la misma interfaz de reloj y semilla que el juego real, pero se mantendrá fuera del flujo de producción. Se rechaza añadir workers o paquetes nuevos hasta comprobar que el executor existente no alcanza el requisito; cualquier cambio de contrato requeriría actualizar este Change.

### 4. Evidencia visual basada en fallback trazable

Se conservará un manifiesto de procedencia con los cinco IDs, el estado de consulta y rutas de los HTML locales usados. Playwright comparará referencia e implementación con 360×640, 390×844 y 1280×720 según pantalla, tema y estado. Se documentarán diferencias justificadas y no se presentará una captura de Stitch como prueba de la aplicación.

## Risks / Trade-offs

- [Riesgo] El muestreo difícil puede elevar la latencia en seis dígitos → acotar candidatos, medir por semilla y cancelar trabajos obsoletos; fallar con estado recuperable si excede el tiempo configurado.
- [Riesgo] Un snapshot incompleto podría filtrar feedback rival → probar serialización por participante y aserciones negativas para secreto, historial y feedback antes del cierre.
- [Riesgo] El fallback HTML puede divergir de Stitch → registrar la integración no disponible, justificar cada diferencia y bloquear sólo si el fallback no permite trazabilidad suficiente.
- [Riesgo] Estados de duelo/carrera pueden introducir scroll general → validar los tres viewports con Playwright y conservar el historial como único contenedor desplazable.

## Migration Plan

1. Implementar los contratos y pruebas en `game-core`, reutilizando el motor existente y sin migración de datos.
2. Integrar sesiones y snapshots en web/API, manteniendo compatibilidad con partidas individuales y resultados existentes.
3. Añadir pantallas/estados contra máquina, simulaciones y evidencia Playwright; ejecutar los comandos declarados por el executor.
4. Si el incremento debe revertirse, retirar las rutas de inicio PF-04 y conservar el motor PF-03 sin cambiar sus contratos ni historiales locales.

## Open Questions

No hay preguntas abiertas que cambien el alcance, las especificaciones o el enfoque. Los valores configurables de duración/límites permanecen sujetos a las decisiones ya delegadas por PRODUCT-BASELINE y deberán concretarse con pruebas antes de Apply.
