import { UserPreferences } from "@/types/coffee";
export type Archetype = "precisionist" | "aesthetic" | "efficiencist" | "alchemist";
export function getArchetype(p: UserPreferences): { id: Archetype; label: string; desc: string } {
  if ((p.drinkTypes.includes("black_coffee") || p.maintenanceTolerance==="high") && p.workflowPreference !== "convenience") return { id:"alchemist", label:"The Alchemist", desc:"Flat burr · single-dose · claridad alta · tueste ligero." };
  if (p.workflowPreference === "manual_craft" && p.milkImportance !== "high") return { id:"precisionist", label:"The Precisionist", desc:"PID quirúrgico · 58mm · flow profiling · refractómetro en mano." };
  if (p.workflowPreference === "convenience") return { id:"efficiencist", label:"The Efficiencist", desc:"ThermoJet 40s · 51mm · consistencia diaria." };
  return { id:"aesthetic", label:"The Aesthetic Craft", desc:"Nogal · acero cepillado · ritual obsidian minimal." };
}
