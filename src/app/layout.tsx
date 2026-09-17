import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CookieBanner } from "@/components/ui/CookieBanner";
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
  // Sin canonical global: cada página fija la suya (un canonical único aquí
  // heredaba a todas las rutas y Google las veía como duplicadas de /).
};
// E-P0.5 Consent Mode v2: default denied → update granted → config/page_view
// Secuencia: default denied (antes de gtag) → usuario acepta en CookieBanner → consent update granted → gtag config
// Verificación: sin consent → no page_view; con consent → page_view + quiz_started/completed/result_viewed/amazon_click en GA4 Realtime
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-DWNL7Z9ZCQ";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {GA_ID ? (
          <>
            <Script id="consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied'
                });
                gtag('js', new Date());
              `}
            </Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init-deferred" strategy="afterInteractive">
              {`
                // No gtag config aquí — CookieBanner hará update+config tras consent granted
                // Si ya hay consent previo en localStorage, CookieBanner re-aplicará update+config en mount
                var c = null; try { c = localStorage.getItem('consent_analytics'); } catch(e) {}
                if (c === 'granted') {
                  gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
                  gtag('config', '${GA_ID}', { send_page_view: true });
                }
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        {!GA_ID && process.env.NODE_ENV === "development" && (
          <div style={{ display: "none" }} data-testid="ga-missing-warning">
            GA not configured — set NEXT_PUBLIC_GA_MEASUREMENT_ID
          </div>
        )}
      </body>
    </html>
  );
}
