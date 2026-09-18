import { describe, it, expect } from "vitest";
import {
  CATALOG_POLICY,
  isRecommendableMachine,
  isRecommendableSetup,
  ctaKindFor,
  verificationBadge,
} from "../eligibility";
import type { CoffeeMachine, Grinder } from "@/types/coffee";

const baseMachine: CoffeeMachine = {
  id: "m_test", slug: "test", brand: "T", model: "M", asin: "B000000000",
  type: "manual_espresso", priceBand: "entry", priceApproxEUR: 100,
  espressoCapable: true, grinderIntegrated: true, image: "/x.jpg",
  specs: { pid: false, boilerType: "thermoblock", steamSystem: "manual", waterTankCapacityLiters: 1, startupTimeSeconds: 40 },
  ratings: { easeOfUse: 4, cleaningEase: 4, learningCurve: 1, footprint: "small" },
  usageProfile: { milkUse: "low", idealDailyCups: { min: 1, max: 2 }, bestFor: [], notIdealFor: [] },
  availability: { status: "available" },
  verification: { level: "human", checkedAt: "2026-09-18" },
  priceCheck: { status: "direct_eur", observedEUR: 100, source: "manual" },
  identityCheck: { status: "verified" },
  metadata: { verifiedAt: "2026-09-18T00:00:00Z", sources: ["Test"] },
};

describe("Elegibilidad comercial (puerta estricta)", () => {
  it("human + direct_eur + available + identity → recomendable", () => {
    expect(isRecommendableMachine(baseMachine)).toBe(true);
    expect(ctaKindFor(baseMachine)).toBe("buy");
  });
  it("amazon_html NO pasa con REQUIRE_HUMAN_FOR_RECOMMENDABLE=true", () => {
    const m = { ...baseMachine, verification: { level: "amazon_html" as const } };
    expect(isRecommendableMachine(m)).toBe(false);
    expect(ctaKindFor(m)).toBe("pending");
  });
  it("amazon_html SÍ pasa en modo permisivo (reversible sin tocar datos)", () => {
    const permissive = { requireHumanVerification: false } as const;
    const m = { ...baseMachine, verification: { level: "amazon_html" as const } };
    expect(isRecommendableMachine(m, permissive)).toBe(true);
  });
  it("precio derived o unknown bloquea aunque haya stock + HTML", () => {
    const m = {
      ...baseMachine,
      verification: { level: "amazon_html" as const },
      priceCheck: { status: "derived" as const, observedEUR: 99, source: "ecb" as const },
    };
    expect(isRecommendableMachine(m)).toBe(false);
    expect(isRecommendableMachine(m, { requireHumanVerification: false } as const)).toBe(false);
  });
  it("identidad unknown bloquea (caso Magnifica Duo)", () => {
    const m = { ...baseMachine, identityCheck: { status: "unknown" as const } };
    expect(isRecommendableMachine(m)).toBe(false);
  });
  it("unavailable → CTA 'unavailable', nunca 'buy'", () => {
    const m = { ...baseMachine, availability: { status: "unavailable" as const } };
    expect(ctaKindFor(m)).toBe("unavailable");
  });
  it("el setup exige molinillo recomendable si lo lleva", () => {
    const g: Grinder = {
      id: "g_test", slug: "t", brand: "T", model: "G", asin: "B000000001",
      priceBand: "entry", priceApproxEUR: 50, image: "/y.jpg",
      specs: { burrType: "conical", burrSizeMM: 40, espressoCapable: true, filterCapable: true, grindAdjustment: "stepped", hopperCapacityGrams: 100 },
      performance: { doseControl: 3, retention: 3, noise: 3, easeOfUse: 3, footprint: "small" },
      availability: { status: "available" },
      verification: { level: "amazon_html" as const },
      priceCheck: { status: "direct_eur" as const, observedEUR: 50, source: "amazon_html" as const },
      identityCheck: { status: "verified" as const },
      metadata: { verifiedAt: "2026-09-18T00:00:00Z", sources: ["Test"] },
    };
    expect(isRecommendableSetup(baseMachine, g)).toBe(false);
    expect(isRecommendableSetup(baseMachine, undefined)).toBe(true);
  });
  it("CATALOG_POLICY es estricta por defecto", () => {
    expect(CATALOG_POLICY.requireHumanVerification).toBe(true);
  });
  it("badge analytics sale del campo, no del texto", () => {
    expect(verificationBadge("human")).toBe("humanVerified");
    expect(verificationBadge("amazon_html")).toBe("amazonHtmlVerified");
    expect(verificationBadge(undefined)).toBe("amazonHtmlVerified");
  });
});
