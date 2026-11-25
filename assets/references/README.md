# Referencias visuales Party

## Contrato de integración visual Stitch (vinculante)
Proyecto privado aprobado: https://stitch.withgoogle.com/projects/7461201299918295899; resource projects/7461201299918295899. Durante propose/design de cada issue visual, mini me debe consultar directamente mediante su integración Stitch/MCP las pantallas exactas del manifiesto siguiente (get_screen y recuperación de HTML/captura disponible). Usar los IDs, no buscar por título ni seleccionar versiones antiguas. Registrar en design la referencia recuperada y su procedencia, y conservar snapshot de referencia reproducible como artefacto del cambio. No editar Stitch ni regenerar diseños aprobados. Si el acceso falla, registrar error y usar el HTML versionado correspondiente como fallback; si no resulta suficiente para verificar el criterio visual, declarar bloqueo explícito, no inventar ni afirmar equivalencia. La línea base funcional y la identidad Party aprobada prevalecen; los HTML son referencia histórica, no código productivo. Para pantallas sin referencia exacta (salas públicas, búsqueda, oferta, derrota, empate, etc.) extender los patrones existentes, declarar la derivación y justificar diferencias. Stitch es dependencia de diseño, nunca de ejecución de la app. No introducir CDN ni dependencias de recursos remotos en producción.

## Evidencia de verificación visual
En verify, Playwright debe renderizar la referencia recuperada (o fallback local) y la implementación con viewport, tema y estado comparables. Para referencia estática: capturas referencia/implementación y comparación anotada. Para comportamiento dinámico: cuando la referencia realmente permite reproducirlo, videos Playwright de ambos flujos bajo las mismas condiciones; si la referencia es estática, captura de referencia y video del comportamiento implementado con criterios explícitos, sin simular evidencia inexistente. Registrar diferencias justificadas, resultado y rutas de artefactos en PR; conservar manifiesto, scripts y reporte en Git, archivos pesados como artefactos descargables CI/PR con ubicación y retención documentadas. No cerrar verify si falta evidencia requerida o hay diferencias no justificadas. Probar viewport 360×640, 390×844 y 1280×720 según corresponda, sin scroll general en partida, historial interno y controles visibles. No confundir captura generada por Stitch con prueba ejecutada de la aplicación.

## Manifiesto de pantallas aprobadas

| HTML local (fallback) | ID de pantalla Stitch |
|---|---|
| `home-mobile.html` | `1b0e461f4c614b87bb38919c75f0fa64` |
| `levels.html` | `11123e53ada04a2ba7297f0eeb884f36` |
| `classic-mobile.html` | `33843df735c643be803a75a306f180e6` |
| `duel-bot-mobile.html` | `8fdefea15f054e4fab10978d9e263d5f` |
| `race-bot-mobile.html` | `578efe96cf894d879cfb976c3c868417` |
| `duel-online-mobile.html` | `68e473f7f73e4f86adca782b86da0cba` |
| `race-online-mobile.html` | `9416634b2446455dbec79b148f434d39` |
| `results.html` | `72765bd741154a1c8fbf4728f8a655dd` |
| `home-desktop.html` | `fb108f500648468392d871cac3c1b714` |
| `classic-desktop.html` | `6bc36b0f150544e998215a212a026e4e` |
| `duel-desktop.html` | `3838177211b144d3b6840ebf9cf7bfa7` |
| `race-desktop.html` | `464d2bb886424af0b419ce58290f3106` |
| `tutorial.html` | `880ed04e3a754876a4042278b377b1ec` |
| `stats.html` | `90ce202387c8418aafd3e5d829061065` |
| `settings.html` | `7f2012d3be454c1e9cfd58203b1f4b87` |
| `offline.html` | `1198b97d32174b1886aff9bb0bd762ec` |
| `join-room.html` | `2fb9e0158b5b4f3a842714601a3ba377` |
| `create-room.html` | `ca0a63e2b932407a942bfd26815ebd4c` |
| `waiting.html` | `57272380a6a24ee8a1799a300728aa4e` |
| `reconnect.html` | `6d008404df5146b3a019b079d80038b6` |

Los 20 HTML originales están versionados localmente. Pueden contener CDN, fuentes externas, ilustraciones remotas y ejemplos inconsistentes; sustituir por CSS/SVG propios y recursos locales con licencia. No copiar dependencias. No introducir música, ELO, métricas inventadas ni chat. results.html es base de todas las variantes de resultado. Capturas PNG originales no incluidas en Git; recuperarlas mediante Stitch cuando estén disponibles.
