import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-stone-800/50 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 py-24 px-4 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-mono tracking-widest text-amber-400 border border-amber-500/20 mb-6">OBSIDIAN • BRONCE • RITUAL — 60% Rigor · 40% Alma</span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">Mastering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Extraction.</span><br /><span className="text-stone-100">Tu ritual, elevada a maestría.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-stone-400 leading-relaxed">No vendemos cafeína. Esculpimos tu identidad barista: <b className="text-stone-200">58mm saturado, PID quirúrgico, muelas planas</b> — compatibilidad verificada, estética obsidian que apetece compartir.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/recomendador" className="rounded-xl bg-gradient-to-b from-amber-600 to-amber-700 px-8 py-4 text-sm font-black text-white shadow-xl shadow-amber-900/30 hover:from-amber-500 hover:to-amber-600 transition-all flex items-center gap-2">⚡ Descubre tu Arquetipo — 2 min</Link>
              <Link href="/comparativas" className="rounded-xl border border-stone-700 bg-stone-900/80 px-8 py-4 text-sm font-bold text-stone-300 hover:bg-stone-800 hover:border-amber-500/30 transition-all">Ver Showcase Iconic →</Link>
            </div>
            <p className="mt-4 text-xs font-mono text-stone-500">Sin patrocinios • Datos verificados • 5% Hogar y cocina</p>
          </div>
        </section>
        <section className="py-10 px-4 sm:px-6 mx-auto max-w-7xl">
          <p className="text-center text-xs font-mono tracking-widest text-stone-500 mb-4">DESCUBRE TU ARQUETIPO BARISTA</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-stone-900 border border-amber-500/20 p-4"><p className="text-sm font-black text-amber-400">The Precisionist</p><p className="text-xs text-stone-400 mt-1">PID · 58mm · flow profiling. Control absoluto.</p></div>
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-4"><p className="text-sm font-bold text-stone-200">The Aesthetic Craft</p><p className="text-xs text-stone-400 mt-1">Nogal · acero cepillado · ritual minimal.</p></div>
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-4"><p className="text-sm font-bold text-stone-200">The Efficiencist</p><p className="text-xs text-stone-400 mt-1">ThermoJet 3s · consistencia sin fricción.</p></div>
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-4"><p className="text-sm font-bold text-stone-200">The Alchemist</p><p className="text-xs text-stone-400 mt-1">Anaeróbicos · bergamota · maracuyá.</p></div>
          </div>
        </section>
        <section className="py-8 px-4 sm:px-6 mx-auto max-w-7xl border-y border-stone-900">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500 text-center mb-6">Showcase Iconic — Setups que definen tribu</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/recomendador" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all"><span className="text-amber-500 font-bold block text-sm">The Minimalist Pro</span><span className="text-xs text-stone-400">Bambino + K6 · &lt;500€ · obsidian compact.</span></Link>
            <Link href="/recomendador" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all"><span className="text-amber-500 font-bold block text-sm">The Single-Dose Specialist</span><span className="text-xs text-stone-400">DF64 + Mara X · 0 retención.</span></Link>
            <Link href="/recomendador" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all"><span className="text-amber-500 font-bold block text-sm">Italian Heritage</span><span className="text-xs text-stone-400">Classic Evo + Specialita · 58mm.</span></Link>
            <Link href="/cafes" className="p-4 rounded-xl bg-stone-900/60 border border-amber-500/20 hover:border-amber-500/50 transition-all"><span className="text-amber-500 font-bold block text-sm">Sensory Alchemy</span><span className="text-xs text-stone-400">Gesha + Opus · floral · light.</span></Link>
          </div>
        </section>
        <section className="py-16 px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-8">
            <div><h2 className="text-2xl font-black text-stone-100">Comparativas — Tabla saturada, veredicto honesto</h2><p className="text-sm text-stone-400">Muelas planas vs cónicas: esculpiendo claridad y cuerpo.</p></div>
            <Link href="/comparativas" className="text-xs font-bold text-amber-500 hover:underline">Ver todas →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between"><div><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Ritual vs Eficiencia</span><h3 className="text-lg font-bold text-stone-200 mt-2">Bambino Plus vs Dedica</h3><p className="text-xs text-stone-400 mt-2">El salto a 58mm: por qué la extracción saturada cambia el juego.</p></div><Link href="/comparativas" className="mt-6 inline-block text-xs font-bold text-amber-400">Leer comparativa →</Link></div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between"><div><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Textura del cuerpo</span><h3 className="text-lg font-bold text-stone-200 mt-2">K6 vs Baratza ESP</h3><p className="text-xs text-stone-400 mt-2">Manual precisión vs eléctrico — claridad que se bebe.</p></div><Link href="/comparativas" className="mt-6 inline-block text-xs font-bold text-amber-400">Leer comparativa →</Link></div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between"><div><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Maestría</span><h3 className="text-lg font-bold text-stone-200 mt-2">Anna PID vs Classic Evo</h3><p className="text-xs text-stone-400 mt-2">Control quirúrgico vs lienzo modificable.</p></div><Link href="/comparativas" className="mt-6 inline-block text-xs font-bold text-amber-400">Leer comparativa →</Link></div>
          </div>
        </section>
        <section className="py-12 px-4 sm:px-6 mx-auto max-w-7xl border-t border-stone-900 bg-gradient-to-b from-transparent to-amber-950/10">
          <h2 className="text-xl font-black">🫘 Café en Grano — Tu maridaje Signature</h2>
          <p className="text-sm text-stone-400 mt-1">La máquina es tu ego en acero; el grano es tu firma olfativa. <Link href="/cafes" className="text-amber-500 underline">6 lotes curados</Link> — recurencia mensual, misma afiliación.</p>
          <Link href="/cafes" className="inline-block mt-4 px-6 py-3 rounded-xl bg-amber-600 text-sm font-black text-white hover:bg-amber-500">Explorar maridajes →</Link>
        </section>
      </main>
    </div>
  );
}
