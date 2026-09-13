"use client";
import { useState } from "react";
import { UserPreferences, EvaluatedSetup } from "@/types/coffee";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";
import { passesHardFilters, calculateSetupScore } from "@/engine/compatibility";
import { SetupDisplay } from "@/components/ui/SetupDisplay";
import { track } from "@/lib/analytics";
export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    drinkTypes: ["espresso"], budgetMaxEUR: 600, workflowPreference: "balanced", dailyCups: "3-5", milkImportance: "medium", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent",
  });
  const [result, setResult] = useState<EvaluatedSetup | null>(null);
  const handleComplete = (finalPrefs: UserPreferences) => {
    track("quiz_completed", finalPrefs as unknown as Record<string, unknown>);
    const candidates: EvaluatedSetup[] = [];
    for (const m of MACHINES_SEED) {
      if (m.grinderIntegrated) { if (passesHardFilters(m, undefined, finalPrefs)) candidates.push(calculateSetupScore(m, undefined, finalPrefs)); }
      else { for (const g of GRINDERS_SEED) { if (passesHardFilters(m, g, finalPrefs)) candidates.push(calculateSetupScore(m, g, finalPrefs)); } }
    }
    candidates.sort((a,b)=> b.score.totalScore - a.score.totalScore);
    setResult(candidates[0] ?? null); setStep(9); track("result_viewed", { score: candidates[0]?.score.totalScore });
  };
  if (step===9 && result) return <main className="min-h-screen bg-neutral-950 py-12 px-4"><div className="max-w-3xl mx-auto"><SetupDisplay evaluated={result} /><button onClick={()=>{setStep(1); setResult(null);}} className="mt-6 w-full py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold">Rehacer test</button></div></main>;
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Paso {step} de 8</span>
            <div className="w-1/3 bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full transition-all" style={{width:`${(step/8)*100}%`}}/></div>
          </div>
          {step===1 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Cómo disfrutas el café?</h2><div className="grid gap-2">{[["espresso","Solo Espresso"],["milk_drink","Espresso + leche"],["black_coffee","Café largo"]].map(([v,l])=> <button key={v} onClick={()=>{setPrefs({...prefs, drinkTypes:[v as never]}); setStep(2);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500 text-left">{l}</button>)}</div></div>
          )}
          {step===2 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">Presupuesto máximo (máquina+molinillo)</h2><div className="text-4xl font-mono text-emerald-400 text-center">{prefs.budgetMaxEUR} €</div><input type="range" min={250} max={1500} step={50} value={prefs.budgetMaxEUR} onChange={e=> setPrefs({...prefs, budgetMaxEUR:Number(e.target.value)})} className="w-full accent-emerald-500"/><button onClick={()=> setStep(3)} className="w-full py-3 bg-emerald-600 rounded-xl font-bold">Continuar</button></div>
          )}
          {step===3 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Cuánto quieres involucrarte?</h2><div className="grid gap-2">{[["convenience","Comodidad total"],["balanced","Equilibrio guiado"],["manual_craft","Control manual"]].map(([v,l])=> <button key={v} onClick={()=>{setPrefs({...prefs, workflowPreference:v as never}); setStep(4);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500 text-left">{l}</button>)}</div></div>
          )}
          {step===4 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Cuántas tazas al día?</h2><div className="grid gap-2">{[["1-2","1-2"],["3-5","3-5"],["6+","6+"]].map(([v,l])=> <button key={v} onClick={()=>{setPrefs({...prefs, dailyCups:v as never}); setStep(5);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500 text-center font-bold">{l}</button>)}</div></div>
          )}
          {step===5 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Importancia de la leche?</h2><div className="grid gap-2">{[["low","Baja"],["medium","Media"],["high","Alta"]].map(([v,l])=> <button key={v} onClick={()=>{setPrefs({...prefs, milkImportance:v as never}); setStep(6);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500 text-center font-bold">{l}</button>)}</div></div>
          )}
          {step===6 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Tolerancia a limpieza?</h2><div className="grid gap-2">{[["low","Mínima"],["medium","Moderada"],["high","Sin preferencia"]].map(([v,l])=> <button key={v} onClick={()=>{setPrefs({...prefs, maintenanceTolerance:v as never}); setStep(7);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500 text-center font-bold">{l}</button>)}</div></div>
          )}
          {step===7 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Espacio limitado?</h2><div className="grid gap-2"><button onClick={()=>{setPrefs({...prefs, spaceConstraint:true}); setStep(8);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500">Sí, compacto</button><button onClick={()=>{setPrefs({...prefs, spaceConstraint:false}); setStep(8);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500">No, tengo espacio</button></div></div>
          )}
          {step===8 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Molinillo integrado?</h2><div className="grid gap-2">{[["yes","Todo en uno"],["separated","Separado"],["indifferent","Indiferente"]].map(([v,l])=> <button key={v} onClick={()=>{ const up={...prefs, integratedGrinderPreference:v as never} as UserPreferences; setPrefs(up); handleComplete(up);}} className="p-4 border border-neutral-800 rounded-xl hover:border-emerald-500 text-left font-bold">{l}</button>)}</div></div>
          )}
        </div>
      </div>
    </main>
  );
}
