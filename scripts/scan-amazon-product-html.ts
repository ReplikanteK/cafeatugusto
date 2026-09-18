#!/usr/bin/env tsx
/**
 * scan-amazon-product-html.ts — ESCANEO HTML, NO verificación humana.
 * Lee MACHINES_SEED + GRINDERS_SEED y pide cada amazon.es/dp con fetch GET
 * + heurísticas ("Añadir a la cesta" vs "No disponible").
 *
 * amazonHtmlVerified ≠ humanVerified: lo que sale de aquí como máximo es
 * verification.level = "amazon_html". Un humano en navegador real decide "human".
 * Este script NUNCA escribe src/data/* y NUNCA marca nada como verificado pleno.
 *
 * Salida para ingesta: bloque JSON (una línea por ASIN) con lo observado
 * {asin, http, basket, stockText, priceText, locale}. El mantenedor lo vuelca
 * a verification/priceCheck/availability con su fecha y método reales.
 *
 * Nota anti-bot: desdeIPs de servidor Amazon suele devolver vacío/CAPTCHA
 * (todo unknown = bloqueo, no realidad). El barrido fiable se ejecuta desde
 * WSL local España (curl) o navegador humano.
 *
 * Uso:
 *   npx tsx scripts/scan-amazon-product-html.ts
 */
import { MACHINES_SEED } from "../src/data/machines.js";
import { GRINDERS_SEED } from "../src/data/grinders.js";

const TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";

interface Scan {
  asin: string;
  brand: string;
  model: string;
  http: number | null;
  basket: boolean;
  unavailableText: boolean;
  priceText: string | null;
  locale: string | null;
}

async function scanOne(asin: string, brand: string, model: string): Promise<Scan> {
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
    const lower = text.toLowerCase();
    const price = text.match(/[0-9][0-9.]*,[0-9]{2}\s*€/)?.[0] ?? null;
    const locale = text.match(/GBP|€/)?.[0] ?? null;
    return {
      asin, brand, model,
      http: res.status,
      basket: lower.includes("añadir a la cesta") || lower.includes("add to basket"),
      unavailableText:
        lower.includes("actualmente no disponible") || lower.includes("agotado"),
      priceText: price,
      locale,
    };
  } catch {
    return { asin, brand, model, http: null, basket: false, unavailableText: false, priceText: null, locale: null };
  }
}

async function main() {
  const all = [
    ...MACHINES_SEED.map((m) => ({ asin: m.asin, brand: m.brand, model: m.model })),
    ...GRINDERS_SEED.map((g) => ({ asin: g.asin, brand: g.brand, model: g.model })),
  ];
  console.log(`\n=== scan-amazon-product-html — ${all.length} ASINs (dp individual, HTML ≠ humano) ===`);

  const rows: Scan[] = [];
  for (const item of all) {
    const r = await scanOne(item.asin, item.brand, item.model);
    rows.push(r);
    const icon = r.basket ? "≈" : r.unavailableText ? "✕" : r.http ? "◷" : "!";
    console.log(`${icon} ${r.asin} http=${r.http} cesta=${r.basket} precio=[${r.priceText ?? "?"}]`);
    await new Promise((res) => setTimeout(res, 800));
  }

  const empty = rows.filter((r) => r.http === null || r.http === 0).length;
  if (empty === all.length) {
    console.log(`\n[INFO] ${all.length}/${all.length} sin respuesta — bloqueo anti-bot probable, no realidad. Repetir desde WSL España o navegador.`);
  }
  console.log(`\n--- INGESTA (pegar al mantenedor) ---`);
  for (const r of rows) console.log(JSON.stringify(r));
}

main().catch((e) => {
  console.error(e);
  process.exit(3);
});
