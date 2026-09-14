import Link from "next/link";
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span className="font-bold tracking-tight text-amber-500 text-xl">Café A Tu Gusto</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-stone-300">
          <Link href="/recomendador" className="hover:text-amber-400 transition-colors flex items-center gap-1"><span>⚡</span> Recomendador</Link>
          <Link href="/catalogo" className="hover:text-amber-400 transition-colors flex items-center gap-1"><span>🗂️</span> Catálogo</Link>
          <Link href="/comparativas" className="hover:text-amber-400 transition-colors flex items-center gap-1"><span>⚔️</span> Comparativas</Link>
        </nav>
      </div>
    </header>
  );
}
