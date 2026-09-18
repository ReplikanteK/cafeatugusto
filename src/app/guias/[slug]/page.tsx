import { GUIDES_SEED } from "@/data/guides";
import Link from "next/link";
import { GuideCtaLink } from "@/components/ui/GuideCtaLink";

export function generateStaticParams() {
  return Object.keys(GUIDES_SEED).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES_SEED[slug];
  if (!g) return { title: "Guía no encontrada" };
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app"}/guias/${slug}`;
  return {
    title: `${g.title} — Café a Tu Gusto`,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { title: g.title, description: g.description, url },
  };
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES_SEED[slug];
  if (!g) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-stone-400">
        Guía no encontrada. <Link href="/guias" className="text-amber-500 underline">Volver a guías</Link>
      </main>
    );
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    author: { "@type": "Organization", name: "Café a Tu Gusto" },
    publisher: { "@type": "Organization", name: "Café a Tu Gusto", logo: { "@type": "ImageObject", url: `${base}/og-image.jpg` } },
    mainEntityOfPage: `${base}/guias/${g.slug}`,
    datePublished: "2026-09-01",
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-xs font-mono tracking-widest text-amber-400">GUÍA • {g.targetMetric.toUpperCase()} • {g.readingTime}</p>
      <h1 className="text-3xl font-black text-white mt-2">{g.title}</h1>
      <p className="text-sm text-stone-400 mt-2">{g.subtitle}</p>
      <p className="text-xs text-stone-500 mt-2">{g.description}</p>

      <div className="mt-6 rounded-xl border border-stone-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-900 text-stone-400">
              {g.table.headers.map((h) => (
                <th key={h} className="p-3 text-left font-mono text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.table.rows.map((row, i) => (
              <tr key={i} className="border-t border-stone-800">
                {row.map((cell, j) => (
                  <td key={j} className={`p-3 ${j === 0 ? "font-bold text-stone-300" : "text-stone-400"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4">
        {g.keyTakeaways.map((k) => (
          <div key={k.title} className="rounded-xl bg-stone-900 border border-stone-800 p-4">
            <p className="font-bold text-white text-sm">{k.title}</p>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">{k.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-amber-950/20 border border-amber-500/20 p-5">
        <p className="text-sm font-bold text-amber-300">¿Listo para tu setup ideal?</p>
        <p className="text-xs text-stone-400 mt-1">
          Si ya lo tienes claro, el siguiente paso es el recomendador: test de 1 minuto → Top 3 con desglose detallado.
        </p>
        <GuideCtaLink slug={slug} position="bottom_banner" className="mt-3 inline-block bg-amber-600 hover:bg-amber-500 text-white text-xs font-black px-4 py-2 rounded-lg">
          Hacer test 1 minuto →
        </GuideCtaLink>
        <p className="text-[11px] text-stone-500 mt-2">
          Seguir explorando: <Link href="/comparativas" className="underline">comparativas</Link> •{" "}
          <Link href="/catalogo" className="underline">catálogo 17+10</Link> •{" "}
          <Link href="/metodologia" className="underline">metodología</Link>
        </p>
      </div>

      <p className="text-xs text-stone-500 mt-6">
        <Link href="/guias" className="text-amber-500 underline">← Volver a guías</Link> •{" "}
        <GuideCtaLink slug={slug} position="inline_text" className="text-amber-500 underline">Recomendador →</GuideCtaLink>
      </p>
    </main>
  );
}
