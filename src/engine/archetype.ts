import { UserPreferences } from "@/types/coffee";
export type Archetype = "precisionist" | "aesthetic" | "efficiencist" | "alchemist";
export function getArchetype(p: UserPreferences): { id: Archetype; label: string; desc: string } {
  if (p.workflowPreference === "manual_craft" && p.milkImportance !== "high") return { id:"precisionist", label:"The Precisionist", desc:"PID quirúrgico · 58mm · flow profiling · refractómetro en mano." };
  if (p.workflowPreference === "convenience") return { id:"efficiencist", label:"The Efficiencist", desc:"ThermoJet 3s · consistencia · latte en segundos." };
  if (p.drinkTypes.includes("black_coffee") || p.maintenanceTolerance==="high") return { id:"alchemist", label:"The Alchemist", desc:"Orígenes · anaeróbicos · bergamota · maracuyá." };
  return { id:"aesthetic", label:"The Aesthetic Craft", desc:"Nogal · acero cepillado · ritual obsidian minimal." };
}
