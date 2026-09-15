"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserPreferences, EvaluatedSetup } from "@/types/coffee";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";
import { passesHardFilters, calculateSetupScore } from "@/engine/compatibility";
import { Top3Results } from "@/components/ui/Top3Results";
import { track } from "@/lib/analytics";

function OptionCard({ title, desc, badge, onClick }: { title: string; desc: string; badge?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group p-3.5 sm:p-4 border border-stone-800 rounded-xl text-left hover:border-amber-500/40 hover:bg-stone-800/50 bg-stone-900/50 flex flex-col gap-1 transition-all w-full min-h-[64px] sm:min-h-[68px] active:scale-[0.99] active:border-amber-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 touch-manipulation"
    >
      <div className="flex justify-between items-start gap-2">
        <span className="font-bold text-white text-[15px] sm:text-base leading-tight">{title}</span>
        {badge && <span className="text-[10px] font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full shrink-0 max-w-[38%] text-center leading-tight truncate">{badge}</span>}
      </div>
      <span className="text-[13px] sm:text-xs text-stone-400 leading-snug sm:leading-relaxed line-clamp-2">{desc}</span>
    </button>
  );
}

// Presets mapean arquetipo de identidad -> UserPreferences para salto directo a resultados
// Precisionist: PID + 58mm (manual_craft boost en engine), high maintenance, separated
// Aesthetic: balanced, madera/acero, indifferent
// Efficiencist: convenience, ThermoJet 3s, high milk, low maintenance, compact (indifferent para permitir Bambino)
// Alchemist: black_coffee, alta claridad, manual craft
const ARCHETYPE_PRESETS: Record<string, UserPreferences> = {
  precisionist: { drinkTypes: ["espresso"], budgetMaxEUR: 950, workflowPreference: "manual_craft", dailyCups: "3-5", milkImportance: "low", maintenanceTolerance: "high", spaceConstraint: false, integratedGrinderPreference: "separated" },
  aesthetic: { drinkTypes: ["espresso","milk_drink"], budgetMaxEUR: 700, workflowPreference: "balanced", dailyCups: "3-5", milkImportance: "medium", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent" },
  efficiencist: { drinkTypes: ["espresso","milk_drink"], budgetMaxEUR: 550, workflowPreference: "convenience", dailyCups: "3-5", milkImportance: "high", maintenanceTolerance: "low", spaceConstraint: true, integratedGrinderPreference: "indifferent" },
  // P0-5 espresso-only: alchemist black_coffee oculto — catálogo 100% espresso. Usamos espresso + manual para claridad alta sin ruta filtro.
  alchemist: { drinkTypes: ["espresso"], budgetMaxEUR: 700, workflowPreference: "manual_craft", dailyCups: "1-2", milkImportance: "low", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "separated" },
};

function WizardInner() {
  const searchParams = useSearchParams();
  const archetype = searchParams.get("archetype");
  const src = searchParams.get("src");
  const [step, setStep] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    drinkTypes: ["espresso"], budgetMaxEUR: 600, workflowPreference: "balanced", dailyCups: "3-5", milkImportance: "medium", maintenanceTolerance: "medium", spaceConstraint: false, integratedGrinderPreference: "indifferent",
  });
  const [tops, setTops] = useState<EvaluatedSetup[]>([]);
  const [finalPrefs, setFinalPrefs] = useState<UserPreferences | null>(null);

  const trackStarted = () => {
    if (!hasStarted) {
      track("quiz_started", { step, archetype: archetype ?? "custom", src: src ?? "direct" } as unknown as Record<string, unknown>);
      setHasStarted(true);
    }
  };
  const handleComplete = (fp: UserPreferences) => {
    track("quiz_completed", { ...fp, src: src ?? "direct" } as unknown as Record<string, unknown>);
    if (archetype && ARCHETYPE_PRESETS[archetype]) track("archetype_preset", { archetype, src: src ?? "direct" } as unknown as Record<string, unknown>);
    if (src) track("guide_conversion", { src, archetype: archetype ?? "custom" } as unknown as Record<string, unknown>);
    const candidates: EvaluatedSetup[] = [];
    for (const m of MACHINES_SEED) {
      if (m.grinderIntegrated) { if (passesHardFilters(m, undefined, fp)) candidates.push(calculateSetupScore(m, undefined, fp)); }
      else { for (const g of GRINDERS_SEED) { if (passesHardFilters(m, g, fp)) candidates.push(calculateSetupScore(m, g, fp)); } }
    }
    candidates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    const top3 = candidates.slice(0, 3);
    setTops(top3); setFinalPrefs(fp); setStep(9); track("result_viewed", { score: top3[0]?.score.totalScore, count: top3.length, archetype: archetype ?? "custom", src: src ?? "direct" } as unknown as Record<string, unknown>);
  };

  useEffect(()=> {
    if (archetype && ARCHETYPE_PRESETS[archetype] && tops.length === 0) {
      handleComplete(ARCHETYPE_PRESETS[archetype] as UserPreferences);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype]);

  if (step === 9 && tops.length > 0 && finalPrefs) {
    return (
      <main className="min-h-screen bg-stone-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-amber-400 mb-2">ARQUETIPO: {archetype?.toUpperCase() || "CUSTOM"} • TOP 3 • MOTOR ESPRESSO-ONLY</p>
          <Top3Results tops={tops} prefs={finalPrefs} />
          <button onClick={() => { setStep(1); setTops([]); setFinalPrefs(null); }} className="mt-6 w-full py-3 bg-stone-900 border border-stone-800 rounded-xl text-white font-bold hover:bg-stone-800">
            Rehacer test
          </button>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-5 sm:mb-8 border-b border-stone-800 pb-3 sm:pb-4 sticky top-0 bg-stone-900/95 backdrop-blur supports-[backdrop-filter]:bg-stone-900/80 z-10 -mx-4 sm:mx-0 px-4 sm:px-0 -mt-4 sm:mt-0 pt-4 sm:pt-0">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-500">Paso {step} de 8</span>
            <div className="w-24 sm:w-1/3 bg-stone-800 h-1.5 rounded-full overflow-hidden shrink-0">
              <div className="bg-amber-500 h-full transition-all duration-300 ease-out" style={{ width: `${(step / 8) * 100}%` }} />
            </div>
          </div>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">¿Cómo disfrutas el café habitualmente?</h2>
              <div className="grid gap-3">
                <OptionCard title="Solo Espresso" desc="Extractos cortos y densos. Prioridad a la estabilidad térmica." badge="Purista" onClick={() => { trackStarted(); setPrefs({ ...prefs, drinkTypes: ["espresso"] }); setStep(2); }} />
                <OptionCard title="Espresso con Leche" desc="Cappuccinos, Lattes o Flat Whites regulares." badge="Equilibrio" onClick={() => { trackStarted(); setPrefs({ ...prefs, drinkTypes: ["espresso", "milk_drink"] }); setStep(2); }} />
                {/* P0-5 espresso-only: Cafés Largos / Filtro oculto — sin máquinas filtro en catálogo. Reactivar solo con V60/AeroPress reales. */}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black leading-tight">Presupuesto Máximo Ajustado</h2>
              <div className="text-3xl sm:text-4xl font-mono text-amber-400 text-center py-3 sm:py-4">{prefs.budgetMaxEUR} €</div>
              <input type="range" min={250} max={1500} step={50} value={prefs.budgetMaxEUR} onChange={e => setPrefs({ ...prefs, budgetMaxEUR: Number(e.target.value) })} className="w-full accent-amber-500 h-2 touch-manipulation" />
              <div className="flex justify-between text-[11px] font-mono text-stone-500 px-1"><span>250€</span><span>1500€</span></div>
              <button onClick={() => setStep(3)} className="w-full py-3.5 sm:py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 rounded-xl font-black mt-2 text-base sm:text-sm touch-manipulation">Continuar</button>
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

export default function WizardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-stone-950 py-12 px-4"><div className="max-w-3xl mx-auto text-center text-stone-400">Cargando recomendador…</div></main>}>
      <WizardInner />
    </Suspense>
  );
}
