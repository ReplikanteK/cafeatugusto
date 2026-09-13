import { EvaluatedSetup, UserPreferences } from "@/types/coffee";
import { getArchetype } from "@/engine/archetype";
// P0-1 RETIRADA TEMPORAL: BEANS + ACCESORIOS con ASIN placeholders (B0B5X etc., B0C1MARCELLA etc.) ocultos hasta verificación 1×1 en Amazon.
// No reactivar sin sustituir por ASIN reales 10ch verificados. Import BEANS_SEED comentado para evitar enlaces rotos en prod.
// import { BEANS_SEED } from "@/data/beans";
import { ScoreBadge } from "./ScoreBadge";
import { ProductImage } from "./ProductImage";
import { track } from "@/lib/analytics";
// function accessoriesFor(diam?: number) { // P0-1 oculto — ASINs B0B5X/B0C1X etc. 5ch inválidos
//   if (diam === 54) return [
//     { name: "Tamper dinamométrico 53.3mm", asin: "B0B5X", note: "30 lbs constantes — evita channeling", badge: "54mm Verificada" },
//     { name: "Embudo + WDT 0.35mm titanio", asin: "B0B5Y", note: "Descompacta sin apelmazar", badge: "54mm" },
//     { name: "Puck Screen 53.5mm", asin: "B0B5Z", note: "Distribución agua + limpieza grupo", badge: "54mm" },
//   ];
//   if (diam === 58) return [
//     { name: "Cesta IMS/VST 18g 58mm", asin: "B0C1X", note: "Láser micrométrico — extracción uniforme", badge: "58mm Pro" },
//     { name: "Portafiltro bottomless nogal 58mm", asin: "B0C2X", note: "Diagnóstico visual + estética premium", badge: "58mm" },
//     { name: "WDT Pro + embudo 58mm magnetizado", asin: "B0C3X", note: "Flujo sin derrames", badge: "58mm" },
//   ];
//   if (diam === 51 || diam === 57) return [
//     { name: "Tamper calibrado 51/57mm", asin: "B0D51", note: `Para ${diam}mm — presión uniforme`, badge: `${diam}mm` },
//     { name: "WDT + embudo magnético", asin: "B0D52", note: "Ritual sin derrames", badge: `${diam}mm` },
//   ];
//   return [];
// }
export function SetupSignature({ evaluated, prefs }: { evaluated: EvaluatedSetup; prefs: UserPreferences }) {
  const arch = getArchetype(prefs);
  // P0-1 RETIRADA: beans/accesorios ocultos — ver arriba
  // const beans = BEANS_SEED.filter(b=> b.recommendedBrewing.includes(prefs.drinkTypes.includes("espresso") ? "espresso" : "filter")).slice(0,2);
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";
  // const diam = evaluated.setup.machine.specs.portafilterDiameter;
  // const accs = accessoriesFor(diam);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950/20 p-6 shadow-2xl">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-xs font-mono tracking-widest text-amber-400">{arch.label.toUpperCase()} • SETUP SIGNATURE</p>
            <h2 className="text-2xl font-black text-white mt-1">{arch.label} — Tu ritual</h2>
            <p className="text-xs text-stone-400 mt-1">{arch.desc}</p>
          </div>
          <ScoreBadge score={evaluated.score.totalScore} />
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-stone-950 border border-stone-800 p-4">
            <ProductImage src={evaluated.setup.machine.image} alt={evaluated.setup.machine.model} />
            <p className="font-bold text-white mt-2">{evaluated.setup.machine.brand} {evaluated.setup.machine.model}</p>
            <a href={`https://www.amazon.es/dp/${evaluated.setup.machine.asin}?tag=${tag}`} target="_blank" rel="noopener noreferrer" onClick={() => track("amazon_click", { asin: evaluated.setup.machine.asin, role: "machine", score: evaluated.score.totalScore })} className="mt-2 block text-center py-2 bg-amber-600 rounded-lg text-xs font-bold">Ver en Amazon →</a>
          </div>
          <div className="rounded-xl bg-stone-950 border border-stone-800 p-4">
            {evaluated.setup.grinder ? (
              <>
                <ProductImage src={evaluated.setup.grinder.image} alt={evaluated.setup.grinder.model} />
                <p className="font-bold text-white mt-2">{evaluated.setup.grinder.brand} {evaluated.setup.grinder.model}</p>
                <a href={`https://www.amazon.es/dp/${evaluated.setup.grinder.asin}?tag=${tag}`} target="_blank" rel="noopener noreferrer" onClick={() => track("amazon_click", { asin: evaluated.setup.grinder!.asin, role: "grinder", score: evaluated.score.totalScore })} className="mt-2 block text-center py-2 bg-amber-600 rounded-lg text-xs font-bold">Ver en Amazon →</a>
              </>
            ) : <p className="text-xs text-stone-500 text-center py-8">Molinillo integrado — ritual compacto</p>}
          </div>
        </div>
        <p className="text-xs text-stone-300 mt-4 border-t border-stone-800 pt-3">{evaluated.score.rationale}</p>
        <p className="text-[11px] text-stone-500 mt-2">Comparte tu Signature — obsidian · bronce · ritual. @{arch.label}</p>
      </div>
      {/* P0-1 PLACEHOLDER: accesorios y granos ocultos hasta verificación ASIN 1×1. No borrar este comentario — reactividad requiere PR explícito con ASIN reales 10ch. */}
      <div className="rounded-2xl bg-stone-900 border border-dashed border-stone-700 p-5 text-center">
        <p className="text-xs font-mono text-stone-500">P0-1 — Accesorios compatibles y Maridaje de granos temporalmente ocultos</p>
        <p className="text-[11px] text-stone-600 mt-1">Validación ASIN 1×1 en Amazon pendiente (placeholders B0B5X / B0C1MARCELLA retirados). Reactivación solo con ASIN reales 10ch verificados.</p>
      </div>
    </div>
  );
}
