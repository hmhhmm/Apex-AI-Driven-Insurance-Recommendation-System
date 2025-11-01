export type InsuranceType = "Health" | "Auto" | "Life" | "Travel" | "Sports";

export interface RequiresCondition {
  type: "dna" | "lifestyle" | "age" | "family";
  field: string;
  value: any;
  operator: "equals" | "greaterThan" | "includes" | "lessThan";
}

export interface RiskMultipliers {
  low: number;
  medium: number;
  high: number;
}

export interface InsurancePlan {
  id: string;
  provider: string;
  name: string;
  type: InsuranceType;
  basePrice: number;
  currency: "RM";
  coverage: string;
  features: string[];
  
  // Matching criteria
  targetAgeRange: [number, number];
  targetRiskProfile: [number, number];
  idealLifestyle: string[];
  dnaFactors: string[];
  
  // Optional: Specific trigger conditions
  requiresCondition?: RequiresCondition;
  
  // Multipliers for pricing
  riskMultipliers: RiskMultipliers;
}

export interface PlanRecommendation {
  plan: InsurancePlan & {
    originalPrice?: number;
    priceAdjustment?: number;
    aiGenerated?: boolean;
  };
  matchPercentage: number;
  adjustedPrice: number;
  originalPrice: number;
  monthlyPrice: number;
  savings: number;
  savingsPercentage: number;
  whyRecommended: string;
  reasoning?: string;
  dnaHighlights: string[];
  features: string[];
  potentialSavings?: number;
}
