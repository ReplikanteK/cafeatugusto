import Link from "next/link";
export function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-bold text-stone-200 mb-3 text-base">Café A Tu Gusto</h3>
          <p className="text-xs text-stone-400 leading-relaxed">Recomendador independiente de máquinas de café, molinillos y selección de café de especialidad basado en especificaciones objetivas y compatibilidad real.</p>
        </div>
        <div>
          <h4 className="font-semibold text-stone-200 mb-2">Herramientas</h4>
          <ul className="space-y-2 text-xs"><li><Link href="/recomendador" className="hover:text-amber-400">Asistente de Setup Ideal</Link></li><li><Link href="/comparativas" className="hover:text-amber-400">Matriz de Comparativas</Link></li><li><Link href="/catalogo" className="hover:text-amber-400">Catálogo Técnico</Link></li><li><Link href="/cafes" className="hover:text-amber-400">Catálogo de Granos Curados</Link></li></ul>
        </div>
        <div>
          <h4 className="font-semibold text-stone-200 mb-2">Conocimiento</h4>
          <ul className="space-y-2 text-xs"><li><Link href="/catalogo" className="hover:text-amber-400">Ficha Técnica Completa</Link></li></ul>
        </div>
        <div>
          <h4 className="font-semibold text-stone-200 mb-2">Transparencia</h4>
          <ul className="space-y-2 text-xs"><li><Link href="/metodologia" className="hover:text-amber-400">Metodología de Scoring</Link></li><li><Link href="/afiliados" className="hover:text-amber-400">Aviso de Afiliación (Amazon 5%)</Link></li></ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 pt-6 border-t border-stone-900 text-center text-xs text-stone-500">© {new Date().getFullYear()} Café A Tu Gusto — Criterios de filtrado técnico y determinista.</div>
    </footer>
  );
}
