import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = { title: "Café A Tu Gusto — Tu setup ideal", description: "Recomendador independiente de setups espresso" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full flex flex-col bg-stone-950 text-stone-100"><Header /><div className="flex-1">{children}</div><Footer /></body></html>;
}
