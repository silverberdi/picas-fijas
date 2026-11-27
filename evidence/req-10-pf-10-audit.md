# PF-10 request/log audit

Ejecutado sobre el candidato local después de `npm run build --workspace=@picas-fijas/web`:

- `apps/web/src` no contiene URLs HTTP(S), Stitch, CDN, fuentes remotas ni claves de proveedor en TypeScript, HTML, CSS o configuración de runtime.
- `apps/web/src/assets/runtime-config.js` sólo permite `basePath` y `wsUrl` públicos; no contiene credenciales.
- El backend sólo conserva hashes de credenciales en memoria; no hay writer de IP completa ni base de datos en el Change.
- `OperationalMetrics` acepta únicamente categoría, resultado y timestamp; el endpoint `/metrics` sólo devuelve contadores agregados con TTL.
- Logs del executor y pruebas revisados: no se exportan payloads completos, códigos privados, credenciales ni IP completa.

El texto `https://angular.dev` que aparece en el bundle minificado proviene del runtime de Angular y no es una dependencia cargada por la aplicación; no se trata como recurso remoto obligatorio.
