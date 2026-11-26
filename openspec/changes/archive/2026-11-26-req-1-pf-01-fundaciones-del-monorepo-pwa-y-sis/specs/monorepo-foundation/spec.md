# Spec Delta

## Purpose

Proporciona una base de monorepo reproducible para ejecutar la experiencia web, la API y el motor compartido de Picas y Fijas bajo las restricciones de producto y entrega aprobadas.

## ADDED Requirements

### Requirement: Workspace reproducible

El repositorio SHALL contener proyectos web y API TypeScript, un paquete compartido `game-core`, un lockfile y comandos declarados para build, test y lint de los proyectos y del paquete.

#### Scenario: Compilación limpia del workspace

- **WHEN** el executor instala las dependencias desde el lockfile en un entorno limpio y ejecuta los comandos declarados
- **THEN** web, API y `game-core` compilan y las pruebas automatizadas se ejecutan sin depender de archivos generados o estado local previo

### Requirement: Runtime y despliegue aprobados

La solución SHALL usar Angular, TypeScript y Tailwind CSS 4 para la web, Fastify con TypeScript para la API y una PWA desplegable; SHALL incluir estructura de despliegue y SHALL excluir PrimeNG, bases de datos, servicios de IA y dependencias de recursos remotos en runtime.

#### Scenario: Inspección de la fundación

- **WHEN** se inspeccionan manifiestos, código de arranque y configuración de despliegue
- **THEN** se identifican los runtimes aprobados, no se identifica PrimeNG ni una base de datos, y la PWA puede construirse para el destino declarado

### Requirement: API externa segura y juego offline

La API SHALL ser configurable mediante configuración no sensible, no SHALL exponer secretos ni URLs sensibles al frontend, y la primera carga SHALL permitir jugar offline sin dependencia posterior de la API para las funciones locales.

#### Scenario: Configuración segura y desconexión

- **WHEN** la aplicación se construye con configuración de ejemplo y después pierde acceso a la API tras la primera carga
- **THEN** no aparecen secretos en los artefactos públicos y las funciones locales de juego y preferencias continúan disponibles

