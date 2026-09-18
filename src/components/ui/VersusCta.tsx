"use client";
import { track } from "@/lib/analytics";
import { amazonUrl } from "@/lib/amazon";

// CTA de versus con elegibilidad comercial: solo recommendable enlaza a Amazon.
// Registra amazon_click con source comparativa para el experimento CTR.
export function VersusCta({ asin, name, slug, role, recommendable, note }: {
  asin: string; name: string; slug: string;
  role: "a" | "b" | "accessory";
  recommendable: boolean; note?: string;
}) {
  if (!recommendable) {
    return (
      <div>
        <span className="mt-3 block text-center py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs font-bold text-stone-400">Comprobación pendiente</span>
        <p className="text-[10px] text-stone-500 text-center mt-1">(afiliado · pendiente)</p>
      </div>
    );
  }
  return (
    <div>
      <a
        href={amazonUrl(asin, name)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("amazon_click", { asin, title: name, source: "comparativa", slug, product_role: role })}
        className="mt-3 block text-center py-2 bg-amber-600 rounded-lg text-xs font-black"
      >
        Ver en Amazon →
      </a>
      <p className="text-[10px] text-stone-500 text-center mt-1">(afiliado · verificado){note ? ` · ${note}` : ""}</p>
    </div>
  );
}

// Enlace de accesorio: cross-selling existente (fuera de la política de
// elegibilidad de producto), pero con tracking para medir todo el CTR afiliado.
export function AccessoryCta({ asin, name, note, slug }: {
  asin: string; name: string; note: string; slug: string;
}) {
  return (
    <a
      href={amazonUrl(asin, name)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("amazon_click", { asin, title: name, source: "comparativa_accessory", slug, product_role: "accessory" })}
      className="rounded-lg bg-stone-950 border border-stone-800 p-3 hover:border-amber-500/30"
    >
      <p className="font-bold text-sm text-white">{name}</p>
      <p className="text-xs text-stone-500">{note}</p>
      <p className="text-xs text-amber-400 mt-1">Ver en Amazon →</p>
    </a>
  );
}
