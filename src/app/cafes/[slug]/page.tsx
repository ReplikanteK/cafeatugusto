import { BEANS_SEED } from "@/data/beans";
import { MACHINES_SEED } from "@/data/machines";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { amazonUrl } from "@/lib/amazon";
export function generateStaticParams() { return BEANS_SEED.map(b=> ({ slug: b.slug })); }
export default async function BeanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bean = BEANS_SEED.find(b=> b.slug===slug);
  if (!bean) return <main className="max-w-3xl mx-auto px-6 py-12 text-stone-400">Grano no encontrado. <Link href="/cafes" className="text-amber-500 underline">Volver</Link></main>;
  const paired = bean.recommendedBrewing.includes("espresso") ? MACHINES_SEED.filter(m=> m.specs.pid).slice(0,2) : MACHINES_SEED.filter(m=> m.type==="superautomatic").slice(0,2);
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-mono text-amber-400 tracking-widest">{bean.process.toUpperCase()} • {bean.roastProfile.toUpperCase()}</p>
      <h1 className="text-3xl font-black text-white mt-2">{bean.roaster} — {bean.name}</h1>
      <p className="text-sm text-stone-400">{bean.origin} • {bean.tastingNotes.join(" • ")} • {bean.weightGrams}g • {bean.priceApproxEUR}€</p>
      <div className="mt-6 rounded-2xl bg-stone-900 border border-stone-800 p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1"><ProductImage src={bean.image} alt={bean.name} /></div>
        <div className="flex-1 space-y-4">
          <h2 className="font-black text-amber-400">The Ritual Recipe</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-stone-950 border border-stone-800 p-3"><p className="text-stone-500 text-xs">Ratio</p><p className="font-mono font-bold text-white">{bean.recipe.ratio}</p></div>
            <div className="rounded-lg bg-stone-950 border border-stone-800 p-3"><p className="text-stone-500 text-xs">Tiempo diana</p><p className="font-mono font-bold text-white">{bean.recipe.timeSec}</p></div>
            <div className="rounded-lg bg-stone-950 border border-stone-800 p-3"><p className="text-stone-500 text-xs">Molienda</p><p className="font-bold text-white">{bean.recipe.grind}</p></div>
            <div className="rounded-lg bg-stone-950 border border-stone-800 p-3"><p className="text-stone-500 text-xs">Temp / Yield</p><p className="font-bold text-white">{bean.recipe.tempC}°C • {bean.recipe.yield}</p></div>
          </div>
          <p className="text-xs text-stone-500">Para PID 58mm: {bean.recipe.tempC}°C estable. Superauto: usa programa espresso largo.</p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-stone-900 border border-stone-800 p-5">
        <h3 className="font-bold text-white">Perfil sensorial</h3>
        <p className="text-sm text-stone-400 mt-1">{bean.tastingNotes.join(" • ")} — {bean.process} — tueste {bean.roastProfile}</p>
        <p className="text-xs text-stone-500 mt-2">Recomendado para: {bean.recommendedBrewing.join(", ")}</p>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-white">Maridaje setups — brilla con</h3>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {paired.map(m=> (
            <div key={m.id} className="rounded-lg bg-stone-900 border border-stone-800 p-3 flex items-center gap-3">
              <ProductImage src={m.image} alt={m.model} className="w-16 h-16 rounded" />
              <div><p className="font-bold text-sm text-white">{m.brand} {m.model}</p><p className="text-xs text-stone-400">{m.specs.pid ? "PID" : "No PID"} • {m.specs.portafilterDiameter}mm</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <a href={amazonUrl(bean.amazonAsin!, `${bean.roaster} ${bean.name}`)} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-amber-600 rounded-xl text-center font-black text-sm">Comprar en Amazon →</a>
        <a href={bean.directLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-stone-800 border border-stone-700 rounded-xl text-center font-bold text-sm hover:border-amber-500/30">Tostaduría →</a>
      </div>
      <p className="text-[11px] text-stone-500 text-center mt-2">Afiliado amazon.es + directo tostaduría.</p>
      <p className="text-xs text-stone-500 mt-6"><Link href="/cafes" className="text-amber-500 underline">← Volver a cafés</Link></p>
    </main>
  );
}
