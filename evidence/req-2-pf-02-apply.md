# Evidencia Apply — PF-02

## Identidad

- Change: `req-2-pf-02-motor-de-reglas-determinista-y-cic`
- Rama/worktree: `request-2-pf-02-motor-de-reglas-determinista-y-cic`
- Workflow: OpenSpec Apply `spec-driven`
- Integración PF-01: `packages/game-core`, exports `MODES`, `LEVELS`, `isValidCustomLevel`; callers actuales en `apps/web/src/app/app.component.ts` y sus tests.
- Retiro: `NONE`; PF-02 amplía el único motor existente y no sustituye otra ruta de cálculo o validación.

## Trazabilidad Gherkin → test → resultado

| Scenario | Prueba | Resultado |
|---|---|---|
| Presets permanecen intactos | `niveles de línea base tienen reglas exactas`; `configuración añade duraciones explícitas sin mutar presets` | PASS |
| Generación uniforme con cero inicial | `generación preserva cero inicial, repetición y semillas` | PASS |
| Configuración personalizada explícita | `valida configuración personalizada`; `configuración añade duraciones explícitas sin mutar presets` | PASS |
| Dígitos repetidos sin doble conteo | `puntuación cuenta fijas primero y frecuencias restantes` | PASS |
| Tentativa inválida no consume oportunidad | `rechazo serializable no muta estado ni consume intento` | PASS |
| Agotamiento y vencimiento | `individual respeta acierto y agotamiento; el vencimiento es explícito` | PASS |
| Duelo por rondas equivalentes | `duelo conserva la oportunidad equivalente y empata si ambos aciertan` | PASS |
| Carrera por primer acierto válido | `carrera ignora inválidas y gana el primer acierto válido` | PASS |
| Cobertura 3 dígitos y propiedades 4–6 | `cobertura exhaustiva de longitud 3 verifica simetría y límites`; `propiedades reproducibles cubren longitudes 4–6 y ambos modos` | PASS |

## Comandos y resultados

```text
npm run check
exit 0
5 Playwright tests passed
```

El check incluye lint, tests de web/API/game-core, builds y Playwright. No se afirma integración remota ni despliegue: este Change sólo implementa el motor puro.
