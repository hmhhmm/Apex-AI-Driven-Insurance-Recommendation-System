/**
 * SMART RECOMMENDATION ALGORITHM
 * 
 * This algorithm ensures:
 * 1. Recommendations match user-selected insurance types
 * 2. Different recommendations each time based on user profile + randomization
 * 3. Personalized pricing that varies based on DNA, lifestyle, age, etc.
 */

import { INSURANCE_PLANS } from '../data/insurancePlans';
import type { InsurancePlan } from '../types/insurance.types';
import type { UserProfile } from '../types/user.types';

interface RecommendationScore {
  plan: InsurancePlan;
  score: number;
  matchPercentage: number;
  adjustedPrice: number;
  reasons: string[];
}

/**
 * Calculate personalized price based on user profile
 */
export function calculatePersonalizedPrice(plan: InsurancePlan, userProfile: UserProfile): number {
  let multiplier = 1.0;
  const basePrice = plan.basePrice;

  // Age factor
  if (userProfile.age > 50) multiplier *= 1.25;
  else if (userProfile.age > 40) multiplier *= 1.12;
  else if (userProfile.age < 25) multiplier *= 0.93;
  else if (userProfile.age < 30) multiplier *= 0.97;

  // Smoking status
  if (userProfile.smokingStatus === 'Current smoker') multiplier *= 1.30;
  else if (userProfile.smokingStatus === 'Former smoker') multiplier *= 1.10;
  else multiplier *= 0.95; // Non-smoker discount

  // Exercise/Lifestyle factor
  if (userProfile.exerciseFrequency === 'Daily') multiplier *= 0.90;
  else if (userProfile.exerciseFrequency === 'Regularly') multiplier *= 0.95;
  else if (userProfile.exerciseFrequency === 'Occasionally') multiplier *= 1.00;
  else multiplier *= 1.08; // Rarely/Never

  // Family history factors
  if (plan.dnaFactors && plan.dnaFactors.length > 0) {
    const familyHistory = userProfile.familyHistory || {};
    
    if (plan.dnaFactors.includes('cardiovascularRisk') && familyHistory.cardiovascular) {
      multiplier *= 1.15;
    }
    if (plan.dnaFactors.includes('diabetesRisk') && familyHistory.diabetes) {
      multiplier *= 1.12;
    }
    if (plan.dnaFactors.includes('cancerRisk') && familyHistory.cancer) {
      multiplier *= 1.10;
    }
  }

  // Occupation risk
  const highRiskOccupations = ['construction', 'military', 'police', 'firefighter', 'pilot'];
  const occupation = userProfile.occupation?.toLowerCase() || '';
  if (highRiskOccupations.some(occ => occupation.includes(occ))) {
    multiplier *= 1.15;
  }

  // Apply specific risk multipliers from the plan
  const riskLevel = calculateRiskLevel(userProfile);
  if (riskLevel === 'low' && plan.riskMultipliers) {
    multiplier *= plan.riskMultipliers.low;
  } else if (riskLevel === 'high' && plan.riskMultipliers) {
    multiplier *= plan.riskMultipliers.high;
  } else if (plan.riskMultipliers) {
    multiplier *= plan.riskMultipliers.medium;
  }

  // Add small random variance (±3%) to ensure prices are never exactly the same
  const randomVariance = 0.97 + (Math.random() * 0.06); // 0.97 to 1.03
  multiplier *= randomVariance;

  return Math.round(basePrice * multiplier);
}

/**
 * Calculate overall risk level
 */
function calculateRiskLevel(userProfile: UserProfile): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Age risk
  if (userProfile.age > 50) riskScore += 2;
  else if (userProfile.age > 40) riskScore += 1;
  else if (userProfile.age < 25) riskScore -= 1;

  // Lifestyle risks
  if (userProfile.smokingStatus === 'Current smoker') riskScore += 3;
  if (userProfile.exerciseFrequency === 'Rarely' || userProfile.exerciseFrequency === 'Never') riskScore += 2;
  if (userProfile.alcoholConsumption === 'Heavy (3+ drinks/day)') riskScore += 2;

  // Family history
  const familyHistory = userProfile.familyHistory || {};
  if (familyHistory.cardiovascular) riskScore += 2;
  if (familyHistory.diabetes) riskScore += 1;
  if (familyHistory.cancer) riskScore += 1;
  if (familyHistory.alzheimers) riskScore += 1;

  // Existing conditions
  if (userProfile.existingConditions && userProfile.existingConditions.length > 0) {
    riskScore += userProfile.existingConditions.length;
  }

  if (riskScore <= 2) return 'low';
  if (riskScore >= 7) return 'high';
  return 'medium';
}

/**
 * Calculate match score for a plan based on user profile
 */
function calculateMatchScore(plan: InsurancePlan, userProfile: UserProfile, insuranceType: string): RecommendationScore {
  let score = 50; // Base score
  const reasons: string[] = [];

  // Type match (must match!)
  if (plan.type !== insuranceType) {
    return { plan, score: 0, matchPercentage: 0, adjustedPrice: 0, reasons: [] };
  }

  // Age range match
  if (userProfile.age >= plan.targetAgeRange[0] && userProfile.age <= plan.targetAgeRange[1]) {
    score += 15;
    reasons.push(`Perfect age range for this plan (${plan.targetAgeRange[0]}-${plan.targetAgeRange[1]})`);
  } else {
    score -= 10;
  }

  // Lifestyle match
  if (plan.idealLifestyle && plan.idealLifestyle.includes(userProfile.lifestyle || 'Moderate')) {
    score += 12;
    reasons.push(`Matches your ${userProfile.lifestyle} lifestyle`);
  }

  // DNA/Health factors match
  if (plan.dnaFactors && plan.dnaFactors.length > 0) {
    const familyHistory = userProfile.familyHistory || {};
    
    if (plan.dnaFactors.includes('cardiovascularRisk') && familyHistory.cardiovascular) {
      score += 15;
      reasons.push('Covers cardiovascular risks identified in your family history');
    }
    if (plan.dnaFactors.includes('diabetesRisk') && familyHistory.diabetes) {
      score += 15;
      reasons.push('Includes diabetes coverage relevant to your profile');
    }
    if (plan.dnaFactors.includes('cancerRisk') && familyHistory.cancer) {
      score += 15;
      reasons.push('Provides cancer coverage based on family history');
    }
  }

  // Exercise/Activity match for Sports insurance
  if (insuranceType === 'Sports' && userProfile.exerciseFrequency) {
    if (userProfile.exerciseFrequency === 'Daily' || userProfile.exerciseFrequency === 'Regularly') {
      score += 18;
      reasons.push('Great fit for your active lifestyle');
    }
  }

  // Travel frequency match for Travel insurance
  if (insuranceType === 'Travel' && userProfile.travelFrequency) {
    if (userProfile.travelFrequency === 'Frequent' && plan.name.includes('Annual')) {
      score += 20;
      reasons.push('Annual plan perfect for frequent travelers');
    } else if (userProfile.travelFrequency === 'Occasional') {
      score += 15;
      reasons.push('Suitable for occasional travel needs');
    }
  }

  // Family/Dependents match for Life insurance
  if (insuranceType === 'Life' && userProfile.hasDependents) {
    score += 15;
    reasons.push('Important protection for your family');
  }

  // Driving experience for Auto insurance
  if (insuranceType === 'Auto' && userProfile.drivingExperience) {
    if (userProfile.drivingExperience > 5) {
      score += 10;
      reasons.push('Good driver discount eligible');
    }
    if (userProfile.accidentHistory === 0) {
      score += 12;
      reasons.push('Clean driving record bonus');
    }
  }

  // Budget match
  const adjustedPrice = calculatePersonalizedPrice(plan, userProfile);
  const budgetMap: Record<string, number> = {
    'Low': 200,
    'Medium': 400,
    'High': 700
  };
  const userBudget = budgetMap[userProfile.budget || 'Medium'];
  
  if (adjustedPrice <= userBudget) {
    score += 10;
    reasons.push('Within your budget range');
  } else if (adjustedPrice <= userBudget * 1.2) {
    score += 5;
  } else {
    score -= 10;
  }

  // Add randomization factor (±10 points) to ensure variety
  const randomFactor = -5 + (Math.random() * 10);
  score += randomFactor;

  // Normalize score to 0-100
  score = Math.max(0, Math.min(100, score));
  
  const matchPercentage = Math.round(score);

  return {
    plan,
    score,
    matchPercentage,
    adjustedPrice,
    reasons: reasons.slice(0, 3) // Top 3 reasons
  };
}

/**
 * Generate smart recommendations based on selected insurance types
 */
export function generateSmartRecommendations(
  userProfile: UserProfile,
  selectedTypes: string[]
): RecommendationScore[] {
  const recommendations: RecommendationScore[] = [];

  // For each selected insurance type, find the best matching plan
  selectedTypes.forEach(type => {
    const plansOfType = INSURANCE_PLANS.filter(plan => plan.type === type);
    
    if (plansOfType.length === 0) return;

    // Score all plans of this type
    const scoredPlans = plansOfType.map(plan => 
      calculateMatchScore(plan, userProfile, type)
    ).filter(scored => scored.score > 0);

    // Sort by score
    scoredPlans.sort((a, b) => b.score - a.score);

    // Take top 2-3 plans to add variety
    const topPlans = scoredPlans.slice(0, 3);
    
    // Randomly select one from the top plans (adds variety)
    if (topPlans.length > 0) {
      const selectedIndex = Math.floor(Math.random() * Math.min(topPlans.length, 2));
      recommendations.push(topPlans[selectedIndex]);
    }
  });

  // Sort final recommendations by match percentage
  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return recommendations;
}

/**
 * Get AI insights based on recommendations
 */
export function generateAIInsights(
  recommendations: RecommendationScore[],
  userProfile: UserProfile
): {
  overallAnalysis: string;
  riskFactors: string[];
  savingsTips: string[];
} {
  const riskLevel = calculateRiskLevel(userProfile);
  const riskFactors: string[] = [];
  const savingsTips: string[] = [];

  // Generate risk factors
  const familyHistory = userProfile.familyHistory || {};
  if (familyHistory.cardiovascular) {
    riskFactors.push('Family history of cardiovascular disease');
  }
  if (familyHistory.diabetes) {
    riskFactors.push('Genetic predisposition to diabetes');
  }
  if (userProfile.smokingStatus === 'Current smoker') {
    riskFactors.push('Smoking increases health insurance premiums');
  }
  if (userProfile.exerciseFrequency === 'Rarely' || userProfile.exerciseFrequency === 'Never') {
    riskFactors.push('Sedentary lifestyle impacts health coverage');
  }

  // Generate savings tips
  if (userProfile.exerciseFrequency !== 'Daily') {
    savingsTips.push('Increasing physical activity can lead to better rates and overall health');
  }
  if (userProfile.smokingStatus !== 'Never') {
    savingsTips.push('Quitting smoking can reduce premiums by up to 30%');
  }
  if (recommendations.length > 1) {
    savingsTips.push('Bundling multiple insurance types can save 10-15%');
  }
  savingsTips.push('Annual payment plans often offer 5-8% savings vs monthly payments');

  // Generate overall analysis
  const totalMonthly = recommendations.reduce((sum, rec) => sum + rec.adjustedPrice, 0);
  const analysisText = `Based on your ${userProfile.age}-year profile with ${riskLevel} risk level, we've personalized ${recommendations.length} plan${recommendations.length > 1 ? 's' : ''} with AI-optimized pricing. Your estimated monthly total is RM ${totalMonthly}.`;

  return {
    overallAnalysis: analysisText,
    riskFactors: riskFactors.slice(0, 3),
    savingsTips: savingsTips.slice(0, 3)
  };
}
