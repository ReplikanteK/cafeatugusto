import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacidad y Cookies — Café A Tu Gusto",
  description: "Cómo tratamos analítica, consentimiento y afiliación. GA4 solo con consentimiento, sin venta de datos.",
};
export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black text-white">Privacidad y Cookies</h1>
      <p className="text-sm text-stone-400 mt-2">Transparencia — sin letra pequeña.</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-stone-300">
        <section>
          <h2 className="font-bold text-white">Analítica (GA4)</h2>
          <p className="mt-2">Usamos Google Analytics 4 solo si aceptas en el banner. Por defecto el consentimiento es <span className="font-mono text-amber-400">denied</span> y no se configura `gtag` ni se envían eventos/`page_view` analíticos. Al aceptar hacemos `consent update granted` y luego `gtag config`. Puedes revocar borrando `consent_analytics` en localStorage.</p>
        </section>
        <section>
          <h2 className="font-bold text-white">Afiliación Amazon</h2>
          <p className="mt-2">En calidad de Afiliado de Amazon obtengo ingresos por compras adscritas que cumplan requisitos. Los enlaces llevan `?tag=cafeatugusto-21` y no alteran tu precio. Precios y disponibilidad pueden cambiar — verifica en Amazon antes de comprar. Más detalle en <a href="/afiliados" className="text-amber-400 underline">/afiliados</a>.</p>
        </section>
        <section>
          <h2 className="font-bold text-white">Datos</h2>
          <p className="mt-2">No vendemos datos, no usamos `ad_storage` ni `ad_personalization` (siempre `denied`). Solo `analytics_storage` si consientes. Sin consentimiento, `track()` solo avisa en consola.</p>
        </section>
      </div>
    </main>
  );
}
