"use client";
import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/recomendador", label: "Recomendador" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/comparativas", label: "Comparativas" },
];

// Navegación móvil: hamburguesa con panel desplegable.
// En desktop (md+) el Header muestra los enlaces en línea.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-800 text-stone-300 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
      >
        {open ? (
          <span aria-hidden className="text-lg leading-none">✕</span>
        ) : (
          <span aria-hidden className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        )}
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-stone-800 bg-stone-950/95 backdrop-blur-md">
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-xs font-mono uppercase tracking-[0.18em] text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
