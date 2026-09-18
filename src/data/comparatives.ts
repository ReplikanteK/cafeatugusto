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
  {
    slug: "lelit-fred-vs-gaggia-md15",
    title: "Lelit Fred PL043MMI vs Gaggia MD15",
    subtitle: "Dedicados espresso con filosofías opuestas: Fred 38mm stepless micrométrico 250g para dial fino prosumer, MD15 15 niveles con timer digital y tolva 300g para quien quiere pulsar y moler directo a portafiltro sin báscula.",
    verdict: "Fred si tu ritual es perfilar 0.1s y buscas inox pulido 38mm para espresso puro; MD15 si prefieres flujo guiado, display y 300g para rotar grano sin vaciar. Stepless es precisión, 15 stepped es repetibilidad.",
    verdictArchetype: "The Stepless → Fred (38mm). The Timer → MD15 (15 + 300g).",
    a: { name: "Lelit Fred PL043MMI", asin: "B00K5YLI2U", image: "/images/grinders/lelit-fred-pl043mmi.jpg" },
    b: { name: "Gaggia MD15", asin: "B08SBH2TC6", image: "/images/grinders/gaggia-md15.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 38mm", b: "Cónica ~40mm" },
      { label: "Ajuste", a: "Stepless micrométrico", b: "Stepped 15" },
      { label: "Tolva", a: "250g", b: "300g" },
      { label: "Timer", a: "2-20s", b: "Digital timer" },
      { label: "Molido a", a: "Directo portafiltro", b: "Contenedor 150g / portafiltro" },
    ],
    accessories: [
      { name: "Anillo dosificador 58mm", asin: "B0GXFD87XD", note: "Magnético — evita desperdicio" },
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — mantenimiento grinder" },
    ],
  },
  {
    slug: "delonghi-stilosa-vs-caso-gourmet",
    title: "De'Longhi Stilosa EC235.BK vs Caso Espresso Gourmet",
    subtitle: "Duelo entry 51mm thermoblock: Stilosa 109€ inox con pannarello y 1L para el primer espresso sin complicaciones, frente a Caso 160€ con manómetro visible, 1.8L y pannarello orientable para aprender leyendo presión.",
    verdict: "Stilosa si entras con 109€ y quieres marca, repuestos y curva 1 desde el día uno. Caso si pagas 50€ más por manómetro, depósito 1.8L y más tazas al día — el instrumento para aprender sin saltar de gama.",
    verdictArchetype: "The Budget Entry 109€ → Stilosa (marca, curva 1). The Learning Entry 160€ → Caso (manómetro, 1.8L).",
    a: { name: "De'Longhi Stilosa EC235.BK", asin: "B086RF6YJQ", image: "/images/machines/delonghi-stilosa-ec235.jpg" },
    b: { name: "Caso Espresso Gourmet", asin: "B0F1FZ5CPR", image: "/images/machines/caso-espresso-gourmet.jpg" },
    specs: [
      { label: "Portafiltro", a: "51 mm presurizado", b: "51 mm presurizado" },
      { label: "Manómetro", a: "No", b: "Sí" },
      { label: "Depósito", a: "1.0 L", b: "1.8 L" },
      { label: "Tazas", a: "1-3", b: "1-4" },
      { label: "Vapor", a: "Pannarello", b: "Pannarello orientable" },
      { label: "Curva", a: "1", b: "2" },
    ],
    accessories: [
      { name: "Tamper regulable 51mm", asin: "B0D92111HV", note: "51mm presión constante — para 51mm tolerante" },
      { name: "WDT 0.35mm 10 agujas", asin: "B0BH8MRB2Z", note: "0.35mm acero — distribución naked" },
    ],
  },
  {
    slug: "delonghi-magnifica-s-vs-philips-5400",
    title: "De'Longhi Magnifica S ECAM22.110.B vs Philips Serie 5400 EP5447/90",
    subtitle: "Grano a taza sin fricción en dos escalones: Magnifica S 287€ entry con espumador manual y 13 niveles en 23.8cm, frente a Philips 5400 399€ con 12 bebidas, LatteGo y 4 perfiles para familia.",
    verdict: "Magnifica S si quieres el grano-a-taza más barato con marca y repuestos, y no te importa espumar a mano. Philips 5400 si la casa pide capuchinos a botón, limpieza LatteGo en 15 segundos y perfiles para cada uno — los 110€ se pagan en daily driver.",
    verdictArchetype: "The Entry Superauto 287€ → Magnifica S (manual, 23.8cm). The Family Driver 399€ → Philips 5400 (12 bebidas, LatteGo).",
    a: { name: "De'Longhi Magnifica S ECAM22.110.B", asin: "B07PLXPCX3", image: "/images/machines/delonghi-magnifica-s-22110b.jpg" },
    b: { name: "Philips Serie 5400 EP5447/90", asin: "B08CBJ8W9W", image: "/images/machines/philips-5400-ep5447.jpg" },
    specs: [
      { label: "Bebidas", a: "Espresso + capuchino manual", b: "12 con LatteGo" },
      { label: "Leche", a: "Manual", b: "Automática LatteGo" },
      { label: "Muelas", a: "Acero 13 niveles", b: "Cerámica 12 niveles" },
      { label: "Perfiles", a: "No", b: "4" },
      { label: "Mantenimiento", a: "Básico", b: "AquaClean 5000 tazas" },
      { label: "Footprint", a: "Small (23.8cm)", b: "Medium" },
    ],
    accessories: [
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — molinillo integrado" },
      { name: "Báscula 0.1g con timer", asin: "B0D9NX6VNG", note: "0.1g — clava ratio en taza" },
    ],
  },
  {
    slug: "delonghi-specialista-arte-vs-krups-precision",
    title: "De'Longhi La Specialista Arte vs Krups Precision GW",
    subtitle: "Todo en uno de gama media a 17€ de distancia: Specialista Arte 390€ con 51mm, 8 niveles y My LatteArt guiado, frente a Krups Precision 373€ con 58mm, manómetro y dial para aprender dosis y prensado.",
    verdict: "Specialista Arte si quieres flujo guiado compacto y vaporizar LatteArt sin pensar en técnica. Krups Precision si te tienta el 58mm estándar, leer presión en manómetro y ajustar con dial — más escuela de espresso por menos euros.",
    verdictArchetype: "The Guided 390€ → Specialista Arte (51mm, LatteArt). The School 373€ → Krups Precision (58mm, manómetro).",
    a: { name: "De'Longhi La Specialista Arte", asin: "B0H2MS9GJH", image: "/images/machines/delonghi-la-specialista-arte.jpg" },
    b: { name: "Krups Precision GW", asin: "B0DW9F2DDR", image: "/images/machines/krups-precision-gw.jpg" },
    specs: [
      { label: "Portafiltro", a: "51 mm", b: "58 mm" },
      { label: "Molinillo", a: "8 niveles", b: "Cónico con dial" },
      { label: "Manómetro", a: "No", b: "Sí" },
      { label: "Depósito", a: "1.5 L", b: "1.7 L" },
      { label: "Vapor", a: "My LatteArt", b: "Manual" },
      { label: "Curva", a: "2", b: "3" },
    ],
    accessories: [
      { name: "WDT 0.35mm 10 agujas", asin: "B0BH8MRB2Z", note: "0.35mm acero — distribución naked" },
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — molinillo integrado" },
    ],
  },
  {
    slug: "delonghi-opera-vs-siemens-eq6",
    title: "De'Longhi La Specialista Opera EC9555.M vs Siemens EQ6 Plus S500",
    subtitle: "Mismo precio, rituales opuestos: Opera 699€ manual 58mm con PID, 15 niveles y Cold Brew para experimentar, frente a EQ6 675€ superautomática silenciosa con cerámicas, TFT y autolimpieza de leche.",
    verdict: "Opera si tu placer es el ritual: 58mm, control de temperatura y Cold Brew para perfilar cada taza. EQ6 si priorizas un toque y cero fricción: cerámica silenciosa, 3-10 tazas y leche que se limpia sola — oficina o familia sin barista de guardia.",
    verdictArchetype: "The Ritual 699€ → Opera (58mm PID, Cold Brew). The One-Touch 675€ → EQ6 (cerámica, autolimpieza).",
    a: { name: "De'Longhi La Specialista Opera EC9555.M", asin: "B0CWP67FWS", image: "/images/machines/delonghi-ec9555-m.jpg" },
    b: { name: "Siemens EQ6 Plus S500 TE655203RW", asin: "B076HZ1P4M", image: "/images/machines/siemens-te655203rw.jpg" },
    specs: [
      { label: "Ritual", a: "Manual 58mm con PID", b: "Botón superauto" },
      { label: "Molinillo", a: "15 niveles", b: "Cerámico silencioso" },
      { label: "Leche", a: "Manual pro", b: "Automática con autolimpieza" },
      { label: "Depósito", a: "2.0 L", b: "1.7 L" },
      { label: "Tazas", a: "2-6", b: "3-10" },
      { label: "Curva", a: "3", b: "1" },
    ],
    accessories: [
      { name: "Anillo dosificador 58mm", asin: "B0GXFD87XD", note: "Magnético — evita desperdicio" },
      { name: "Cesta VST 18g 58mm", asin: "B0CGVVSM19", note: "Solo Opera 58mm — precisión" },
    ],
  },
  {
    slug: "behmor-ideal-vs-rommelsbacher-ekm200",
    title: "Behmor Ideal Conical 30 vs Rommelsbacher EKM 200",
    subtitle: "Sub-100€ con geometrías opuestas: Behmor 97€ cónica 40mm de 30 niveles con 300g y cierre auto de tolva, frente a EKM200 76€ flat 44mm con selector 2-12 tazas que además muele especias.",
    verdict: "Behmor si mueles espresso a diario y quieres 30 pasos, 300g y cambiar de grano sin vaciar. EKM200 si buscas el flat más barato que rinde en espresso y un todoterreno que también muele especias sin recalentar.",
    verdictArchetype: "The Conical 97€ → Behmor (30 niveles, 300g). The Flat 76€ → EKM200 (44mm, especias).",
    a: { name: "Behmor Ideal Conical 30", asin: "B0FKN9KHJP", image: "/images/grinders/behmor-ideal-conical.jpg" },
    b: { name: "Rommelsbacher EKM 200", asin: "B005L8YUI4", image: "/images/grinders/rommelsbacher-ekm200.jpg" },
    specs: [
      { label: "Muelas", a: "Cónica 40mm", b: "Flat 44mm" },
      { label: "Ajuste", a: "30 niveles", b: "Stepped 2-12 tazas" },
      { label: "Tolva", a: "300g", b: "250g" },
      { label: "Dosis", a: "Cierre auto de tolva", b: "Selector de tazas" },
      { label: "Plus", a: "80dB low-noise", b: "Muele especias" },
    ],
    accessories: [
      { name: "Cepillo limpieza muelas", asin: "B08NBHR7HT", note: "Cerdas antiestáticas — mantenimiento" },
      { name: "Tolva single-dose 45g", asin: "B0D1PF6Z57", note: "Fuelle 58mm — reduce retención" },
    ],
  },
];
