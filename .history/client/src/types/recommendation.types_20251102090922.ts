import { DNAInterpretation } from './dna.types';
import { PlanRecommendation, InsurancePlan as BaseInsurancePlan } from './insurance.types';
import { RiskProfile } from './user.types';

// ═══════════════════════════════════════════════════════════
// ENHANCED USER PROFILE (with ALL form inputs)
// ═══════════════════════════════════════════════════════════

export interface EnhancedUserProfile {
  // Basic Information
  name: string;
  age: number;
  zipCode: string;
  annualIncome: number;
  occupation: string;
  
  // Insurance Selection
  selectedTypes: string[]; // ["Health", "Auto", "Life", "Travel"]
  budget: number; // Monthly budget for insurance
  
  // Health Insurance Factors
  exerciseFrequency: 'Rarely' | 'Sometimes' | 'Often' | string;
  smokingStatus: 'Yes' | 'No' | string;
  lifestyle: 'Active' | 'Moderate' | 'Sedentary' | string;
  
  // Life Insurance Factors
  expectedCoverage: number; // Coverage amount needed
  maritalStatus?: string;
  numberOfDependents?: number;
  
  // Auto Insurance Factors
  hasCar: boolean;
  hasCarInsurance?: boolean;
  carPlateNumber?: string;
  carModel?: string;
  drivingYears?: number;
  
  // Travel Insurance Factors
  travelFrequency: '0-1' | '2' | '3-5' | '6+' | string;
  
  // DNA & Medical History (existing system)
  dnaRisks: string[];
  geneticStrengths: string[];
  familyHistory: string[];
}

// ═══════════════════════════════════════════════════════════
// INSURANCE PLAN (use the one from insurance.types.ts)
// ═══════════════════════════════════════════════════════════

// ✅ Import and re-export the InsurancePlan from insurance.types.ts
export type InsurancePlan = BaseInsurancePlan;

// ═══════════════════════════════════════════════════════════
// RECOMMENDATION RESULT (for Gemini service)
// ═══════════════════════════════════════════════════════════

export interface RecommendationResult {
  planId: string;
  matchScore: number;
  reasoning: string;
  priceAdjustment: number;
  finalPrice?: number;
  savings?: number;
  highlights?: string[];
}

// ═══════════════════════════════════════════════════════════
// API REQUEST/RESPONSE (your existing structures)
// ═══════════════════════════════════════════════════════════

export interface RecommendationRequest {
  userId: string;
  userProfile: EnhancedUserProfile;
}

export interface RecommendationResponse {
  success: boolean;
  data: {
    userRiskProfile: RiskProfile & {
      dnaInterpretation: DNAInterpretation;
    };
    recommendations: PlanRecommendation[];
    alternativePlans: PlanRecommendation[];
    totalPotentialSavings: number;
    confidence: number;
    aiInsights?: {
      overallAnalysis: string;
      riskFactors: string[];
      savingsTips: string[];
    };
  };
}

// ═══════════════════════════════════════════════════════════
// SAVED PLANS (your existing)
// ═══════════════════════════════════════════════════════════

export interface SavedPlan {
  planId: string;
  savedAt: string;
  userNotes?: string;
}

// ═══════════════════════════════════════════════════════════
// GEMINI-SPECIFIC TYPES
// ═══════════════════════════════════════════════════════════

export interface GeminiRecommendationInput {
  userProfile: EnhancedUserProfile;
  availablePlans: InsurancePlan[];
}

export interface GeminiRecommendationOutput {
  topRecommendations: RecommendationResult[];
  overallAnalysis: string;
  riskFactors: string[];
  savingsTips: string[];
  aiInsights?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPREHENSIVE RISK PROFILE
// ═══════════════════════════════════════════════════════════

export interface ComprehensiveRiskProfile {
  overall: number;
  health: number;
  lifestyle: number;
  financial: number;
  breakdown: {
    smoking: number;
    exercise: number;
    age: number;
    dna: number;
    familyHistory: number;
    occupation: number;
  };
}

// ═══════════════════════════════════════════════════════════
// HELPER TYPES
// ═══════════════════════════════════════════════════════════

export type InsuranceType = 'Health' | 'Auto' | 'Life' | 'Travel' | 'Sports';
export type ExerciseFrequency = 'Rarely' | 'Sometimes' | 'Often';
export type SmokingStatus = 'Yes' | 'No';
export type Lifestyle = 'Active' | 'Moderate' | 'Sedentary';
export type TravelFrequency = '0-1' | '2' | '3-5' | '6+';

// ═══════════════════════════════════════════════════════════
// TYPE GUARDS (for runtime type checking)
// ═══════════════════════════════════════════════════════════

export function isRecommendationResult(
  obj: any
): obj is RecommendationResult {
  return (
    obj &&
    typeof obj.planId === 'string' &&
    typeof obj.matchScore === 'number' &&
    typeof obj.reasoning === 'string' &&
    typeof obj.priceAdjustment === 'number'
  );
}

export function isPlanRecommendation(
  obj: any
): obj is PlanRecommendation {
  return (
    obj &&
    obj.plan &&
    typeof obj.matchPercentage === 'number'
  );
}

// ═══════════════════════════════════════════════════════════
// CONVERTER FUNCTIONS (bridge old and new formats)
// ═══════════════════════════════════════════════════════════

/**
 * Convert PlanRecommendation to RecommendationResult
 */
export function convertToRecommendationResult(
  planRec: PlanRecommendation
): RecommendationResult {
  return {
    planId: planRec.plan.id,
    matchScore: planRec.matchPercentage,
    reasoning: planRec.whyRecommended || 'Recommended for your profile',
    priceAdjustment: planRec.savingsPercentage || 0,
    finalPrice: planRec.adjustedPrice || planRec.plan.basePrice,
    savings: planRec.savings || 0,
    highlights: planRec.dnaHighlights || []
  };
}

/**
 * Convert RecommendationResult to PlanRecommendation
 */
export function convertToPlanRecommendation(
  result: RecommendationResult,
  plan: InsurancePlan
): PlanRecommendation {
  const finalPrice = result.finalPrice || plan.basePrice;
  const savings = result.savings || (plan.basePrice * 1.3 - finalPrice);
  
  return {
    plan: plan,
    matchPercentage: result.matchScore,
    adjustedPrice: finalPrice,
    originalPrice: plan.basePrice,
    monthlyPrice: finalPrice,
    savings: savings,
    savingsPercentage: (savings / (plan.basePrice * 1.3)) * 100,
    whyRecommended: result.reasoning,
    dnaHighlights: result.highlights || [],
    features: plan.features
  };
}

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Determine lifestyle based on exercise frequency
 */
export function determineLifestyle(exerciseFrequency: ExerciseFrequency): Lifestyle {
  if (exerciseFrequency === 'Often') return 'Active';
  if (exerciseFrequency === 'Sometimes') return 'Moderate';
  return 'Sedentary';
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'RM'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

/**
 * Calculate monthly premium from annual
 */
export function calculateMonthlyPremium(annualPremium: number): number {
  return Math.round(annualPremium / 12);
}

/**
 * Calculate savings percentage
 */
export function calculateSavingsPercentage(originalPrice: number, finalPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
}