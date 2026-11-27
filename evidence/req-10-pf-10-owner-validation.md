# Solicitud de validación del propietario — PF-10

Se solicita validación explícita antes de cualquier despliegue o publicación del candidato `req-10-pf-10-seguridad-operacional-validacion-i`:

- confirmar DNS y reverse proxy HTTPS/WSS, incluidos `Upgrade`, `Connection` y `Host`;
- confirmar el `basePath` de GitHub Pages y el routing PWA/offline;
- confirmar la URL WSS pública y el rollback al artefacto anterior;
- autorizar explícitamente el seguimiento físico post-merge.

Apply no ejecuta ni modifica infraestructura real, secretos, DNS, Docker del propietario ni GitHub Pages. La validación humana no sustituye los checks automatizables ya ejecutados.
