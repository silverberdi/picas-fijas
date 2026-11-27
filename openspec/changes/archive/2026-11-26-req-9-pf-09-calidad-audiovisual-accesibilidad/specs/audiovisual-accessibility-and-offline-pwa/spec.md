# Spec Delta

## Purpose

Proporciona una experiencia audiovisual local, accesible y no bloqueante, con una PWA instalable que conserva las funciones locales después de la primera carga incluso cuando se corta internet.

## ADDED Requirements

### Requirement: Recursos audiovisuales locales y licenciados

La aplicación SHALL incluir efectos originales y locales para teclas, validación, picas/fijas, ganar/perder y oferta, sin música; SHALL incluir iconos PWA/favicon e ilustraciones propias SVG/CSS; y SHALL publicar licencia y manifiesto de procedencia sin solicitar audio, imagen, fuente o CDN remoto durante el uso.

#### Scenario: Reproducir efectos locales
- **WHEN** el usuario pulsa una tecla, valida un intento, recibe picas/fijas, gana, pierde o recibe una oferta
- **THEN** se reproduce el efecto local correspondiente, o nada si mute está activo, sin bloquear la interacción ni cargar un recurso remoto

#### Scenario: Auditar recursos y licencia
- **WHEN** se inspecciona el manifiesto, la licencia y las solicitudes de una sesión offline
- **THEN** cada recurso audiovisual e icono tiene procedencia local documentada y no existe una solicitud requerida a CDN, fuente, audio o imagen remota

### Requirement: Interacción accesible y no bloqueante

Todos los controles y estados interactivos SHALL tener nombre accesible, foco visible y uso por teclado; la información SHALL estar disponible sin depender sólo del color; los indicadores de picas/fijas SHALL estar etiquetados como P/F; las microanimaciones y celebraciones SHALL respetar `prefers-reduced-motion`; y la vibración SHALL ser opcional.

#### Scenario: Navegación por teclado y lector de pantalla
- **WHEN** una persona recorre cualquier vista con teclado o lector de pantalla
- **THEN** puede identificar y operar cada control mediante su nombre accesible, observa foco visible y recibe el estado sin depender únicamente del color

#### Scenario: Reduced motion y vibración
- **WHEN** reduced-motion está activo o la vibración está desactivada
- **THEN** las animaciones se reducen o eliminan y no se invoca vibración, manteniendo disponibles las mismas acciones y estados

### Requirement: PWA offline segura

La aplicación SHALL registrar un service worker que almacene el shell y los recursos locales necesarios, SHALL servir `offline.html` como fallback, SHALL actualizarse mediante una estrategia segura que no deje una versión parcial activa y SHALL exponer una ruta de instalación válida; las funciones online SHALL deshabilitarse sólo cuando no haya conexión.

#### Scenario: Primera carga e instalación
- **WHEN** la aplicación se carga con conexión y el navegador admite instalación
- **THEN** el shell, recursos locales y fallback quedan disponibles, el service worker se registra y el navegador puede instalar la PWA sin recursos remotos obligatorios

#### Scenario: Recarga sin conexión
- **WHEN** después de completar la primera carga se corta internet y se recarga la aplicación
- **THEN** se muestra la aplicación o `offline.html` según la ruta, las funciones locales siguen operativas y las funciones online informan que requieren conexión sin bloquear el resto

#### Scenario: Actualización segura
- **WHEN** existe una nueva versión del shell
- **THEN** la versión anterior continúa sirviendo hasta que la nueva caché esté completa y una activación controlada no mezcla archivos de versiones distintas

### Requirement: Funcionalidad local completa sin red

Tras la primera carga, los tres modos locales, el tutorial, estadísticas, preferencias y sonidos SHALL funcionar sin red; la interfaz SHALL conservar sus estados locales y no SHALL exigir backend para iniciar, jugar, consultar o finalizar una partida local.

#### Scenario: Jugar todos los modos locales offline
- **WHEN** se corta internet después de la primera carga y se inicia cada uno de los tres modos locales
- **THEN** cada modo permite jugar y finalizar, el tutorial y las estadísticas son consultables, y la sesión no solicita un recurso remoto obligatorio

#### Scenario: Preferencias audiovisuales globales
- **WHEN** el usuario activa mute o reduced-motion en ajustes y navega por inicio, tutorial, juego, resultados y estadísticas sin conexión
- **THEN** la preferencia se respeta en todas las vistas y permanece activa tras recargar
