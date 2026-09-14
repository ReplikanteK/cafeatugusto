import Link from "next/link";
import { GUIDES_SEED } from "@/data/guides";

export const metadata = {
  title: "Guías — Café a Tu Gusto | 54mm vs 58mm, Dial-in y Thermoblock",
  description: "3 guías técnicas sin humo: 54mm vs 58mm, dial-in por tueste y Thermoblock vs caldera. Tablas, takeaways y CTA al recomendador.",
};

export default function GuiasPage() {
  const guides = Object.values(GUIDES_SEED);
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-xs font-mono tracking-widest text-amber-400">GUÍAS • SEO TOFU/MOFU</p>
      <h1 className="text-3xl font-black text-white mt-2">Guías técnicas — sin thin content</h1>
      <p className="text-sm text-stone-400 mt-2 max-w-2xl">
        Contenido curado para capturar intención pre-compra y canalizar hacia el recomendador. Cada guía es tabla + takeaways + veredicto, con internal linking a comparativas y recomendador.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guias/${g.slug}`}
            className="rounded-2xl bg-stone-900 border border-stone-800 p-6 hover:border-amber-500/40 transition-all flex flex-col"
          >
            <span className="text-xs font-mono text-amber-400">{g.slug} • {g.readingTime} • {g.targetMetric}</span>
            <h3 className="font-black text-white mt-2">{g.title}</h3>
            <p className="text-xs text-stone-400 mt-1">{g.subtitle}</p>
            <p className="text-xs text-stone-500 mt-2 line-clamp-3">{g.description}</p>
            <span className="mt-4 text-xs font-bold text-amber-400">Leer guía completa →</span>
          </Link>
        ))}
      </div>
      <div className="mt-10 rounded-2xl bg-amber-950/20 border border-amber-500/20 p-5">
        <p className="text-sm font-bold text-amber-300">¿Dudas entre modelos concretos?</p>
        <p className="text-xs text-stone-400 mt-1">Haz el test de 1 minuto y obtén tu Top 3 con desglose 7 dims.</p>
        <Link href="/recomendador" className="mt-3 inline-block bg-amber-600 hover:bg-amber-500 text-white text-xs font-black px-4 py-2 rounded-lg">
          Ir al recomendador →
        </Link>
      </div>
      <p className="text-xs text-stone-500 mt-6">
        <Link href="/comparativas" className="text-amber-500 underline">Comparativas longtail →</Link> •{" "}
        <Link href="/metodologia" className="text-amber-500 underline">Metodología →</Link>
      </p>
    </main>
  );
}
