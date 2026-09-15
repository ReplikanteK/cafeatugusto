"use client";
import { EvaluatedSetup, UserPreferences } from "@/types/coffee";
import { getArchetype } from "@/engine/archetype";
import { ScoreBadge } from "./ScoreBadge";
import { ProductImage } from "./ProductImage";
import { track } from "@/lib/analytics";
import { amazonUrl } from "@/lib/amazon";

function pillsFor(e: EvaluatedSetup) {
  const m = e.setup.machine;
  const g = e.setup.grinder;
  const pills: string[] = [];
  if (m.specs.portafilterDiameter) pills.push(`${m.specs.portafilterDiameter}mm`);
  if (m.specs.pid) pills.push("PID");
  if (m.specs.boilerType === "dual_boiler") pills.push("Doble caldera");
  else if (m.specs.boilerType === "heat_exchanger") pills.push("HX");
  else if (m.specs.boilerType === "single_boiler") pills.push("Caldera simple");
  else if (m.specs.boilerType === "thermoblock") pills.push("Thermoblock");
  if (m.specs.steamSystem === "automatic") pills.push("Vapor auto");
  if (m.specs.waterTankCapacityLiters) pills.push(`${m.specs.waterTankCapacityLiters}L`);
  if (m.grinderIntegrated) pills.push("Integrado");
  else if (g) {
    if (g.specs.grindAdjustment === "stepless") pills.push("Stepless");
    if (g.specs.burrType === "flat") pills.push(`Flat ${g.specs.burrSizeMM}mm`);
    if (g.performance.retention >= 4) pills.push("Single Dose");
    if (g.performance.retention >= 5) pills.push("Retención baja");
  }
  return pills.slice(0, 6);
}

function rankBadge(i: number) {
  if (i === 0) return { label: "🥇 Mejor Coincidencia", cls: "bg-amber-500 text-white border-amber-600", topCls: "border-amber-500/40 shadow-2xl shadow-amber-900/20" };
  if (i === 1) return { label: "🥈 Mejor Relación", cls: "bg-stone-700 text-stone-200 border-stone-600", topCls: "border-stone-700" };
  return { label: "🥉 Alternativa", cls: "bg-stone-800 text-stone-300 border-stone-700", topCls: "border-stone-800" };
}

export function Top3Results({ tops, prefs }: { tops: EvaluatedSetup[]; prefs: UserPreferences }) {
  const arch = getArchetype(prefs);
  if (tops.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-stone-900 p-8 text-center">
        <p className="font-bold text-white">Sin resultados para tu presupuesto</p>
        <p className="text-xs text-stone-400 mt-2">Prueba ampliar presupuesto o cambiar preferencia de molinillo integrado/separado.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <p className="text-[11px] sm:text-xs font-mono tracking-widest text-amber-400">{arch.label.toUpperCase()} • TOP 3</p>
        <span className="text-[11px] sm:text-xs text-stone-500">Motor espresso-only • {tops.length} setups</span>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {tops.map((e, i) => {
          const badge = rankBadge(i);
          const pills = pillsFor(e);
          const isTop1 = i === 0;
          return (
            <div
              key={e.setup.id}
              className={`rounded-2xl border bg-gradient-to-b p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4 ${isTop1 ? "from-stone-900 via-stone-900 to-amber-950/20 border-amber-500/40 shadow-xl" : "from-stone-900 to-stone-950 border-stone-800"} ${badge.topCls}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border font-bold ${badge.cls}`}>{badge.label}</span>
                  {isTop1 && <ScoreBadge score={e.score.totalScore} />}
                </div>
                {!isTop1 && <span className="font-mono text-xs font-bold text-stone-400">{e.score.totalScore}/100</span>}
              </div>

              <div className={`grid gap-3 sm:gap-4 ${isTop1 ? "grid-cols-2" : "grid-cols-2"}`}>
                <div className="rounded-xl bg-stone-950 border border-stone-800 p-2.5 sm:p-3 flex flex-col">
                  <ProductImage src={e.setup.machine.image} alt={e.setup.machine.model} className="aspect-[16/10] sm:aspect-[4/3]" />
                  <p className="font-bold text-white mt-2 text-sm">
                    {e.setup.machine.brand} {e.setup.machine.model}
                  </p>
                  <p className="text-xs text-stone-400">
                    {e.setup.machine.specs.portafilterDiameter ? `${e.setup.machine.specs.portafilterDiameter}mm` : ""} {e.setup.machine.specs.pid ? "· PID" : "· sin PID"} · {e.setup.machine.specs.boilerType}
                  </p>
                  <a
                    href={amazonUrl(e.setup.machine.asin, `${e.setup.machine.brand} ${e.setup.machine.model}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("amazon_click", { asin: e.setup.machine.asin, role: "machine", rank: i + 1, score: e.score.totalScore })}
                    className={`mt-2.5 sm:mt-3 block text-center py-2.5 sm:py-2 rounded-lg text-[13px] sm:text-xs font-bold min-h-[42px] sm:min-h-0 flex items-center justify-center touch-manipulation ${isTop1 ? "bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white" : "bg-stone-800 hover:bg-stone-700 active:bg-stone-700 text-stone-200 border border-stone-700"}`}
                  >
                    Ver en Amazon →
                  </a>
                </div>

                <div className="rounded-xl bg-stone-950 border border-stone-800 p-2.5 sm:p-3 flex flex-col">
                  {e.setup.grinder ? (
                    <>
                      <ProductImage src={e.setup.grinder.image} alt={e.setup.grinder.model} className="aspect-[16/10] sm:aspect-[4/3]" />
                      <p className="font-bold text-white mt-2 text-sm">
                        {e.setup.grinder.brand} {e.setup.grinder.model}
                      </p>
                      <p className="text-xs text-stone-400">
                        {e.setup.grinder.specs.burrType} {e.setup.grinder.specs.burrSizeMM}mm · {e.setup.grinder.specs.grindAdjustment} · retención {e.setup.grinder.performance.retention}/5
                      </p>
                      <a
                        href={amazonUrl(e.setup.grinder.asin, `${e.setup.grinder.brand} ${e.setup.grinder.model}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("amazon_click", { asin: e.setup.grinder!.asin, role: "grinder", rank: i + 1, score: e.score.totalScore })}
                        className={`mt-2.5 sm:mt-3 block text-center py-2.5 sm:py-2 rounded-lg text-[13px] sm:text-xs font-bold min-h-[42px] sm:min-h-0 flex items-center justify-center touch-manipulation ${isTop1 ? "bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white" : "bg-stone-800 hover:bg-stone-700 active:bg-stone-700 text-stone-200 border border-stone-700"}`}
                      >
                        Ver en Amazon →
                      </a>
                    </>
                  ) : (
                    <p className="text-xs text-stone-500 text-center py-8">Molinillo integrado — ritual compacto</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {pills.map((p) => (
                  <span key={p} className="text-[10px] sm:text-[11px] font-mono bg-stone-800 text-stone-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-stone-700 whitespace-nowrap">
                    {p}
                  </span>
                ))}
                <span className="text-[10px] sm:text-[11px] font-mono bg-amber-900/20 text-amber-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-500/20 whitespace-nowrap">
                  {e.setup.estimatedTotalEUR}€
                </span>
              </div>

              <div className="space-y-2 border-t border-stone-800/50 pt-3">
                {e.setup.machine.description && <p className="text-[13px] leading-relaxed text-stone-300 italic">{e.setup.machine.description}</p>}
                {e.setup.grinder?.description && <p className="text-[13px] leading-relaxed text-stone-400 italic">{e.setup.grinder.description}</p>}
              </div>

              <div className="border-t border-stone-800 pt-3">
                <p className="text-xs text-stone-300 leading-relaxed">{e.score.rationale}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {e.score.pros.slice(0, 2).map((pr) => (
                    <span key={pr} className="text-[11px] text-emerald-300/80">✓ {pr}</span>
                  ))}
                  {e.score.cons.slice(0, 1).map((co) => (
                    <span key={co} className="text-[11px] text-amber-300/70">• {co}</span>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-stone-950 border border-stone-800 p-3" data-testid="breakdown">
                  <p className="text-[10px] font-mono tracking-widest text-stone-500 mb-2">DESGLOSE 7 DIMS — TRAZABLE 0–100</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {([
                      ["Presupuesto", e.score.breakdown.budgetMatch],
                      ["Workflow", e.score.breakdown.experienceMatch],
                      ["Espacio", e.score.breakdown.spaceMatch],
                      ["Mantenimiento", e.score.breakdown.maintenanceMatch],
                      ["Leche", e.score.breakdown.milkMatch],
                      ["Uso diario", e.score.breakdown.dailyMatch],
                      ["Molinillo", e.score.breakdown.grinderMatch],
                    ] as const).map(([label, val]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-400 w-24 shrink-0">{label}</span>
                        <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${Math.max(0, Math.min(100, val))}%` }} />
                        </div>
                        <span className="text-[11px] font-mono text-stone-300 w-8 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-2">Pregunta → campo → función → peso → test — ver metodologia</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-stone-500 text-center">Motor espresso-only • {arch.label} • Precios de referencia — verificar en Amazon</p>
    </div>
  );
}
