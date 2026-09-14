// E-P0.5 Analytics con Consent Mode v2: track solo si consent granted, pero siempre log en dev para debug
// Secuencia: default denied → accept → consent update → gtag config → events
// Verificación: GA4 Realtime debe mostrar page_view + quiz_started/completed/result_viewed/amazon_click solo tras consent
export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("consent_analytics") === "granted";
  } catch {
    return false;
  }
}
export function track(event: string, params: Record<string, unknown> = {}) {
  const hasGtag = typeof window !== "undefined" && !!(window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  const consent = hasConsent();
  if (hasGtag && consent) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag!("event", event, params);
  }
  // Siempre log en dev + warn en prod si gtag no existe o sin consent
  if (process.env.NODE_ENV !== "production") {
    const reason = !hasGtag ? "gtag MISSING" : !consent ? "consent denied (event no enviado)" : "→ gtag OK";
    console.log(`[track] ${event}`, params, reason);
  } else if (!hasGtag) {
    console.warn(`[track] ${event} — window.gtag no existe. Verifica NEXT_PUBLIC_GA_MEASUREMENT_ID en layout.tsx`);
  } else if (!consent) {
    console.log(`[track] ${event} — consent denied, evento no enviado a GA4`);
  }
}

// Helper para verificar instalación en runtime (usado en tests/manual)
export function isGtagReady(): boolean {
  return typeof window !== "undefined" && !!(window as unknown as { gtag?: unknown }).gtag;
}
