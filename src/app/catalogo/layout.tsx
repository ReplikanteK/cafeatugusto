import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Catálogo Técnico — Máquinas y Molinillos",
  description: "Catálogo auditable 15 máquinas +11 molinillos — filtros 58mm, PID, stepless, thermoblock/dual. Espresso-only.",
  openGraph: {
    title: "Catálogo — Café A Tu Gusto",
    description: "Ficha técnica auditable — 58mm, PID, stepless, capacidad. Sin café de filtro.",
  },
};
export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
