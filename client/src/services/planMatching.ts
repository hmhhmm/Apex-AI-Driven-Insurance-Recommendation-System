import { InsurancePlan, PlanRecommendation, InsuranceType } from '../types/insurance.types';
import { UserProfile, RiskProfile } from '../types/user.types';
import { DNAInterpretation } from '../types/dna.types';
import { calculateAdjustedPrice } from '../utils/pricingCalculator';
import { INSURANCE_PLANS } from '../data/insurancePlans';

/**
 * PLAN MATCHING ALGORITHM
 * Calculates match percentage for each plan based on user profile
 * Returns top recommended plans sorted by match percentage
 */

interface MatchScore {
  plan: InsurancePlan;
  matchPercentage: number;
  baseScore: number;
  bonuses: {
    dnaFactorMatch: number;
    lifestyleMatch: number;
    ageMatch: number;
    budgetMatch: number;
    specialCondition: number;
  };
}

/**
 * Check if special condition requirement is met
 */
function meetsSpecialCondition(
  plan: InsurancePlan,
  userProfile: UserProfile,
  dnaInterpretation: DNAInterpretation
): boolean {
  if (!plan.requiresCondition) return false;

  const { type, field, value, operator } = plan.requiresCondition;

  switch (type) {
    case 'dna':
      // Check DNA interpretation
      const riskMatch = dnaInterpretation.displayRisks.some(risk => 
        risk.toLowerCase().includes(field.toLowerCase())
      );
      return riskMatch;

    case 'lifestyle':
      const userValue = (userProfile as any)[field];
      
      switch (operator) {
        case 'equals':
          return userValue === value;
        case 'greaterThan':
          return userValue > value;
        case 'lessThan':
          return userValue < value;
        case 'includes':
          if (Array.isArray(value) && Array.isArray(userValue)) {
            return value.some((v: string) => 
              userValue.some((uv: string) => 
                uv.toLowerCase().includes(v.toLowerCase())
              )
            );
          }
          return false;
        default:
          return false;
      }

    case 'age':
      switch (operator) {
        case 'greaterThan':
          return userProfile.age > value;
        case 'lessThan':
          return userProfile.age < value;
        case 'equals':
          return userProfile.age === value;
        default:
          return false;
      }

    case 'family':
      const familyCondition = (userProfile.familyHistory as any)[field];
      return familyCondition === true;

    default:
      return false;
  }
}

/**
 * Calculate match score for a single plan
 */
function calculatePlanMatch(
  plan: InsurancePlan,
  userProfile: UserProfile,
  riskProfile: RiskProfile,
  dnaInterpretation: DNAInterpretation
): MatchScore {
  // Calculate base match score
  const planRiskMidpoint = (plan.targetRiskProfile[0] + plan.targetRiskProfile[1]) / 2;
  const riskDifference = Math.abs(riskProfile.overallRiskScore - planRiskMidpoint);
  let baseScore = 100 - riskDifference;
  
  // Ensure base score is within bounds
  baseScore = Math.max(0, Math.min(100, baseScore));

  const bonuses = {
    dnaFactorMatch: 0,
    lifestyleMatch: 0,
    ageMatch: 0,
    budgetMatch: 0,
    specialCondition: 0
  };

  // DNA factor matching bonus (+5% per matching factor)
  if (plan.dnaFactors.length > 0) {
    const matchingFactors = plan.dnaFactors.filter(factor => 
      dnaInterpretation.displayRisks.some(risk => 
        risk.toLowerCase().includes(factor.toLowerCase().replace('Risk', '').trim())
      ) ||
      dnaInterpretation.primaryConcerns.some(concern => 
        concern.toLowerCase().includes(factor.toLowerCase().replace('Risk', '').trim())
      )
    );
    bonuses.dnaFactorMatch = matchingFactors.length * 5;
  }

  // Lifestyle matching bonus (+3% if lifestyle matches)
  if (plan.idealLifestyle.includes(userProfile.lifestyle)) {
    bonuses.lifestyleMatch = 3;
  }

  // Age appropriateness bonus (+2% if age in range)
  const [minAge, maxAge] = plan.targetAgeRange;
  if (userProfile.age >= minAge && userProfile.age <= maxAge) {
    bonuses.ageMatch = 2;
  }

  // Budget alignment bonus (+2% if pricing fits budget)
  const budgetRanges: Record<string, [number, number]> = {
    'Low': [0, 200],
    'Medium': [200, 400],
    'High': [400, 1000]
  };
  const [minBudget, maxBudget] = budgetRanges[userProfile.budget] || [0, 1000];
  if (plan.basePrice >= minBudget && plan.basePrice <= maxBudget) {
    bonuses.budgetMatch = 2;
  }

  // Special condition bonus (+10% if condition met)
  if (meetsSpecialCondition(plan, userProfile, dnaInterpretation)) {
    bonuses.specialCondition = 10;
  }

  // Calculate final match percentage
  const totalBonus = Object.values(bonuses).reduce((sum, bonus) => sum + bonus, 0);
  const matchPercentage = Math.min(100, Math.round(baseScore + totalBonus));

  return {
    plan,
    matchPercentage,
    baseScore,
    bonuses
  };
}

/**
 * Generate "why recommended" text for a plan
 */
function generateWhyRecommended(
  matchScore: MatchScore,
  userProfile: UserProfile,
  dnaInterpretation: DNAInterpretation
): string {
  const reasons: string[] = [];
  const { plan, bonuses } = matchScore;

  // DNA-based reason
  if (bonuses.dnaFactorMatch > 0) {
    const matchingRisk = dnaInterpretation.displayRisks[0];
    if (matchingRisk) {
      const riskType = matchingRisk.split(' ')[0].toLowerCase();
      reasons.push(`Your DNA shows ${matchingRisk.toLowerCase()}. This plan provides targeted ${riskType} protection.`);
    }
  }

  // Lifestyle-based reason
  if (bonuses.lifestyleMatch > 0) {
    reasons.push(`Your ${userProfile.lifestyle.toLowerCase()} lifestyle perfectly aligns with this coverage.`);
  }

  // Age-based reason
  if (bonuses.ageMatch > 0 && reasons.length < 2) {
    reasons.push(`At ${userProfile.age}, this plan offers excellent value and comprehensive benefits.`);
  }

  // Special condition reason
  if (bonuses.specialCondition > 0 && reasons.length < 2) {
    if (plan.requiresCondition?.type === 'dna') {
      reasons.push(`Specialized coverage designed for your genetic profile.`);
    } else if (plan.requiresCondition?.type === 'lifestyle') {
      reasons.push(`Tailored specifically for your lifestyle and needs.`);
    }
  }

  // Budget reason
  if (bonuses.budgetMatch > 0 && reasons.length < 2) {
    reasons.push(`Fits within your budget while providing comprehensive protection.`);
  }

  // Family history reason
  if (reasons.length < 2) {
    const familyConditions = Object.entries(userProfile.familyHistory)
      .filter(([_, hasCondition]) => hasCondition)
      .map(([condition]) => condition);
    
    if (familyConditions.length > 0 && plan.dnaFactors.length > 0) {
      reasons.push(`With your family history, this plan includes essential preventive care.`);
    }
  }

  // Default reason if no specific matches
  if (reasons.length === 0) {
    reasons.push(`Strong match for your overall profile and insurance needs.`);
  }

  // Return top 2 reasons
  return reasons.slice(0, 2).join(' ');
}

/**
 * Generate DNA highlights for a plan
 */
function generateDNAHighlights(
  plan: InsurancePlan,
  dnaInterpretation: DNAInterpretation
): string[] {
  const highlights: string[] = [];

  // Match plan DNA factors with user's DNA interpretation
  plan.dnaFactors.forEach(factor => {
    const factorName = factor.toLowerCase().replace('risk', '').trim();
    
    dnaInterpretation.displayRisks.forEach(risk => {
      if (risk.toLowerCase().includes(factorName)) {
        highlights.push(`Covers ${risk.toLowerCase()}`);
      }
    });

    dnaInterpretation.primaryConcerns.forEach(concern => {
      if (concern.toLowerCase().includes(factorName)) {
        highlights.push(`Addresses ${concern.toLowerCase()}`);
      }
    });
  });

  // Add genetic strengths if relevant to sports/athletic plans
  if (plan.type === 'Sports' && dnaInterpretation.geneticStrengths.length > 0) {
    dnaInterpretation.geneticStrengths.forEach(strength => {
      if (strength.toLowerCase().includes('athletic') || strength.toLowerCase().includes('injury')) {
        highlights.push(strength);
      }
    });
  }

  return highlights.slice(0, 3);
}

/**
 * Main function: Match and recommend insurance plans
 */
export function matchAndRecommendPlans(
  userProfile: UserProfile,
  riskProfile: RiskProfile,
  dnaInterpretation: DNAInterpretation,
  topCount: number = 4
): {
  recommendations: PlanRecommendation[];
  alternativePlans: PlanRecommendation[];
} {
  // Filter plans by selected insurance types
  const eligiblePlans = INSURANCE_PLANS.filter(plan =>
    userProfile.selectedInsuranceTypes.includes(plan.type as InsuranceType)
  );

  // Calculate match scores for all eligible plans
  const matchScores = eligiblePlans.map(plan =>
    calculatePlanMatch(plan, userProfile, riskProfile, dnaInterpretation)
  );

  // Sort by match percentage (descending)
  matchScores.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Convert to recommendations with pricing
  const convertToRecommendation = (matchScore: MatchScore): PlanRecommendation => {
    const pricing = calculateAdjustedPrice(matchScore.plan, riskProfile.overallRiskScore);
    
    return {
      plan: matchScore.plan,
      matchPercentage: matchScore.matchPercentage,
      adjustedPrice: pricing.adjustedPrice,
      originalPrice: pricing.originalPrice,
      monthlyPrice: pricing.monthlyPrice,
      savings: pricing.savings,
      savingsPercentage: pricing.savingsPercentage,
      whyRecommended: generateWhyRecommended(matchScore, userProfile, dnaInterpretation),
      dnaHighlights: generateDNAHighlights(matchScore.plan, dnaInterpretation),
      features: matchScore.plan.features
    };
  };

  // Get top recommendations
  const recommendations = matchScores
    .slice(0, topCount)
    .map(convertToRecommendation);

  // Get alternative plans (next 2-3)
  const alternativePlans = matchScores
    .slice(topCount, topCount + 3)
    .map(convertToRecommendation);

  return {
    recommendations,
    alternativePlans
  };
}

/**
 * Calculate confidence score based on data completeness
 */
export function calculateConfidenceScore(userProfile: UserProfile): number {
  let score = 70; // Base score

  // Data completeness checks
  if (userProfile.existingConditions.length > 0) score += 5;
  if (userProfile.exerciseTypes.length > 0) score += 5;
  if (Object.values(userProfile.familyHistory).some(v => v)) score += 5;
  if (userProfile.occupation && userProfile.occupation.length > 0) score += 5;
  if (userProfile.selectedInsuranceTypes.length >= 2) score += 5;
  if (userProfile.age >= 25 && userProfile.age <= 60) score += 5;

  return Math.min(100, score);
}
