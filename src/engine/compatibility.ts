import { CoffeeMachine, Grinder, EvaluatedSetup, UserPreferences } from "@/types/coffee";

// P0 fix semántico — ver tests en src/engine/__tests__/compatibility.p0.test.ts
// Tabla preferencia → señal:
// workflow manual → learningCurve alta + PID + 58mm + grinder stepless/retención
// workflow convenience → easeOfUse + learningCurve baja + startup rápido + grinder ease
// dailyCups → idealDailyCups {min,max}
// milk → steamSystem + boilerType (low/medium/high distinguen)
// maintenance → cleaningEase + grinder retention (low/medium/high distinguen)
// space → footprint máquina + molinillo
// grinder → espressoCapable (hard) + dosis/retención/ruido + ajuste

export function passesHardFilters(
  machine: CoffeeMachine,
  grinder: Grinder | undefined,
  prefs: UserPreferences
): boolean {
  // V1 Catalogación Amazon: solo productos verified son recomendables — unknown/unavailable no pasan
  // unknown ≠ verified (evita humo si no hay oferta comprable). Migración inicial marca verified con reason pendiente.
  if (machine.availability && machine.availability.status !== "verified") return false;
  if (grinder?.availability && grinder.availability.status !== "verified") return false;
  const totalCost = machine.priceApproxEUR + (grinder?.priceApproxEUR ?? 0);
  if (totalCost > prefs.budgetMaxEUR * 1.1) return false;
  if (prefs.spaceConstraint) {
    if (machine.ratings.footprint === "large") return false;
    if (grinder && grinder.performance.footprint === "large") return false;
  }
  if (prefs.integratedGrinderPreference === "yes" && !machine.grinderIntegrated) return false;
  if (prefs.integratedGrinderPreference === "separated" && machine.grinderIntegrated) return false;
  if (prefs.drinkTypes.includes("espresso") && !machine.espressoCapable) return false;
  // P0-3 grinder debe ser apto para espresso si se pide espresso
  if (prefs.drinkTypes.includes("espresso") && grinder && !grinder.specs.espressoCapable) return false;
  // P0-5 espresso-only: catálogo sin máquinas de filtro/goteo. Si pide solo black_coffee, no hay match.
  if (prefs.drinkTypes.length === 1 && prefs.drinkTypes[0] === "black_coffee") return false;
  if (prefs.drinkTypes.includes("black_coffee") && !prefs.drinkTypes.includes("espresso") && !prefs.drinkTypes.includes("milk_drink")) {
    return false;
  }
  return true;
}

function getExperienceScore(machine: CoffeeMachine, grinder: Grinder | undefined, prefs: UserPreferences, pros: string[], cons: string[]): number {
  let s = 0;
  if (prefs.workflowPreference === "convenience") {
    // convenience quiere baja curva y alta facilidad — easeOfUse sí puntúa (fix rojo #1)
    s = (6 - machine.ratings.learningCurve) * 20; // 1->100, 5->20
    if (machine.ratings.easeOfUse >= 4) {
      s = Math.min(100, s + 12);
      pros.push("Operación rápida y sencilla sin curva técnica.");
    } else if (machine.ratings.easeOfUse === 3) {
      s = Math.min(100, s + 4);
    } else if (machine.ratings.easeOfUse <= 2) {
      s = Math.max(0, s - 8);
      cons.push("Requiere práctica para uso cómodo.");
    }
    if (machine.ratings.learningCurve > 3) cons.push("Curva de aprendizaje moderada para tus preferencias.");
    // startup rápido premia convenience
    if (machine.specs.startupTimeSeconds <= 30) {
      s = Math.min(100, s + 10);
      pros.push("Calentamiento casi instantáneo para uso rápido.");
    }
    // grinder aporta a convenience
    if (grinder) {
      if (grinder.performance.easeOfUse >= 4) {
        s = Math.min(100, s + 8);
        pros.push("Molinillo muy intuitivo para uso diario.");
      }
      if (grinder.performance.footprint === "small" && grinder.specs.grindAdjustment === "stepped") {
        s = Math.min(100, s + 5);
      }
    }
    return Math.round(Math.max(0, Math.min(100, s)));
  }
  if (prefs.workflowPreference === "balanced") {
    // balanced: ideal curva 3 => 100, extremos penalizan
    const lc = machine.ratings.learningCurve;
    if (lc === 3) s = 100;
    else if (lc === 2 || lc === 4) s = 80;
    else if (lc === 1 || lc === 5) s = 60;
    else s = 70;
    if (machine.specs.pid) {
      s = Math.min(100, s + 8);
      pros.push("PID ayuda a mantener consistencia sin complicar.");
    }
    if (machine.ratings.easeOfUse >= 4) {
      s = Math.min(100, s + 5);
    }
    if (grinder) {
      if (grinder.performance.easeOfUse >= 4) s = Math.min(100, s + 5);
    }
    return Math.round(s);
  }
  // manual_craft — semántico: base por curva alta + PID + 58mm + grinder técnico
  // base 40 + curva*12 => 1=>52, 3=>76, 5=>100 (recompensa alta curva)
  s = 40 + machine.ratings.learningCurve * 12;
  if (machine.ratings.learningCurve >= 4) pros.push("Curva exigente ideal para control manual.");
  if (machine.ratings.learningCurve <= 2) cons.push("Demasiado sencilla si buscas control manual profundo.");
  if (machine.specs.pid) {
    s += 12; // Recalibrado P2: evidencia externa Tom's Guide/forocafe — para manual_craft PID > 58mm (antes 7 vs 12, ahora 12 vs 7)
    pros.push("Incluye control PID para estabilidad térmica.");
  } else {
    cons.push("Sin PID: mayor variabilidad térmica en manual.");
  }
  if (machine.specs.portafilterDiameter === 58) {
    s += 7; // 58mm +7 (antes +12) — ahora subordinado a PID para manual_craft
    pros.push("Portafiltro de 58 mm estándar comercial.");
  } else if (machine.specs.portafilterDiameter === 54) {
    // neutro, no bonus ni penalización fuerte
  } else {
    cons.push(`Portafiltro ${machine.specs.portafilterDiameter ?? "?"}mm menos estándar para accesorios 58mm.`);
  }
  if (grinder) {
    if (grinder.specs.grindAdjustment === "stepless") {
      s += 6;
      pros.push("Molinillo stepless para ajuste micrométrico manual.");
    }
    if (grinder.specs.burrType === "flat" && grinder.specs.burrSizeMM >= 55) {
      s += 3;
      pros.push("Muelas planas grandes para claridad en tueste ligero.");
    }
    if (grinder.performance.retention >= 4) {
      s += 3;
      pros.push("Baja retención, ideal para single-dosing manual.");
    }
    if (grinder.performance.doseControl >= 4) {
      s += 3;
    }
  } else if (!machine.grinderIntegrated) {
    cons.push("Sin molinillo dedicado: limita control manual.");
  }
  // A-fix: contrato absoluto 0-100 — sin excepciones (antes 130 permitía 113 vs 104 por encima de 100)
  return Math.round(Math.max(0, Math.min(100, s)));
}

function getDailyScore(machine: CoffeeMachine, prefs: UserPreferences, pros: string[], cons: string[]): number {
  // 6+ categoría abierta → need=6, no 10 (fix rojo #2). 70% =4.2 para borde.
  const needMap: Record<string, number> = { "1-2": 2, "3-5": 5, "6+": 6 };
  const need = needMap[prefs.dailyCups] ?? 5;
  const max = machine.usageProfile.idealDailyCups.max;
  const min = machine.usageProfile.idealDailyCups.min;
  let score: number;
  // alta demanda: categoría abierta → basta max>=6 (o min<=6<=max) para 100
  if (prefs.dailyCups === "6+" ? max >= 6 : (max >= need && min <= need)) {
    pros.push(`Adecuada para ${prefs.dailyCups} cafés/día (rango ${min}-${max}).`);
    score = 100;
  } else if (max >= need * 0.7) {
    cons.push(`Algo justa para ${prefs.dailyCups} cafés/día (ideal ${min}-${max}).`);
    score = 70;
  } else {
    cons.push(`No ideal para ${prefs.dailyCups} cafés/día — capacidad pensada para ${min}-${max}.`);
    score = 40;
  }
  // P1: hard penalty depósito <1.8L para alta demanda 6+ (termobloque pequeño no es oficina)
  if (prefs.dailyCups === "6+" && machine.specs.waterTankCapacityLiters < 1.8) {
    cons.push(`Depósito ${machine.specs.waterTankCapacityLiters}L insuficiente para uso intensivo 6+ — penalización capacidad.`);
    score = Math.min(score, 30);
  }
  return score;
}

function getGrinderScore(grinder: Grinder | undefined, machine: CoffeeMachine, prefs: UserPreferences): number {
  if (!grinder) {
    // integrada: buena para convenience/balanced, neutra para manual separado (ya filtrado)
    return machine.grinderIntegrated ? 85 : 50;
  }
  // base por performance promedio (20-100)
  const avg = (grinder.performance.doseControl + grinder.performance.retention + grinder.performance.easeOfUse + grinder.performance.noise) / 4;
  let s = Math.round(avg * 20); // 1->20, 5->100
  // ajustes workflow ya contemplados en experience, aquí solo leve
  return Math.max(0, Math.min(100, s));
}

export function calculateSetupScore(
  machine: CoffeeMachine,
  grinder: Grinder | undefined,
  prefs: UserPreferences
): EvaluatedSetup {
  let budgetScore = 100;
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

  const experienceScore = getExperienceScore(machine, grinder, prefs, pros, cons);

  if (prefs.spaceConstraint) {
    if (machine.ratings.footprint === "small") {
      spaceScore = 100;
      pros.push("Diseño compacto ideal para cocinas pequeñas.");
    } else if (machine.ratings.footprint === "medium") {
      spaceScore = 70;
      cons.push("Ocupa más espacio del ideal para encimera compacta.");
    } else {
      spaceScore = 40;
      cons.push("Demasiado voluminosa para espacio compacto.");
    }
    if (grinder && grinder.performance.footprint !== "small") {
      spaceScore = Math.max(0, spaceScore - 10);
      cons.push("Molinillo añade huella en encimera.");
    }
  }

  // maintenance — low/medium/high distinguen (no solo low)
  if (prefs.maintenanceTolerance === "low") {
    maintenanceScore = machine.ratings.cleaningEase * 20;
    if (machine.ratings.cleaningEase < 3) cons.push("Requiere rutinas de limpieza más exigentes.");
    else pros.push("Mantenimiento y limpieza diarios sencillos.");
    if (grinder && grinder.performance.retention < 3) {
      maintenanceScore = Math.max(0, maintenanceScore - 10);
      cons.push("Molinillo con retención alta complica limpieza.");
    }
  } else if (prefs.maintenanceTolerance === "medium") {
    maintenanceScore = Math.round(60 + machine.ratings.cleaningEase * 8); // 68-100
    if (machine.ratings.cleaningEase <= 2) cons.push("Limpieza algo exigente para tolerancia media.");
    else if (machine.ratings.cleaningEase >= 4) pros.push("Limpieza razonable para uso medio.");
  } else {
    // high tolerance — aún así distingue, pero penaliza poco
    maintenanceScore = Math.round(80 + machine.ratings.cleaningEase * 4); // 84-100
    if (machine.ratings.cleaningEase >= 4) pros.push("Fácil de mantener incluso con uso intensivo.");
  }

  // milk — low/medium/high distinguen
  if (prefs.milkImportance === "high") {
    if (machine.specs.steamSystem === "automatic" || machine.specs.boilerType === "dual_boiler") {
      milkScore = 100;
      pros.push("Excelente potencia de vaporización de leche.");
    } else if (machine.specs.boilerType === "thermoblock") {
      milkScore = 75;
      cons.push("Vapor adecuado pero sin doble caldera.");
    } else {
      milkScore = 50;
      cons.push("Espera térmica necesaria entre café y vapor.");
    }
  } else if (prefs.milkImportance === "medium") {
    if (machine.specs.steamSystem === "automatic" || machine.specs.boilerType === "dual_boiler") {
      milkScore = 90;
      pros.push("Buena capacidad de leche para uso medio.");
    } else if (machine.specs.boilerType === "thermoblock") {
      milkScore = 75;
    } else if (machine.specs.boilerType === "heat_exchanger") {
      milkScore = 80;
    } else {
      milkScore = 60;
      cons.push("Vapor correcto pero no prioritario para tu uso medio.");
    }
  } else {
    // low — no penaliza, pero deja 100 para no distorsionar, salvo single_boiler sin auto
    milkScore = 100;
  }

  const dailyScore = getDailyScore(machine, prefs, pros, cons);
  const grinderScore = getGrinderScore(grinder, machine, prefs);

  // P1 ponderación: daily 5% base, sube a 13% en alta demanda 6+ (P3,P5) para desplazar termobloque pequeño
  // + hard penalty depósito <1.8L ya aplicado en getDailyScore
  // For 6+ daily cups, shift 5-7 pp from workflow/space toward daily capacity because throughput
  // becomes a primary fit criterion. Protect with test: daily weight 13% vs 5%.
  const isHighDaily = prefs.dailyCups === "6+";
  const wBudget = isHighDaily ? 0.32 : 0.35;
  const wExp = isHighDaily ? 0.18 : 0.20;
  const wSpace = isHighDaily ? 0.12 : 0.15;
  const wDaily = isHighDaily ? 0.13 : 0.05;
  const wMaint = 0.10;
  const wMilk = 0.10;
  const wGrinder = 0.05;
  const finalScore = Math.round(
    budgetScore * wBudget +
      experienceScore * wExp +
      spaceScore * wSpace +
      maintenanceScore * wMaint +
      milkScore * wMilk +
      dailyScore * wDaily +
      grinderScore * wGrinder
  );

  const cappedFinal = Math.round(Math.max(0, Math.min(100, finalScore)));
  return {
    setup: {
      id: `${machine.slug}_${grinder?.slug ?? "integrated"}`,
      machine,
      grinder,
      isIntegrated: machine.grinderIntegrated,
      estimatedTotalEUR: totalCost,
    },
    score: {
      totalScore: cappedFinal,
      breakdown: {
        hardRequirementsPassed: true,
        budgetMatch: Math.round(budgetScore),
        experienceMatch: Math.round(experienceScore),
        dailyMatch: Math.round(dailyScore),
        spaceMatch: Math.round(spaceScore),
        maintenanceMatch: Math.round(maintenanceScore),
        milkMatch: Math.round(milkScore),
        grinderMatch: Math.round(grinderScore),
      },
      pros,
      cons,
      rationale: `Setup configurado para tu perfil de ${prefs.workflowPreference} con un encaje global del ${cappedFinal}%.`,
    },
  };
}
