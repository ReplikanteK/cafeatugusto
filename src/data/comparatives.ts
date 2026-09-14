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
    a: { name: "Sage Bambino", asin: "B09713NW8H", image: "/images/machines/sage-bambino.jpg" },
    b: { name: "De'Longhi Dedica EC685", asin: "B06X3Z9MF3", image: "/images/machines/dedica-ec685.jpg" },
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
      { name: "WDT 0.35mm 10 agujas", asin: "B0BH8MRB2Z", note: "0.35mm acero 304 — distribución naked (verificado ES)" },
    ],
  },
  {
    slug: "lelit-anna-vs-gaggia-classic-pro",
    title: "Lelit Anna PL41TEM vs Gaggia Classic Evo Pro",
    subtitle: "Prosumer entrada — PID 57mm vs 58mm latón. Control quirúrgico vs lienzo modificable.",
    verdict: "Anna si quieres PID integrado sin mods; Classic si buscas plataforma 58mm para tunear.",
    verdictArchetype: "The Precisionist → Anna (PID). The Aesthetic Craft → Classic (58mm latón).",
    a: { name: "Lelit Anna PL41TEM", asin: "B00BS7RFSO", image: "/images/machines/lelit-anna-pl41tem.jpg" },
    b: { name: "Gaggia Classic Evo Pro", asin: "B086H1W384", image: "/images/machines/gaggia-classic-evo.jpg" },
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
      { name: "Portafiltro bottomless 58mm E61", asin: "B09N2C9FP5", note: "Universal E61/58mm — diagnóstico canalización (verificado ES)" },
    ],
  },
  {
    slug: "kingrinder-k6-vs-baratza-encore-esp",
    title: "KINGrinder K6 vs Baratza Encore ESP",
    subtitle: "Molinillo manual precisión vs eléctrico diario. Misma molienda espresso, ritual opuesto.",
    verdict: "K6 para cero retención y viaje; Encore ESP para pulsar botón diario sin curva.",
    verdictArchetype: "The Alchemist → K6 (single-dose). The Efficiencist → Encore ESP.",
    a: { name: "KINGrinder K6", asin: "B0GK8VQW77", image: "/images/grinders/kingrinder-k6.jpg" },
    b: { name: "Baratza Encore ESP", asin: "B0CDCDR385", image: "/images/grinders/baratza-encore-esp.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 48mm", b: "Cónica 40mm" },
      { label: "Ajuste", a: "Stepped fino", b: "Stepped" },
      { label: "Retención", a: "Casi 0", b: "Media" },
      { label: "Hopper", a: "30g single-dose", b: "230g" },
      { label: "Ruido", a: "Silencioso manual", b: "Medio eléctrico" },
      { label: "Precio aprox", a: "110€", b: "190€" },
    ],
    accessories: [
      { name: "Báscula 0.1g con timer", asin: "B0D9NX6VNG", note: "0.1g/2kg impermeable con timer — dose control (verificado ES)" },
      { name: "Soplador single-dose", asin: "B0DB1J2S6V", note: "Silicona genérico — retención mínima (verificado ES)" },
    ],
  },
  {
    slug: "sage-barista-express-vs-delonghi-specialista-arte",
    title: "Sage Barista Express vs De'Longhi La Specialista Arte",
    subtitle: "Todo-en-uno 54mm ThermoJet vs 51mm compacto. Misma promesa integrada, extracción opuesta.",
    verdict: "Barista Express si quieres PID + 54mm con margen de mejora (muelas cónicas 40mm regulables); Specialista Arte si priorizas huella compacta y flujo guiado My LatteArt a 550€.",
    verdictArchetype: "The Precisionist → Barista Express (PID 54mm + manómetro). The Efficiencist → Specialista Arte (51mm guiado).",
    a: { name: "Sage Barista Express", asin: "B077YZXR1W", image: "/images/machines/sage-barista-express.jpg" },
    b: { name: "De'Longhi La Specialista Arte", asin: "B0B8JV43LL", image: "/images/machines/delonghi-specialista-arte.jpg" },
    specs: [
      { label: "Portafiltro", a: "54 mm", b: "51 mm" },
      { label: "Molinillo integrado", a: "Cónico 40mm 18 niveles", b: "Cónico 8 niveles" },
      { label: "Térmico", a: "Thermoblock PID 60s", b: "Thermoblock 45s" },
      { label: "PID", a: "Sí", b: "No" },
      { label: "Presión", a: "15 bar + manómetro", b: "15 bar" },
      { label: "Depósito", a: "2.0 L", b: "1.5 L" },
    ],
    accessories: [
      { name: "Anillo dosificador magnético 54mm", asin: "B0GXFD87XD", note: "Aluminio 54mm — evita desperdicio en Barista Express (verificado ES)" },
      { name: "Tamper regulable 51mm", asin: "B0D92111HV", note: "51mm presión constante — para Specialista Arte (verificado ES)" },
    ],
  },
  {
    slug: "eureka-mignon-manuale-vs-baratza-encore-esp",
    title: "Eureka Mignon Manuale vs Baratza Encore ESP",
    subtitle: "Entrada espresso dedicada vs híbrido espresso+filtro. Muelas planas 50mm silenciosas vs cónicas 40mm versátiles.",
    verdict: "Mignon Manuale si tu foco es 100% espresso con ajuste micrométrico stepless y 50mm planas; Encore ESP si alternas filtro y espresso sin cambiar molinillo.",
    verdictArchetype: "The Purist → Manuale (planas 50mm stepless). The Versatilist → Encore ESP (cónica 40mm + filtro).",
    a: { name: "Eureka Mignon Manuale", asin: "B0FJ8Q6KQZ", image: "/images/grinders/eureka-manuale.jpg" },
    b: { name: "Baratza Encore ESP", asin: "B0CDCDR385", image: "/images/grinders/baratza-encore-esp.jpg" },
    specs: [
      { label: "Muelas", a: "Planas 50mm", b: "Cónicas 40mm" },
      { label: "Ajuste", a: "Stepless micrométrico", b: "Stepped 20 pasos" },
      { label: "Espresso / Filtro", a: "Espresso sí / Filtro no", b: "Espresso sí / Filtro sí" },
      { label: "Hopper", a: "300g", b: "230g" },
      { label: "Retención", a: "Media", b: "Media" },
      { label: "Precio aprox", a: "270€", b: "190€" },
    ],
    accessories: [
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — mantenimiento semanal (verificado ES)" },
      { name: "Tolva single-dose 45g", asin: "B0D1PF6Z57", note: "Fuelle soplador 58mm — reduce retención (verificado ES)" },
    ],
  },
];
