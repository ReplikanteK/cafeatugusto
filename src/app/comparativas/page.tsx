import Link from "next/link";
import { COMPARATIVES } from "@/data/comparatives";
export default function ComparativasPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black">Comparativas — Longtail alta intención</h1>
      <p className="text-sm text-stone-400 mt-2">5 enfrentamientos curados spec-by-spec. Cada URL es landing SEO directa a compra.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {COMPARATIVES.map(c=> (
          <Link key={c.slug} href={`/comparativas/${c.slug}`} className="rounded-2xl bg-stone-900 border border-stone-800 p-6 hover:border-amber-500/40 transition-all flex flex-col">
            <h3 className="font-black text-white mt-2">{c.title}</h3>
            <p className="text-xs text-stone-400 mt-1">{c.subtitle}</p>
            <span className="mt-4 text-xs font-bold text-amber-400">Leer tabla rigor + veredicto →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
