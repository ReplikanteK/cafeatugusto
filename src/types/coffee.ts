export type PriceBand = "entry" | "mid" | "premium";
export type FootprintSize = "small" | "medium" | "large";
export type MilkFrequency = "low" | "medium" | "high";
export type RatingScale = 1 | 2 | 3 | 4 | 5;

export type MachineType = "manual_espresso" | "superautomatic" | "semi_automatic";
export type BoilerType = "thermoblock" | "single_boiler" | "dual_boiler" | "heat_exchanger";
export type SteamSystem = "manual" | "automatic" | "none";
export type PortafilterDiameter = 51 | 54 | 57 | 58;

export type AmazonMarketplace = "amazon.es";
// Disponibilidad = ¿hay stock comprable ahora? (nunca implica quién lo comprobó)
export type AvailabilityStatus = "available" | "unavailable" | "unknown";

export interface AmazonInfo {
  readonly asin: string;
  readonly marketplace: AmazonMarketplace;
  readonly url: string;
  readonly lastVerified?: string; // ISO date
}

export interface AvailabilityInfo {
  readonly status: AvailabilityStatus;
  readonly lastChecked?: string; // ISO date
  readonly reason?: string;
}

// Nivel de verificación = ¿QUIÉN comprobó la disponibilidad? (ortogonal a availability).
// "human" = persona en navegador real. "amazon_html" = HTML/dp automático.
// amazonHtmlVerified ≠ humanVerified — ver scripts/scan-amazon-product-html.ts
export type VerificationLevel = "human" | "amazon_html" | "none";
export interface VerificationInfo {
  readonly level: VerificationLevel;
  readonly checkedAt?: string; // ISO date
}

// Precio = ¿el EUR es observado directo o derivado? (ortogonal a availability/verification)
export type PriceCheckStatus = "direct_eur" | "derived" | "unknown";
export interface PriceCheckInfo {
  readonly status: PriceCheckStatus;
  readonly observedEUR?: number;
  readonly checkedAt?: string; // ISO date
  readonly source?: "amazon_html" | "manual" | "ecb";
  readonly note?: string;
}

// Identidad = ¿el ASIN corresponde al modelo/tipo declarado? (categoría de fallo real: caso Magnifica Duo)
export type IdentityCheckStatus = "verified" | "unknown";
export interface IdentityCheckInfo {
  readonly status: IdentityCheckStatus;
  readonly checkedAt?: string; // ISO date
  readonly note?: string;
}

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
  readonly image: string;
  readonly description?: string;
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
  readonly amazon?: AmazonInfo;
  readonly availability?: AvailabilityInfo;
  readonly verification?: VerificationInfo;
  readonly priceCheck?: PriceCheckInfo;
  readonly identityCheck?: IdentityCheckInfo;
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
  readonly image: string;
  readonly description?: string;
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
  readonly amazon?: AmazonInfo;
  readonly availability?: AvailabilityInfo;
  readonly verification?: VerificationInfo;
  readonly priceCheck?: PriceCheckInfo;
  readonly identityCheck?: IdentityCheckInfo;
  readonly metadata: {
    readonly verifiedAt: string;
    readonly sources: readonly string[];
  };
}

export type RoastProfile = "light" | "medium_light" | "medium" | "medium_dark" | "dark";
export type ProcessMethod = "washed" | "natural" | "honey" | "experimental";
export type BrewingMatch = "espresso" | "filter" | "omni";

export interface CoffeeBean {
  readonly id: string;
  readonly slug: string;
  readonly roaster: string;
  readonly name: string;
  readonly origin: string;
  readonly roastProfile: RoastProfile;
  readonly process: ProcessMethod;
  readonly tastingNotes: readonly string[];
  readonly recommendedBrewing: readonly BrewingMatch[];
  readonly priceApproxEUR: number;
  readonly weightGrams: number;
  readonly amazonAsin?: string;
  readonly directLink?: string;
  readonly image: string;
  readonly recipe: {
    readonly ratio: string;
    readonly timeSec: string;
    readonly grind: string;
    readonly tempC: number;
    readonly yield: string;
  };
  readonly metadata: {
    readonly verifiedAt: string;
    readonly sources: readonly string[];
  };
}

export interface WizardOption<T> {
  readonly id: T;
  readonly title: string;
  readonly description: string;
  readonly badge?: string;
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
    readonly dailyMatch: number;
    readonly spaceMatch: number;
    readonly maintenanceMatch: number;
    readonly milkMatch: number;
    readonly grinderMatch: number;
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
