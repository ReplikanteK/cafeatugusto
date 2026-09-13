# Café a tu gusto — Tu setup de café ideal

Recomendador determinista Next 16 + TypeScript + Amazon Associates (5% Cocina).

**Stack:** Next 16.3.5 (App Router, React 19, Turbopack) + Tailwind 4 + Vitest

## Motor
- `src/types/coffee.ts` — tipos inmutables CoffeeMachine/Grinder
- `src/engine/compatibility.ts` — 2 capas: `passesHardFilters()` (budget*1.1, footprint, integrado, espresso) → `calculateSetupScore()` 40/25/15/10/10

## MVP
- Wizard 8 pasos `/recomendador` → `SetupDisplay` con breakdown transparente
- Catálogo semilla curado `src/data/machines.ts` (9) + `grinders.ts` (5) — `verifiedAt/sources`, sin LLM
- Legal: `/metodologia` + `/afiliados` (Amazon 5%, "Ver precio en Amazon")

## Dev
```bash
npm run dev
npm run build # tsc 0 errores
npx vitest run # 2/2
```

## Deploy
Vercel — root `*`, auto-deploy en push a `main`.
