# Siguientes pasos — Sitio atiktechmx.com

> Análisis 2026-09-09. Aún sin sesión propia — `ESTADO.md` es el llenado inicial
> automático. La primera sesión debe revisarlo (METODO-AVANCE.md §8).

## Dónde está

Sitio estático (index, suite, sistemas, aprendizaje) en GitHub Pages con
dominio propio (CNAME). Responde. Construido ~63%.

## Lo primero que hace la primera sesión

1. Revisar cada capacidad del `PROGRESO` contra las páginas reales y escribir su
   prueba de aceptación (hoy dicen "pendiente de escribir").
2. Pasada E2E: abrir cada página en `atiktechmx.com`, confirmar que carga, que
   los enlaces funcionan, que se ve bien en móvil. `hecho` → `verificado`.

## Para cerrar Fase 1

1. **Contenido final** — los textos están en `parcial`. Definir copy definitivo
   de cada página.
2. **Subdominios por app.** Plan acordado: `tzibal.atiktechmx.com`,
   `taanwallet.atiktechmx.com`, etc., apuntando a cada Firebase Hosting site
   (no GitHub Pages para las apps). Configurar los CNAME.
3. Agregar el servicio "páginas web" (Tektón) como oferta en el sitio.

## Base del repo (METODO-AVANCE.md §10)

`LICENSE` · CI (lint de HTML / enlaces rotos) · `main` protegida · README con
"cómo levantar esto" · deploy ya es automático (GitHub Pages desde `main`) ·
monitoreo `window.onerror` → Phrourós · secretos N/A (confirmarlo).

## Decisión de negocio (para el usuario)

- ¿El sitio público sigue en GitHub Pages o se mueve a Netlify/Vercel? (Pages
  no da analítica ni headers custom). El panel de proyectos que pediste NO va
  acá — va en archivo local o Vercel con auth.

## No hacer

- Un CMS / backend — es un sitio estático, que siga así.
- Mezclar el sitio público con herramientas internas.
