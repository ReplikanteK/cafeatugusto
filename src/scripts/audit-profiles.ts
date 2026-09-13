import { MACHINES_SEED } from "../data/machines";
import { GRINDERS_SEED } from "../data/grinders";
import { passesHardFilters, calculateSetupScore } from "../engine/compatibility";
import { UserPreferences } from "../types/coffee";

type Profile = { id: string; name: string; prefs: UserPreferences; expected: string };

const profiles: Profile[] = [
  {
    id: "P1",
    name: "El Novato Práctico (Presupuesto Ajustado)",
    prefs: {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 350,
      workflowPreference: "convenience",
      dailyCups: "1-2",
      milkImportance: "low",
      maintenanceTolerance: "low",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    },
    expected: "Compacta, encendido rápido, bajo mantenimiento. Penaliza manual complejo.",
  },
  {
    id: "P2",
    name: "El Aspirante a Barista (Presupuesto Medio)",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 700,
      workflowPreference: "manual_craft",
      dailyCups: "3-5",
      milkImportance: "medium",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "separated",
    },
    expected: "Prioriza PID + 58mm + stepless real. Supera superautomáticas.",
  },
  {
    id: "P3",
    name: "El Amante del Latte Art (Familia / Alta Leche)",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 1000,
      workflowPreference: "balanced",
      dailyCups: "6+",
      milkImportance: "high",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    },
    expected: "Doble caldera/HX o vapor potente. Monocaldera lento penalizado en milkScore.",
  },
  {
    id: "P4",
    name: "El Purista Single-Dose (Geek Técnico)",
    prefs: {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 1200,
      workflowPreference: "manual_craft",
      dailyCups: "1-2",
      milkImportance: "low",
      maintenanceTolerance: "high",
      spaceConstraint: false,
      integratedGrinderPreference: "separated",
    },
    expected: "Máx para single-dose flat/retención baja + PID/preinfusión. Leche irrelevante.",
  },
  {
    id: "P5",
    name: "Uso Intensivo Oficina / Hogar Numeroso",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 850,
      workflowPreference: "balanced",
      dailyCups: "6+",
      milkImportance: "medium",
      maintenanceTolerance: "low",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    },
    expected: "Penaliza depósito pequeño/termobloque personal. Premia capacidad y ciclo rápido.",
  },
  {
    id: "P6",
    name: "Espacio Muy Limitado (Piso Pequeño)",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 600,
      workflowPreference: "balanced",
      dailyCups: "1-2",
      milkImportance: "medium",
      maintenanceTolerance: "medium",
      spaceConstraint: true,
      integratedGrinderPreference: "indifferent",
    },
    expected: "Huella reducida/integrada compacta. Penaliza máquina ancha + molinillo voluminoso.",
  },
  {
    id: "P7",
    name: "Presupuesto Desbalanceado (Máquina cara + molinillo barato)",
    prefs: {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 600,
      workflowPreference: "manual_craft",
      dailyCups: "3-5",
      milkImportance: "low",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "separated",
    },
    expected: "Rechaza/penaliza grinder no espressoCapable; propone combo equilibrado 50/50 no máquina cara sola.",
  },
];

function audit() {
  for (const p of profiles) {
    const candidates: ReturnType<typeof calculateSetupScore>[] = [];
    for (const m of MACHINES_SEED) {
      if (m.grinderIntegrated) {
        if (passesHardFilters(m, undefined, p.prefs)) candidates.push(calculateSetupScore(m, undefined, p.prefs));
      } else {
        for (const g of GRINDERS_SEED) {
          if (passesHardFilters(m, g, p.prefs)) candidates.push(calculateSetupScore(m, g, p.prefs));
        }
      }
    }
    candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    const top1 = candidates[0];
    const top2 = candidates[1];
    const top3 = candidates[2];

    // Cálculo auxiliar para desglose
    const fmt = (c: ReturnType<typeof calculateSetupScore> | undefined) => {
      if (!c) return "— sin candidatos (hard filter bloquea todo)";
      const b = c.score.breakdown;
      // daily y grinder no están en breakdown, los recalculamos aproximados vía total vs suma
      const dailyApprox = Math.round(c.score.totalScore - (b.budgetMatch * 0.35 + b.experienceMatch * 0.2 + b.spaceMatch * 0.15 + b.maintenanceMatch * 0.1 + b.milkMatch * 0.1 + 0 * 0.05) / 0.05) as any;
      return `${c.setup.machine.brand} ${c.setup.machine.model} ${c.setup.machine.specs.portafilterDiameter ? `(${c.setup.machine.specs.portafilterDiameter}mm${c.setup.machine.specs.pid ? "+PID" : ""})` : ""} + ${
        c.setup.grinder ? `${c.setup.grinder.brand} ${c.setup.grinder.model} (${c.setup.grinder.specs.grindAdjustment}, ${c.setup.grinder.specs.burrType} ${c.setup.grinder.specs.burrSizeMM}mm)` : "integrado"
      } | ${c.setup.estimatedTotalEUR}€ | Score ${c.score.totalScore} | exp ${b.experienceMatch} milk ${b.milkMatch} maint ${b.maintenanceMatch} budget ${b.budgetMatch} space ${b.spaceMatch}`;
    };

    console.log(`\n=== ${p.id}: ${p.name} ===`);
    console.log(`Prefs: budget ${p.prefs.budgetMaxEUR}€ workflow ${p.prefs.workflowPreference} daily ${p.prefs.dailyCups} milk ${p.prefs.milkImportance} maint ${p.prefs.maintenanceTolerance} space ${p.prefs.spaceConstraint ? "compacto" : "libre"} integrated ${p.prefs.integratedGrinderPreference}`);
    console.log(`Esperado: ${p.expected}`);
    console.log(`Candidatos totales: ${candidates.length} / ${MACHINES_SEED.length * GRINDERS_SEED.length + MACHINES_SEED.filter(m=>m.grinderIntegrated).length}`);
    console.log(`→ Top1: ${fmt(top1)}`);
    if (top1) console.log(`   pros: ${top1.score.pros.slice(0,3).join(" | ")} || cons: ${top1.score.cons.slice(0,2).join(" | ")}`);
    console.log(`→ Top2: ${fmt(top2)}`);
    if (top2) console.log(`   pros: ${top2.score.pros.slice(0,3).join(" | ")}`);
    if (top3) console.log(`→ Top3: ${fmt(top3)}`);
    // Juicio crítico automático básico
    if (!top1) {
      console.log(`Juicio: ❌ Sin recomendación — revisar hard filters (presupuesto muy bajo o black_coffee bloqueado)`);
    } else {
      const isManual = p.prefs.workflowPreference === "manual_craft";
      const topIsManualFriendly = top1.setup.machine.specs.pid && top1.setup.machine.specs.portafilterDiameter === 58;
      const topIsConvenience = top1.setup.machine.ratings.easeOfUse >= 4 && top1.setup.machine.ratings.learningCurve <= 2;
      let juicio = "";
      if (p.id === "P1" && top1.setup.machine.ratings.learningCurve <= 2 && top1.score.breakdown.experienceMatch >= 80) juicio = "✅ Sensato — curva baja para novato";
      else if (p.id === "P2" && topIsManualFriendly) juicio = "✅ Sensato — PID+58 para aspirante manual";
      else if (p.id === "P3" && top1.setup.machine.specs.boilerType === "dual_boiler" || top1.setup.machine.specs.boilerType === "heat_exchanger") juicio = "✅ Sensato — doble/HX para leche alta";
      else if (p.id === "P4" && top1.setup.grinder?.specs.grindAdjustment === "stepless") juicio = "✅ Sensato — stepless para purista";
      else if (p.id === "P6" && top1.setup.machine.ratings.footprint === "small" && (top1.setup.grinder ? top1.setup.grinder.performance.footprint === "small" : true)) juicio = "✅ Sensato — huella pequeña";
      else if (p.id === "P7" && top1.setup.estimatedTotalEUR <= p.prefs.budgetMaxEUR * 1.1 && top1.setup.grinder?.specs.espressoCapable) juicio = "✅ Sensato — combo equilibrado, grinder espresso OK";
      else juicio = "⚠️ Revisar — no cumple expectativa automática, requiere juicio humano";
      console.log(`Juicio crítico auto: ${juicio}`);
      console.log(`Rationale: ${top1.score.rationale}`);
    }
  }
}

audit();
