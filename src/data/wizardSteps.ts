import { WizardOption } from "@/types/coffee";
export const WIZARD_STEPS = [
  {
    id: "drink",
    title: "¿Cómo disfrutas el café en tu día a día?",
    subtitle: "Adaptamos presión y sistema térmico a tu perfil.",
    options: [
      { id:"espresso", title:"Solo Espresso", description:"Tiro corto, crema densa. Priorizamos estabilidad térmica y PID.", badge:"Purista" },
      { id:"milk_drink", title:"Espresso + leche (cappuccino/latte)", description:"Necesitas vaporización eficiente. Thermoblock rápido o caldera dedicada.", badge:"Equilibrio" },
      // P0-5 espresso-only: black_coffee oculto — catálogo sin máquinas filtro. Reactivar solo con máquinas V60/AeroPress reales.
      // { id:"black_coffee", title:"Café largo / americano", description:"Volumen largo manteniendo intensidad. Superautomática cómoda.", badge:"Versátil" },
    ] as WizardOption<string>[]
  },
  {
    id: "budget",
    title: "¿Cuál es tu inversión objetivo para el equipo completo?",
    subtitle: "Suma máquina + molinillo si aplica. No mostramos fuera de rango.",
    options: [
      { id:300, title:"Hasta 400 €", description:"Thermoblock compacto + molinillo manual de calidad. Ideal iniciarse.", badge:"Entrada" },
      { id:600, title:"Hasta 700 €", description:"54mm de calidad o primer eléctrico cónico. Salto a espresso serio.", badge:"Recomendado" },
      { id:1000, title:"Hasta 1.100 €", description:"58mm profesional o muelas planas stepless. Control preciso.", badge:"Avanzado" },
      { id:2000, title:"Más de 1.100 €", description:"Prosumer HX/doble caldera. Vaporizar y extraer simultáneamente.", badge:"Prosumer" },
    ] as WizardOption<number>[]
  },
  {
    id: "workflow",
    title: "¿Cuánto quieres involucrarte en el proceso?",
    subtitle: "Workflow determina curva de aprendizaje y consistencia.",
    options: [
      { id:"convenience", title:"Comodidad total (automático)", description:"Pulso botón y obtengo taza. Sin calibrar molienda.", badge:"Sin fricción" },
      { id:"balanced", title:"Equilibrio guiado", description:"Moler, prensar y extraer artesanal sin curva técnica compleja.", badge:"Aprendizaje" },
      { id:"manual_craft", title:"Control manual", description:"Ajustar molienda, temperatura y experimentar como barista.", badge:"Artesano" },
    ] as WizardOption<string>[]
  },
] as const;
