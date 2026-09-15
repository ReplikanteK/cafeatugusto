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
  it("PID +12 debe superar 58mm +7 para manual_craft tras recalibrado P2 (evidencia Tom's/forocafe)", () => {
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
    expect(s54.score.breakdown.experienceMatch).toBeGreaterThan(s58.score.breakdown.experienceMatch);
    // Tras recalibrado P2: PID estable > 58mm para manual_craft
    expect(s54.score.totalScore).toBeGreaterThan(s58.score.totalScore);
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
  it("F: breakdown debe exponer 7 dims auditables 0-100 (presupuesto, workflow, daily, espacio, mantenimiento, leche, molinillo)", () => {
    const prefs: UserPreferences = { drinkTypes: ["espresso"], budgetMaxEUR: 800, workflowPreference: "balanced", dailyCups: "3-5", milkImportance: "medium", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent" };
    const s = calculateSetupScore(base, g, prefs);
    const b = s.score.breakdown;
    expect(b.budgetMatch).toBeGreaterThanOrEqual(0); expect(b.budgetMatch).toBeLessThanOrEqual(100);
    expect(b.experienceMatch).toBeGreaterThanOrEqual(0); expect(b.experienceMatch).toBeLessThanOrEqual(100);
    expect(b.dailyMatch).toBeGreaterThanOrEqual(0); expect(b.dailyMatch).toBeLessThanOrEqual(100);
    expect(b.spaceMatch).toBeGreaterThanOrEqual(0); expect(b.spaceMatch).toBeLessThanOrEqual(100);
    expect(b.maintenanceMatch).toBeGreaterThanOrEqual(0); expect(b.maintenanceMatch).toBeLessThanOrEqual(100);
    expect(b.milkMatch).toBeGreaterThanOrEqual(0); expect(b.milkMatch).toBeLessThanOrEqual(100);
    expect(b.grinderMatch).toBeGreaterThanOrEqual(0); expect(b.grinderMatch).toBeLessThanOrEqual(100);
    // trazabilidad: daily 6+ vs 1-2 debe cambiar dailyMatch, grinder integrado vs separado debe cambiar grinderMatch
    const lowDaily = calculateSetupScore({ ...base, usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 2 }, bestFor: [], notIdealFor: [] } } as CoffeeMachine, g, { ...prefs, dailyCups: "6+" });
    const highDaily = calculateSetupScore({ ...base, usageProfile: { milkUse: "medium", idealDailyCups: { min: 5, max: 8 }, bestFor: [], notIdealFor: [] } } as CoffeeMachine, g, { ...prefs, dailyCups: "6+" });
    expect(highDaily.score.breakdown.dailyMatch).toBeGreaterThan(lowDaily.score.breakdown.dailyMatch);
  });

  it("convenience: easeOfUse 5 debe superar easeOfUse 2 con misma learningCurve (rojo #1)", () => {
    const easy: CoffeeMachine = { ...base, ratings: { ...base.ratings, learningCurve: 2, easeOfUse: 5 } };
    const hard: CoffeeMachine = { ...base, ratings: { ...base.ratings, learningCurve: 2, easeOfUse: 2 } };
    const prefs: UserPreferences = { drinkTypes: ["espresso"], budgetMaxEUR: 800, workflowPreference: "convenience", dailyCups: "1-2", milkImportance: "low", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent" };
    const sEasy = calculateSetupScore(easy, g, prefs);
    const sHard = calculateSetupScore(hard, g, prefs);
    expect(sEasy.score.breakdown.experienceMatch).toBeGreaterThan(sHard.score.breakdown.experienceMatch);
    expect(sEasy.score.totalScore).toBeGreaterThan(sHard.score.totalScore);
  });

  it("6+ semántico: máquina 5-8 debe superar 1-4 para usuario 6+ (rojo #2)", () => {
    const caps8: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 2.5 }, usageProfile: { milkUse: "medium", idealDailyCups: { min: 5, max: 8 }, bestFor: [], notIdealFor: [] } };
    const caps4: CoffeeMachine = { ...base, specs: { ...base.specs, waterTankCapacityLiters: 2.5 }, usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] } };
    const prefs: UserPreferences = { drinkTypes: ["espresso"], budgetMaxEUR: 800, workflowPreference: "balanced", dailyCups: "6+", milkImportance: "low", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent" };
    const s8 = calculateSetupScore(caps8, g, prefs);
    const s4 = calculateSetupScore(caps4, g, prefs);
    // 5-8 cubre 6+ → 100, 1-4 no cubre 6 → 40 o 30 penalizado
    expect(s8.score.breakdown.dailyMatch).toBeGreaterThan(s4.score.breakdown.dailyMatch);
    expect(s8.score.totalScore).toBeGreaterThan(s4.score.totalScore);
    expect(s8.score.breakdown.dailyMatch).toBe(100);
  });
});
