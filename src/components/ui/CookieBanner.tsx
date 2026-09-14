"use client";
import { useEffect, useState } from "react";

const CONSENT_KEY = "consent_analytics";
export type ConsentValue = "granted" | "denied" | null;

export function getConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CONSENT_KEY) as ConsentValue) ?? null;
}

function setConsent(value: "granted" | "denied") {
  localStorage.setItem(CONSENT_KEY, value);
  // Consent Mode v2 update
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (gtag) {
    gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (value === "granted") {
      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-DWNL7Z9ZCQ";
      // config tras consent granted → dispara page_view
      gtag("config", gaId, { send_page_view: true });
    }
  }
  window.dispatchEvent(new CustomEvent("consent-updated", { detail: value }));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === null) setVisible(true);
    else if (consent === "granted") {
      // re-aplica update en recargas (layout default denied es anterior)
      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      if (gtag) {
        gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-DWNL7Z9ZCQ";
        gtag("config", gaId, { send_page_view: true });
      }
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-3 sm:p-4" data-testid="cookie-banner">
      <div className="max-w-4xl mx-auto rounded-2xl border border-stone-700 bg-stone-900 p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Cookies analíticas</p>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Usamos GA4 solo si aceptas. Sin consentimiento no se carga analítica.{" "}
            <a href="/afiliados" className="underline text-amber-400">
              Más info
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => {
              setConsent("denied");
              setVisible(false);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-sm font-bold text-stone-200 hover:bg-stone-700"
            data-testid="cookie-reject"
          >
            Rechazar
          </button>
          <button
            onClick={() => {
              setConsent("granted");
              setVisible(false);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-600 text-sm font-black text-white hover:bg-amber-500"
            data-testid="cookie-accept"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
