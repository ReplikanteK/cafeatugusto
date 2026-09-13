import Link from "next/link";
export default function ComparativasPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black">Comparativas</h1>
      <p className="text-sm text-stone-400 mt-2">Hub SEO — enfrentamientos spec-by-spec con veredicto. Próximamente `/comparativas/[slug]` dinámico.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Link href="/recomendador" className="p-6 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500"><h3 className="font-bold">Sage Bambino vs Dedica</h3><p className="text-xs text-stone-400 mt-1">54mm ThermoJet vs 51mm</p></Link>
        <Link href="/recomendador" className="p-6 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500"><h3 className="font-bold">Lelit Anna vs Profitec Go</h3><p className="text-xs text-stone-400 mt-1">57mm vs 58mm PID</p></Link>
        <Link href="/recomendador" className="p-6 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500"><h3 className="font-bold">Eureka Manuale vs Specialita</h3><p className="text-xs text-stone-400 mt-1">50mm vs 55mm stepless</p></Link>
      </div>
    </main>
  );
}
