#!/usr/bin/env tsx
// Barrera anti-regresión del catálogo — modelo de confianza (availability /
// verification / priceCheck / identityCheck) + política CATALOG_POLICY.
// - Verifica estructura y coherencia de los 27 productos (nada hardcodeado).
// - priceCheck direct_eur exige observedEUR === priceApproxEUR (el número que
//   usa el motor tiene que ser el observado, no otro).
// - Emite el bloque CATALOG CHECK: es la ÚNICA fuente permitida para el
//   encabezado del dump (prohibido escribir "VERIFIED ..." a mano).
import { MACHINES_SEED } from "../src/data/machines.js";
import { GRINDERS_SEED } from "../src/data/grinders.js";
import {
  CATALOG_POLICY,
  isRecommendableMachine,
  isRecommendableGrinder,
} from "../src/lib/eligibility.js";

const ASIN_RE = /^[A-Z0-9]{10}$/;
let errors = 0;
const fail = (msg: string) => {
  errors++;
  console.log(`INVALID ${msg}`);
};

for (const m of MACHINES_SEED) {
  const a = m.amazon?.asin || m.asin;
  if (!ASIN_RE.test(a)) fail(`machine ${m.id} asin=${a} (formato)`);
  const price = (m as { priceApproxEUR?: unknown }).priceApproxEUR;
  if (typeof price !== "number" || price <= 0)
    fail(`machine ${m.id} sin priceApproxEUR>0`);
  const avail = m.availability?.status;
  if (avail !== "available" && avail !== "unknown" && avail !== "unavailable")
    fail(`machine ${m.id} availability=${avail}`);
  if (avail === "available") {
    if (!m.verification?.level)
      fail(`machine ${m.id} available sin verification.level`);
    if (!m.priceCheck?.status)
      fail(`machine ${m.id} available sin priceCheck.status`);
    if (!m.identityCheck?.status)
      fail(`machine ${m.id} available sin identityCheck.status`);
    if (
      m.priceCheck?.status === "direct_eur" &&
      m.priceCheck?.observedEUR !== m.priceApproxEUR
    )
      fail(`machine ${m.id} direct_eur pero observedEUR=${m.priceCheck?.observedEUR} ≠ priceApproxEUR=${m.priceApproxEUR}`);
  }
}
for (const g of GRINDERS_SEED) {
  const a = g.amazon?.asin || g.asin;
  if (!ASIN_RE.test(a)) fail(`grinder ${g.id} asin=${a} (formato)`);
  const price = (g as { priceApproxEUR?: unknown }).priceApproxEUR;
  if (typeof price !== "number" || price <= 0)
    fail(`grinder ${g.id} sin priceApproxEUR>0`);
  const avail = g.availability?.status;
  if (avail !== "available" && avail !== "unknown" && avail !== "unavailable")
    fail(`grinder ${g.id} availability=${avail}`);
  if (avail === "available") {
    if (!g.verification?.level)
      fail(`grinder ${g.id} available sin verification.level`);
    if (!g.priceCheck?.status)
      fail(`grinder ${g.id} available sin priceCheck.status`);
    if (!g.identityCheck?.status)
      fail(`grinder ${g.id} available sin identityCheck.status`);
    if (
      g.priceCheck?.status === "direct_eur" &&
      g.priceCheck?.observedEUR !== g.priceApproxEUR
    )
      fail(`grinder ${g.id} direct_eur pero observedEUR=${g.priceCheck?.observedEUR} ≠ priceApproxEUR=${g.priceApproxEUR}`);
  }
}

const nM = MACHINES_SEED.length;
const nG = GRINDERS_SEED.length;
const total = nM + nG;
const asinRe = /^[A-Z0-9]{10}$/;
const asinOk =
  MACHINES_SEED.filter((m) => asinRe.test(m.amazon?.asin || m.asin)).length +
  GRINDERS_SEED.filter((g) => asinRe.test(g.amazon?.asin || g.asin)).length;
const identityOk =
  MACHINES_SEED.filter((m) => m.identityCheck?.status === "verified").length +
  GRINDERS_SEED.filter((g) => g.identityCheck?.status === "verified").length;
const eurDirect =
  MACHINES_SEED.filter((m) => m.priceCheck?.status === "direct_eur").length +
  GRINDERS_SEED.filter((g) => g.priceCheck?.status === "direct_eur").length;
const recM = MACHINES_SEED.filter((m) => isRecommendableMachine(m)).length;
const recG = GRINDERS_SEED.filter((g) => isRecommendableGrinder(g)).length;
const today = new Date().toISOString().slice(0, 10);

console.log(`\nCATALOG CHECK ${today}`);
console.log(`${total} products (${nM} machines + ${nG} grinders)`);
console.log(`${asinOk}/${total} ASIN valid`);
console.log(`${identityOk}/${total} identity verified`);
console.log(`${eurDirect}/${total} EUR direct`);
console.log(`${recM + recG}/${total} recommendable (policy: requireHumanVerification=${String(CATALOG_POLICY.requireHumanVerification)})`);
if (errors === 0) console.log("INTEGRITY: PASS");
else console.log(`INTEGRITY: FAIL (${errors} errores)`);
process.exit(errors === 0 ? 0 : 1);
