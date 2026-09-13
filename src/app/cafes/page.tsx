import { BEANS_SEED } from "@/data/beans";
export default function CafesPage() {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || "cafeatugusto-21";
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black">Café en Grano — Recurrencia</h1>
      <p className="text-sm text-stone-400 mt-2">6 lotes curados. La máquina dura años, el grano vuelve cada mes. Sección afiliado y tostaduría directa.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {BEANS_SEED.map(b=> (
          <div key={b.id} className="rounded-xl bg-stone-900 border border-stone-800 p-5 flex flex-col">
            <div className="aspect-[4/3] bg-stone-800 rounded-lg mb-3 overflow-hidden flex items-center justify-center text-stone-500 text-xs">🫘 {b.roaster}</div>
            <h3 className="font-bold">{b.roaster} — {b.name}</h3>
            <p className="text-xs text-stone-400">{b.origin} • {b.roastProfile} • {b.process}</p>
            <p className="text-xs text-amber-300 mt-1">{b.tastingNotes.join(" • ")}</p>
            <p className="text-xs text-stone-500 mt-1">Para: {b.recommendedBrewing.join(", ")} • {b.weightGrams}g • {b.priceApproxEUR}€</p>
            <div className="mt-auto pt-4 flex gap-2">
              {b.amazonAsin ? <a href={`https://www.amazon.es/dp/${b.amazonAsin}?tag=${tag}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-amber-600 rounded-lg text-xs font-bold text-center">Amazon →</a> : null}
              {b.directLink ? <a href={b.directLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-stone-800 rounded-lg text-xs font-bold text-center">Tostaduría →</a> : !b.amazonAsin ? <span className="flex-1 py-2 bg-stone-800 rounded-lg text-xs text-center">Ver origen</span> : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
