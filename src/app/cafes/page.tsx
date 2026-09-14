import { BEANS_SEED } from "@/data/beans";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: true } };
export default function CafesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black">Café en Grano — Guía de Selección</h1>
      <p className="text-sm text-stone-400 mt-2">
        Selección de orígenes probados con sus recetas de extracción recomendadas (ratio, temperatura y tiempo diana).
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {BEANS_SEED.map((b) => (
          <Link
            key={b.id}
            href={`/cafes/${b.slug}`}
            className="rounded-xl bg-stone-900 border border-stone-800 p-5 flex flex-col hover:border-amber-500/30 transition-all"
          >
            <ProductImage src={b.image} alt={b.name} className="aspect-[4/3] mb-3" />
            <h3 className="font-bold text-white">{b.roaster} — {b.name}</h3>
            <p className="text-xs text-stone-400 mt-1">{b.origin} • Tueste {b.roastProfile}</p>
            <p className="text-xs text-amber-300 mt-2">{b.tastingNotes.join(" • ")}</p>
            <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between items-center">
              <span className="text-xs text-stone-500">Ratio {b.recipe.ratio}</span>
              <span className="text-xs font-bold text-amber-400">Ver Receta y Ficha →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
