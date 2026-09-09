# Método de avance medible

> Convención única para medir cómo va este proyecto. Igual en los 10 repos de Atik.
> Cada sesión de Code que trabaje aquí la sigue y mantiene `ESTADO.md` al día.

---

## 1. La unidad de medida: la **Capacidad**

Una capacidad = una rebanada de función **visible para el usuario**, con **una**
frase de prueba de aceptación.

- Tamaño objetivo: 1–3 días de trabajo. Si es más grande, se parte.
- Si no se puede escribir su prueba de aceptación en una frase, **no es una
  capacidad** — es un "tema". Los temas no se miden.
- ✅ "Alta de suscripción con periodicidad y auto-renovación"
- ✅ "Bandeja de próximos cobros ordenada por urgencia"
- ❌ "Fase 1"  ❌ "Backend"  ❌ "Mejorar la UX"

## 2. Estados de una capacidad — una sola escala

| Estado | Significa | Peso para el % |
|---|---|---|
| `pendiente` | definida, sin código | 0 |
| `parcial` | a medias, o detrás de un flag | 0.4 |
| `hecho` | código integrado + DoD (§3) + desplegado | 0.8 |
| `verificado` | pasó su prueba de aceptación E2E contra el deploy real, **con fecha** | 1.0 |
| `descartado` | ya no va — no cuenta en el total | — |

`hecho` no vale 1 **a propósito**: lo que está hecho pero no verificado es deuda,
y tiene que verse en el número.

## 3. Definición de Hecho (DoD)

Una capacidad pasa a `hecho` sólo si:

- typecheck y lint verdes
- rules-tests actualizados y verdes si se tocó `firestore.rules`
- desplegada (Hosting / Vercel / donde viva el proyecto)
- su fila en `ESTADO.md` tiene la prueba de aceptación escrita

## 4. Fases — mismo significado en todos los proyectos

- **Fase 1 — Núcleo.** Una persona real puede usar el proyecto para su caso
  principal, de punta a punta, sin ayuda.
- **Fase 2 — Automatiza y avisa.** Trabajos programados, notificaciones, export,
  puentes con otros sistemas/apps.
- **Fase 3 — Escala y cobra.** Monetización real, equipo/permisos, reportes,
  tableros.

`fase` = en cuál se está trabajando · `fase_objetivo` = hasta cuál mide el % hoy.

## 5. `ESTADO.md` — el archivo que se mantiene

Vive en la raíz del repo. Tiene tres partes: frontmatter, bloque `PROGRESO`,
bloque `SCORECARD`. El panel de proyectos lee **sólo** esos bloques, así que su
formato es estricto: una capacidad por fila, sin negritas ni sub-viñetas, sin
prosa dentro de los bloques (la explicación va después del `:END`).

```markdown
---
nombre: NombreVisible
slug: slug-interno
estado: en-desarrollo        # candidata | aprobada | en-desarrollo | pausada | descartada
fase: 1
fase_objetivo: 1
deploy_url: https://...      # vacío si no hay deploy
actualizado: 2026-09-08
---

# Estado — NombreVisible

## Capacidades

<!-- PROGRESO:START -->
| Capacidad | Fase | Estado | Verificado | Prueba de aceptación |
|---|---|---|---|---|
| Auth (registro/login/reset) | 1 | verificado | 2026-09-05 | Registro→login→reset; crea users/{uid} |
| Entidades + selector | 1 | hecho |  | Crear Empresa→aparece en el selector y persiste al recargar |
| Recepción desde otra app | 2 | pendiente |  | Acción en la app origen→llega el pendiente aquí |
<!-- PROGRESO:END -->

## Scorecard

<!-- SCORECARD:START -->
| Eje | Valor |
|---|---|
| Planeación / spec | 1 |
| Núcleo funcional | 0.5 |
| Datos + reglas | 1 |
| Integraciones | 0 |
| Pruebas / QA | 0.5 |
| Deploy / producción | 1 |
| Monetización / legal | 0 |
<!-- SCORECARD:END -->

## Notas

Texto libre: qué falta, bloqueantes, decisiones abiertas.
```

### Escala del eje "Pruebas / QA"

`0` nada · `0.25` typecheck + lint · `0.5` rules-tests / unit · `0.75` E2E manual
una vez · `1` E2E verificado con fecha reciente **y** CI verde.

## 6. El scorecard: el control de sanidad

Las capacidades miden de abajo hacia arriba (lo que existe). El scorecard lo
ajusta la persona (tú) al cerrar cada fase — es el "número de la cabeza",
estructurado. **Si el % de capacidades y el promedio del scorecard difieren
mucho, una de las dos está mal.** Esa discrepancia es la señal a revisar.

## 7. El hábito de cada sesión de Code

1. **Antes de codear:** la capacidad ya está en `ESTADO.md` como `pendiente` con
   su prueba escrita. Si no está, se agrega primero.
2. **Al terminar el código:** `→ hecho`, se corre el DoD (§3), se despliega.
3. **Al pasar la prueba E2E contra el deploy real:** `→ verificado` + la fecha.
4. Se agrega una línea al registro de cambios de la spec/README y se actualiza
   `actualizado:` en el frontmatter.
5. Al cerrar una fase: se revisa el scorecard.

## 8. Primera vez en este repo (lo que hace la primera sesión)

- Si `ESTADO.md` trae un llenado inicial, **revisarlo capacidad por capacidad**
  contra el código real: bajar a `pendiente`/`parcial` lo que no esté probado,
  corregir el scorecard.
- Si falta alguna capacidad de la fase actual, agregarla.
- A partir de ahí, mantenerlo con el hábito del §7.

## 9. Monorepo (suite atik)

En el monorepo, cada app lleva su bloque `PROGRESO` en el **§11 de su spec**
(`docs/specs/<slug>.md`), no en un `ESTADO.md` propio. El `ESTADO.md` de la raíz
es el índice: una fila de scorecard por app. La primera sesión que toque una app
convierte el §11 de esa spec al formato de la tabla del §5.
