# Preparación de despliegue PF-10

Este documento describe una preparación de candidato; no ejecuta DNS, reverse proxy, Docker del propietario, GitHub Pages ni cambios de secretos.

## Orden y configuración

1. Construir el frontend estático con `npm run build --workspace=@picas-fijas/web` y publicar el contenido de `apps/web/dist/web/browser` bajo el `basePath` elegido.
2. Servir el backend `Dockerfile` en Ubuntu con `PORT=3000` y un `ALLOWED_ORIGINS` explícito. El endpoint `/health` es el healthcheck y no expone secretos.
3. Configurar DNS al reverse proxy HTTPS. El proxy debe reenviar `Upgrade` y `Connection` para WSS, conservar `Host`, y enrutar `/health` y WebSocket al backend. La aplicación usa `assets/runtime-config.js` para la URL WSS pública; sólo contiene routing.
4. En GitHub Pages configurar el base path y el fallback SPA/PWA según el propietario. Mantener `manifest.webmanifest`, `ngsw-config.json` y `offline.html` dentro del mismo path.

## Rollback y límites

Conservar el artefacto anterior, detener el candidato y reiniciar la instancia anterior. PF-10 no añade migraciones ni datos durables. El backend es de instancia única en memoria: un reinicio termina una partida online con interrupción neutral; el juego local no depende del backend.

La validación del propietario y la autorización explícita de publicación siguen pendientes. Ningún comando de este documento modifica infraestructura real.
