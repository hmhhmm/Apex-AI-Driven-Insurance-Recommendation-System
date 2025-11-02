import { InsurancePlan } from '../types/insurance.types';
import { UserProfile } from '../types/user.types';
import { INSURANCE_PLANS } from '../data/insurancePlans';

interface ScoredPlan {
  plan: InsurancePlan;
  score: number;
  matchPercentage: number;
  adjustedPrice: number;
  reasons: string[];
}

// Store for forcing refresh on each page load
let lastRefreshTime = 0;
const REFRESH_INTERVAL = 100; // Force new calculations every 100ms

/**
 * Force fresh recommendations by clearing cache
 */
export function forceRecommendationRefresh(): void {
  lastRefreshTime = Date.now();
}

/**
 * Get refresh seed that changes on every page load
 */
function getRefreshSeed(): number {
  return Date.now() + Math.random() * 10000;
}

/**
 * Advanced recommendation engine that personalizes insurance recommendations
 * based on user age, income, coverage needs, and risk profile
 * REFRESHES with new prices every time the page is loaded
 */
export function generatePersonalizedRecommendations(userProfile: UserProfile): ScoredPlan[] {
  // Force fresh calculations on each call
  const refreshSeed = getRefreshSeed();
  
  const {
    age,
    annualIncome,
    selectedInsuranceTypes,
    smokingStatus,
    exerciseFrequency,
    familyHistory,
    occupation,
    budget,
    hasDependents,
    numberOfDependents
  } = userProfile;

  // Determine required coverage based on user profile
  const requiredCoverage = calculateRequiredCoverage(age, annualIncome, hasDependents, numberOfDependents);
  
  // Filter plans by selected insurance types
  const relevantPlans = INSURANCE_PLANS.filter(plan => 
    selectedInsuranceTypes.includes(plan.type as any)
  );

  // Score and personalize each plan (with refresh seed for variety)
  const scoredPlans: ScoredPlan[] = relevantPlans.map(plan => {
    let score = 0;
    const reasons: string[] = [];
    
    // 1. AGE MATCHING (30 points)
    const [minAge, maxAge] = plan.targetAgeRange;
    if (age >= minAge && age <= maxAge) {
      score += 30;
      reasons.push(`Perfect age fit (${age} years)`);
    } else if (age < minAge) {
      score += 15;
      reasons.push('Excellent long-term value for your age');
    } else {
      score += 10;
      reasons.push('Coverage available for your age group');
    }

    // 2. COVERAGE ADEQUACY (35 points)
    const coverageScore = calculateCoverageScore(plan, requiredCoverage, age, annualIncome);
    score += coverageScore.points;
    if (coverageScore.reason) reasons.push(coverageScore.reason);

    // 3. PRICE AFFORDABILITY (20 points)
    const affordabilityScore = calculateAffordabilityScore(plan.basePrice, annualIncome, budget);
    score += affordabilityScore.points;
    if (affordabilityScore.reason) reasons.push(affordabilityScore.reason);

    // 4. RISK PROFILE MATCHING (10 points)
    const riskScore = calculateRiskScore(plan, smokingStatus, exerciseFrequency, familyHistory);
    score += riskScore.points;
    reasons.push(...riskScore.reasons);

    // 5. OCCUPATION RELEVANCE (5 points)
    if (isOccupationRelevant(plan.type, occupation)) {
      score += 5;
      reasons.push('Highly relevant for your profession');
    }

    // Add small random variation to score for diversity (±3 points)
    score += (Math.random() * 6) - 3;

    // Calculate personalized price (includes refresh seed for variation)
    const adjustedPrice = calculatePersonalizedPrice(
      plan,
      age,
      annualIncome,
      smokingStatus,
      exerciseFrequency,
      familyHistory,
      occupation,
      refreshSeed
    );

    const matchPercentage = Math.min(100, Math.round(score));

    return {
      plan,
      score,
      matchPercentage,
      adjustedPrice: Math.round(adjustedPrice),
      reasons
    };
  });

  // Sort by score and return top recommendations
  return scoredPlans.sort((a, b) => b.score - a.score);
}

/**
 * Calculate required coverage based on user's financial situation
 */
function calculateRequiredCoverage(
  age: number,
  annualIncome: number,
  hasDependents: boolean,
  numberOfDependents: number
): number {
  let coverage = annualIncome * 10; // Base: 10x annual income

  // Age factor: younger needs more coverage
  if (age < 35) {
    coverage *= 1.2;
  } else if (age > 50) {
    coverage *= 0.8;
  }

  // Dependents factor
  if (hasDependents) {
    coverage += (numberOfDependents * annualIncome * 2);
  }

  return Math.round(coverage);
}

/**
 * Score plan based on coverage adequacy
 * HIGH INCOME + OLDER AGE = PREMIUM HIGH-COVERAGE PLANS
 */
function calculateCoverageScore(
  plan: InsurancePlan,
  requiredCoverage: number,
  age: number,
  annualIncome: number
): { points: number; reason?: string } {
  // Extract coverage amount from plan features or estimate from price
  const planCoverageMatch = plan.coverage.match(/RM\s*([\d,]+)/);
  const planFeatureCoverage = plan.features.find(f => f.match(/RM\s*([\d,]+)/));
  
  let estimatedCoverage = plan.basePrice * 1000; // Rough estimate
  
  if (planCoverageMatch) {
    estimatedCoverage = parseInt(planCoverageMatch[1].replace(/,/g, ''));
  } else if (planFeatureCoverage) {
    const match = planFeatureCoverage.match(/RM\s*([\d,]+)/);
    if (match) {
      estimatedCoverage = parseInt(match[1].replace(/,/g, ''));
    }
  }

  // ===== HIGH INCOME (>120K) + OLDER AGE (>45) = PREMIUM PLANS ONLY =====
  if ((annualIncome > 120000 || age > 45) && estimatedCoverage > 500000) {
    if (plan.basePrice > 500) {
      return {
        points: 35,
        reason: `Premium ${(estimatedCoverage/1000000).toFixed(1)}M coverage ideal for ${age > 50 ? 'senior protection' : 'high-income security'}`
      };
    } else if (plan.basePrice > 400) {
      return {
        points: 32,
        reason: `Comprehensive ${(estimatedCoverage/1000).toFixed(0)}K coverage for your ${age > 50 ? 'age group' : 'income level'}`
      };
    } else if (plan.basePrice > 300) {
      return {
        points: 25,
        reason: `Mid-tier coverage (RM ${(estimatedCoverage/1000).toFixed(0)}K) - consider upgrading`
      };
    } else {
      return {
        points: 12,
        reason: 'Basic coverage insufficient - premium plans recommended'
      };
    }
  }

  // ===== SENIOR CITIZENS (55+) NEED HIGHER COVERAGE =====
  if (age >= 55) {
    if (plan.basePrice > 450) {
      return {
        points: 35,
        reason: `Excellent ${(estimatedCoverage/1000).toFixed(0)}K coverage for seniors with comprehensive benefits`
      };
    } else if (plan.basePrice > 350) {
      return {
        points: 28,
        reason: `Good ${(estimatedCoverage/1000).toFixed(0)}K senior coverage`
      };
    } else {
      return {
        points: 15,
        reason: 'Consider higher coverage for better senior protection'
      };
    }
  }

  // ===== MID-HIGH INCOME (80K-120K) =====
  if (annualIncome > 80000 && annualIncome <= 120000) {
    if (plan.basePrice > 300 && plan.basePrice < 500) {
      return {
        points: 35,
        reason: `Perfect ${(estimatedCoverage/1000).toFixed(0)}K coverage for your income bracket`
      };
    } else if (plan.basePrice > 500) {
      return {
        points: 28,
        reason: `Premium ${(estimatedCoverage/1000000).toFixed(1)}M plan with extensive benefits`
      };
    } else {
      return {
        points: 22,
        reason: `Affordable ${(estimatedCoverage/1000).toFixed(0)}K coverage with solid protection`
      };
    }
  }

  // ===== MIDDLE INCOME (50K-80K) =====
  if (annualIncome > 50000 && annualIncome <= 80000) {
    if (plan.basePrice > 200 && plan.basePrice < 350) {
      return {
        points: 35,
        reason: `Optimal ${(estimatedCoverage/1000).toFixed(0)}K coverage balancing price and protection`
      };
    } else if (plan.basePrice > 350) {
      return {
        points: 20,
        reason: 'Premium plan - excellent but higher cost'
      };
    } else {
      return {
        points: 25,
        reason: `Budget-friendly ${(estimatedCoverage/1000).toFixed(0)}K coverage`
      };
    }
  }

  // ===== BUDGET-CONSCIOUS (<50K) =====
  if (annualIncome <= 50000) {
    if (plan.basePrice < 200) {
      return {
        points: 35,
        reason: `Affordable ${(estimatedCoverage/1000).toFixed(0)}K essential coverage`
      };
    } else if (plan.basePrice < 300) {
      return {
        points: 25,
        reason: `Good value ${(estimatedCoverage/1000).toFixed(0)}K coverage`
      };
    } else {
      return {
        points: 10,
        reason: 'Premium pricing - consider budget-friendly alternatives'
      };
    }
  }

  return { points: 18, reason: `Standard ${(estimatedCoverage/1000).toFixed(0)}K coverage` };
}

/**
 * Score plan based on affordability
 */
function calculateAffordabilityScore(
  planPrice: number,
  annualIncome: number,
  budget: string
): { points: number; reason?: string } {
  const monthlyIncome = annualIncome / 12;
  const pricePercentage = (planPrice / monthlyIncome) * 100;

  // Budget preferences
  const budgetMultipliers = {
    'Low': 0.7,
    'Medium': 1.0,
    'High': 1.5
  };

  const maxAffordable = monthlyIncome * 0.1 * (budgetMultipliers[budget as keyof typeof budgetMultipliers] || 1);

  if (planPrice <= maxAffordable * 0.5) {
    return {
      points: 20,
      reason: `Excellent value - only ${pricePercentage.toFixed(1)}% of monthly income`
    };
  } else if (planPrice <= maxAffordable) {
    return {
      points: 15,
      reason: `Well within budget (${pricePercentage.toFixed(1)}% of monthly income)`
    };
  } else if (planPrice <= maxAffordable * 1.3) {
    return {
      points: 10,
      reason: 'Slightly above ideal budget but manageable'
    };
  }

  return {
    points: 5,
    reason: 'Premium pricing for comprehensive coverage'
  };
}

/**
 * Score based on health risk factors
 */
function calculateRiskScore(
  plan: InsurancePlan,
  smokingStatus: string,
  exerciseFrequency: string,
  familyHistory: any
): { points: number; reasons: string[] } {
  let points = 5; // Base points
  const reasons: string[] = [];

  // Check if plan addresses specific risk factors
  if (plan.dnaFactors && plan.dnaFactors.length > 0) {
    if (smokingStatus !== 'Never' && plan.dnaFactors.includes('cardiovascularRisk')) {
      points += 3;
      reasons.push('Includes cardiac care for smokers');
    }

    if (familyHistory?.diabetes && plan.dnaFactors.includes('diabetesRisk')) {
      points += 3;
      reasons.push('Diabetes family history coverage');
    }

    if (familyHistory?.cardiovascular && plan.dnaFactors.includes('cardiovascularRisk')) {
      points += 3;
      reasons.push('Heart health coverage for family history');
    }
  }

  // Exercise benefits
  if (exerciseFrequency === 'Daily' || exerciseFrequency === 'Regularly') {
    points += 2;
    reasons.push('Active lifestyle discount eligible');
  }

  return { points: Math.min(10, points), reasons };
}

/**
 * Check if plan type is relevant to occupation
 */
function isOccupationRelevant(planType: string, occupation: string): boolean {
  const occupationLower = occupation.toLowerCase();
  
  if (planType === 'Auto' && ['driver', 'delivery', 'sales', 'taxi'].some(o => occupationLower.includes(o))) {
    return true;
  }
  
  if (planType === 'Sports' && ['athlete', 'coach', 'trainer', 'fitness'].some(o => occupationLower.includes(o))) {
    return true;
  }
  
  if (planType === 'Travel' && ['pilot', 'flight', 'travel', 'tourism'].some(o => occupationLower.includes(o))) {
    return true;
  }

  return false;
}

/**
 * Calculate personalized price with HIGHLY GRANULAR risk factors
 * Ensures unique pricing for every user profile and EVERY PAGE LOAD
 */
function calculatePersonalizedPrice(
  plan: InsurancePlan,
  age: number,
  annualIncome: number,
  smokingStatus: string,
  exerciseFrequency: string,
  familyHistory: any,
  occupation: string,
  refreshSeed: number = Date.now()
): number {
  let price = plan.basePrice;

  // ========== ULTRA-GRANULAR AGE FACTOR (every year matters!) ==========
  if (age <= 22) {
    // Youth discount: 18yo=68%, 22yo=74%
    price *= (0.65 + (age - 18) * 0.015);
  } else if (age <= 25) {
    // Young adult: 23yo=76%, 25yo=82%
    price *= (0.74 + (age - 22) * 0.022);
  } else if (age <= 30) {
    // Prime age: 26yo=85%, 30yo=91%
    price *= (0.82 + (age - 25) * 0.018);
  } else if (age <= 35) {
    // Early career: 31yo=93%, 35yo=98%
    price *= (0.91 + (age - 30) * 0.014);
  } else if (age <= 40) {
    // Mid-career: 36yo=100%, 40yo=107%
    price *= (0.98 + (age - 35) * 0.018);
  } else if (age <= 45) {
    // Established: 41yo=110%, 45yo=119%
    price *= (1.07 + (age - 40) * 0.023);
  } else if (age <= 50) {
    // Pre-senior: 46yo=123%, 50yo=136%
    price *= (1.19 + (age - 45) * 0.026);
  } else if (age <= 55) {
    // Early senior: 51yo=142%, 55yo=158%
    price *= (1.36 + (age - 50) * 0.032);
  } else if (age <= 60) {
    // Senior: 56yo=165%, 60yo=184%
    price *= (1.58 + (age - 55) * 0.038);
  } else if (age <= 65) {
    // Late senior: 61yo=192%, 65yo=212%
    price *= (1.84 + (age - 60) * 0.04);
  } else {
    // Elderly: 66yo=220%, 70yo=260%
    price *= (2.12 + (age - 65) * 0.048);
  }

  // ========== PRECISE SMOKING IMPACT ==========
  if (smokingStatus === 'Current smoker' || smokingStatus === 'Daily') {
    price *= 1.32; // 32% increase
  } else if (smokingStatus === 'Former smoker') {
    price *= 1.18; // 18% increase
  } else if (smokingStatus === 'Occasionally') {
    price *= 1.14; // 14% increase
  } else {
    price *= 0.96; // 4% discount for never smokers
  }

  // ========== DETAILED EXERCISE BENEFITS ==========
  if (exerciseFrequency === 'Daily') {
    price *= 0.87; // 13% discount
  } else if (exerciseFrequency === '5-6 times/week' || exerciseFrequency === 'Regularly') {
    price *= 0.91; // 9% discount
  } else if (exerciseFrequency === '3-4 times/week') {
    price *= 0.96; // 4% discount
  } else if (exerciseFrequency === 'Occasionally' || exerciseFrequency === '1-2 times/week') {
    price *= 1.02; // 2% increase
  } else {
    price *= 1.11; // 11% increase for sedentary
  }

  // ========== SPECIFIC FAMILY HISTORY RISKS ==========
  if (familyHistory) {
    if (familyHistory.cardiovascular) {
      price *= 1.08; // 8% for heart disease
    }
    if (familyHistory.diabetes) {
      price *= 1.06; // 6% for diabetes
    }
    if (familyHistory.cancer) {
      price *= 1.07; // 7% for cancer
    }
    if (familyHistory.alzheimers) {
      price *= 1.04; // 4% for Alzheimer's
    }
  }

  // ========== OCCUPATION-SPECIFIC PRICING ==========
  const occupationLower = occupation.toLowerCase();
  
  // High-risk occupations (+12-18%)
  if (['construction', 'mining', 'oil', 'gas'].some(o => occupationLower.includes(o))) {
    price *= 1.18; // Very high risk
  } else if (['police', 'security', 'firefighter', 'military'].some(o => occupationLower.includes(o))) {
    price *= 1.15; // High risk
  } else if (['driver', 'delivery', 'courier', 'taxi'].some(o => occupationLower.includes(o))) {
    price *= 1.12; // Moderate-high risk
  } 
  // Medium-risk occupations (+3-6%)
  else if (['healthcare', 'nurse', 'doctor', 'hospital'].some(o => occupationLower.includes(o))) {
    price *= 1.06; // Healthcare exposure
  } else if (['chef', 'cook', 'restaurant'].some(o => occupationLower.includes(o))) {
    price *= 1.04; // Kitchen hazards
  } else if (['factory', 'manufacturing', 'warehouse'].some(o => occupationLower.includes(o))) {
    price *= 1.05; // Industrial work
  }
  // Low-risk occupations (discount -2 to -5%)
  else if (['accountant', 'finance', 'banker', 'analyst'].some(o => occupationLower.includes(o))) {
    price *= 0.96; // Desk job discount
  } else if (['teacher', 'professor', 'education'].some(o => occupationLower.includes(o))) {
    price *= 0.97; // Education sector
  } else if (['IT', 'software', 'programmer', 'developer'].some(o => occupationLower.includes(o))) {
    price *= 0.95; // Tech sector
  }

  // ========== INCOME-BASED PREMIUM TIER ADJUSTMENT ==========
  if (annualIncome > 200000 && plan.basePrice > 500) {
    price *= 1.08; // High-income premium tier
  } else if (annualIncome > 150000 && plan.basePrice > 400) {
    price *= 1.05; // Upper-income premium
  } else if (annualIncome > 100000 && plan.basePrice > 300) {
    price *= 1.03; // Middle-income standard
  } else if (annualIncome < 50000 && plan.basePrice < 200) {
    price *= 0.94; // Budget tier discount
  }

  // ========== PLAN TYPE SPECIFIC ADJUSTMENTS ==========
  if (plan.type === 'Health') {
    // Health insurance is more sensitive to age and health factors
    if (age > 50) price *= 1.05;
    if (smokingStatus === 'Current smoker') price *= 1.08;
  } else if (plan.type === 'Auto') {
    // Auto less sensitive to health, more to occupation
    if (occupationLower.includes('driver')) price *= 1.12;
  } else if (plan.type === 'Sports') {
    // Sports benefits from fitness
    if (exerciseFrequency === 'Daily') price *= 0.92;
  } else if (plan.type === 'Life') {
    // Life insurance heavily weighted on age and health
    if (age > 55) price *= 1.12;
    if (familyHistory?.cardiovascular || familyHistory?.cancer) price *= 1.09;
  }

  // ========== TIME-BASED VARIANCE (changes with each page load) ==========
  // Use refresh seed + user age + random component for unique pricing per page load
  const sessionSeed = refreshSeed + age + (Math.random() * 1000);
  const pseudoRandom = ((sessionSeed * 9301 + 49297) % 233280) / 233280.0;
  const timeVariance = 0.95 + (pseudoRandom * 0.10); // ±5% variance
  price *= timeVariance;

  // ========== FINAL RANDOMIZATION (ensures different prices on every refresh) ==========
  const finalVariance = 0.96 + (Math.random() * 0.08); // ±4%
  price *= finalVariance;

  // Round to realistic price (avoid too many decimal places)
  // Round to nearest RM 3-7 for more natural pricing (e.g., 308, 313, 317 instead of 310, 315, 320)
  const roundBase = 3 + Math.floor(Math.random() * 5); // Random between 3-7
  price = Math.round(price / roundBase) * roundBase;

  return Math.round(price);
}

/**
 * Get top N recommendations ensuring diversity across insurance types
 */
export function getTopRecommendations(
  allRecommendations: ScoredPlan[],
  count: number,
  ensureDiversity: boolean = true
): ScoredPlan[] {
  if (!ensureDiversity) {
    return allRecommendations.slice(0, count);
  }

  const selected: ScoredPlan[] = [];
  const usedTypes = new Set<string>();

  // First pass: get one of each type
  for (const rec of allRecommendations) {
    if (selected.length >= count) break;
    if (!usedTypes.has(rec.plan.type)) {
      selected.push(rec);
      usedTypes.add(rec.plan.type);
    }
  }

  // Second pass: fill remaining slots with highest scores
  for (const rec of allRecommendations) {
    if (selected.length >= count) break;
    if (!selected.includes(rec)) {
      selected.push(rec);
    }
  }

  return selected;
}
