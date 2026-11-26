# Evidencia visual PF-06

La consulta Stitch del proyecto `7461201299918295899` devolvió `UNAUTHORIZED`; el manifiesto conserva `status: fallback_applied`, `blocking: false`, los IDs exactos y los SHA-256 de `reconnect.html` y `results.html`. No hay dependencia Stitch/CDN en runtime.

Playwright ejecutó el catálogo local en 360×640, 390×844 y 1280×720, en tema claro y oscuro. Las capturas PF-06 seleccionadas verifican la pantalla de reconexión con cuenta regresiva/pausa y la pantalla de resultados con resultado neutralizable y revancha. Las diferencias quedan justificadas por el fallback local y la integración Angular existente; el historial conserva scroll interno y el shell no añade scroll general.
