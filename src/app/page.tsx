import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-stone-800/50 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 py-20 px-4 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-mono tracking-widest text-amber-400 border border-amber-500/20 mb-6">
              ANÁLISIS TÉCNICO • METODOLOGÍA TRANSPARENTE
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
              Mastering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Extraction.</span>
              <br />
              <span className="text-stone-100">Tu ritual espresso, llevado a maestría.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-stone-400 leading-relaxed">
              Sin recomendaciones a ciegas. Evaluamos compatibilidad real de portafiltros, control térmico PID y geometría de muelas para encontrar el setup exacto que encaja contigo.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/recomendador" className="rounded-xl bg-gradient-to-b from-amber-600 to-amber-700 px-8 py-4 text-sm font-black text-white shadow-xl shadow-amber-900/30 hover:from-amber-500 hover:to-amber-600 transition-all">
                ⚡ Test de Recomendación — 2 min
              </Link>
              <Link href="/catalogo" className="rounded-xl border border-stone-700 bg-stone-900/80 px-8 py-4 text-sm font-bold text-stone-300 hover:bg-stone-800 hover:border-amber-500/30 transition-all">
                Explorar Catálogo Técnico →
              </Link>
            </div>
          </div>
        </section>
        <section className="py-12 px-4 sm:px-6 mx-auto max-w-7xl">
          <p className="text-center text-xs font-mono tracking-widest text-stone-500 mb-6 uppercase">
            Arquetipos de Barista Doméstico
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-stone-900 border border-amber-500/20 p-5">
              <p className="text-sm font-black text-amber-400">The Precisionist</p>
              <p className="text-xs text-stone-400 mt-2">Búsqueda del control absoluto: PID, 58mm y perfilado de flujo.</p>
            </div>
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5">
              <p className="text-sm font-bold text-stone-200">The Aesthetic Craft</p>
              <p className="text-xs text-stone-400 mt-2">Acabados en madera, acero cepillado y un ritual pausado.</p>
            </div>
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5">
              <p className="text-sm font-bold text-stone-200">The Efficiencist</p>
              <p className="text-xs text-stone-400 mt-2">Calentamiento en segundos y consistencia sin complicaciones.</p>
            </div>
            <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5">
              <p className="text-sm font-bold text-stone-200">The Alchemist</p>
              <p className="text-xs text-stone-400 mt-2">Molienda de alta claridad para cafés de especialidad de tueste ligero.</p>
            </div>
          </div>
        </section>
        <section className="py-12 px-4 sm:px-6 mx-auto max-w-7xl border-t border-stone-900">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-stone-100">Comparativas Directas</h2>
              <p className="text-sm text-stone-400 mt-1">Análisis cara a cara con especificaciones auditables.</p>
            </div>
            <Link href="/comparativas" className="text-xs font-bold text-amber-500 hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/comparativas/sage-bambino-vs-delonghi-dedica" className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">Inicio Espresso</span>
                <h3 className="text-lg font-bold text-stone-200 mt-2">Bambino vs Dedica EC685</h3>
                <p className="text-xs text-stone-400 mt-2">ThermoJet 54mm vs 51mm presurizado y vapor automático.</p>
              </div>
              <span className="mt-6 text-xs font-bold text-amber-400">Leer análisis →</span>
            </Link>
            <Link href="/comparativas/kingrinder-k6-vs-baratza-encore-esp" className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">Molinillos Entrada</span>
                <h3 className="text-lg font-bold text-stone-200 mt-2">Kingrinder K6 vs Baratza ESP</h3>
                <p className="text-xs text-stone-400 mt-2">Precisión manual cónica frente a comodidad eléctrica paso a paso.</p>
              </div>
              <span className="mt-6 text-xs font-bold text-amber-400">Leer análisis →</span>
            </Link>
            <Link href="/comparativas/lelit-anna-vs-gaggia-classic-pro" className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">Gama Media Single Boiler</span>
                <h3 className="text-lg font-bold text-stone-200 mt-2">Lelit Anna PID vs Gaggia Classic Evo</h3>
                <p className="text-xs text-stone-400 mt-2">Control de temperatura integrado frente al estándar de 58mm.</p>
              </div>
              <span className="mt-6 text-xs font-bold text-amber-400">Leer análisis →</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
