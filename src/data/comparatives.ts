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
    subtitle: "Entrada compacta 51mm para cocina pequeña y 1-3 tazas diarias. Ambas presurizado tolerante, pero Dedica gana en huella 15cm y ecosistema barato 51mm, mientras Virtuoso aporta ThermoJet auto y pannarello más amable para capuchino sin técnica.",
    verdict: "Elige Dedica EC685 si cada centímetro cuenta y quieres accesorios 51mm baratos para iniciarte sin presión por el dial. Elige Virtuoso XP444 si prefieres encendido intuitivo, vapor más estable y curva de aprendizaje 1 — el extra 20€ se paga en consistencia día uno.",
    verdictArchetype: "The Efficiencist con 190€ y prisa → Virtuoso (40s, pannarello). The Small Space → Dedica (15cm, 210€).",
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
    subtitle: "Single boiler Lelit para control térmico fino vs conveniencia grano-a-taza. Victoria LCC PID 58mm y vaporizador pro para quien quiere perfilar; Anita PL042EM integra cónica 38mm en 31.5cm de inox para diario sin molinillo externo.",
    verdict: "Victoria si tu prioridad es repetir shot con PID LCC, 58mm estándar y 2.7L estable — pagas curva 4 pero ganas extracción quirúrgica. Anita si valoras encimera y flujo sin fricción: mueles y extraes sin comprar ni calibrar molinillo aparte.",
    verdictArchetype: "The Precisionist → Victoria (PID 58mm). The Integrated → Anita (38mm, 31.5cm).",
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
    subtitle: "Familia Graef cónica para espresso diario: CM702 24 niveles 250g a 132€ como puerta de entrada seria, CM800 40 niveles 350g a 159€ con rueda 5 palas aluminio y 800-900rpm para moler frío sin calentar y con menos retención.",
    verdict: "Quédate en CM702 si entras con presupuesto ajustado y 24 pasos ya te dan filtro+espresso correcto. Salta a CM800 si mueles a diario y notas retención o calor: 40 niveles, tolva 350g y molienda 800rpm preservan aroma y sostienen flujo.",
    verdictArchetype: "The Entry 132€ → CM702 (24). The Daily 159€ → CM800 (40 + 350g frío).",
    a: { name: "Graef CM702", asin: "B00EO26GGC", image: "/images/grinders/graef-cm702.jpg" },
    b: { name: "Graef CM800", asin: "B00CS2DAEG", image: "/images/grinders/graef-cm800.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 38mm", b: "Cónica 38mm" },
      { label: "Niveles", a: "24", b: "40" },
      { label: "Tolva", a: "250g", b: "350g" },
      { label: "Rueda", a: "3 palas", b: "5 palas aluminio" },
      { label: "RPM", a: "~1400", b: "800-900" },
    ],
    accessories: [
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — mantenimiento" },
      { name: "Tolva single-dose 45g", asin: "B0D1PF6Z57", note: "Fuelle 58mm — reduce retención" },
    ],
  },
  {
    slug: "krups-gvx242-vs-melitta-molino",
    title: "Krups GVX242 vs Melitta Molino 1019-01",
    subtitle: "Flat 17 niveles cara a cara para quien empieza con 200g y quiere espresso sin saltar a 100€. Ambos 17 pasos 100W, pero GVX242 añade flat 50mm y auto-stop 2-12 tazas, Melitta prioriza footprint y selector 2-14 con 5/5 easeOfUse.",
    verdict: "GVX242 si valoras doseControl y flat 50mm para repetir sin báscula; Molino si buscas encimera mínima, 2-14 tazas y el uso más simple para pareja/oficina. Misma molienda, workflow distinto.",
    verdictArchetype: "The Dose-Control → GVX242 (auto-stop). The Compact → Molino (ease 5).",
    a: { name: "Krups GVX242", asin: "B000IWHXH8", image: "/images/grinders/krups-gvx242.jpg" },
    b: { name: "Melitta Molino 1019-01", asin: "B00R7HKAWC", image: "/images/grinders/melitta-molino-1019-01.jpg" },
    specs: [
      { label: "Muelas", a: "Flat 50mm", b: "Flat 40mm" },
      { label: "Niveles", a: "17", b: "17" },
      { label: "Tolva", a: "200g", b: "200g" },
      { label: "Tazas", a: "2-12 auto-stop", b: "2-14" },
      { label: "Potencia", a: "100W", b: "100W" },
    ],
    accessories: [
      { name: "Báscula 0.1g con timer", asin: "B0D9NX6VNG", note: "0.1g — dose control entry" },
      { name: "Soplador single-dose", asin: "B0DB1J2S6V", note: "Silicona — retención mínima" },
    ],
  },
];
