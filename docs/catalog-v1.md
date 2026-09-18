# Catalogación Amazon V2 — Modelo de confianza (2026-09-18)

**Estado:** 17 máquinas + 10 molinillos + 16 comparativas. Fuente de verdad comercial con 4 campos ortogonales.

> Alcance del experimento: el CTR de septiembre cubre exclusivamente cafeteras
> espresso y molinillos. El catálogo de cafés (`cafes/[slug]`) mantiene su flujo
> comercial independiente, fuera de `CATALOG_POLICY`.

## Modelo 4 campos (`src/types/coffee.ts`)

```ts
availability: { status: "available" | "unknown" | "unavailable", lastChecked, reason }
verification: { level: "human" | "amazon_html" | "none", checkedAt }   // ¿QUIÉN comprobó?
priceCheck: { status: "direct_eur" | "derived" | "unknown", observedEUR?, checkedAt?, source? }  // ¿EUR directo?
identityCheck: { status: "verified" | "unknown", checkedAt?, note? }  // ¿ASIN↔modelo correcto?
```

**amazonHtmlVerified ≠ humanVerified.** El HTML es trazabilidad válida, pero durante
el experimento no basta para un enlace comprable.

## Elegibilidad comercial (`src/lib/eligibility.ts`, NO el scoring)

```ts
export const CATALOG_POLICY = { requireHumanVerification: true } as const;

recommendable =
  availability.status === "available" &&
  verification.level === "human" &&        // estricto durante el experimento
  priceCheck.status === "direct_eur" &&
  identityCheck.status === "verified";
```

Tres capas separadas: `isRecommendableSetup` (¿comercialmente enlazable?) →
`passesHardFilters` (¿encaja con el usuario?) → `calculateSetupScore` (¿cuánto encaja?).
El motor de scoring no se toca.

## Display fail-closed

- `recommendable` → "Ver en Amazon →" (+ `amazon_click` con `verification` estructurada)
- `available` pero no recomendable → "Comprobación pendiente" (sin enlace)
- `unavailable` → "No disponible"

## Por qué no PA-API 5 scrape `s?`

- PA-API 5 deprecada **15-may-2026** → **Creators API** exige **10 ventas cualificadas/30d continuas**. Sin cualificar, `403 AccessDenied`.
- `s?` es anti-bot (CAPTCHA/JS) y viola ToS. No añadir FlareSolverr/headless.

## Proceso (sin API)

1. **Scan HTML:** `npm run scan:amazon-html` — emite señales `amazon_html` + JSON de ingesta. Nunca marca `human`, nunca muta datos.
2. **Ronda humana:** navegador real sin VPN por ASIN (precio EUR + "Añadir a la cesta") → `verification.level = "human"` + `priceCheck direct_eur` con `observedEUR`.
3. **Barrera:** `npm run check:integrity` — 0 errores + bloque `CATALOG CHECK` (única fuente del header del dump; prohibido escribirlo a mano).
4. **CTR:** solo se mide sobre enlaces recomendables.

## Verificación

```bash
npm run check:asins        # formato ASIN 10ch (mock)
npm run scan:amazon-html   # señales HTML, no veredicto
npm run check:integrity    # modelo + coherencia observedEUR === priceApproxEUR
npm run build && npx vitest run
```

## Cobertura verificación humana (prioridad)

Cubrir al menos una entrada por franja antes de ampliar: entry (Stilosa/Caso/Dedica),
superauto (Magnifica S/Philips/EQ6), entry grinder (GVX242/Molino/EKM200).
Premiums y mid manual ya cubiertos (Victoria, TQ923, Specialista, Precision, MD15).
