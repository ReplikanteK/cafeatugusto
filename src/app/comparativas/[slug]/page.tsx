import { COMPARATIVES } from "@/data/comparatives";
import { MACHINES_SEED } from "@/data/machines";
import { GRINDERS_SEED } from "@/data/grinders";
import Link from "next/link";
import { amazonUrl } from "@/lib/amazon";
export function generateStaticParams() { return COMPARATIVES.map(c=> ({ slug: c.slug })); }
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COMPARATIVES.find(x=> x.slug===slug);
  if (!c) return { title: "Comparativa no encontrada" };
  const url = `${SITE_URL}/comparativas/${c.slug}`;
  return {
    title: `${c.title} — Café A Tu Gusto`,
    description: c.subtitle,
    alternates: { canonical: url },
    openGraph: { title: c.title, description: c.subtitle, url },
  };
}
function findPrice(asin: string): number | undefined {
  const m = MACHINES_SEED.find(x=> x.asin===asin);
  if (m) return m.priceApproxEUR;
  const g = GRINDERS_SEED.find(x=> x.asin===asin);
  return g?.priceApproxEUR;
}
export default async function ComparativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COMPARATIVES.find(x=> x.slug===slug);
  if (!c) return <main className="max-w-3xl mx-auto px-6 py-12 text-stone-400">Comparativa no encontrada. <Link href="/comparativas" className="text-amber-500 underline">Volver</Link></main>;
  const priceA = findPrice(c.a.asin);
  const priceB = findPrice(c.b.asin);
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs font-mono text-amber-400 tracking-widest">COMPARATIVA • RIGOR 60% + RITUAL 40% • PRECIOS VERIFICADOS 2026-09-15</p>
      <h1 className="text-3xl font-black text-white mt-2">{c.title}</h1>
      <p className="text-sm text-stone-300 mt-2 leading-relaxed">{c.subtitle}</p>
      <div className="mt-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 p-4">
        <p className="text-sm font-bold text-amber-300">Veredicto: {c.verdict}</p>
        <p className="text-xs text-stone-400 mt-1">{c.verdictArchetype}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {[c.a,c.b].map((p)=> {
          return (
          <div key={p.asin} className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="w-full aspect-[4/3] object-contain bg-white p-2" />
            <div className="p-4"><p className="font-bold text-white">{p.name}</p><a href={amazonUrl(p.asin, p.name)} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center py-2 bg-amber-600 rounded-lg text-xs font-black">Ver en Amazon →</a><p className="text-[10px] text-stone-500 text-center mt-1">(afiliado · verified)</p></div>
          </div>
        )})}
      </div>
      <div className="mt-8 rounded-xl border border-stone-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-stone-900 text-stone-400"><th className="p-3 text-left">Spec</th><th className="p-3 text-left">{c.a.name}</th><th className="p-3 text-left">{c.b.name}</th></tr></thead>
          <tbody>
            <tr className="border-t border-amber-500/20 bg-amber-950/10"><td className="p-3 font-black text-amber-300">Precio aprox.</td><td className="p-3 font-mono font-black text-amber-400">{priceA ? `${priceA}€` : "—"}</td><td className="p-3 font-mono font-black text-amber-400">{priceB ? `${priceB}€` : "—"}</td></tr>
            {c.specs.map(s=> <tr key={s.label} className="border-t border-stone-800"><td className="p-3 font-bold text-stone-300">{s.label}</td><td className="p-3 text-stone-400">{s.a}</td><td className="p-3 text-stone-400">{s.b}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl bg-stone-900 border border-stone-800 p-5">
        <h3 className="font-black text-white">Accesorios esenciales — Ritual</h3>
        <p className="text-xs text-stone-400 mt-1">Cross-selling afiliado — tamper, WDT, VST según diámetro.</p>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {c.accessories.map(a=> (
            <a key={a.asin} href={amazonUrl(a.asin, a.name)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-stone-950 border border-stone-800 p-3 hover:border-amber-500/30">
              <p className="font-bold text-sm text-white">{a.name}</p><p className="text-xs text-stone-500">{a.note}</p><p className="text-xs text-amber-400 mt-1">Ver en Amazon →</p>
            </a>
          ))}
        </div>
      </div>
      <p className="text-xs text-stone-500 mt-6"><Link href="/comparativas" className="text-amber-500 underline">← Volver a comparativas</Link> • <Link href="/recomendador" className="text-amber-500 underline">Recomendador →</Link></p>
    </main>
  );
}
