# Catalogación Amazon V1 — Fuente de verdad comercial

**Objetivo:** 25–35 cafeteras espresso verificadas en `amazon.es` (BrowseNode `2165182031`) + 10–15 molinillos, con dos capas separadas.

## Modelo 2 capas

```ts
// src/types/coffee.ts
amazon: { asin, marketplace: "amazon.es", url: "https://amazon.es/dp/ASIN?tag=cafeatugusto-21", lastVerified }
availability: { status: "verified" | "unavailable" | "unknown", lastChecked, reason }
```

- **Capa comercial** (`amazon`): existe en Amazon, precio/offer, imagen, variantes — viene de Amazon (hoy manual, mañana Creators API `SearchItems`/`GetItems`/`GetVariations`/`GetBrowseNodes`).
- **Capa editorial** (`specs`, `ratings`, `usageProfile`): PID, diámetro, caldera, curva, leche — curación manual nuestra, nunca decide Amazon.

Motor `passesHardFilters()` solo deja `availability.status === "verified"` — `unknown !== verified` evita recomendar humo `src/engine/compatibility.ts:18`.

## Por qué no PA-API 5 scrape `s?`

- PA-API 5 deprecada **15-may-2026** → **Creators API** exige **10 ventas cualificadas/30d continuas** (Panel Associates → API). Sin cualificar, `403 AccessDenied`.
- `s?` con `sr_st_review-rank` es anti-bot (CAPTCHA/JS) y viola ToS. No añadir FlareSolverr/headless.
- Nodo 2165182031 trae 90 resultados mezcla AMZCHEF 119€ + Siemens 2499€ que nuestro filtro `espresso-only` excluye — importar 90 sin curar `portafilterDiameter`/`pid` no aporta gasolina.

## Proceso V1 (sin API, sin romper freeze 15–22 sep)

1. **Spot manual hoy:** `npx tsx scripts/verify-catalog.ts` verifica 25 ASINs actuales contra `amazon.es/dp` individual (fetch HEAD, heurística `Añadir a la cesta` vs `No disponible`). Media hora humana = fuente de verdad, cero dependencias.
2. **Marcar verificado:** actualizar `src/data/machines.ts` y `grinders.ts` `availability: { status: "verified", lastChecked: "2026-09-15" }` o `unavailable` si falla. Migración inicial ya marca `verified` con reason pendiente `BrowseNode 2165182031`.
3. **Pausar CTR hasta V1:** funnel `result_viewed → amazon_click` no limpio si `verified` <25 — CTR bajo podría ser `unavailable`, no mala recomendación.
4. **Post-22 sep con API cualificada:** rama `feat/import-creators` usa `SearchItems(BrowseNode=2165182031, SortBy=AvgCustomerReviews)` + `GetItems` para candidatos → curación `specs/ratings` manual → auditoría motor.

## Verificación

```bash
npm run check:asins          # 35 ASINs formato 10ch (mock InStock hasta Creators)
npx tsx scripts/verify-catalog.ts  # dp real, no mock — requiere revisión manual si unknown
npm run build && npm test    # 27 SSG, vitest 15/15, engine filtra solo verified
```

## Segmentación objetivo 25–35

| Segmento | Objetivo |
|---|---|
| Entrada | 5–7 |
| Principiante/conveniencia | 5–7 |
| Manual intermedio | 6–8 |
| Entusiasta | 5–7 |
| Gama alta | 4–6 |

## Siguiente

- Comprobar hoy panel Associates → Creators API elegibilidad (1 clic).
- Verificar 25 enlaces `amazon.es/dp` a mano antes del 22.
- Guardar `SearchItems` para cuando haya ventas que sostengan acceso — entonces sí dirigir importación por conversión real, no 90 genéricos.
