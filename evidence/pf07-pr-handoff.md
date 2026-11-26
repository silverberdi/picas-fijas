# Handoff PR PF-07

## Escenarios

- Reserva exacta y FIFO sin datos personales.
- Cancelación/desconexión idempotente y expiración de oferta a 20 s.
- Aceptación bilateral, entrada humana única y cierre neutral del bot.
- Listado/cola/oferta accesibles en los tres viewports declarados.

## Checks

`npm run check` → exit code 0, incluyendo lint, unit/integration, build y 25 E2E Playwright.

## Revisión de alcance

No se agregan PostgreSQL, Redis, servicios externos, chat, perfiles, fotos, ranking, dependencias Stitch/CDN ni cambios al catálogo histórico PF-06. El PR debe adjuntar las capturas PNG comparativas anotadas y su ubicación/retención CI antes de Verify.
