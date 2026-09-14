// helper amazon.es - tag centralizado + fallback a búsqueda si ASIN no existe en .es
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";

// ASINs que sabemos son 404 en amazon.es (US-only) — fallback a search
const FALLBACK_ASINS = new Set<string>([
  "B0C2ZPPX9K", // Profitec Go — no listado en amazon.es (verificado 2026-09-14 DDG sin resultados)
]);

export function amazonUrl(asin: string, fallbackQuery?: string): string {
  const tag = AMAZON_TAG;
  // si está en blocklist o formato inválido -> búsqueda
  if (!asin || asin.length !== 10 || FALLBACK_ASINS.has(asin)) {
    const q = encodeURIComponent(fallbackQuery || asin);
    return `https://www.amazon.es/s?k=${q}&tag=${tag}`;
  }
  return `https://www.amazon.es/dp/${asin}?tag=${tag}`;
}

export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.es/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}
