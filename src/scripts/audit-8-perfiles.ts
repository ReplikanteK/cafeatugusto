import { MACHINES_SEED } from "../data/machines";
import { GRINDERS_SEED } from "../data/grinders";
import { passesHardFilters, calculateSetupScore } from "../engine/compatibility";
import { isRecommendableSetup, CATALOG_POLICY } from "../lib/eligibility";
import { UserPreferences } from "../types/coffee";

type Profile = { id: string; name: string; prefs: UserPreferences; descripcion: string };

const profiles: Profile[] = [
  {
    id: "P1",
    name: "Principiante — Presupuesto limitado, comodidad",
    descripcion: "Presupuesto muy ajustado, pocos cafés, prioriza facilidad y bajo mantenimiento. Test FAIL si devuelve prosumer manual 15min calentamiento.",
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
  },
  {
    id: "P2",
    name: "Barista entusiasta — Control total",
    descripcion: "Manual_craft, PID + 58mm + stepless, molinillo separado. Juicio clave: ¿Silvia 58 sin PID vs Bambino PID 54mm cuál prevalece?",
    prefs: {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 900,
      workflowPreference: "manual_craft",
      dailyCups: "1-2",
      milkImportance: "low",
      maintenanceTolerance: "high",
      spaceConstraint: false,
      integratedGrinderPreference: "separated",
    },
  },
  {
    id: "P3",
    name: "Leche — Cappuccino/latte alto vapor",
    descripcion: "Uso leche HIGH, 3-5 cafés, workflow convenience/balanced. FAIL si single_boiler lento sin vapor auto.",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 800,
      workflowPreference: "convenience",
      dailyCups: "3-5",
      milkImportance: "high",
      maintenanceTolerance: "low",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    },
  },
  {
    id: "P4",
    name: "Poco espacio — Encimera limitada",
    descripcion: "Space true, huella pequeña exigida. FAIL si máquina grande + grinder grande.",
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
  },
  {
    id: "P5",
    name: "Mucho consumo — 6+ diarios",
    descripcion: "Alta demanda 6+, daily 13% + penalización depósito <1.8L. FAIL si termobloque pequeño personal.",
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
  },
  {
    id: "P6",
    name: "Mantenimiento mínimo — Comodidad total",
    descripcion: "Convenience, maint low, 3-5 cafés. FAIL si devuelve máquina manual con limpieza alta 91/100.",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 600,
      workflowPreference: "convenience",
      dailyCups: "3-5",
      milkImportance: "medium",
      maintenanceTolerance: "low",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    },
  },
  {
    id: "P7",
    name: "Equilibrado — Sin extremos",
    descripcion: "Ninguna preferencia extrema, presupuesto medio. Debe devolver setup medio solvente, no extremo.",
    prefs: {
      drinkTypes: ["espresso", "milk_drink"],
      budgetMaxEUR: 600,
      workflowPreference: "balanced",
      dailyCups: "3-5",
      milkImportance: "medium",
      maintenanceTolerance: "medium",
      spaceConstraint: false,
      integratedGrinderPreference: "indifferent",
    },
  },
  {
    id: "P8",
    name: "Presupuesto alto — Maximizar prestaciones",
    descripcion: "Budget 1500€, sin restricción económica. Debe priorizar dual/HX + flat grande + baja retención, no presupuesto.",
    prefs: {
      drinkTypes: ["espresso"],
      budgetMaxEUR: 1500,
      workflowPreference: "manual_craft",
      dailyCups: "3-5",
      milkImportance: "low",
      maintenanceTolerance: "high",
      spaceConstraint: false,
      integratedGrinderPreference: "separated",
    },
  },
];

function fmt(c: ReturnType<typeof calculateSetupScore> | undefined) {
  if (!c) return "— sin candidatos";
  const b = c.score.breakdown;
  return `${c.setup.machine.brand} ${c.setup.machine.model} ${c.setup.machine.specs.portafilterDiameter ? `(${c.setup.machine.specs.portafilterDiameter}mm${c.setup.machine.specs.pid ? "+PID" : ""})` : ""} + ${c.setup.grinder ? `${c.setup.grinder.brand} ${c.setup.grinder.model} (${c.setup.grinder.specs.grindAdjustment})` : "integrado"} | ${c.setup.estimatedTotalEUR}€ | Score ${c.score.totalScore} [P${b.budgetMatch} W${b.experienceMatch} E${b.spaceMatch} Mnt${b.maintenanceMatch} L${b.milkMatch} D${b.dailyMatch} G${b.grinderMatch}]`;
}

function audit() {
  // Sin --strict: QA del MOTOR (compatibilidad/scoring) en modo permisivo.
  // Con --strict: QA del CTR (puerta comercial estricta) — P2 vacío aquí es
  // señal de cobertura humana, no bug del motor.
  const POLICY = process.argv.includes("--strict")
    ? CATALOG_POLICY
    : { requireHumanVerification: false } as const;
  console.log("# QA 8 Perfiles Humanos — Café A Tu Gusto\n");
  console.log(`Política: requireHumanVerification=${String(POLICY.requireHumanVerification)}`);
  for (const p of profiles) {
    const candidates: ReturnType<typeof calculateSetupScore>[] = [];
    for (const m of MACHINES_SEED) {
      if (m.grinderIntegrated) {
        if (isRecommendableSetup(m, undefined, POLICY) && passesHardFilters(m, undefined, p.prefs)) candidates.push(calculateSetupScore(m, undefined, p.prefs));
      } else {
        for (const g of GRINDERS_SEED) {
          if (isRecommendableSetup(m, g, POLICY) && passesHardFilters(m, g, p.prefs)) candidates.push(calculateSetupScore(m, g, p.prefs));
        }
      }
    }
    candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    const top3 = candidates.slice(0, 3);
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`PERFIL ${p.id} — ${p.name}`);
    console.log(`Entrada: budget ${p.prefs.budgetMaxEUR}€ | workflow ${p.prefs.workflowPreference} | daily ${p.prefs.dailyCups} | milk ${p.prefs.milkImportance} | maint ${p.prefs.maintenanceTolerance} | space ${p.prefs.spaceConstraint ? "compacto" : "normal"} | grinder ${p.prefs.integratedGrinderPreference}`);
    console.log(`Nota: ${p.descripcion}`);
    console.log(`Candidatos: ${candidates.length}`);
    console.log(`\nTOP 3`);
    top3.forEach((c, i) => {
      console.log(`${i + 1}. ${fmt(c)}`);
      console.log(`   pros: ${c.score.pros.slice(0, 2).join(" | ")}`);
      if (c.score.cons.length) console.log(`   cons: ${c.score.cons.slice(0, 1).join(" | ")}`);
      console.log(`   DESGLOSE  P${c.score.breakdown.budgetMatch} W${c.score.breakdown.experienceMatch} E${c.score.breakdown.spaceMatch} Mnt${c.score.breakdown.maintenanceMatch} L${c.score.breakdown.milkMatch} D${c.score.breakdown.dailyMatch} G${c.score.breakdown.grinderMatch}  → ${c.score.totalScore}/100`);
    });
    if (!top3.length) console.log(`❌ Sin Top3`);
    const top1 = top3[0];
    if (top1) {
      let juicio = "⚠️ Revisar humano";
      let fail = "";
      // FAILs automáticos detectables
      if (p.id === "P1" && top1.setup.machine.ratings.learningCurve >= 4) fail = "FAIL: novato con curva alta";
      if (p.id === "P3" && top1.setup.machine.specs.steamSystem !== "automatic" && top1.setup.machine.specs.boilerType !== "dual_boiler" && top1.setup.machine.specs.boilerType !== "heat_exchanger" && top1.score.breakdown.milkMatch < 75) fail = "FAIL: leche alta sin vapor potente";
      if (p.id === "P4" && top1.setup.machine.ratings.footprint !== "small") fail = "FAIL: espacio exigido pero máquina no compacta";
      if (p.id === "P5" && top1.setup.machine.specs.waterTankCapacityLiters < 1.8) fail = "FAIL: 6+ con depósito <1.8L";
      if (p.id === "P6" && top1.setup.machine.ratings.cleaningEase <= 2) fail = "FAIL: maint low con limpieza exigente";
      if (p.id === "P6" && top1.setup.machine.ratings.learningCurve >= 4) fail = "FAIL: comodidad total devuelve prosumer compleja";
      if (fail) juicio = `❌ ${fail}`;
      else {
        // sensatos
        if (p.id === "P1" && top1.setup.machine.ratings.learningCurve <= 2) juicio = "✅ Sensato — curva baja para novato";
        else if (p.id === "P2" && top1.setup.machine.specs.portafilterDiameter === 58) juicio = "✅ Sensato — 58mm para entusiasta (vs PID, revisar humano)";
        else if (p.id === "P4" && top1.setup.machine.ratings.footprint === "small") juicio = "✅ Sensato — compacta";
        else if (p.id === "P7") juicio = "✅/⚠️ Equilibrado — revisar que no sea extremo";
        else if (p.id === "P8" && top1.setup.machine.priceApproxEUR > 800) juicio = "✅ Sensato — presupuesto alto usa gama alta";
      }
      console.log(`\nJUICIO AUTO: ${juicio}`);
      console.log(`Rationale: ${top1.score.rationale}`);
      // alerta compresión
      const spread = Math.max(...top3.map(t => t.score.totalScore)) - Math.min(...top3.map(t => t.score.totalScore));
      const avgTop = Math.round(top3.reduce((s, t) => s + t.score.totalScore, 0) / top3.length);
      if (avgTop >= 94) console.log(`⚠️ Alerta compresión: Top3 avg ${avgTop} (94-99 sugiere scoring plano — revisar dims default 100)`);
      if (spread <= 3) console.log(`⚠️ Spread Top3 ≤3pts (${spread}) — poca discriminación`);
    }
    console.log(`\n¿Tiene sentido para aficionado real? — decidir humano ✅/⚠️/❌`);
  }
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

audit();
