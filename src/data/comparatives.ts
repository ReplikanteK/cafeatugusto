export interface Comparative {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly verdict: string;
  readonly verdictArchetype: string;
  readonly specs: readonly { label: string; a: string; b: string }[];
  readonly a: { name: string; asin: string; image: string };
  readonly b: { name: string; asin: string; image: string };
  readonly accessories: readonly { name: string; asin: string; note: string }[];
}
export const COMPARATIVES: readonly Comparative[] = [
  {
    slug: "sage-bambino-vs-delonghi-dedica",
    title: "Sage Bambino vs De'Longhi Dedica EC685",
    subtitle: "Gama entrada — 54mm ThermoJet vs 51mm presurizado. Misma encimera, extracción distinta.",
    verdict: "Bambino para quien busca primer espresso real con PID; Dedica si presupuesto manda y espacio es crítico.",
    verdictArchetype: "The Precisionist → Bambino (PID 54mm). The Efficiencist con 210€ → Dedica.",
    a: { name: "Sage Bambino", asin: "B0813S2G2N", image: "/images/machines/sage-bambino.jpg" },
    b: { name: "De'Longhi Dedica EC685", asin: "B06WWDZ425", image: "/images/machines/dedica-ec685.jpg" },
    specs: [
      { label: "Portafiltro", a: "54 mm", b: "51 mm (presurizado)" },
      { label: "Térmico", a: "Thermoblock ThermoJet 3s", b: "Thermoblock 40s" },
      { label: "PID", a: "Sí", b: "No" },
      { label: "Listo para extraer", a: "3s", b: "40s" },
      { label: "Vapor", a: "Manual, buen texturizado", b: "Manual básico" },
      { label: "Depósito", a: "1.4 L", b: "1.1 L" },
    ],
    accessories: [
      { name: "Tamper 54mm presión constante", asin: "B0DSLYKM31", note: "Para 54mm — evita canalización" },
      { name: "WDT 0.35mm titanio", asin: "B0BW9658TW", note: "Distribución naked" },
    ],
  },
  {
    slug: "lelit-anna-vs-gaggia-classic-pro",
    title: "Lelit Anna PL41TEM vs Gaggia Classic Evo Pro",
    subtitle: "Prosumer entrada — PID 57mm vs 58mm latón. Control quirúrgico vs lienzo modificable.",
    verdict: "Anna si quieres PID integrado sin mods; Classic si buscas plataforma 58mm para tunear.",
    verdictArchetype: "The Precisionist → Anna (PID). The Aesthetic Craft → Classic (58mm latón).",
    a: { name: "Lelit Anna PL41TEM", asin: "B00BQU8T9A", image: "/images/machines/lelit-anna-pl41tem.jpg" },
    b: { name: "Gaggia Classic Evo Pro", asin: "B0C77413S8", image: "/images/machines/gaggia-classic-evo.jpg" },
    specs: [
      { label: "Portafiltro", a: "57 mm", b: "58 mm" },
      { label: "Caldera", a: "Single boiler latón PID", b: "Single boiler latón" },
      { label: "PID", a: "Sí (LCC)", b: "No (mod)" },
      { label: "Listo", a: "3 min", b: "5 min" },
      { label: "Footprint", a: "Small", b: "Medium" },
      { label: "Vapor", a: "Manual", b: "Manual, espera térmica" },
    ],
    accessories: [
      { name: "Cesta VST 18g 58mm", asin: "B0CGVVSM19", note: "Solo Classic 58mm — precisión" },
      { name: "Portafiltro bottomless nogal 58mm", asin: "B0CXSNQLZL", note: "Diagnóstico canalización" },
    ],
  },
  {
    slug: "kingrinder-k6-vs-baratza-encore-esp",
    title: "KINGrinder K6 vs Baratza Encore ESP",
    subtitle: "Molinillo manual precisión vs eléctrico diario. Misma molienda espresso, ritual opuesto.",
    verdict: "K6 para cero retención y viaje; Encore ESP para pulsar botón diario sin curva.",
    verdictArchetype: "The Alchemist → K6 (single-dose). The Efficiencist → Encore ESP.",
    a: { name: "KINGrinder K6", asin: "B09WV9Y2S9", image: "/images/grinders/kingrinder-k6.jpg" },
    b: { name: "Baratza Encore ESP", asin: "B0BSMS325R", image: "/images/grinders/baratza-encore-esp.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 48mm", b: "Cónica 40mm" },
      { label: "Ajuste", a: "Stepped fino", b: "Stepped" },
      { label: "Retención", a: "Casi 0", b: "Media" },
      { label: "Hopper", a: "30g single-dose", b: "230g" },
      { label: "Ruido", a: "Silencioso manual", b: "Medio eléctrico" },
      { label: "Precio aprox", a: "110€", b: "190€" },
    ],
    accessories: [
      { name: "Báscula 0.1g con timer", asin: "B0F6BLBQPY", note: "Dose control" },
      { name: "Soplador single-dose", asin: "B0BBR3LRYW", note: "Retención mínima" },
    ],
  },
];
