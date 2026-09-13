export type PriceBand = "entry" | "mid" | "premium";
export type FootprintSize = "small" | "medium" | "large";
export type MilkFrequency = "low" | "medium" | "high";
export type RatingScale = 1 | 2 | 3 | 4 | 5;

export type MachineType = "manual_espresso" | "superautomatic" | "semi_automatic";
export type BoilerType = "thermoblock" | "single_boiler" | "dual_boiler" | "heat_exchanger";
export type SteamSystem = "manual" | "automatic" | "none";
export type PortafilterDiameter = 51 | 54 | 57 | 58;

export interface CoffeeMachine {
  readonly id: string;
  readonly slug: string;
  readonly brand: string;
  readonly model: string;
  readonly asin: string;
  readonly type: MachineType;
  readonly priceBand: PriceBand;
  readonly priceApproxEUR: number;
  readonly espressoCapable: boolean;
  readonly grinderIntegrated: boolean;
  readonly specs: {
    readonly portafilterDiameter?: PortafilterDiameter;
    readonly pid: boolean;
    readonly boilerType: BoilerType;
    readonly steamSystem: SteamSystem;
    readonly pumpPressureBar?: number;
    readonly waterTankCapacityLiters: number;
    readonly startupTimeSeconds: number;
  };
  readonly ratings: {
    readonly easeOfUse: RatingScale;
    readonly cleaningEase: RatingScale;
    readonly learningCurve: RatingScale;
    readonly footprint: FootprintSize;
  };
  readonly usageProfile: {
    readonly milkUse: MilkFrequency;
    readonly idealDailyCups: { min: number; max: number };
    readonly bestFor: readonly string[];
    readonly notIdealFor: readonly string[];
  };
  readonly metadata: {
    readonly verifiedAt: string;
    readonly sources: readonly string[];
  };
}

export type BurrType = "conical" | "flat";
export type GrindAdjustment = "stepped" | "stepless";

export interface Grinder {
  readonly id: string;
  readonly slug: string;
  readonly brand: string;
  readonly model: string;
  readonly asin: string;
  readonly priceBand: PriceBand;
  readonly priceApproxEUR: number;
  readonly specs: {
    readonly burrType: BurrType;
    readonly burrSizeMM: number;
    readonly espressoCapable: boolean;
    readonly filterCapable: boolean;
    readonly grindAdjustment: GrindAdjustment;
    readonly hopperCapacityGrams: number;
  };
  readonly performance: {
    readonly doseControl: RatingScale;
    readonly retention: RatingScale;
    readonly noise: RatingScale;
    readonly easeOfUse: RatingScale;
    readonly footprint: FootprintSize;
  };
  readonly metadata: {
    readonly verifiedAt: string;
    readonly sources: readonly string[];
  };
}

export interface CoffeeSetup {
  readonly id: string;
  readonly machine: CoffeeMachine;
  readonly grinder?: Grinder;
  readonly isIntegrated: boolean;
  readonly estimatedTotalEUR: number;
}

export interface CompatibilityScore {
  readonly totalScore: number;
  readonly breakdown: {
    readonly hardRequirementsPassed: boolean;
    readonly budgetMatch: number;
    readonly experienceMatch: number;
    readonly spaceMatch: number;
    readonly maintenanceMatch: number;
    readonly milkMatch: number;
  };
  readonly pros: readonly string[];
  readonly cons: readonly string[];
  readonly rationale: string;
}

export interface EvaluatedSetup {
  readonly setup: CoffeeSetup;
  readonly score: CompatibilityScore;
}

export interface UserPreferences {
  readonly drinkTypes: readonly ("espresso" | "milk_drink" | "black_coffee")[];
  readonly budgetMaxEUR: number;
  readonly workflowPreference: "convenience" | "balanced" | "manual_craft";
  readonly dailyCups: "1-2" | "3-5" | "6+";
  readonly milkImportance: "low" | "medium" | "high";
  readonly maintenanceTolerance: "low" | "medium" | "high";
  readonly spaceConstraint: boolean;
  readonly integratedGrinderPreference: "yes" | "indifferent" | "separated";
}
