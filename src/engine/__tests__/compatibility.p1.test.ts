import { describe, it, expect } from "vitest";
import { calculateSetupScore } from "../compatibility";
import { CoffeeMachine, Grinder, UserPreferences } from "@/types/coffee";

const base: CoffeeMachine = {
  id: "m_base",
  slug: "base",
  brand: "Test",
  model: "Base",
  asin: "B0TEST0001",
  type: "manual_espresso",
  priceBand: "mid",
  priceApproxEUR: 400,
  espressoCapable: true,
  grinderIntegrated: false,
  image: "/images/test.jpg",
  specs: { portafilterDiameter: 54, pid: false, boilerType: "single_boiler", steamSystem: "manual", waterTankCapacityLiters: 2.0, startupTimeSeconds: 180 },
  ratings: { easeOfUse: 3, cleaningEase: 3, learningCurve: 4, footprint: "medium" },
  usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] },
  metadata: { verifiedAt: "2026-09-01T00:00:00Z", sources: ["Test"] },
};
const g: Grinder = {
  id: "g_test",
  slug: "test-grinder",
  brand: "Test",
  model: "G",
  asin: "B0TEST0002",
  priceBand: "entry",
  priceApproxEUR: 150,
  image: "/images/test.jpg",
  specs: { burrType: "conical", burrSizeMM: 40, espressoCapable: true, filterCapable: true, grindAdjustment: "stepped", hopperCapacityGrams: 30 },
  performance: { doseControl: 3, retention: 3, noise: 3, easeOfUse: 3, footprint: "small" },
  metadata: { verifiedAt: "2026-09-01T00:00:00Z", sources: ["Test"] },
};

describe("P1-Engine pesos + A-fix contrato 0-100", () => {
  it("A: contrato 0-100 absoluto — bruto >100 → expuesto ≤100 y rationale capado", () => {
    const beast: CoffeeMachine = { ...base, specs: { ...base.specs, portafilterDiameter: 58, pid: true }, ratings: { ...base.ratings, learningCurve: 5 } };
    const gPro: Grinder = { ...g, specs: { ...g.specs, grindAdjustment: "stepless", burrType: "flat", burrSizeMM: 58 }, performance: { doseControl: 5, retention: 5, noise: 5, easeOfUse: 5, footprint: "small" } };
    const prefs: UserPreferences = { drinkTypes: ["espresso"], budgetMaxEUR: 2000, workflowPreference: "manual_craft", dailyCups: "3-5", milkImportance: "low", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "separated" };
    const s = calculateSetupScore(beast, gPro, prefs);
    expect(s.score.totalScore).toBeLessThanOrEqual(100);
    expect(s.score.breakdown.experienceMatch).toBeLessThanOrEqual(100);
    expect(s.score.breakdown.experienceMatch).toBe(100);
    expect(s.score.rationale).toMatch(/100%|9\d%/);
    expect(s.score.rationale).not.toContain("113%");
    expect(s.score.rationale).not.toContain("130%");
    expect(s.score.rationale).not.toMatch(/10[1-9]%|1[1-9]\d%/);
  });
  it("58mm +12 debe superar 54mm+PID +7 para manual_craft bajo techo 100", () => {
    const m58noPid: CoffeeMachine = { ...base, specs: { ...base.specs, portafilterDiameter: 58, pid: false } };
    const m54pid: CoffeeMachine = { ...base, specs: { ...base.specs, portafilterDiameter: 54, pid: true } };
    const prefs: UserPreferences = {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 800,
      workflowPreference: "manual_craft",
      dailyCups: "3-5",
      milkImportance: "low",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "separated",
    };
    const s58 = calculateSetupScore(m58noPid, g, prefs);
    const s54 = calculateSetupScore(m54pid, g, prefs);
    expect(s58.score.breakdown.experienceMatch).toBeGreaterThan(s54.score.breakdown.experienceMatch);
    // Gaggia 58 sin PID debe ganar a Bambino 54 con PID para aspirante manual
    expect(s58.score.totalScore).toBeGreaterThan(s54.score.totalScore);
  });

  it("daily 6+ con depósito <1.8L debe penalizar vs >1.8L", () => {
    const smallTank: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 1.4 }, usageProfile: { min: 1, max: 4, bestFor: [], notIdealFor: [] } as any };
    // Fix usageProfile structure
    (smallTank as any).usageProfile = { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] };
    const largeTank: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 2.7 }, usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] } as any };
    (largeTank as any).usageProfile = { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] };
    // Actually need proper type
    const small: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 1.4 }, usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] } };
    const large: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 2.7 }, usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] } };
    const prefs: UserPreferences = {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 1000,
      workflowPreference: "balanced",
      dailyCups: "6+",
      milkImportance: "medium",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    };
    const sSmall = calculateSetupScore(small, g, prefs);
    const sLarge = calculateSetupScore(large, g, prefs);
    expect(sLarge.score.totalScore).toBeGreaterThan(sSmall.score.totalScore);
    // penalización explícita en cons
    expect(sSmall.score.cons.join(" ")).toMatch(/Depósito.*insuficiente/);
  });

  it("peso daily 6+ debe ser 13% (no 5%) — 6+ vs 1-2 mismo setup debe diferir más", () => {
    const m: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 2.7 }, usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] } };
    const prefsLow: UserPreferences = {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 800,
      workflowPreference: "balanced",
      dailyCups: "1-2",
      milkImportance: "low",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    };
    const prefsHigh: UserPreferences = { ...prefsLow, dailyCups: "6+" };
    const sLow = calculateSetupScore(m, g, prefsLow);
    const sHigh = calculateSetupScore(m, g, prefsHigh);
    // con 6+ el dailyScore 40 vs 100, y peso 13% vs 5% amplifica diferencia
    const diff = sLow.score.totalScore - sHigh.score.totalScore;
    expect(diff).toBeGreaterThan(5); // antes con 5% era ~3, ahora con 13% debe ser >5
  });
});
