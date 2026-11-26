# Proposal

## Why

Picas y Fijas necesita una base ejecutable y reproducible para entregar su primera experiencia web sin arrastrar dependencias incompatibles, decisiones visuales antiguas ni una arquitectura distinta de la línea base. Este cambio establece el monorepo, el shell inicial y el contrato visual mínimo para que los incrementos posteriores puedan implementarse y verificarse mediante OpenSpec, con ejecución offline tras la primera carga y sin secretos ni servicios de runtime no aprobados.

## What Changes

- Inicializa un monorepo con Angular, TypeScript, Tailwind CSS 4, Fastify con TypeScript y el paquete compartido `game-core`, incluyendo lockfile y scripts reproducibles de build, test y lint.
- Configura PWA, despliegue y una API externa configurable en modo sin base de datos, manteniendo el backend de instancia única en memoria y sin exponer secretos o URLs sensibles.
- Define el shell inicial de Beastie Studio con exactamente cinco modalidades, los seis niveles de la línea base y el selector que incluye nivel personalizado.
- Implementa tema claro/oscuro persistente, CSS/SVG y recursos locales, sin PrimeNG, CDN ni dependencias remotas de runtime.
- Traduce las discrepancias funcionales de las referencias HTML al contrato de producto vigente sin convertirlas en fuente de requisitos ni copiar sus dependencias.
- Integra la procedencia y snapshots de las pantallas Stitch aprobadas, o documenta el fallo de acceso y usa el fallback versionado de `assets/references/` cuando corresponda.
- Define pruebas automatizadas reproducibles para ambos proyectos y `game-core`, además de verificación Playwright con estados, temas y viewports comparables, capturas/videos y manifiesto de evidencia sin inventar resultados.
- Entrega escenarios Gherkin, trazabilidad visual, estructura de despliegue y el flujo OpenSpec completo; el trabajo requiere una rama `request-<n>-<slug>` y PR.

## Capabilities

### New Capabilities

- `monorepo-foundation`: base de workspace, proyectos web/API, `game-core`, PWA, configuración externa, scripts, lockfile y despliegue.
- `initial-game-shell`: shell de inicio, navegación, cinco modalidades, seis niveles y nivel personalizado según `PRODUCT-BASELINE`.
- `visual-system-and-evidence`: temas, sistema visual local, contrato Stitch/fallback, correcciones de referencias y evidencia visual reproducible.

### Modified Capabilities

- Ninguna; no existen capacidades canónicas previas en este repositorio.

## Impact

- Añade la estructura inicial del monorepo y los artefactos de configuración de Angular, Fastify, TypeScript, Tailwind, PWA, pruebas, lint, build y despliegue.
- Añade contratos de comportamiento para el shell, niveles, temas, recursos locales y evidencia de UI; el backend inicial no persiste datos en una base de datos.
- Requiere consultar las pantallas Stitch exactas del proyecto aprobado durante design/verify y conservar snapshots o documentar el fallback; Stitch no será una dependencia de ejecución.
- El executor configurado debe implementar y ejecutar los checks de navegador con Chromium/Playwright y adjuntar evidencia observable; no se delegan esos checks a operación u `human_validation`.
- No modifica las decisiones de producto de `docs/PRODUCT-BASELINE.md`, no introduce PrimeNG, bases de datos, secretos, CDN ni URLs sensibles, y no autoriza implementación fuera de este Change.
