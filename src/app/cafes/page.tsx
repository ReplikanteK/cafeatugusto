import { BEANS_SEED } from "@/data/beans";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
export default function CafesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black">Café en Grano — Recurrencia</h1>
      <p className="text-sm text-stone-400 mt-2">6 lotes curados con Ritual Recipe. Cada origen es landing indexable — la máquina dura años, el grano vuelve cada mes.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {BEANS_SEED.map(b=> (
          <Link key={b.id} href={`/cafes/${b.slug}`} className="rounded-xl bg-stone-900 border border-stone-800 p-5 flex flex-col hover:border-amber-500/30 transition-all">
            <ProductImage src={b.image} alt={b.name} className="aspect-[4/3] mb-3" />
            <h3 className="font-bold text-white">{b.roaster} — {b.name}</h3>
            <p className="text-xs text-stone-400">{b.origin} • {b.roastProfile} • {b.process}</p>
            <p className="text-xs text-amber-300 mt-1">{b.tastingNotes.join(" • ")}</p>
            <p className="text-xs text-stone-500 mt-1">Ratio {b.recipe.ratio} • {b.recipe.timeSec} • {b.recipe.tempC}°C</p>
            <span className="mt-3 inline-flex gap-2">
              <span className="text-xs font-bold text-amber-400">Amazon →</span>
              <span className="text-xs text-stone-500">· Tostaduría →</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
