import { UserProfile, RiskProfile } from '../types/user.types';
import { InsuranceType } from '../types/insurance.types';
import { calculateDNARiskScore } from './dnaInterpretation';
import { MASTER_DNA_REPORT } from '../data/masterDNA';

/**
 * RISK SCORING ENGINE
 * Calculates comprehensive risk score (0-100) based on multiple factors
 * Algorithm: DNA (40%) + Lifestyle (30%) + Age (20%) + Family History (10%)
 */

/**
 * Calculate lifestyle risk score (0-100)
 * Higher score = higher risk
 */
function calculateLifestyleRisk(userProfile: UserProfile): number {
  let score = 0;
  let factors = 0;

  // Exercise frequency (0-80 scale)
  const exerciseScores: Record<string, number> = {
    'Never': 80,
    'Rarely': 60,
    'Occasionally': 40,
    'Regularly': 20
  };
  score += exerciseScores[userProfile.exerciseFrequency] || 40;
  factors++;

  // Smoking status (0-80 scale)
  const smokingScores: Record<string, number> = {
    'Current': 80,
    'Former': 40,
    'Never': 10
  };
  score += smokingScores[userProfile.smokingStatus] || 10;
  factors++;

  // Alcohol consumption (0-70 scale)
  const alcoholScores: Record<string, number> = {
    'Heavy': 70,
    'Moderate': 40,
    'Light': 20,
    'None': 10
  };
  score += alcoholScores[userProfile.alcoholConsumption] || 10;
  factors++;

  // Lifestyle type (0-70 scale)
  const lifestyleScores: Record<string, number> = {
    'Sedentary': 70,
    'Moderate': 40,
    'Active': 15
  };
  score += lifestyleScores[userProfile.lifestyle] || 40;
  factors++;

  return Math.round(score / factors);
}

/**
 * Calculate age risk score (0-80 scale)
 * Younger = lower risk, Older = higher risk
 */
function calculateAgeRisk(age: number): number {
  if (age < 25) return 20;
  if (age < 35) return 25;
  if (age < 45) return 35;
  if (age < 55) return 50;
  if (age < 65) return 65;
  return 80;
}

/**
 * Calculate family history risk score (0-100 scale)
 * Each condition adds 15 points
 */
function calculateFamilyHistoryRisk(userProfile: UserProfile): number {
  const { familyHistory } = userProfile;
  let score = 0;
  let conditions = 0;

  if (familyHistory.cardiovascular) {
    score += 15;
    conditions++;
  }
  if (familyHistory.diabetes) {
    score += 15;
    conditions++;
  }
  if (familyHistory.cancer) {
    score += 15;
    conditions++;
  }
  if (familyHistory.alzheimers) {
    score += 15;
    conditions++;
  }

  // If no family history, return low baseline
  if (conditions === 0) return 10;

  // Average the scores
  return Math.round(score);
}

/**
 * Calculate overall risk profile
 */
export function calculateRiskProfile(userProfile: UserProfile): RiskProfile {
  // Calculate individual risk components
  const dnaRisk = calculateDNARiskScore(
    MASTER_DNA_REPORT,
    userProfile.selectedInsuranceTypes as InsuranceType[]
  );
  const lifestyleRisk = calculateLifestyleRisk(userProfile);
  const ageRisk = calculateAgeRisk(userProfile.age);
  const familyHistoryRisk = calculateFamilyHistoryRisk(userProfile);

  // Calculate weighted overall risk score
  // DNA: 40%, Lifestyle: 30%, Age: 20%, Family History: 10%
  const overallRiskScore = Math.round(
    dnaRisk * 0.40 +
    lifestyleRisk * 0.30 +
    ageRisk * 0.20 +
    familyHistoryRisk * 0.10
  );

  // Determine risk category
  let riskCategory: "Low" | "Medium" | "High";
  if (overallRiskScore < 40) {
    riskCategory = "Low";
  } else if (overallRiskScore < 65) {
    riskCategory = "Medium";
  } else {
    riskCategory = "High";
  }

  return {
    overallRiskScore,
    riskCategory,
    dnaRisk,
    lifestyleRisk,
    ageRisk,
    familyHistoryRisk
  };
}

/**
 * Get risk breakdown explanation
 */
export function getRiskBreakdown(riskProfile: RiskProfile): string[] {
  const breakdown: string[] = [];

  if (riskProfile.dnaRisk >= 60) {
    breakdown.push('Genetic factors contribute significantly to your risk profile');
  }
  
  if (riskProfile.lifestyleRisk >= 60) {
    breakdown.push('Lifestyle modifications can help reduce your risk');
  }
  
  if (riskProfile.ageRisk >= 50) {
    breakdown.push('Age-related factors increase insurance considerations');
  }
  
  if (riskProfile.familyHistoryRisk >= 30) {
    breakdown.push('Family health history requires preventive care attention');
  }

  if (breakdown.length === 0) {
    breakdown.push('Your overall risk profile is favorable');
  }

  return breakdown;
}
