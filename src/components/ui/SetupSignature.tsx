import { EvaluatedSetup, UserPreferences } from "@/types/coffee";
import { getArchetype } from "@/engine/archetype";
import { ScoreBadge } from "./ScoreBadge";
import { ProductImage } from "./ProductImage";
import { track } from "@/lib/analytics";
import { amazonUrl } from "@/lib/amazon";
export function SetupSignature({ evaluated, prefs }: { evaluated: EvaluatedSetup; prefs: UserPreferences }) {
  const arch = getArchetype(prefs);
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
            <a href={amazonUrl(evaluated.setup.machine.asin, `${evaluated.setup.machine.brand} ${evaluated.setup.machine.model}`)} target="_blank" rel="noopener noreferrer" onClick={() => track("amazon_click", { asin: evaluated.setup.machine.asin, role: "machine", score: evaluated.score.totalScore })} className="mt-2 block text-center py-2 bg-amber-600 rounded-lg text-xs font-bold">Ver en Amazon →</a>
          </div>
          <div className="rounded-xl bg-stone-950 border border-stone-800 p-4">
            {evaluated.setup.grinder ? (
              <>
                <ProductImage src={evaluated.setup.grinder.image} alt={evaluated.setup.grinder.model} />
                <p className="font-bold text-white mt-2">{evaluated.setup.grinder.brand} {evaluated.setup.grinder.model}</p>
                <a href={amazonUrl(evaluated.setup.grinder.asin, `${evaluated.setup.grinder.brand} ${evaluated.setup.grinder.model}`)} target="_blank" rel="noopener noreferrer" onClick={() => track("amazon_click", { asin: evaluated.setup.grinder!.asin, role: "grinder", score: evaluated.score.totalScore })} className="mt-2 block text-center py-2 bg-amber-600 rounded-lg text-xs font-bold">Ver en Amazon →</a>
              </>
            ) : <p className="text-xs text-stone-500 text-center py-8">Molinillo integrado — ritual compacto</p>}
          </div>
        </div>
        <p className="text-xs text-stone-300 mt-4 border-t border-stone-800 pt-3">{evaluated.score.rationale}</p>
      </div>
    </div>
  );
}
