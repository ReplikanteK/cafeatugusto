"use client";
import { useState } from "react";
import { UserPreferences, EvaluatedSetup } from "@/types/coffee";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";
import { passesHardFilters, calculateSetupScore } from "@/engine/compatibility";
import { SetupSignature } from "@/components/ui/SetupSignature";
import { track } from "@/lib/analytics";
function OptionCard({ title, desc, badge, onClick }: { title: string; desc: string; badge?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-4 border border-stone-800 rounded-xl text-left hover:border-amber-500/40 bg-stone-900/50 flex flex-col gap-1 transition-all w-full">
      <div className="flex justify-between items-start gap-2">
        <span className="font-bold text-white">{title}</span>
        {badge && <span className="text-[10px] font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <span className="text-xs text-stone-400 leading-relaxed">{desc}</span>
    </button>
  );
}
export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    drinkTypes: ["espresso"],
    budgetMaxEUR: 600,
    workflowPreference: "balanced",
    dailyCups: "3-5",
    milkImportance: "medium",
    maintenanceTolerance: "medium",
    spaceConstraint: false,
    integratedGrinderPreference: "indifferent",
  });
  const [result, setResult] = useState<EvaluatedSetup | null>(null);
  const [finalPrefs, setFinalPrefs] = useState<UserPreferences | null>(null);
  const handleComplete = (fp: UserPreferences) => {
    track("quiz_completed", fp as unknown as Record<string, unknown>);
    const candidates: EvaluatedSetup[] = [];
    for (const m of MACHINES_SEED) {
      if (m.grinderIntegrated) {
        if (passesHardFilters(m, undefined, fp)) candidates.push(calculateSetupScore(m, undefined, fp));
      } else {
        for (const g of GRINDERS_SEED) {
          if (passesHardFilters(m, g, fp)) candidates.push(calculateSetupScore(m, g, fp));
        }
      }
    }
    candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    setResult(candidates[0] ?? null);
    setFinalPrefs(fp);
    setStep(9);
    track("result_viewed", { score: candidates[0]?.score.totalScore });
  };
  if (step === 9 && result && finalPrefs) {
    return (
      <main className="min-h-screen bg-stone-950 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <SetupSignature evaluated={result} prefs={finalPrefs} />
          <button onClick={() => { setStep(1); setResult(null); }} className="mt-6 w-full py-3 bg-stone-900 border border-stone-800 rounded-xl text-white font-bold hover:bg-stone-800">
            Rehacer test
          </button>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Paso {step} de 8</span>
            <div className="w-1/3 bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all" style={{ width: `${(step / 8) * 100}%` }} />
            </div>
          </div>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">¿Cómo disfrutas el café habitualmente?</h2>
              <div className="grid gap-3">
                <OptionCard title="Solo Espresso" desc="Extractos cortos y densos. Prioridad a la estabilidad térmica." badge="Purista" onClick={() => { setPrefs({ ...prefs, drinkTypes: ["espresso"] }); setStep(2); }} />
                <OptionCard title="Espresso con Leche" desc="Cappuccinos, Lattes o Flat Whites regulares." badge="Equilibrio" onClick={() => { setPrefs({ ...prefs, drinkTypes: ["espresso", "milk_drink"] }); setStep(2); }} />
                <OptionCard title="Cafés Largos / Filtro" desc="Bebidas de mayor volumen o extracción suave." badge="Alquimista" onClick={() => { setPrefs({ ...prefs, drinkTypes: ["black_coffee"] }); setStep(2); }} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Presupuesto Máximo Ajustado</h2>
              <div className="text-4xl font-mono text-amber-400 text-center py-4">{prefs.budgetMaxEUR} €</div>
              <input type="range" min={250} max={1500} step={50} value={prefs.budgetMaxEUR} onChange={e => setPrefs({ ...prefs, budgetMaxEUR: Number(e.target.value) })} className="w-full accent-amber-500" />
              <button onClick={() => setStep(3)} className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-black mt-4">Continuar</button>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Nivel de Control Deseado</h2>
              <div className="grid gap-3">
                <OptionCard title="Comodidad Rápida" desc="Extracción directa con mínimo ajuste." badge="Eficiencia" onClick={() => { setPrefs({ ...prefs, workflowPreference: "convenience" }); setStep(4); }} />
                <OptionCard title="Equilibrio Manual" desc="Ajuste de molienda y prensado estándar." badge="Craft" onClick={() => { setPrefs({ ...prefs, workflowPreference: "balanced" }); setStep(4); }} />
                <OptionCard title="Control Profesional" desc="Control manual de flujo, temperatura y recetas." badge="Precisionista" onClick={() => { setPrefs({ ...prefs, workflowPreference: "manual_craft" }); setStep(4); }} />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">¿Cuántas tazas preparas al día?</h2>
              <div className="grid gap-3">
                <OptionCard title="1–2 tazas" desc="Consumo individual o en pareja." onClick={() => { setPrefs({ ...prefs, dailyCups: "1-2" }); setStep(5); }} />
                <OptionCard title="3–5 tazas" desc="Uso constante durante el día." onClick={() => { setPrefs({ ...prefs, dailyCups: "3-5" }); setStep(5); }} />
                <OptionCard title="6+ tazas" desc="Uso intensivo o reuniones." onClick={() => { setPrefs({ ...prefs, dailyCups: "6+" }); setStep(5); }} />
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Importancia del Vapor / Leche</h2>
              <div className="grid gap-3">
                <OptionCard title="Ocasional / Baja" desc="Uso esporádico del vaporizador." onClick={() => { setPrefs({ ...prefs, milkImportance: "low" }); setStep(6); }} />
                <OptionCard title="Media" desc="Preparación de bebidas con leche varios días a la semana." onClick={() => { setPrefs({ ...prefs, milkImportance: "medium" }); setStep(6); }} />
                <OptionCard title="Alta" desc="Uso diario con exigencia de microespuma para Latte Art." badge="Latte" onClick={() => { setPrefs({ ...prefs, milkImportance: "high" }); setStep(6); }} />
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Tolerancia de Mantenimiento</h2>
              <div className="grid gap-3">
                <OptionCard title="Mínima" desc="Prefiero descalcificación automática y procesos simples." onClick={() => { setPrefs({ ...prefs, maintenanceTolerance: "low" }); setStep(7); }} />
                <OptionCard title="Estándar" desc="Limpieza habitual de portafiltros y lanza de vapor." onClick={() => { setPrefs({ ...prefs, maintenanceTolerance: "medium" }); setStep(7); }} />
                <OptionCard title="Alta" desc="Mantenimiento minucioso de calderas y grupos prosumer." onClick={() => { setPrefs({ ...prefs, maintenanceTolerance: "high" }); setStep(7); }} />
              </div>
            </div>
          )}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Restricciones de Espacio</h2>
              <div className="grid gap-3">
                <OptionCard title="Espacio Compacto" desc="Encimera ajustada (ancho < 20cm)." onClick={() => { setPrefs({ ...prefs, spaceConstraint: true }); setStep(8); }} />
                <OptionCard title="Sin Restricción" desc="Espacio amplio para máquina y molinillo independiente." onClick={() => { setPrefs({ ...prefs, spaceConstraint: false }); setStep(8); }} />
              </div>
            </div>
          )}
          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Preferencia de Molinillo</h2>
              <div className="grid gap-3">
                <OptionCard title="Molinillo Integrado" desc="Todo en un solo cuerpo." onClick={() => {
                  const final = { ...prefs, integratedGrinderPreference: "yes" } as UserPreferences;
                  handleComplete(final);
                }} />
                <OptionCard title="Molinillo Independiente" desc="Mayor modularidad y facilidad de actualización." onClick={() => {
                  const final = { ...prefs, integratedGrinderPreference: "separated" } as UserPreferences;
                  handleComplete(final);
                }} />
                <OptionCard title="Indiferente" desc="La mejor combinación técnica dentro de mi presupuesto." onClick={() => {
                  const final = { ...prefs, integratedGrinderPreference: "indifferent" } as UserPreferences;
                  handleComplete(final);
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
