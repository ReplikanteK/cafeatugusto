import type { Metadata } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app";
export const metadata: Metadata = {
  title: "Catálogo Técnico — Máquinas y Molinillos",
  description: "Catálogo auditable 17 máquinas +9 molinillos — filtros 58mm, PID, stepless, thermoblock/dual. Espresso-only.",
  alternates: { canonical: `${SITE_URL}/catalogo` },
  openGraph: {
    title: "Catálogo — Café A Tu Gusto",
    description: "Ficha técnica auditable — 58mm, PID, stepless, capacidad. Sin café de filtro.",
  },
};
export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
