import { describe, it, expect } from "vitest";
import { passesHardFilters, calculateSetupScore } from "../compatibility";
import { CoffeeMachine, Grinder, UserPreferences } from "@/types/coffee";

// Máquina base para comparar PID vs no PID — resto idéntico
const baseMachine: CoffeeMachine = {
  id: "m_test_base",
  slug: "test-machine",
  brand: "Test",
  model: "Base",
  asin: "B0TEST0001",
  type: "manual_espresso",
  priceBand: "mid",
  priceApproxEUR: 400,
  espressoCapable: true,
  grinderIntegrated: false,
  image: "/images/machines/test.jpg",
  specs: { portafilterDiameter: 54, pid: false, boilerType: "single_boiler", steamSystem: "manual", waterTankCapacityLiters: 2, startupTimeSeconds: 180 },
  ratings: { easeOfUse: 3, cleaningEase: 3, learningCurve: 3, footprint: "medium" },
  usageProfile: { milkUse: "medium", idealDailyCups: { min: 1, max: 4 }, bestFor: [], notIdealFor: [] },
  availability: { status: "verified", lastChecked: "2026-09-15", reason: "test" },
  metadata: { verifiedAt: "2026-09-01T00:00:00Z", sources: ["Test"] },
};

const pidMachine: CoffeeMachine = {
  ...baseMachine,
  id: "m_test_pid",
  specs: { ...baseMachine.specs, pid: true, portafilterDiameter: 58 },
};

const nonPidMachine: CoffeeMachine = {
  ...baseMachine,
  id: "m_test_nopid",
  specs: { ...baseMachine.specs, pid: false, portafilterDiameter: 54 },
};

const espressoGrinder: Grinder = {
  id: "g_espresso_ok",
  slug: "test-espresso-grinder",
  brand: "Test",
  model: "EspressoOK",
  asin: "B0TEST0002",
  priceBand: "entry",
  priceApproxEUR: 150,
  image: "/images/grinders/test.jpg",
  specs: { burrType: "conical", burrSizeMM: 40, espressoCapable: true, filterCapable: true, grindAdjustment: "stepped", hopperCapacityGrams: 30 },
  performance: { doseControl: 3, retention: 3, noise: 3, easeOfUse: 3, footprint: "small" },
  availability: { status: "verified", lastChecked: "2026-09-15", reason: "test" },
  metadata: { verifiedAt: "2026-09-01T00:00:00Z", sources: ["Test"] },
};

const nonEspressoGrinder: Grinder = {
  ...espressoGrinder,
  id: "g_filter_only",
  slug: "test-filter-only",
  model: "FilterOnly",
  specs: { ...espressoGrinder.specs, espressoCapable: false, filterCapable: true },
};

const manualPrefs: UserPreferences = {
  drinkTypes: ["espresso"],
  budgetMaxEUR: 800,
  workflowPreference: "manual_craft",
  dailyCups: "3-5",
  milkImportance: "low",
  maintenanceTolerance: "medium",
  spaceConstraint: false,
  integratedGrinderPreference: "separated",
};

describe("P0 RED — debe fallar antes del fix, pasar después", () => {
  it("manual_craft: PID + 58mm debe puntuar > que sin PID/54mm (bug experienceScore=100)", () => {
    const withPid = calculateSetupScore(pidMachine, espressoGrinder, manualPrefs);
    const withoutPid = calculateSetupScore(nonPidMachine, espressoGrinder, manualPrefs);
    // Si bug existe, ambos experienceMatch = 100 y totalScore igual -> falla
    expect(withPid.score.breakdown.experienceMatch).toBeGreaterThan(withoutPid.score.breakdown.experienceMatch);
    expect(withPid.score.totalScore).toBeGreaterThan(withoutPid.score.totalScore);
  });

  it("grinder no apto para espresso debe ser rechazado cuando se pide espresso", () => {
    const prefs: UserPreferences = { ...manualPrefs, drinkTypes: ["espresso"] };
    // Máquina ok, grinder no espresso -> debe fallar hard filter
    expect(passesHardFilters(baseMachine, nonEspressoGrinder, prefs)).toBe(false);
  });

  it("dailyCups 6+ con maquina 1-4 debe puntuar peor que 1-2 (dailyCups no usado)", () => {
    const lowUseMachine: CoffeeMachine = { ...baseMachine, usageProfile: { ...baseMachine.usageProfile, idealDailyCups: { min: 1, max: 2 } } };
    const prefsFew: UserPreferences = { ...manualPrefs, dailyCups: "1-2" };
    const prefsMany: UserPreferences = { ...manualPrefs, dailyCups: "6+" };
    const scoreFew = calculateSetupScore(lowUseMachine, espressoGrinder, prefsFew);
    const scoreMany = calculateSetupScore(lowUseMachine, espressoGrinder, prefsMany);
    // Si dailyCups no participa, ambos scores iguales -> test en rojo
    expect(scoreFew.score.totalScore).not.toEqual(scoreMany.score.totalScore);
    // 6+ fuera de ideal 1-2 debe ser peor
    expect(scoreMany.score.totalScore).toBeLessThan(scoreFew.score.totalScore);
  });

  it("black_coffee sin filtro en catalogo debe rechazarse o puntuar distinto (espresso-only)", () => {
    const filterPrefs: UserPreferences = { ...manualPrefs, drinkTypes: ["black_coffee"] };
    // Hoy el hard filter no distingue black_coffee vs espresso -> ambos pasan igual
    // Tras P0-5, black_coffee debería ser rechazado o mostrar mensaje espresso-only
    // Test rojo: si sigue pasando como espresso, no hay distincion
    const espressoPrefs: UserPreferences = { ...manualPrefs, drinkTypes: ["espresso"] };
    const scoreFilter = calculateSetupScore(baseMachine, espressoGrinder, filterPrefs);
    const scoreEspresso = calculateSetupScore(baseMachine, espressoGrinder, espressoPrefs);
    // Esperamos que tras fix no sean identicos (o que filter sea rechazado en passesHardFilters)
    // Por ahora este test documenta que son identicos -> bug
    const filterPass = passesHardFilters(baseMachine, espressoGrinder, filterPrefs);
    const espressoPass = passesHardFilters(baseMachine, espressoGrinder, espressoPrefs);
    // Si no hay diferencia, test falla intencionalmente antes del fix
    expect(filterPass === espressoPass && scoreFilter.score.totalScore === scoreEspresso.score.totalScore).toBe(false);
  });
});

describe("P0 VERDE intermedio — cada señal cuenta por separado, no binario", () => {
  it("manual_craft: PID solo (+15) debe estar entre ninguno y PID+58 (+30)", () => {
    const none = calculateSetupScore(nonPidMachine, espressoGrinder, manualPrefs); // 54 sin PID
    const pidOnly: CoffeeMachine = { ...baseMachine, id: "m_pid_only", specs: { ...baseMachine.specs, pid: true, portafilterDiameter: 54 } };
    const both = calculateSetupScore(pidMachine, espressoGrinder, manualPrefs); // PID+58
    const one = calculateSetupScore(pidOnly, espressoGrinder, manualPrefs);
    expect(one.score.breakdown.experienceMatch).toBeGreaterThan(none.score.breakdown.experienceMatch);
    expect(both.score.breakdown.experienceMatch).toBeGreaterThan(one.score.breakdown.experienceMatch);
    expect(both.score.totalScore).toBeGreaterThan(one.score.totalScore);
    expect(one.score.totalScore).toBeGreaterThan(none.score.totalScore);
  });
  it("maintenance medium debe distinguir cleaningEase 2 vs 5 (no solo low)", () => {
    const lowClean: CoffeeMachine = { ...baseMachine, ratings: { ...baseMachine.ratings, cleaningEase: 2 } };
    const highClean: CoffeeMachine = { ...baseMachine, ratings: { ...baseMachine.ratings, cleaningEase: 5 } };
    const mediumPrefs: UserPreferences = { ...manualPrefs, maintenanceTolerance: "medium" };
    const sLow = calculateSetupScore(lowClean, espressoGrinder, mediumPrefs);
    const sHigh = calculateSetupScore(highClean, espressoGrinder, mediumPrefs);
    expect(sHigh.score.breakdown.maintenanceMatch).toBeGreaterThan(sLow.score.breakdown.maintenanceMatch);
    expect(sHigh.score.totalScore).toBeGreaterThan(sLow.score.totalScore);
  });
  it("milk medium debe distinguir automatic vs thermoblock vs single_boiler", () => {
    const autoM: CoffeeMachine = { ...baseMachine, specs: { ...baseMachine.specs, steamSystem: "automatic", boilerType: "thermoblock" } };
    const thermoM: CoffeeMachine = { ...baseMachine, specs: { ...baseMachine.specs, steamSystem: "manual", boilerType: "thermoblock" } };
    const singleM: CoffeeMachine = { ...baseMachine, specs: { ...baseMachine.specs, steamSystem: "manual", boilerType: "single_boiler" } };
    const medPrefs: UserPreferences = { ...manualPrefs, milkImportance: "medium" };
    const sAuto = calculateSetupScore(autoM, espressoGrinder, medPrefs);
    const sThermo = calculateSetupScore(thermoM, espressoGrinder, medPrefs);
    const sSingle = calculateSetupScore(singleM, espressoGrinder, medPrefs);
    expect(sAuto.score.breakdown.milkMatch).toBeGreaterThan(sThermo.score.breakdown.milkMatch);
    expect(sThermo.score.breakdown.milkMatch).toBeGreaterThan(sSingle.score.breakdown.milkMatch);
  });
  it("grinder stepless debe superar stepped para manual_craft (no solo precio)", () => {
    const stepped = { ...espressoGrinder, specs: { ...espressoGrinder.specs, grindAdjustment: "stepped" as const } };
    const stepless = { ...espressoGrinder, specs: { ...espressoGrinder.specs, grindAdjustment: "stepless" as const, burrType: "flat" as const, burrSizeMM: 58 }, performance: { ...espressoGrinder.performance, retention: 5 as const, doseControl: 5 as const } };
    const sStepped = calculateSetupScore(nonPidMachine, stepped, manualPrefs);
    const sStepless = calculateSetupScore(nonPidMachine, stepless, manualPrefs);
    expect(sStepless.score.breakdown.experienceMatch).toBeGreaterThan(sStepped.score.breakdown.experienceMatch);
    expect(sStepless.score.totalScore).toBeGreaterThan(sStepped.score.totalScore);
  });
});
