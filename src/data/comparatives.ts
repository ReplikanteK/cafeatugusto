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
    slug: "delonghi-dedica-vs-krups-virtuoso",
    title: "De'Longhi Dedica EC685 vs Krups Virtuoso XP444",
    subtitle: "Entrada compacta — 51mm presurizado 15cm vs 51mm ThermoJet pannarello. Misma huella, extracción tolerante.",
    verdict: "Dedica si priorizas 15cm y ecosistema 51mm barato; Virtuoso si quieres ThermoJet intuitivo y lanza pannarello más amable día uno.",
    verdictArchetype: "The Efficiencist con 190€ → Virtuoso (40s, pannarello). The Aesthetic compact → Dedica (15cm).",
    a: { name: "De'Longhi Dedica EC685", asin: "B06X3ZWVZ7", image: "/images/machines/delonghi-dedica-ec685.jpg" },
    b: { name: "Krups Virtuoso XP444", asin: "B0C85NMRXP", image: "/images/machines/krups-virtuoso-xp444.jpg" },
    specs: [
      { label: "Portafiltro", a: "51 mm presurizado", b: "51 mm" },
      { label: "Térmico", a: "Thermoblock 40s", b: "Thermoblock 40s" },
      { label: "PID", a: "No", b: "No" },
      { label: "Presión", a: "15 bar", b: "15 bar" },
      { label: "Depósito", a: "1.1 L", b: "1.1 L" },
      { label: "Footprint", a: "Small (15cm)", b: "Small" },
    ],
    accessories: [
      { name: "Tamper regulable 51mm", asin: "B0D92111HV", note: "51mm presión constante — para 51mm tolerante" },
      { name: "WDT 0.35mm 10 agujas", asin: "B0BH8MRB2Z", note: "0.35mm acero — distribución naked" },
    ],
  },
  {
    slug: "lelit-victoria-vs-lelit-anita",
    title: "Lelit Victoria PL91T vs Lelit Anita PL042EM",
    subtitle: "Lelit single boiler — PID LCC 58mm vs muela integrada 57mm. Control térmico vs grano a taza sin molinillo.",
    verdict: "Victoria si buscas PID LCC y 58mm pro para pulir extracción; Anita si quieres inox 31.5cm con cónica 38mm integrada sin comprar molinillo.",
    verdictArchetype: "The Precisionist → Victoria (PID 58mm). The Efficiencist integrado → Anita (38mm).",
    a: { name: "Lelit Victoria PL91T", asin: "B01D4O62JG", image: "/images/machines/lelit-victoria-pl91t.jpg" },
    b: { name: "Lelit Anita PL042EM", asin: "B004QXG132", image: "/images/machines/lelit-anita-pl042em.jpg" },
    specs: [
      { label: "Portafiltro", a: "58 mm", b: "57 mm LELIT57" },
      { label: "Caldera", a: "Single boiler 2.7L PID", b: "Single boiler 2.7L" },
      { label: "PID", a: "Sí LCC", b: "No" },
      { label: "Molinillo", a: "No", b: "Sí cónico 38mm" },
      { label: "Vapor", a: "Manual pro", b: "Manual multi-direccional" },
      { label: "Arranque", a: "300s", b: "300s" },
    ],
    accessories: [
      { name: "Cesta VST 18g 58mm", asin: "B0CGVVSM19", note: "Solo Victoria 58mm — precisión" },
      { name: "Portafiltro bottomless 58mm E61", asin: "B09N2C9FP5", note: "58mm — diagnóstico canalización" },
    ],
  },
  {
    slug: "graef-cm702-vs-graef-cm800",
    title: "Graef CM702 vs Graef CM800",
    subtitle: "Graef cónica — 24 niveles 250g vs 40 niveles 350g. Misma familia, escalado de precisión y tolva.",
    verdict: "CM702 si entras a espresso con 24 pasos y 132€; CM800 si quieres 40 niveles + 350g + rueda 5 palas para moler frío sin retención.",
    verdictArchetype: "The Efficiencist → CM702 (24). The Precisionist → CM800 (40 + 350g).",
    a: { name: "Graef CM702", asin: "B00EO26GGC", image: "/images/grinders/graef-cm702.jpg" },
    b: { name: "Graef CM800", asin: "B00CS2DAEG", image: "/images/grinders/graef-cm800.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 38mm", b: "Cónica 38mm" },
      { label: "Niveles", a: "24", b: "40" },
      { label: "Tolva", a: "250g", b: "350g" },
      { label: "Rueda", a: "3 palas", b: "5 palas aluminio" },
      { label: "RPM", a: "~1400", b: "800-900" },
      { label: "Precio", a: "132€", b: "159€" },
    ],
    accessories: [
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — mantenimiento" },
      { name: "Tolva single-dose 45g", asin: "B0D1PF6Z57", note: "Fuelle 58mm — reduce retención" },
    ],
  },
  {
    slug: "krups-gvx242-vs-melitta-molino",
    title: "Krups GVX242 vs Melitta Molino 1019-01",
    subtitle: "Entry flat 17 niveles — 200g vs 200g. Misma receta 17 pasos, placa vs cónica y selector tazas.",
    verdict: "GVX242 si quieres flat 50mm con auto-stop 2-12 tazas; Molino si priorizas selector 2-14 y footprint menor con mismo 1-17 fino a grueso.",
    verdictArchetype: "The Efficiencist → GVX242 (auto-stop). The Compact → Molino (5 easeOfUse).",
    a: { name: "Krups GVX242", asin: "B000IWHXH8", image: "/images/grinders/krups-gvx242.jpg" },
    b: { name: "Melitta Molino 1019-01", asin: "B00R7HKAWC", image: "/images/grinders/melitta-molino-1019-01.jpg" },
    specs: [
      { label: "Muelas", a: "Flat 50mm", b: "Flat 40mm" },
      { label: "Niveles", a: "17", b: "17" },
      { label: "Tolva", a: "200g", b: "200g" },
      { label: "Tazas", a: "2-12 auto-stop", b: "2-14" },
      { label: "Potencia", a: "100W", b: "100W" },
      { label: "Precio", a: "49€", b: "60€" },
    ],
    accessories: [
      { name: "Báscula 0.1g con timer", asin: "B0D9NX6VNG", note: "0.1g — dose control entry" },
      { name: "Soplador single-dose", asin: "B0DB1J2S6V", note: "Silicona — retención mínima" },
    ],
  },
  {
    slug: "lelit-fred-vs-gaggia-md15",
    title: "Lelit Fred PL043MMI vs Gaggia MD15",
    subtitle: "Espresso dedicado — cónica 38mm stepless vs cónica 15 niveles con timer. Micrométrico vs escalado con display.",
    verdict: "Fred si tu foco es stepless 38mm inox pulido 250g para dial fino; MD15 si quieres 15 pasos con timer digital y tolva 300g lista para portafiltro.",
    verdictArchetype: "The Precisionist stepless → Fred. The Balanced timer → MD15.",
    a: { name: "Lelit Fred PL043MMI", asin: "B00K5YLI2U", image: "/images/grinders/lelit-fred-pl043mmi.jpg" },
    b: { name: "Gaggia MD15", asin: "B08SBH2TC6", image: "/images/grinders/gaggia-md15.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 38mm", b: "Cónica ~40mm" },
      { label: "Ajuste", a: "Stepless micrométrico", b: "Stepped 15" },
      { label: "Tolva", a: "250g", b: "300g" },
      { label: "Timer", a: "2-20s", b: "Digital timer" },
      { label: "Molido a", a: "Directo portafiltro", b: "Contenedor 150g / portafiltro" },
      { label: "Precio", a: "165€", b: "86€" },
    ],
    accessories: [
      { name: "Anillo dosificador 58mm", asin: "B0GXFD87XD", note: "Magnético — evita desperdicio" },
      { name: "Tamper 54mm presión constante", asin: "B0DSLYKM31", note: "Para 54mm — canalización" },
    ],
  },
];
