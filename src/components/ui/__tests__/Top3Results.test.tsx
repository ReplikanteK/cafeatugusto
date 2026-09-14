import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Top3Results } from "../Top3Results";
import { EvaluatedSetup } from "@/types/coffee";

const mockPrefs = {
  drinkTypes: ["espresso"] as const,
  budgetMaxEUR: 700,
  workflowPreference: "manual_craft" as const,
  dailyCups: "3-5" as const,
  milkImportance: "low" as const,
  maintenanceTolerance: "medium" as const,
  spaceConstraint: false,
  integratedGrinderPreference: "separated" as const,
};

const mockM1 = {
  id: "m_test",
  slug: "test-m",
  brand: "Test",
  model: "M58",
  asin: "B0TEST0001",
  type: "manual_espresso" as const,
  priceBand: "mid" as const,
  priceApproxEUR: 400,
  espressoCapable: true,
  grinderIntegrated: false,
  image: "/images/test.jpg",
  specs: { portafilterDiameter: 58 as const, pid: true, boilerType: "single_boiler" as const, steamSystem: "manual" as const, waterTankCapacityLiters: 2, startupTimeSeconds: 180 },
  ratings: { easeOfUse: 3 as const, cleaningEase: 3 as const, learningCurve: 4 as const, footprint: "medium" as const },
  usageProfile: { milkUse: "medium" as const, idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] },
  metadata: { verifiedAt: "2026-09-01T00:00:00Z", sources: ["Test"] },
};
const mockG1 = {
  id: "g_test",
  slug: "test-g",
  brand: "Test",
  model: "G1",
  asin: "B0TEST0002",
  priceBand: "entry" as const,
  priceApproxEUR: 150,
  image: "/images/test.jpg",
  specs: { burrType: "conical" as const, burrSizeMM: 40, espressoCapable: true, filterCapable: true, grindAdjustment: "stepless" as const, hopperCapacityGrams: 30 },
  performance: { doseControl: 5 as const, retention: 5 as const, noise: 3 as const, easeOfUse: 3 as const, footprint: "small" as const },
  metadata: { verifiedAt: "2026-09-01T00:00:00Z", sources: ["Test"] },
};

const mkEval = (id: string, score: number, machine = mockM1, grinder = mockG1): EvaluatedSetup => ({
  setup: { id, machine: { ...machine, slug: id }, grinder, isIntegrated: false, estimatedTotalEUR: 550 },
  score: {
    totalScore: score,
    breakdown: { hardRequirementsPassed: true, budgetMatch: 100, experienceMatch: 100, dailyMatch: 100, spaceMatch: 100, maintenanceMatch: 90, milkMatch: 90, grinderMatch: 95 },
    pros: ["PID ayuda", "58mm"],
    cons: ["Sin"],
    rationale: `Setup ${id} rationale`,
  },
});

describe("Top3Results — jerarquía visual", () => {
  it("renderiza Top1 destacado con pills y amazon links instrumentados", () => {
    const tops = [mkEval("top1", 99), mkEval("top2", 95), mkEval("top3", 92)];
    const html = renderToString(<Top3Results tops={tops} prefs={mockPrefs as any} />);
    // Jerarquía
    expect(html).toContain("Mejor Coincidencia");
    expect(html).toContain("Mejor Relación");
    expect(html).toContain("Alternativa");
    // Score visible (ScoreBadge renders 99 / 100 con comentario React)
    expect(html).toMatch(/99.*\/ 100/);
    expect(html).toMatch(/95.*\/100/);
    // Pills técnicas
    expect(html).toContain("58mm");
    expect(html).toContain("PID");
    expect(html).toContain("Stepless");
    expect(html).toContain("Single Dose");
    // Amazon
    expect(html).toContain("Ver en Amazon");
    expect(html).toContain("B0TEST0001");
    expect(html).toContain("B0TEST0002");
    // Precio (React inserta comentario entre número y €)
    expect(html).toMatch(/550.*€/);
  });

  it("muestra fallback sin resultados", () => {
    const html = renderToString(<Top3Results tops={[]} prefs={mockPrefs as any} />);
    expect(html).toContain("Sin resultados");
  });
});
