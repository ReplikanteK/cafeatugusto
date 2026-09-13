import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cafeatugusto.vercel.app";
export const metadata: Metadata = {
  verification: { google: "6yfZaTPJGnEE54GkhDnsWBf_qB5-2ov3Mdeuqs2G5ec" },
  metadataBase: new URL(SITE_URL),
  title: { default: "Café A Tu Gusto — Tu setup ideal", template: "%s | Café A Tu Gusto" },
  description:
    "Recomendador de setups de espresso real — compatibilidad 58mm, PID, stepless y capacidad por uso diario. Metodología transparente, sin humo.",
  openGraph: {
    title: "Café A Tu Gusto — Tu setup ideal",
    description: "El motor de recomendación de setups de espresso real. 58mm, PID y single-dose evaluados sin humo.",
    url: SITE_URL,
    siteName: "Café A Tu Gusto",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Café A Tu Gusto — setups espresso" }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Café A Tu Gusto — Tu setup ideal",
    description: "Recomendador de setups de espresso real — 58mm, PID, stepless.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};
// P0-2 GA4: define NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX en .env.local
// Verificación Power Tenant-level: tras completar wizard, abrir DevTools → Network filtrar "googletagmanager.com" o "google-analytics.com"
// y comprobar petición g/collect con event quiz_completed. En GA4 → Informes → Tiempo real también debe aparecer.
// Sin esta var, window.gtag no existe y track() solo hace console.warn (bug anterior).
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        {!GA_ID && process.env.NODE_ENV === "development" && (
          <div style={{ display: "none" }} data-testid="ga-missing-warning">
            GA not configured — set NEXT_PUBLIC_GA_MEASUREMENT_ID
          </div>
        )}
      </body>
    </html>
  );
}
