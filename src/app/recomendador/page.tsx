"use client";
import { useState } from "react";
import { UserPreferences, EvaluatedSetup } from "@/types/coffee";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";
import { passesHardFilters, calculateSetupScore } from "@/engine/compatibility";
import { SetupSignature } from "@/components/ui/SetupSignature";
import { track } from "@/lib/analytics";
function OptionCard({ title, desc, badge, onClick }: { title:string; desc:string; badge?:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} className="p-4 border border-stone-800 rounded-xl text-left hover:border-amber-500/40 bg-stone-900/50 flex flex-col gap-1 transition-all">
      <div className="flex justify-between items-start gap-2"><span className="font-bold text-white">{title}</span>{badge && <span className="text-[10px] font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full">{badge}</span>}</div>
      <span className="text-xs text-stone-400 leading-relaxed">{desc}</span>
    </button>
  );
}
export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    drinkTypes: ["espresso"], budgetMaxEUR: 600, workflowPreference: "balanced", dailyCups: "3-5", milkImportance: "medium", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent",
  });
  const [result, setResult] = useState<EvaluatedSetup | null>(null);
  const [finalPrefs, setFinalPrefs] = useState<UserPreferences | null>(null);
  const handleComplete = (fp: UserPreferences) => {
    track("quiz_completed", fp as unknown as Record<string, unknown>);
    const candidates: EvaluatedSetup[] = [];
    for (const m of MACHINES_SEED) {
      if (m.grinderIntegrated) { if (passesHardFilters(m, undefined, fp)) candidates.push(calculateSetupScore(m, undefined, fp)); }
      else { for (const g of GRINDERS_SEED) { if (passesHardFilters(m, g, fp)) candidates.push(calculateSetupScore(m, g, fp)); } }
    }
    candidates.sort((a,b)=> b.score.totalScore - a.score.totalScore);
    setResult(candidates[0] ?? null); setFinalPrefs(fp); setStep(9); track("result_viewed", { score: candidates[0]?.score.totalScore });
  };
  if (step===9 && result && finalPrefs) return <main className="min-h-screen bg-stone-950 py-12 px-4"><div className="max-w-3xl mx-auto"><SetupSignature evaluated={result} prefs={finalPrefs} /><button onClick={()=>{setStep(1); setResult(null);}} className="mt-6 w-full py-3 bg-stone-900 border border-stone-800 rounded-xl text-white font-bold">Rehacer test — nuevo ritual</button></div></main>;
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Paso {step} de 8 — Ritual</span>
            <div className="w-1/3 bg-stone-800 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full transition-all" style={{width:`${(step/8)*100}%`}}/></div>
          </div>
          {step===1 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Cómo disfrutas el café?</h2><p className="text-xs text-stone-400">Presión y térmica adaptadas a tu arquetipo.</p><div className="grid gap-3">
              <OptionCard title="Solo Espresso" desc="Tiro corto, crema densa. PID quirúrgico — The Precisionist." badge="Purista" onClick={()=>{setPrefs({...prefs, drinkTypes:["espresso"]}); setStep(2);}} />
              <OptionCard title="Espresso + leche" desc="Cappuccino diario. Thermoblock 3s — The Efficiencist." badge="Equilibrio" onClick={()=>{setPrefs({...prefs, drinkTypes:["espresso","milk_drink"]}); setStep(2);}} />
              <OptionCard title="Café largo" desc="Volumen largo, origen floral — The Alchemist." badge="Alquimista" onClick={()=>{setPrefs({...prefs, drinkTypes:["black_coffee"]}); setStep(2);}} />
            </div></div>
          )}
          {step===2 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">Presupuesto — tu inversión ritual</h2><div className="text-4xl font-mono text-amber-400 text-center">{prefs.budgetMaxEUR} €</div><input type="range" min={250} max={1500} step={50} value={prefs.budgetMaxEUR} onChange={e=> setPrefs({...prefs, budgetMaxEUR:Number(e.target.value)})} className="w-full accent-amber-500"/><p className="text-[11px] text-stone-500 text-center">Eco obsidian • Mid bronce • Prosumer oro</p><button onClick={()=> setStep(3)} className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-black">Continuar</button></div>
          )}
          {step===3 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Cuánto quieres dominar?</h2><div className="grid gap-3">
              <OptionCard title="Comodidad total" desc="Botón y listo. Sin dial-in — ritual eficiente." badge="Efficiencist" onClick={()=>{setPrefs({...prefs, workflowPreference:"convenience"}); setStep(4);}} />
              <OptionCard title="Equilibrio guiado" desc="Moler y prensar sin refractómetro — craft accesible." badge="Aesthetic" onClick={()=>{setPrefs({...prefs, workflowPreference:"balanced"}); setStep(4);}} />
              <OptionCard title="Control manual" desc="Flow profiling, VST/IMS — esculpir extracción." badge="Precisionist" onClick={()=>{setPrefs({...prefs, workflowPreference:"manual_craft"}); setStep(4);}} />
            </div></div>
          )}
          {step===4 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Cuántas tazas?</h2><div className="grid gap-3">
              <OptionCard title="1–2" desc="Ritual íntimo. Caldera pequeña basta." onClick={()=>{setPrefs({...prefs, dailyCups:"1-2"}); setStep(5);}} />
              <OptionCard title="3–5" desc="Jornada constante. Depósito ≥1.8L." onClick={()=>{setPrefs({...prefs, dailyCups:"3-5"}); setStep(5);}} />
              <OptionCard title="6+" desc="Tribu. Doble caldera — sin espera." onClick={()=>{setPrefs({...prefs, dailyCups:"6+"}); setStep(5);}} />
            </div></div>
          )}
          {step===5 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Leche?</h2><div className="grid gap-3">
              <OptionCard title="Baja" desc="Solo café. Vapor secundario." onClick={()=>{setPrefs({...prefs, milkImportance:"low"}); setStep(6);}} />
              <OptionCard title="Media" desc="Fines de semana. Thermoblock válido." onClick={()=>{setPrefs({...prefs, milkImportance:"medium"}); setStep(6);}} />
              <OptionCard title="Alta" desc="A diario, latte art — poder continuo." badge="Latte" onClick={()=>{setPrefs({...prefs, milkImportance:"high"}); setStep(6);}} />
            </div></div>
          )}
          {step===6 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Limpieza?</h2><div className="grid gap-3">
              <OptionCard title="Mínima" desc="Ciclos auto. Ritual sin fricción." onClick={()=>{setPrefs({...prefs, maintenanceTolerance:"low"}); setStep(7);}} />
              <OptionCard title="Moderada" desc="Portafilter + lanza. Estándar." onClick={()=>{setPrefs({...prefs, maintenanceTolerance:"medium"}); setStep(7);}} />
              <OptionCard title="Alta" desc="Purgas sin problema. Prosumer." onClick={()=>{setPrefs({...prefs, maintenanceTolerance:"high"}); setStep(7);}} />
            </div></div>
          )}
          {step===7 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Espacio?</h2><div className="grid gap-3">
              <OptionCard title="Sí, compacto" desc="Ancho &lt;20cm. Obsidian minimal." onClick={()=>{setPrefs({...prefs, spaceConstraint:true}); setStep(8);}} />
              <OptionCard title="No" desc="Encimera generosa. E61 bienvenido." onClick={()=>{setPrefs({...prefs, spaceConstraint:false}); setStep(8);}} />
            </div></div>
          )}
          {step===8 && (
            <div className="space-y-4"><h2 className="text-2xl font-black">¿Molinillo?</h2><div className="grid gap-3">
              <OptionCard title="Todo en uno" desc="Un bloque. Estética uniforme." badge="Todo" onClick={()=>{ const up={...prefs, integratedGrinderPreference:"yes"} as UserPreferences; setPrefs(up); handleComplete(up);}} />
              <OptionCard title="Separado" desc="Muelas planas 64mm — claridad. Actualizable." badge="Maestría" onClick={()=>{ const up={...prefs, integratedGrinderPreference:"separated"} as UserPreferences; setPrefs(up); handleComplete(up);}} />
              <OptionCard title="Indiferente" desc="Motor elige blend perfecto." onClick={()=>{ const up={...prefs, integratedGrinderPreference:"indifferent"} as UserPreferences; setPrefs(up); handleComplete(up);}} />
            </div></div>
          )}
        </div>
      </div>
    </main>
  );
}
