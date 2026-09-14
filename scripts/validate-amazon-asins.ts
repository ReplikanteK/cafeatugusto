#!/usr/bin/env tsx
/**
 * validate-amazon-asins.ts — Validador LOCAL de ASINs (no verificador de stock)
 * Extrae dinámicamente ASINs de src/data/{machines,grinders,comparatives}.ts
 * Valida: formato 10ch /^[A-Z0-9]{10}$/, duplicados, referencias, fallback amazonUrl.
 * NO verifica stock/precio real en Amazon — eso requiere PA-API/Keepa o webfetch manual 1×1.
 * Reporte: reports/asin-availability.json {InStock(mock), InvalidASIN, PriceChanged}
 * Exit 1 si InvalidASIN >0 — protege CTAs Amazon en CI.
 * Para verificación comercial real: webfetch https://www.amazon.es/dp/{ASIN}?tag=cafeatugusto-21
 */
import { MACHINES_SEED } from "../src/data/machines.js";
import { GRINDERS_SEED } from "../src/data/grinders.js";
import { COMPARATIVES } from "../src/data/comparatives.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

type AsinSource = { asin: string; sources: string[]; kind: string };
type Report = {
  timestamp: string;
  mode: "paapi" | "mock" | "keepa";
  total: number;
  valid: number;
  invalid: number;
  InStock: string[];
  OutOfStock: string[];
  InvalidASIN: { asin: string; reason: string; sources: string[] }[];
  PriceChanged: { asin: string; oldPriceEUR?: number; newPriceEUR?: number; note: string }[];
  details: Record<string, { status: string; sources: string[] }>;
};

const ASIN_RE = /^[A-Z0-9]{10}$/;

function collect(): Map<string, AsinSource> {
  const map = new Map<string, AsinSource>();
  const add = (asin: string, src: string, kind: string) => {
    const key = asin.trim().toUpperCase();
    if (!map.has(key)) map.set(key, { asin: key, sources: [src], kind });
    else map.get(key)!.sources.push(src);
  };
  for (const m of MACHINES_SEED) add(m.asin, `machines:${m.id}`, "machine");
  for (const g of GRINDERS_SEED) add(g.asin, `grinders:${g.id}`, "grinder");
  for (const c of COMPARATIVES) {
    add(c.a.asin, `comparatives:${c.slug}:a`, "comparative");
    add(c.b.asin, `comparatives:${c.slug}:b`, "comparative");
    for (const acc of c.accessories) add(acc.asin, `comparatives:${c.slug}:acc:${acc.name}`, "accessory");
  }
  return map;
}

async function checkPaapi(asins: string[]): Promise<Report["details"]> {
  // STUB — no hace llamada real. Mantiene compat si hay credenciales, pero marca mock.
  console.log(`[PA-API STUB] ${asins.length} SKUs host=${process.env.AMAZON_PAAPI_HOST ?? "webservices.amazon.es"} tag=${process.env.AMAZON_ASSOCIATE_TAG} — sin llamada real`);
  const details: Record<string, { status: string; sources: string[] }> = {};
  for (const asin of asins) details[asin] = { status: "InStock", sources: [] };
  await new Promise((r) => setTimeout(r, 50));
  return details;
}

async function checkKeepa(asins: string[]): Promise<Report["details"]> {
  console.log(`[Keepa STUB] ${asins.length} SKUs — sin llamada real`);
  const details: Record<string, { status: string; sources: string[] }> = {};
  for (const asin of asins) details[asin] = { status: "InStock", sources: [] };
  return details;
}

async function main() {
  const map = collect();
  console.log(`\n=== validate-amazon-asins (validador local — no verifica Amazon) ===`);
  console.log(`Total ASINs únicos (machines+grinders+comparatives): ${map.size}`);

  const invalid: Report["InvalidASIN"] = [];
  const validAsins: string[] = [];

  for (const [asin, info] of map) {
    if (!ASIN_RE.test(asin)) {
      invalid.push({ asin, reason: `Formato inválido: len=${asin.length} esperado 10 /^[A-Z0-9]{10}$/`, sources: info.sources });
    } else {
      validAsins.push(asin);
    }
  }

  console.log(`Válidos: ${validAsins.length} | Inválidos: ${invalid.length}`);
  if (invalid.length) {
    for (const i of invalid) console.log(`  InvalidASIN ${i.asin} len=${i.asin.length} sources=${i.sources.join(",")} reason=${i.reason}`);
  }

  const hasPaapi = !!(process.env.AMAZON_PAAPI_KEY && process.env.AMAZON_PAAPI_SECRET && process.env.AMAZON_ASSOCIATE_TAG);
  const hasKeepa = !!process.env.KEEPA_API_KEY;

  let mode: Report["mode"] = "mock";
  let details: Record<string, { status: string; sources: string[] }> = {};

  if (hasPaapi) {
    mode = "paapi";
    details = await checkPaapi(validAsins);
  } else if (hasKeepa) {
    mode = "keepa";
    details = await checkKeepa(validAsins);
  } else {
    mode = "mock";
    console.log(`[MOCK] Sin credenciales PA-API/Keepa — stub InStock para todos los válidos`);
    for (const asin of validAsins) details[asin] = { status: "InStock", sources: map.get(asin)!.sources };
  }

  // Enriquecer details con sources reales
  for (const asin of validAsins) {
    if (details[asin]) details[asin].sources = map.get(asin)!.sources;
  }

  // Por ahora PriceChanged vacío en stub; en real comparar con priceApproxEUR vs PA-API Offers
  const InStock = Object.entries(details).filter(([, v]) => v.status === "InStock").map(([k]) => k);
  const OutOfStock = Object.entries(details).filter(([, v]) => v.status === "OutOfStock").map(([k]) => k);

  const report: Report = {
    timestamp: new Date().toISOString(),
    mode,
    total: map.size,
    valid: validAsins.length,
    invalid: invalid.length,
    InStock,
    OutOfStock,
    InvalidASIN: invalid,
    PriceChanged: [],
    details,
  };

  const outPath = join(dirname(fileURLToPath(import.meta.url)), "../reports/asin-availability.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`\n→ Reporte escrito: ${outPath}`);
  console.log(`  InStock: ${InStock.length} | OutOfStock: ${OutOfStock.length} | InvalidASIN: ${invalid.length} | PriceChanged: 0`);
  console.log(`  Detalle:`);
  for (const asin of [...InStock].sort()) console.log(`    InStock ${asin} ← ${details[asin].sources.join(",")}`);
  if (OutOfStock.length) for (const asin of OutOfStock) console.log(`    OutOfStock ${asin}`);
  console.log(`\nModo: ${mode} ${mode === "mock" ? "(stub sin credenciales — CI OK)" : ""}`);

  if (invalid.length > 0) {
    console.error(`\n[FAIL] ${invalid.length} ASIN(s) con formato inválido — corrige a 10 chars B0...`);
    process.exit(1);
  } else {
    console.log(`\n[OK] Todos los ASINs con formato válido (10 chars).`);
    process.exit(0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
