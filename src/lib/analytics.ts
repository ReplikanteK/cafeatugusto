export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag("event", event, params);
  }
  // Fallback: console for MVP
  if (process.env.NODE_ENV !== "production") console.log("[track]", event, params);
}
