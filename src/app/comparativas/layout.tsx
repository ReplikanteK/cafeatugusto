import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Comparativas Espresso — Cara a Cara",
  description: "Comparativas auditables: Bambino vs Dedica, K6 vs ESP, Lelit vs Gaggia. Especs reales, sin humo.",
};
export default function ComparativasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
