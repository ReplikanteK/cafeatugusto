import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <div className="inline-flex px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs font-mono uppercase tracking-widest">Motor determinista • Sin IA inventada</div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">Encuentra tu <span className="text-emerald-400">setup de café</span> ideal</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">Responde 8 preguntas y te recomendamos la máquina y el molinillo que mejor encajan con tu forma de preparar café. Sin rankings genéricos, con especificaciones verificadas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/recomendador" className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg">Descubrir mi setup →</Link>
            <Link href="/metodologia" className="px-8 py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-bold">Cómo funciona</Link>
          </div>
          <p className="text-xs text-neutral-500 font-mono">Menos de 2 min • Basado en características reales • 5% afiliación Hogar y cocina</p>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"><div className="text-2xl">☕</div><h3 className="font-bold mt-2">Quiero empezar</h3><p className="text-sm text-neutral-400">No sé qué comprar. 250-500 € y quiero espresso sin arrepentirme.</p></div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"><div className="text-2xl">⚙️</div><h3 className="font-bold mt-2">Ya tengo experiencia</h3><p className="text-sm text-neutral-400">Quiero mejorar mi equipo y controlar variables (PID, 58mm).</p></div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"><div className="text-2xl">🔍</div><h3 className="font-bold mt-2">Quiero comparar</h3><p className="text-sm text-neutral-400">Ya tengo modelos en mente — valida compatibilidad setup completo.</p></div>
        </div>
        <footer className="mt-12 text-center text-[11px] text-neutral-500 border-t border-neutral-900 pt-6">En calidad de Afiliado de Amazon, obtengo ingresos por compras adscritas. <Link href="/metodologia" className="underline">Metodología</Link> • <Link href="/afiliados" className="underline">Afiliados</Link></footer>
      </div>
    </main>
  );
}
