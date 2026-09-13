import { EvaluatedSetup, UserPreferences } from "@/types/coffee";
import { getArchetype } from "@/engine/archetype";
import { BEANS_SEED } from "@/data/beans";
import { ScoreBadge } from "./ScoreBadge";
function accessoriesFor(diam?: number) {
  const tag = "cafeatugusto-21"; // placeholder ASINs — sustituir por reales tras validación
  if (diam === 54) return [
    { name: "Tamper dinamométrico 53.3mm", asin: "B0B5X", note: "30 lbs constantes — evita channeling", badge: "54mm Verificada" },
    { name: "Embudo + WDT 0.35mm titanio", asin: "B0B5Y", note: "Descompacta sin apelmazar", badge: "54mm" },
    { name: "Puck Screen 53.5mm", asin: "B0B5Z", note: "Distribución agua + limpieza grupo", badge: "54mm" },
  ];
  if (diam === 58) return [
    { name: "Cesta IMS/VST 18g 58mm", asin: "B0C1X", note: "Láser micrométrico — extracción uniforme", badge: "58mm Pro" },
    { name: "Portafiltro bottomless nogal 58mm", asin: "B0C2X", note: "Diagnóstico visual + estética premium", badge: "58mm" },
    { name: "WDT Pro + embudo 58mm magnetizado", asin: "B0C3X", note: "Flujo sin derrames", badge: "58mm" },
  ];
  if (diam === 51 || diam === 57) return [
    { name: "Tamper calibrado 51/57mm", asin: "B0D51", note: `Para ${diam}mm — presión uniforme`, badge: `${diam}mm` },
    { name: "WDT + embudo magnético", asin: "B0D52", note: "Ritual sin derrames", badge: `${diam}mm` },
  ];
  return [];
}
export function SetupSignature({ evaluated, prefs }: { evaluated: EvaluatedSetup; prefs: UserPreferences }) {
  const arch = getArchetype(prefs);
  const beans = BEANS_SEED.filter(b=> b.recommendedBrewing.includes(prefs.drinkTypes.includes("espresso") ? "espresso" : "filter")).slice(0,2);
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";
  const diam = evaluated.setup.machine.specs.portafilterDiameter;
  const accs = accessoriesFor(diam);
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
        <h3 className="font-bold text-white">Completa tu Ritual — Herramientas de Precisión Compatible</h3>
        <p className="text-xs text-stone-400 mt-1">Un buen setup solo expresa su máximo si eliminas el channeling y mides la ratio con exactitud. {diam ? `Compatibilidad ${diam}mm verificada.` : "Selección universal."}</p>
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {accs.map(a=> (
            <a key={a.asin} href={`https://www.amazon.es/dp/${a.asin}?tag=${tag}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-stone-950 border border-stone-800 p-3 hover:border-amber-500/30 transition-all">
              <span className="text-[10px] font-mono bg-amber-900/30 text-amber-300 px-2 py-0.5 rounded-full">{a.badge}</span>
              <p className="font-bold text-sm text-white mt-2">{a.name}</p>
              <p className="text-xs text-stone-400">{a.note}</p>
              <p className="text-xs text-amber-400 mt-2">Ver en Amazon →</p>
            </a>
          ))}
          <a href={`https://www.amazon.es/s?k=bascula+cafe+0.1g&tag=${tag}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-stone-950 border border-amber-500/20 p-3 hover:border-amber-500/40">
            <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">Universal</span>
            <p className="font-bold text-sm text-white mt-2">Báscula 0.1g con timer auto-tare</p>
            <p className="text-xs text-stone-400">Control ratio in/out de tu Ritual Recipe.</p>
            <p className="text-xs text-amber-400 mt-2">Ver en Amazon →</p>
          </a>
        </div>
      </div>
      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5">
        <h3 className="font-bold text-white">🫘 Maridaje Signature — 2 granos para tu arquetipo</h3>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {beans.map(b=> (
            <div key={b.id} className="rounded-lg bg-stone-950 border border-stone-800 p-3">
              <p className="font-bold text-sm text-white">{b.roaster} — {b.name}</p>
              <p className="text-xs text-stone-400">{b.origin} • {b.tastingNotes.join(" • ")}</p>
              <p className="text-xs text-amber-300 mt-1">{b.priceApproxEUR}€ / {b.weightGrams}g • {b.recipe.ratio} • {b.recipe.timeSec}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-stone-500 mt-3">Molienda esculpe claridad; origen esculpe identidad.</p>
      </div>
    </div>
  );
}
