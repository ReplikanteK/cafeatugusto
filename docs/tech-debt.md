# Tech Debt — Café A Tu Gusto (2026-09-18 — main post trust-model, 17+10, 16 comparativas)

> Motor congelado tras QA 8 perfiles. Solo se reabre por FAIL absurdo en validación humana o por evidencia CTR.
> Ronda 2026-09-18: modelo de confianza (availability/verification/priceCheck/identityCheck) +
> elegibilidad estricta (`CATALOG_POLICY.requireHumanVerification = true`). Scoring intacto.

## Deuda deliberada (no bloquea freeze)

### 1. 🟡 Techo estructural `experienceMatch` para `manual_craft` — hallazgo P2

**Síntoma:** `Gaggia Classic Evo 58mm sin PID` vs `Lelit Anna PID 57mm` ambas `experienceMatch=100` capped → empate `99/100` Top1, swap `PID +12 / 58mm +7` (`src/engine/compatibility.ts:86`) no discrimina en catálogo real aunque sí en test aislado `src/engine/__tests__/compatibility.p1.test.ts:50`.

**Causa:** `src/engine/compatibility.ts:81` `s = 40 + learningCurve*12` → con `learningCurve 4-5` base `88-100` antes de bonificaciones. Contrato `0-100 sin excepciones` `Math.min(100,s)` absorbe `PID vs 58mm` en extremo superior. Tensión entre dos decisiones correctas: `nunca >100` vs `PID debe pesar >58mm para manual_craft`.

**Impacto:** Segmento `manual_craft` (público más técnico) pierde discriminación justo donde más detalle espera. UI `Encaje muy alto — 99/100` mitiga percepción pero no resuelve estructura.

**Solución identificada (no implementar hasta CTR):** Separar techo: `learningCurve` max 70pts + bonificaciones técnicas hasta 30pts, en lugar de todo compartiendo mismo límite 100. Reservar `30` para `PID/portafiltro/molinillo`.

**Evidencia externa:** Tom's Guide (Classic sin PID temps inestables), forocafe.es recomienda PID para `aprender/jugar` → manual_craft.

### 2. 🟡 Compresión 94-99 — scoring plano

**Síntoma:** 8 perfiles `Top1 94-99` avg `96-99` spread `0-3` `src/scripts/audit-8-perfiles.ts:1`.

**Causa:** `milk low→100` `src/engine/compatibility.ts:244`, `space sin restricción→100`, `budget ≤1.0→100` → base alta, media ponderada comprimida.

**Mitigación actual:** `src/components/ui/ScoreBadge.tsx:4` `Encaje muy alto — 99/100` + breakdown protagonista, nº secundario. No tocar pesos hasta CTR.

### 3. 🟡 Cobertura catálogo gama alta

`17 máquinas /10 molinillos` → catálogo 27/27 human-verificado demuestra `mejor de catálogo`, no `mejor del mercado`. P8 con candidatos reales (Victoria+MD15 98) — el escenario Silvia V6 era del freeze antiguo sin cobertura. Documentar en `/metodologia`.

### 4. 🟡 Diversidad Top3 — misma máquina + molinillos distintos

Top3 puede ser misma máquina con 3 molinillos (P8) por ranking `machine×grinder` sin deduplicación máquina. No es bug, limita diversidad semántica. Deuda UX futura.

### 5. 🟡 `getGrinderScore` `prefs` muerto

`src/engine/compatibility.ts:147` recibe `prefs` no usado; workflow ya en `getExperienceScore`. Documentado, no bloquea.

### 6. 🟡 Shift ponderación `6+` `wExp 20→18` `wSpace 15→12` hacia `wDaily 13`

`src/engine/compatibility.ts:253` documentado `throughput primario` y test `src/engine/__tests__/compatibility.p1.test.ts:96`. Correcto matemáticamente, decisión producto consciente.

## Cerrado

- P0 5× + F 7 dims + 19/19 tests + QA automático fiable + QA 8 perfiles + metodologia 7 dims + UX encaje + analytics Consent Mode v2 + SEO 15 URLs + Amazon `amazonUrl` fallback

## Métricas validación 15-22 sep (T0 `0de4f60` → `73c2b38`)

Funnel: `page_view /guias/[slug]` → `guide_cta_click {slug,cta_position}` `src/components/ui/GuideCtaLink.tsx:1` → `quiz_started {src}` `src/app/recomendador/page.tsx:52` → `quiz_completed/guide_conversion` → `result_viewed` → `amazon_click {asin,rank}`

KPI: `amazon_click / result_viewed >12%` + `quiz_started/visitors` + `quiz_completed/quiz_started` desglosado `src/machine/grinder/pos/TOP`.

> Reabrir motor solo por FAIL objetivo en QA humano (ej: `convenience → prosumer 15min`) o por señal CTR.
