import { CoffeeMachine, Grinder, EvaluatedSetup } from "@/types/coffee";

export interface UserPreferences {
  readonly drinkTypes: readonly ("espresso" | "milk_drink" | "black_coffee")[];
  readonly budgetMaxEUR: number;
  readonly workflowPreference: "convenience" | "balanced" | "manual_craft";
  readonly dailyCups: "1-2" | "3-5" | "6+";
  readonly milkImportance: "low" | "medium" | "high";
  readonly maintenanceTolerance: "low" | "medium" | "high";
  readonly spaceConstraint: boolean;
  readonly integratedGrinderPreference: "yes" | "indifferent" | "separated";
}

export function passesHardFilters(
  machine: CoffeeMachine,
  grinder: Grinder | undefined,
  prefs: UserPreferences
): boolean {
  const totalCost = machine.priceApproxEUR + (grinder?.priceApproxEUR ?? 0);
  if (totalCost > prefs.budgetMaxEUR * 1.1) return false;
  if (prefs.spaceConstraint) {
    if (machine.ratings.footprint === "large") return false;
    if (grinder && grinder.performance.footprint === "large") return false;
  }
  if (prefs.integratedGrinderPreference === "yes" && !machine.grinderIntegrated) return false;
  if (prefs.integratedGrinderPreference === "separated" && machine.grinderIntegrated) return false;
  if (prefs.drinkTypes.includes("espresso") && !machine.espressoCapable) return false;
  return true;
}

export function calculateSetupScore(
  machine: CoffeeMachine,
  grinder: Grinder | undefined,
  prefs: UserPreferences
): EvaluatedSetup {
  let budgetScore = 100;
  let experienceScore = 100;
  let spaceScore = 100;
  let maintenanceScore = 100;
  let milkScore = 100;
  const pros: string[] = [];
  const cons: string[] = [];
  const totalCost = machine.priceApproxEUR + (grinder?.priceApproxEUR ?? 0);
  const budgetRatio = totalCost / prefs.budgetMaxEUR;
  if (budgetRatio <= 1.0) {
    budgetScore = 100;
    pros.push("Dentro del presupuesto definido.");
  } else {
    budgetScore = Math.max(0, 100 - (budgetRatio - 1.0) * 300);
    cons.push("Excede ligeramente el presupuesto objetivo.");
  }
  if (prefs.workflowPreference === "convenience") {
    experienceScore = (6 - machine.ratings.learningCurve) * 20;
    if (machine.ratings.easeOfUse >= 4) pros.push("Operación rápida y sencilla sin curva técnica.");
    if (machine.ratings.learningCurve > 3) cons.push("Curva de aprendizaje moderada para tus preferencias.");
  } else if (prefs.workflowPreference === "manual_craft") {
    if (machine.specs.pid) {
      experienceScore += 15;
      pros.push("Incluye control PID para estabilidad térmica.");
    }
    if (machine.specs.portafilterDiameter === 58) {
      experienceScore += 15;
      pros.push("Portafiltro de 58 mm estándar comercial.");
    }
    experienceScore = Math.min(100, experienceScore);
  }
  if (prefs.spaceConstraint) {
    spaceScore = machine.ratings.footprint === "small" ? 100 : 60;
    if (machine.ratings.footprint === "small") pros.push("Diseño compacto ideal para cocinas pequeñas.");
  }
  if (prefs.maintenanceTolerance === "low") {
    maintenanceScore = machine.ratings.cleaningEase * 20;
    if (machine.ratings.cleaningEase < 3) cons.push("Requiere rutinas de limpieza más exigentes.");
    else pros.push("Mantenimiento y limpieza diarios sencillos.");
  }
  if (prefs.milkImportance === "high") {
    if (machine.specs.steamSystem === "automatic" || machine.specs.boilerType === "dual_boiler") {
      milkScore = 100;
      pros.push("Excelente potencia de vaporización de leche.");
    } else if (machine.specs.boilerType === "thermoblock") {
      milkScore = 75;
    } else {
      milkScore = 50;
      cons.push("Espera térmica necesaria entre café y vapor.");
    }
  }
  const finalScore = Math.round(
    budgetScore * 0.4 + experienceScore * 0.25 + spaceScore * 0.15 + maintenanceScore * 0.1 + milkScore * 0.1
  );
  return {
    setup: {
      id: `${machine.slug}_${grinder?.slug ?? "integrated"}`,
      machine,
      grinder,
      isIntegrated: machine.grinderIntegrated,
      estimatedTotalEUR: totalCost,
    },
    score: {
      totalScore: Math.min(99, Math.max(40, finalScore)),
      breakdown: {
        hardRequirementsPassed: true,
        budgetMatch: Math.round(budgetScore),
        experienceMatch: Math.round(experienceScore),
        spaceMatch: Math.round(spaceScore),
        maintenanceMatch: Math.round(maintenanceScore),
        milkMatch: Math.round(milkScore),
      },
      pros,
      cons,
      rationale: `Setup configurado para tu perfil de ${prefs.workflowPreference} con un encaje global del ${finalScore}%.`,
    },
  };
}
