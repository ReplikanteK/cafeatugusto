import Link from "next/link";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-4">Algoritmo 100% independiente • Sin patrocinios</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-100 leading-tight">Encuentra tu <span className="text-amber-500">setup de espresso ideal</span> sin fallar en la elección.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-stone-400 leading-relaxed">Comparamos tolerancias de molienda, diámetros de portafiltro (54mm vs 58mm) y compatibilidad real de espacio y presupuesto.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/recomendador" className="rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-amber-500 transition-all flex items-center gap-2"><span>⚡</span> Iniciar Asistente (8 Pasos)</Link>
              <Link href="/comparativas" className="rounded-xl border border-stone-700 bg-stone-900 px-6 py-3.5 text-sm font-semibold text-stone-300 hover:bg-stone-800 transition-all">Ver Comparativas Populares</Link>
            </div>
          </div>
        </section>
        <section className="py-12 px-4 sm:px-6 mx-auto max-w-7xl border-b border-stone-900">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500 text-center mb-6">Búsquedas más frecuentes por presupuesto y formato</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/recomendador" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 transition-all"><span className="text-amber-500 font-bold block mb-1">Setups &lt; 400€</span><span className="text-xs text-stone-400">Inicio espresso con molinillo ajustado.</span></Link>
            <Link href="/recomendador" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 transition-all"><span className="text-amber-500 font-bold block mb-1">Estándar 58 mm</span><span className="text-xs text-stone-400">Accesorios profesionales VST.</span></Link>
            <Link href="/recomendador" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 transition-all"><span className="text-amber-500 font-bold block mb-1">Todo en Uno</span><span className="text-xs text-stone-400">Compactas con molinillo incorporado.</span></Link>
            <Link href="/cafes" className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 transition-all"><span className="text-amber-500 font-bold block mb-1">Café de Especialidad</span><span className="text-xs text-stone-400">Granos recién tostados para espresso.</span></Link>
          </div>
        </section>
        <section className="py-16 px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-8">
            <div><h2 className="text-2xl font-bold text-stone-100">Comparativas Frecuentes</h2><p className="text-sm text-stone-400">Enfrentamientos spec-by-spec.</p></div>
            <Link href="/comparativas" className="text-xs font-semibold text-amber-500 hover:underline">Ver todas →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between"><div><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Gama Media</span><h3 className="text-lg font-bold text-stone-200 mt-2">Sage Bambino Plus vs Dedica</h3><p className="text-xs text-stone-400 mt-2">ThermoJet 54mm vs 51mm presurizado. Diferencia real de extracción.</p></div><Link href="/comparativas" className="mt-6 inline-block text-xs font-bold text-amber-400">Leer comparativa →</Link></div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between"><div><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Molinillos</span><h3 className="text-lg font-bold text-stone-200 mt-2">Kingrinder K6 vs Baratza ESP</h3><p className="text-xs text-stone-400 mt-2">Manual precisión vs eléctrico comodidad día a día.</p></div><Link href="/comparativas" className="mt-6 inline-block text-xs font-bold text-amber-400">Leer comparativa →</Link></div>
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 flex flex-col justify-between"><div><span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Prosumer 58mm</span><h3 className="text-lg font-bold text-stone-200 mt-2">Lelit Anna vs Gaggia Classic</h3><p className="text-xs text-stone-400 mt-2">PID integrado vs clásico 58mm modificable.</p></div><Link href="/comparativas" className="mt-6 inline-block text-xs font-bold text-amber-400">Leer comparativa →</Link></div>
          </div>
        </section>
        <section className="py-12 px-4 sm:px-6 mx-auto max-w-7xl border-t border-stone-900">
          <h2 className="text-xl font-bold">☕ Café en Grano — Recurrencia</h2>
          <p className="text-sm text-stone-400 mt-1">La máquina dura 5 años, el grano se compra cada mes. Sección <Link href="/cafes" className="text-amber-500 underline">/cafes</Link> con 6 lotes curados.</p>
          <Link href="/cafes" className="inline-block mt-4 px-5 py-3 rounded-xl bg-stone-900 border border-stone-800 text-sm font-bold hover:border-amber-500">Explorar cafés →</Link>
        </section>
      </main>
    </div>
  );
}
