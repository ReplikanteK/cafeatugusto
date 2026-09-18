import type { CoffeeMachine, Grinder, VerificationLevel } from "@/types/coffee";

// Política de elegibilidad comercial del experimento.
// Separada del scoring (compatibility.ts) y de la compatibilidad (passesHardFilters):
// esto responde "¿puedo recomendarlo comercialmente?", no "¿encaja con el usuario?".
// amazonHtmlVerified ≠ humanVerified: el HTML es trazabilidad válida pero,
// durante el experimento, no basta para un enlace comprable.
export const CATALOG_POLICY = {
  requireHumanVerification: true,
} as const;
// Tipo ancho a propósito: la política admite ambos modos (el experimento usa true).
export type CatalogPolicy = { readonly requireHumanVerification: boolean };

export function isVerificationOk(
  level: VerificationLevel | undefined,
  policy: CatalogPolicy = CATALOG_POLICY,
): boolean {
  if (level === "human") return true;
  if (level === "amazon_html") return !policy.requireHumanVerification;
  return false;
}

export function isRecommendableMachine(
  m: CoffeeMachine,
  policy: CatalogPolicy = CATALOG_POLICY,
): boolean {
  if (m.availability?.status !== "available") return false;
  if (!isVerificationOk(m.verification?.level, policy)) return false;
  if (m.priceCheck?.status !== "direct_eur") return false;
  if (m.identityCheck?.status !== "verified") return false;
  return true;
}

export function isRecommendableGrinder(
  g: Grinder,
  policy: CatalogPolicy = CATALOG_POLICY,
): boolean {
  if (g.availability?.status !== "available") return false;
  if (!isVerificationOk(g.verification?.level, policy)) return false;
  if (g.priceCheck?.status !== "direct_eur") return false;
  if (g.identityCheck?.status !== "verified") return false;
  return true;
}

export function isRecommendableSetup(
  m: CoffeeMachine,
  g: Grinder | undefined,
  policy: CatalogPolicy = CATALOG_POLICY,
): boolean {
  if (!isRecommendableMachine(m, policy)) return false;
  if (g && !isRecommendableGrinder(g, policy)) return false;
  return true;
}

// Etiqueta CTA derivada del modelo (fail-closed: solo recommendable enlaza a Amazon)
export type CtaKind = "buy" | "pending" | "unavailable";
export function ctaKindFor(
  m: CoffeeMachine,
  g?: Grinder,
  policy: CatalogPolicy = CATALOG_POLICY,
): CtaKind {
  if (m.availability?.status === "unavailable") return "unavailable";
  if (g && g.availability?.status === "unavailable") return "unavailable";
  return isRecommendableSetup(m, g, policy) ? "buy" : "pending";
}

// Badge analytics desde campo estructurado (antes: reason.includes — frágil)
export function verificationBadge(level: VerificationLevel | undefined): "humanVerified" | "amazonHtmlVerified" {
  return level === "human" ? "humanVerified" : "amazonHtmlVerified";
}
