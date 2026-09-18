import type { Metadata } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app";
export const metadata: Metadata = {
  title: "Comparativas Espresso — Cara a Cara",
  description: "Duelos auditables con specs reales: entry, gama media, superautos premium y molinillos.",
  alternates: { canonical: `${SITE_URL}/comparativas` },
};
export default function ComparativasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
