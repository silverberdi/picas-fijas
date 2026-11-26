# Design

## Context

El repositorio parte sin root OpenSpec, sin manifiestos de proyectos y sin checks declarados. La única autoridad de producto disponible para este cambio es `docs/PRODUCT-BASELINE.md`; el contrato visual y el manifiesto de 20 pantallas están en `assets/references/README.md`. El inventario recibido confirma Chromium disponible, pero no declara paquetes Playwright ni comandos de test. La motivación está en `proposal.md`; los contratos observables están en las tres specs del cambio.

## Goals / Non-Goals

**Goals:**

- Crear una base monorepo pequeña, reproducible y separada por web, API y `game-core`, con responsabilidades y scripts explícitos.
- Mantener el juego local independiente de la API después de la primera carga y reservar la API externa configurable para integración futura compatible con la línea base.
- Construir el shell visual con componentes propios, recursos locales y persistencia de tema.
- Hacer que la procedencia Stitch/fallback y la evidencia Playwright sean parte verificable del incremento.

**Non-Goals:**

- Implementar partidas completas, salas, matchmaking, estadísticas, logros, autenticación o persistencia central.
- Introducir PostgreSQL, Redis, servicios de IA, PrimeNG, CDN, recursos remotos o nuevas decisiones de producto.
- Editar Stitch, regenerar sus pantallas o tratar los HTML históricos como código productivo.
- Declarar verificación visual antes de ejecutar el navegador y conservar sus artefactos.

## Decisions

### Workspace y límites de runtime

Se usará un workspace de paquetes con una aplicación Angular/PWA, una API Fastify y un paquete TypeScript puro `game-core`. Los scripts raíz delegarán build, test y lint a cada paquete, con lockfile único. Se elige esta separación frente a una aplicación monolítica porque hace explícito qué lógica puede compartir cliente/servidor y qué integración queda en la API; no se añadirá un framework de backend adicional.

La configuración pública de API se leerá desde configuración de build o runtime no sensible y se validará antes de usarse. Los secretos sólo podrán existir en el entorno del servidor y no se incluirán en bundles, logs ni ejemplos versionados. El servicio inicial será en memoria y sin base de datos; el shell y `game-core` deberán funcionar cuando la API no esté disponible.

### Shell, reglas y sistema visual

Las modalidades, niveles, límites y reglas se modelarán como datos tipados compartidos para evitar divergencia entre selector, navegación y pruebas. La aplicación mostrará exactamente el catálogo de PF-01; los flujos de juego posteriores consumirán el mismo contrato sin inventar variantes.

La UI usará tokens CSS propios basados en la paleta de `PRODUCT-BASELINE`, componentes Angular sin PrimeNG y SVG/CSS locales. El tema se persistirá en almacenamiento local apropiado, con fallback seguro si el almacenamiento no está disponible. El layout móvil priorizará controles activos arriba e historial debajo; escritorio dividirá activos a la izquierda e historial a la derecha. Sólo el historial tendrá scroll durante partidas.

### Referencias Stitch y snapshots

En esta ejecución no se expuso una integración Stitch/MCP callable, por lo que no se afirma que las pantallas hayan sido consultadas durante propose. El design/verify executor intentará recuperarlas por ID en la capacidad disponible y registrará el manifiesto exacto, respuesta y snapshot en el cambio. Los 20 HTML locales se conservarán como respaldo histórico, nunca como sustituto silencioso. Si la integración Stitch no está disponible en el entorno de ejecución, se documentará el error concreto y se usará el HTML correspondiente; si no cubre la comparación requerida, la salida será bloqueada, no inferida.

### Checks y evidencia

Se declararán comandos reproducibles de build, lint, unit/integration y navegador. El executor configurado ejecutará Chromium real para navegación, asincronía, tema, viewports y estados; no se asignarán esos checks a operador u `human_validation`. Para referencias estáticas se producirán capturas de ambos lados y comparación anotada. Para una interacción realmente reproducible se producirán videos de ambos flujos; para una referencia estática se conservará captura de referencia y video sólo de la implementación, etiquetado como tal. El manifiesto y scripts pequeños irán a Git; videos/capturas pesados irán a artefactos CI/PR con ruta y retención documentadas.

### Despliegue y rollback

La PWA tendrá configuración de build para GitHub Pages y la API tendrá contenedor Docker para Ubuntu del propietario, sin afirmar despliegue hasta probarlo. El rollback de PF-01 consiste en seleccionar el commit/artefacto anterior y retirar la versión candidata; como no hay migraciones ni estado durable, no se requiere migración de datos. La identidad de candidato y la separación de datos de producción quedan fuera de cualquier script local de este cambio.

## Risks / Trade-offs

- [Acceso privado a Stitch no disponible] → Registrar el fallo por pantalla, usar sólo el fallback versionado y bloquear verify si falta cobertura.
- [No hay comandos ni paquetes Playwright declarados] → El apply deberá declarar el executor y checks reales; verify no podrá aprobarse con capturas inventadas ni con una simple inspección estática.
- [La referencia HTML contiene dependencias remotas o inconsistencias] → Extraer únicamente patrones visuales, reemplazar recursos por CSS/SVG locales y priorizar siempre `PRODUCT-BASELINE`.
- [Configuración pública filtra una URL sensible] → Usar placeholders versionados, validación de configuración y revisión de bundles antes de la evidencia.
- [El catálogo puede duplicarse entre pantallas] → Mantener una única fuente tipada en `game-core` y probar que navegación y selector consumen el mismo conjunto.

## Migration Plan

1. Crear la estructura y contratos sin modificar código previo, porque el repositorio no contiene implementación existente.
2. Ejecutar build/lint/unit y checks de navegador desde un entorno limpio; conservar reportes y manifiesto.
3. Construir la PWA y el contenedor API con configuración de ejemplo, inspeccionar bundles y verificar ausencia de secretos.
4. Si una validación falla, corregir dentro de este Change o actualizar sus artefactos OpenSpec antes de ampliar alcance; no desplegar ni archivar con evidencia insuficiente.

## Open Questions

Ninguna que pueda diferirse sin cambiar el contrato: los valores de PF-01, viewports, pantallas y restricciones de runtime están definidos por la línea base y el request.
