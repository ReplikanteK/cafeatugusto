// P0-2 Analytics real: requiere NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXX en .env.local y layout.tsx lo inyecta.
// Evidencia exigida (Power Tenant-level): ver en DevTools → Network → googletagmanager.com/gtag/js o google-analytics.com/g/collect
// o en GA4 → Informes → Tiempo real → quiz_completed. No basta con "compila".
export function track(event: string, params: Record<string, unknown> = {}) {
  const hasGtag = typeof window !== "undefined" && !!(window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (hasGtag) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag!("event", event, params);
  }
  // Siempre log en dev + warn en prod si gtag no existe (evita silencio que ocultó bug anterior)
  if (process.env.NODE_ENV !== "production") {
    console.log(`[track] ${event}`, params, hasGtag ? "→ gtag OK" : "→ gtag MISSING (GA no instalado)");
  } else if (!hasGtag) {
    console.warn(`[track] ${event} — window.gtag no existe. Verifica NEXT_PUBLIC_GA_MEASUREMENT_ID en layout.tsx`);
  }
}

// Helper para verificar instalación en runtime (usado en tests/manual)
export function isGtagReady(): boolean {
  return typeof window !== "undefined" && !!(window as unknown as { gtag?: unknown }).gtag;
}
