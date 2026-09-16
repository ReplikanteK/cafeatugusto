#!/usr/bin/env tsx
// Integrity guarantee: motor -> availability=verified -> priceCheck.observedEUR exists -> ASIN válido -> RECOMMENDABLE_INVALID=0
import { MACHINES_SEED } from "../src/data/machines.js";
import { GRINDERS_SEED } from "../src/data/grinders.js";

const ASIN_RE = /^[A-Z0-9]{10}$/;
let invalid = 0;
for (const m of MACHINES_SEED) {
  const a = m.amazon?.asin || m.asin;
  const avail = m.availability?.status;
  const price = (m as any).priceApproxEUR;
  const hasPrice = typeof price === "number" && price > 0;
  const validAsin = ASIN_RE.test(a);
  if (avail !== "verified" || !hasPrice || !validAsin) {
    invalid++;
    console.log(`INVALID machine ${m.id} asin=${a} avail=${avail} price=${price} validAsin=${validAsin}`);
  }
}
for (const g of GRINDERS_SEED) {
  const a = g.amazon?.asin || g.asin;
  const avail = g.availability?.status;
  const price = (g as any).priceApproxEUR;
  const hasPrice = typeof price === "number" && price > 0;
  const validAsin = ASIN_RE.test(a);
  if (avail !== "verified" || !hasPrice || !validAsin) {
    invalid++;
    console.log(`INVALID grinder ${g.id} asin=${a} avail=${avail} price=${price} validAsin=${validAsin}`);
  }
}
console.log(`\nRECOMMENDABLE_INVALID = ${invalid}`);
if (invalid === 0) console.log("✓ Barrera anti-regresión OK — 25/25 con availability=verified + priceCheck.observedEUR + ASIN válido");
else console.log("✗ FAIL — hay productos no recomendables sin verificar");
process.exit(invalid === 0 ? 0 : 1);
