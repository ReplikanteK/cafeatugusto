import { describe, it, expect } from "vitest";
import { passesHardFilters, calculateSetupScore } from "../compatibility";
import { CoffeeMachine, Grinder, UserPreferences } from "@/types/coffee";
const sampleMachine: CoffeeMachine = {
  id:"m_sage_bambino", slug:"sage-bambino", brand:"Sage", model:"Bambino", asin:"B0813S2G2N", type:"manual_espresso", priceBand:"entry", priceApproxEUR:330, espressoCapable:true, grinderIntegrated:false, image:"/images/machines/sage-bambino.jpg", specs:{ portafilterDiameter:54, pid:true, boilerType:"thermoblock", steamSystem:"manual", waterTankCapacityLiters:1.4, startupTimeSeconds:3 }, ratings:{ easeOfUse:4, cleaningEase:4, learningCurve:2, footprint:"small" }, usageProfile:{ milkUse:"medium", idealDailyCups:{min:1,max:4}, bestFor:["Rapidez"], notIdealFor:["58mm"] }, availability:{ status:"available", lastChecked:"2026-09-15", reason:"test" }, metadata:{ verifiedAt:"2026-09-01T00:00:00Z", sources:["Sage Specs"] },
};
const sampleGrinder: Grinder = {
  id:"g_kingrinder_k6", slug:"kingrinder-k6", brand:"KINGrinder", model:"K6", asin:"B09WV9Y2S9", priceBand:"entry", priceApproxEUR:110, image:"/images/grinders/kingrinder-k6.jpg", specs:{ burrType:"conical", burrSizeMM:48, espressoCapable:true, filterCapable:true, grindAdjustment:"stepped", hopperCapacityGrams:30 }, performance:{ doseControl:4, retention:5, noise:5, easeOfUse:3, footprint:"small" }, availability:{ status:"available", lastChecked:"2026-09-15", reason:"test" }, metadata:{ verifiedAt:"2026-09-01T00:00:00Z", sources:["KINGrinder Specs"] },
};
describe("Motor de Compatibilidad", () => {
  it("debe rechazar setups que superen el 110% del presupuesto", () => {
    const strictPrefs: UserPreferences = { drinkTypes:["espresso"], budgetMaxEUR:300, workflowPreference:"balanced", dailyCups:"1-2", milkImportance:"low", maintenanceTolerance:"medium", spaceConstraint:false, integratedGrinderPreference:"indifferent" };
    expect(passesHardFilters(sampleMachine, sampleGrinder, strictPrefs)).toBe(false);
  });
  it("debe evaluar correctamente el scoring de un setup viable dentro del presupuesto", () => {
    const validPrefs: UserPreferences = { drinkTypes:["espresso"], budgetMaxEUR:500, workflowPreference:"convenience", dailyCups:"1-2", milkImportance:"medium", maintenanceTolerance:"medium", spaceConstraint:true, integratedGrinderPreference:"separated" };
    expect(passesHardFilters(sampleMachine, sampleGrinder, validPrefs)).toBe(true);
    const result = calculateSetupScore(sampleMachine, sampleGrinder, validPrefs);
    expect(result.score.totalScore).toBeGreaterThanOrEqual(75);
    expect(result.score.breakdown.budgetMatch).toBe(100);
  });
});
