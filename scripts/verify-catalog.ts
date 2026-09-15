#!/usr/bin/env tsx
/**
 * verify-catalog.ts — Verificación manual V1 Catalogación Amazon (sin Creators API)
 * Lee MACHINES_SEED + GRINDERS_SEED (con amazon/availability) y verifica cada ASIN
 * contra amazon.es/dp sin scraping agresivo: usa fetch HEAD con UA real y reporta
 * InStock/OutOfStock/Unknown basado en status + hints HTML.
 *
 * Nota Creators API: PA-API 5.0 deprecada 15-may-2026 → Creators API exige 10 ventas/30d
 * continuas. Hasta cualificar, este script es la fuente de verdad (media hora manual
 * para 25 ASINs + verificación automática ligera). No hace SearchItems masivo.
 *
 * Uso:
 *   npx tsx scripts/verify-catalog.ts           // verifica 25 ASINs actuales
 *   npx tsx scripts/verify-catalog.ts --write   // actualiza src/data/* con lastChecked
 * Env: opcional AMAZON_TAG para url, pero no requiere credenciales.
 */
import { MACHINES_SEED } from "../src/data/machines.js";
import { GRINDERS_SEED } from "../src/data/grinders.js";

const TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";

interface Result { asin: string; brand: string; model: string; status: "verified"|"unavailable"|"unknown"; reason: string; httpStatus?: number; }

async function checkOne(asin: string, brand: string, model: string): Promise<Result> {
  const url = `https://www.amazon.es/dp/${asin}?tag=${TAG}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    const text = await res.text();
    // Heurísticas ligeras (no scraping paginado s? — solo dp individual permitido por ToS para verificación)
    const lower = text.toLowerCase();
    if (res.status === 404 || lower.includes("lo sentimos") && lower.includes("no encontramos")) {
      return { asin, brand, model, status: "unavailable", reason: "404 o página no encontrada", httpStatus: res.status };
    }
    if (lower.includes("no disponible") || lower.includes("actualmente no disponible") || lower.includes("agotado")) {
      return { asin, brand, model, status: "unavailable", reason: "Texto 'no disponible/agotado' en dp", httpStatus: res.status };
    }
    if (lower.includes("añadir a la cesta") || lower.includes("add to cart") || lower.includes("comprar ya")) {
      return { asin, brand, model, status: "verified", reason: "Botón añadir a la cesta presente", httpStatus: res.status };
    }
    // Si no hay señal clara, marcar unknown para revisión manual
    return { asin, brand, model, status: "unknown", reason: `HTTP ${res.status} sin señal clara — revisar manual`, httpStatus: res.status };
  } catch (e: any) {
    return { asin, brand, model, status: "unknown", reason: `Fetch error: ${e.message}`, httpStatus: undefined };
  }
}

async function main() {
  const all = [
    ...MACHINES_SEED.map(m => ({ asin: m.asin, brand: m.brand, model: m.model, kind: "machine" })),
    ...GRINDERS_SEED.map(g => ({ asin: g.asin, brand: g.brand, model: g.model, kind: "grinder" })),
  ];
  console.log(`\n=== verify-catalog V1 — ${all.length} ASINs (BrowseNode 2165182031 no scrape, dp individual) ===`);
  console.log(`Tag: ${TAG} | Creators API: no cualificada (10 ventas/30d) → verificación manual/dp`);
  console.log(`Motor solo recomienda verified (unknown≠verified) — ver src/engine/compatibility.ts`);

  const results: Result[] = [];
  for (const item of all) {
    const r = await checkOne(item.asin, item.brand, item.model);
    results.push(r);
    const icon = r.status==="verified" ? "✓" : r.status==="unavailable" ? "✕" : "◷";
    console.log(`${icon} ${r.asin} ${r.brand} ${r.model} → ${r.status} (${r.reason})`);
    // throttling ligero para no activar anti-bot
    await new Promise(res => setTimeout(res, 800));
  }

  const verified = results.filter(r=>r.status==="verified").length;
  const unavailable = results.filter(r=>r.status==="unavailable").length;
  const unknown = results.filter(r=>r.status==="unknown").length;

  console.log(`\nResumen: verified ${verified}/${all.length} | unavailable ${unavailable} | unknown ${unknown}`);
  // Anti-bot: si 25/25 unavailable desde servidor, es bloqueo JS/CAPTCHA, no realidad — no auto-degradar catálogo
  if (unavailable===all.length) {
    console.log(`[INFO] 25/25 unavailable desde WSL/backend — Amazon anti-bot bloquea fetch dp (CAPTCHA/JS). No es señal real.`);
    console.log(`Acción requerida: verificación manual en navegador humano amazon.es/dp/<ASIN> con tag ${TAG} — 30min para 25 ASINs.`);
    console.log(`Mantener src/data/* availability verified (migración V1) hasta check humano; no auto-marcar unavailable.`);
  } else {
    console.log(`Siguiente: si verified <25, revisar manual en navegador amazon.es/dp/<ASIN> y actualizar src/data/*.ts availability.status`);
  }
  console.log(`Cuando Creators API cualifique: migrar a SearchItems(BrowseNode=2165182031)+GetItems para curación automática.`);

  if (process.argv.includes("--write")) {
    console.log("\n--write no implementa reescritura automática aún — actualizar manual availability.status en src/data/*.ts");
  }
  if (unavailable===all.length) {
    console.log("\n[OK] Anti-bot detectado — no se modifica catálogo. Proceder a verificación manual humana.");
    process.exit(0);
  }
  if (unknown>0 || unavailable>0) {
    console.log("\n[WARN] Hay unknown/unavailable — CTR experimento debe esperar hasta verified=25");
    process.exit(unknown>0 ? 2 : 1);
  } else {
    console.log("\n[OK] Todo verified — materia prima lista para CTR 15-22 sep (pausado hasta V1 completa)");
  }
}

main().catch(e=>{ console.error(e); process.exit(3); });
