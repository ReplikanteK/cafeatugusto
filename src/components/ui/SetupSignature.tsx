import { EvaluatedSetup, UserPreferences } from "@/types/coffee";
import { getArchetype } from "@/engine/archetype";
import { BEANS_SEED } from "@/data/beans";
import { ScoreBadge } from "./ScoreBadge";
export function SetupSignature({ evaluated, prefs }: { evaluated: EvaluatedSetup; prefs: UserPreferences }) {
  const arch = getArchetype(prefs);
  const beans = BEANS_SEED.filter(b=> b.recommendedBrewing.includes(prefs.drinkTypes.includes("espresso") ? "espresso" : "filter")).slice(0,2);
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={evaluated.setup.machine.image} alt={evaluated.setup.machine.model} className="w-full aspect-[4/3] object-cover rounded-lg" />
            <p className="font-bold text-white mt-2">{evaluated.setup.machine.brand} {evaluated.setup.machine.model}</p>
            <a href={`https://www.amazon.es/dp/${evaluated.setup.machine.asin}?tag=${tag}`} target="_blank" rel="noopener noreferrer" className="mt-2 block text-center py-2 bg-amber-600 rounded-lg text-xs font-bold">Ver en Amazon →</a>
          </div>
          <div className="rounded-xl bg-stone-950 border border-stone-800 p-4">
            {evaluated.setup.grinder ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={evaluated.setup.grinder.image} alt={evaluated.setup.grinder.model} className="w-full aspect-[4/3] object-cover rounded-lg" />
                <p className="font-bold text-white mt-2">{evaluated.setup.grinder.brand} {evaluated.setup.grinder.model}</p>
                <a href={`https://www.amazon.es/dp/${evaluated.setup.grinder.asin}?tag=${tag}`} target="_blank" rel="noopener noreferrer" className="mt-2 block text-center py-2 bg-amber-600 rounded-lg text-xs font-bold">Ver en Amazon →</a>
              </>
            ) : <p className="text-xs text-stone-500 text-center py-8">Molinillo integrado — ritual compacto</p>}
          </div>
        </div>
        <p className="text-xs text-stone-300 mt-4 border-t border-stone-800 pt-3">{evaluated.score.rationale}</p>
        <p className="text-[11px] text-stone-500 mt-2">Comparte tu Signature — obsidian · bronce · ritual. @{arch.label}</p>
      </div>
      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5">
        <h3 className="font-bold text-white">🫘 Maridaje Signature — 2 granos para tu arquetipo</h3>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {beans.map(b=> (
            <div key={b.id} className="rounded-lg bg-stone-950 border border-stone-800 p-3">
              <p className="font-bold text-sm text-white">{b.roaster} — {b.name}</p>
              <p className="text-xs text-stone-400">{b.origin} • {b.tastingNotes.join(" • ")}</p>
              <p className="text-xs text-amber-300 mt-1">{b.priceApproxEUR}€ / {b.weightGrams}g</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-stone-500 mt-3">Molienda esculpe claridad; origen esculpe identidad. Mismo tag afiliado.</p>
      </div>
    </div>
  );
}
