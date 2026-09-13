import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Recomendador de Setup Espresso",
  description: "Test de 2 min — 8 preguntas, compatibilidad 58mm/PID/stepless y capacidad diaria. Motor espresso-only sin humo.",
  openGraph: {
    title: "Recomendador — Café A Tu Gusto",
    description: "¿Qué setup espresso encaja contigo? 8 preguntas, TOP3 con 58mm, PID y single-dose evaluados.",
  },
};
export default function RecomendadorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
