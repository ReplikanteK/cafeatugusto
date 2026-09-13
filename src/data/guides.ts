import { Guide } from "@/types/guide";
export const GUIDES_SEED: Record<string, Guide> = {
  "54mm-vs-58mm": {
    slug: "54mm-vs-58mm",
    title: "Ecosistema 54mm vs 58mm",
    subtitle: "Diferencias reales en canalización, cestas VST y compatibilidad de accesorios",
    description: "Comparativa técnica del diámetro del portafiltros basada en profundidad de la pastilla, área de extracción e incompatibilidades de accesorios comercializados.",
    readingTime: "3 min",
    targetMetric: "Extracción y Compatibilidad",
    table: { headers: ["Parámetro", "54 mm (Breville / Sage)", "58 mm (Estándar Comercial)"], rows: [["Espesor de la pastilla","Mayor altura (+15-20%)","Menor altura (distribución uniforme)"],["Riesgo de canalización","Alto (requiere WDT estricto)","Moderado / Estándar"],["Cestas de precisión","Limitadas (IMS / Crema Pro)","Extensas (VST, IMS, Weber, Wafo)"],["Tamper & Distribuidores","53.3 mm específico","58.5 mm (Ajuste de precisión)"],["Puck Screen estándar","53.5 mm","58.5 mm"]] },
    keyTakeaways: [{ title:"Profundidad del lecho", detail:"A igual dosis (e.g. 18g), la cesta de 54mm crea una cama de café más alta, ofreciendo mayor resistencia al flujo pero aumentando la probabilidad de canalización si la molienda no es homogénea." },{ title:"Acceso a accesorios", detail:"El estándar de 58mm cuenta con mayor oferta de cestas VST de extracción alta y tampers de tolerancia estricta (58.5mm)." }],
  },
  "dial-in-ratio": {
    slug: "dial-in-ratio",
    title: "Dial-in: Ratios 1:2 vs 1:2.5 por Tueste",
    subtitle: "Ajuste fino de punto de molido y rendimiento de extracción según la densidad del grano",
    description: "Matriz de ajuste para ajustar la extracción analizando el perfil de tueste, el tiempo objetivo y el rendimiento en taza.",
    readingTime: "4 min",
    targetMetric: "Ratio & Rendimiento",
    table: { headers: ["Tipo de Tueste","Ratio Objetivo","Tiempo Target","Molienda Relative"], rows: [["Tueste Claro (Specialty)","1:2.5 a 1:3.0","28 - 35 seg","Más fina (Mayor área expuesta)"],["Tueste Medio (Omni-roast)","1:2.0 a 1:2.2","25 - 30 seg","Equilibrada / Media-fina"],["Tueste Oscuro (Clásico)","1:1.5 a 1:2.0","20 - 25 seg","Más gruesa (Evita sobreextracción)"]] },
    keyTakeaways: [{ title:"Efecto de la densidad", detail:"Los tuestes claros son más densos y solubles de forma lenta; requieren ratios más largos (1:2.5) y mayor temperatura para extraer los azúcares sin amargor." },{ title:"Ajuste rápido", detail:"Si la extracción sabe agria o vegetal, incrementa el ratio o afina la molienda; si el final es astringente y seco, acorta el ratio." }],
  },
  "thermoblock-vs-boiler": {
    slug: "thermoblock-vs-boiler",
    title: "Thermoblock vs Caldera Principal",
    subtitle: "Inercia térmica, tiempo de calentamiento real y estabilidad en extracciones consecutivas",
    description: "Desglose técnico sobre la arquitectura de calentamiento de agua y su impacto en la temperatura en cazoleta durante la extracción.",
    readingTime: "4 min",
    targetMetric: "Térmica y Potencia",
    table: { headers: ["Criterio","Thermoblock / Thermojet","Caldera Única (Single Boiler)"], rows: [["Tiempo para 1er shot","3 - 10 segundos","10 - 15 minutos"],["Estabilidad intra-shot","Variable (depende de la bomba)","Alta (alta inercia térmica)"],["Paso a Vaporización","Instantáneo (3 seg)","30 - 60 seg (requiere purga)"],["Shots consecutivos","Rendimiento constante","Caída progresiva de temperatura"],["Mantenimiento descalcificación","Sencillo (conductos estrechos)","Complejo (acumulación en depósito)"]] },
    keyTakeaways: [{ title:"Uso diario vs Precisión", detail:"El Thermoblock ofrece inmediatez operacional, mientras que las calderas con control PID entregan una masa de agua a temperatura más uniforme en extracciones largas." }],
  },
};
