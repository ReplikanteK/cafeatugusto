import { EvaluatedSetup } from "@/types/coffee";
import { ScoreBadge } from "./ScoreBadge";
import { amazonUrl } from "@/lib/amazon";
export function SetupDisplay({ evaluated }: { readonly evaluated: EvaluatedSetup }) {
  const { setup, score } = evaluated;
  return (
    <div className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Recomendación de Setup</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Tu Configuración Ideal</h1>
        </div>
        <ScoreBadge score={score.totalScore} />
      </div>
      <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 text-neutral-300 text-sm leading-relaxed">{score.rationale}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
          <div className="aspect-[4/3] bg-neutral-900 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={setup.machine.image} alt={`${setup.machine.brand} ${setup.machine.model}`} className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded self-start">Cafetera Espresso</span>
            <h3 className="text-xl font-bold text-white mt-2">{setup.machine.brand} {setup.machine.model}</h3>
            <ul className="mt-3 space-y-1 text-xs text-neutral-400">
              <li>• Portafiltro: {setup.machine.specs.portafilterDiameter ?? "N/A"} mm</li>
              <li>• Sistema Térmico: {setup.machine.specs.boilerType}</li>
              <li>• PID: {setup.machine.specs.pid ? "Sí" : "No"}</li>
            </ul>
            <div className="mt-auto pt-4 border-t border-neutral-900">
              <a href={amazonUrl(setup.machine.asin, `${setup.machine.brand} ${setup.machine.model}`)} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg text-center transition-colors">Ver precio en Amazon →</a>
              <p className="text-[10px] text-neutral-500 text-center mt-1">(enlace de afiliado)</p>
            </div>
          </div>
        </div>
        {setup.grinder ? (
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-neutral-900 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setup.grinder.image} alt={`${setup.grinder.brand} ${setup.grinder.model}`} className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded self-start">Molinillo Recomendado</span>
              <h3 className="text-xl font-bold text-white mt-2">{setup.grinder.brand} {setup.grinder.model}</h3>
              <ul className="mt-3 space-y-1 text-xs text-neutral-400">
                <li>• Muelas: {setup.grinder.specs.burrType} ({setup.grinder.specs.burrSizeMM} mm)</li>
                <li>• Ajuste: {setup.grinder.specs.grindAdjustment}</li>
                <li>• Hopper: {setup.grinder.specs.hopperCapacityGrams}g</li>
              </ul>
              <div className="mt-auto pt-4 border-t border-neutral-900">
                <a href={amazonUrl(setup.grinder.asin, `${setup.grinder.brand} ${setup.grinder.model}`)} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg text-center transition-colors">Ver precio en Amazon →</a>
                <p className="text-[10px] text-neutral-500 text-center mt-1">(enlace de afiliado)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-950/40 border border-dashed border-neutral-800 rounded-xl p-5 flex items-center justify-center text-center">
            <p className="text-xs text-neutral-500">Molinillo integrado en el bloque de la cafetera seleccionada. No requiere unidad externa.</p>
          </div>
        )}
      </div>
      <div className="border-t border-neutral-800 pt-6">
        <h4 className="text-sm font-bold text-white mb-3">Factores de Compatibilidad</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/60"><span className="text-neutral-500 block">Presupuesto</span><span className="font-mono text-emerald-400 font-bold">{score.breakdown.budgetMatch}%</span></div>
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/60"><span className="text-neutral-500 block">Flujo / Curva</span><span className="font-mono text-emerald-400 font-bold">{score.breakdown.experienceMatch}%</span></div>
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/60"><span className="text-neutral-500 block">Espacio</span><span className="font-mono text-emerald-400 font-bold">{score.breakdown.spaceMatch}%</span></div>
          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/60"><span className="text-neutral-500 block">Limpieza</span><span className="font-mono text-emerald-400 font-bold">{score.breakdown.maintenanceMatch}%</span></div>
        </div>
        {score.pros.length>0 && <ul className="mt-4 text-xs text-emerald-300 space-y-1">{score.pros.map(p=> <li key={p}>✓ {p}</li>)}</ul>}
        {score.cons.length>0 && <ul className="mt-2 text-xs text-amber-300 space-y-1">{score.cons.map(c=> <li key={c}>• {c}</li>)}</ul>}
      </div>
      <footer className="text-[11px] text-neutral-500 pt-4 border-t border-neutral-800/60 leading-normal">En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables. Precios y disponibilidad sujetos a cambios — verificar en Amazon.</footer>
    </div>
  );
}
