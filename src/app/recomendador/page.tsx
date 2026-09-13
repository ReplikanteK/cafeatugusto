"use client";
import { useState } from "react";
import { UserPreferences, EvaluatedSetup } from "@/types/coffee";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";
import { passesHardFilters, calculateSetupScore } from "@/engine/compatibility";
import { SetupDisplay } from "@/components/ui/SetupDisplay";
import { track } from "@/lib/analytics";
function OptionCard({ title, desc, badge, onClick, selected }: { title:string; desc:string; badge?:string; onClick:()=>void; selected?:boolean }) {
  return (
    <button onClick={onClick} className={`p-4 border rounded-xl text-left transition-all ${selected?"border-amber-500 bg-amber-500/10":"border-neutral-800 hover:border-emerald-500 bg-neutral-900/50"} flex flex-col gap-1`}>
      <div className="flex justify-between items-start gap-2"><span className="font-bold text-white">{title}</span>{badge && <span className="text-[10px] font-mono bg-neutral-800 text-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap">{badge}</span>}</div>
      <span className="text-xs text-neutral-400 leading-relaxed">{desc}</span>
    </button>
  );
}
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
  if (step===9 && result) return <main className="min-h-screen bg-stone-950 py-12 px-4"><div className="max-w-3xl mx-auto"><SetupDisplay evaluated={result} /><button onClick={()=>{setStep(1); setResult(null);}} className="mt-6 w-full py-3 bg-stone-900 border border-stone-800 rounded-xl text-white font-bold">Rehacer test</button></div></main>;
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Paso {step} de 8</span>
            <div className="w-1/3 bg-stone-800 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full transition-all" style={{width:`${(step/8)*100}%`}}/></div>
          </div>
          {step===1 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Cómo disfrutas el café?</h2><p className="text-xs text-stone-400">Adaptamos presión y sistema térmico a tu perfil.</p><div className="grid gap-3">
              <OptionCard title="Solo Espresso" desc="Tiro corto, crema densa. Priorizamos estabilidad térmica y PID. Ideal purista." badge="Purista" onClick={()=>{setPrefs({...prefs, drinkTypes:["espresso"]}); setStep(2);}} />
              <OptionCard title="Espresso + leche" desc="Cappuccino/latte diario. Necesitas vaporización eficiente — thermoblock rápido o caldera dedicada." badge="Equilibrio" onClick={()=>{setPrefs({...prefs, drinkTypes:["espresso","milk_drink"]}); setStep(2);}} />
              <OptionCard title="Café largo / americano" desc="Volumen largo manteniendo intensidad. Superautomática cómoda sin curva técnica." badge="Versátil" onClick={()=>{setPrefs({...prefs, drinkTypes:["black_coffee"]}); setStep(2);}} />
            </div></div>
          )}
          {step===2 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">Presupuesto máximo (máquina+molinillo)</h2><p className="text-xs text-stone-400">Suma total. No mostramos fuera de rango.</p><div className="text-4xl font-mono text-amber-400 text-center">{prefs.budgetMaxEUR} €</div><input type="range" min={250} max={1500} step={50} value={prefs.budgetMaxEUR} onChange={e=> setPrefs({...prefs, budgetMaxEUR:Number(e.target.value)})} className="w-full accent-amber-500"/><p className="text-[11px] text-stone-500 text-center">250€ thermoblock compacto • 600€ 54mm calidad • 1000€ 58mm stepless</p><button onClick={()=> setStep(3)} className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold">Continuar</button></div>
          )}
          {step===3 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Cuánto quieres involucrarte?</h2><div className="grid gap-3">
              <OptionCard title="Comodidad total" desc="Pulso botón y obtengo taza. Superautomática, sin calibrar molienda ni prensado." badge="Sin fricción" onClick={()=>{setPrefs({...prefs, workflowPreference:"convenience"}); setStep(4);}} />
              <OptionCard title="Equilibrio guiado" desc="Moler, prensar y extraer artesanal sin curva compleja. ThermoJet + PID." badge="Aprendizaje" onClick={()=>{setPrefs({...prefs, workflowPreference:"balanced"}); setStep(4);}} />
              <OptionCard title="Control manual" desc="Ajustar molienda, temperatura y experimentar como barista. 58mm + PID." badge="Artesano" onClick={()=>{setPrefs({...prefs, workflowPreference:"manual_craft"}); setStep(4);}} />
            </div></div>
          )}
          {step===4 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Cuántas tazas al día?</h2><div className="grid gap-3">
              <OptionCard title="1–2 tazas" desc="Uso individual o pareja. Caldera pequeña suficiente." onClick={()=>{setPrefs({...prefs, dailyCups:"1-2"}); setStep(5);}} />
              <OptionCard title="3–5 tazas" desc="Consumo constante jornada. Valora depósito ≥1.8L." onClick={()=>{setPrefs({...prefs, dailyCups:"3-5"}); setStep(5);}} />
              <OptionCard title="6+ tazas" desc="Alta demanda/reuniones. Doble caldera o HX recomendado." onClick={()=>{setPrefs({...prefs, dailyCups:"6+"}); setStep(5);}} />
            </div></div>
          )}
          {step===5 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Importancia de la leche?</h2><div className="grid gap-3">
              <OptionCard title="Baja / solo café" desc="Solo café. Priorizamos extracción, vapor secundario." onClick={()=>{setPrefs({...prefs, milkImportance:"low"}); setStep(6);}} />
              <OptionCard title="Media (fines de semana)" desc="1-2 cappuccinos/día. Thermoblock con espera corta válida." onClick={()=>{setPrefs({...prefs, milkImportance:"medium"}); setStep(6);}} />
              <OptionCard title="Alta (a diario)" desc="Texturizar rápido y seguido. Sistema automático o doble caldera." badge="Latte lover" onClick={()=>{setPrefs({...prefs, milkImportance:"high"}); setStep(6);}} />
            </div></div>
          )}
          {step===6 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Tolerancia a limpieza?</h2><div className="grid gap-3">
              <OptionCard title="Mínima" desc="Limpieza rápida y ciclos automáticos. Superauto o ThermoJet." onClick={()=>{setPrefs({...prefs, maintenanceTolerance:"low"}); setStep(7);}} />
              <OptionCard title="Moderada" desc="Portafiltro y lanza tras cada uso. Rutina estándar." onClick={()=>{setPrefs({...prefs, maintenanceTolerance:"medium"}); setStep(7);}} />
              <OptionCard title="Sin preferencia" desc="No importa purgas/descalcificación. Prosumer sin problema." onClick={()=>{setPrefs({...prefs, maintenanceTolerance:"high"}); setStep(7);}} />
            </div></div>
          )}
          {step===7 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Espacio limitado?</h2><p className="text-xs text-stone-400">Ancho &lt;20cm si es ajustado. Afecta footprint.</p><div className="grid gap-3">
              <OptionCard title="Sí, compacto" desc="Requiere módulo pequeño. Filtramos large." onClick={()=>{setPrefs({...prefs, spaceConstraint:true}); setStep(8);}} />
              <OptionCard title="No, tengo espacio" desc="El tamaño no es restricción. Doble caldera bienvenida." onClick={()=>{setPrefs({...prefs, spaceConstraint:false}); setStep(8);}} />
            </div></div>
          )}
          {step===8 && (
            <div className="space-y-4"><h2 className="text-2xl font-bold">¿Molinillo integrado?</h2><div className="grid gap-3">
              <OptionCard title="Todo en uno" desc="Un bloque, menos encimera y cable. No actualizable separado." badge="Todo en uno" onClick={()=>{ const up={...prefs, integratedGrinderPreference:"yes"} as UserPreferences; setPrefs(up); handleComplete(up);}} />
              <OptionCard title="Componentes separados" desc="Mayor precisión y actualizar partes independiente. Recomendado." badge="Máximo control" onClick={()=>{ const up={...prefs, integratedGrinderPreference:"separated"} as UserPreferences; setPrefs(up); handleComplete(up);}} />
              <OptionCard title="Indiferente" desc="Que el motor elija mejor combinación según presupuesto." onClick={()=>{ const up={...prefs, integratedGrinderPreference:"indifferent"} as UserPreferences; setPrefs(up); handleComplete(up);}} />
            </div></div>
          )}
        </div>
      </div>
    </main>
  );
}
