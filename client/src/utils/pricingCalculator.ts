import { InsurancePlan } from '../types/insurance.types';

/**
 * PRICING CALCULATOR
 * Adjusts insurance plan prices based on user's risk profile
 */

/**
 * Calculate adjusted price based on risk score
 */
export function calculateAdjustedPrice(
  plan: InsurancePlan,
  userRiskScore: number
): {
  adjustedPrice: number;
  originalPrice: number;
  monthlyPrice: number;
  savings: number;
  savingsPercentage: number;
  multiplierUsed: number;
} {
  const basePrice = plan.basePrice;
  
  // Determine which risk multiplier to use
  let multiplier: number;
  if (userRiskScore < 40) {
    multiplier = plan.riskMultipliers.low;
  } else if (userRiskScore < 65) {
    multiplier = plan.riskMultipliers.medium;
  } else {
    multiplier = plan.riskMultipliers.high;
  }

  // Calculate adjusted price
  const adjustedPrice = Math.round(basePrice * multiplier);
  
  // Traditional insurance is assumed to be 30% more expensive
  const traditionalPrice = Math.round(basePrice * 1.30);
  
  // Calculate savings
  const savings = traditionalPrice - adjustedPrice;
  const savingsPercentage = Math.round((savings / traditionalPrice) * 100);

  return {
    adjustedPrice,
    originalPrice: basePrice,
    monthlyPrice: adjustedPrice,
    savings: Math.max(0, savings),
    savingsPercentage: Math.max(0, savingsPercentage),
    multiplierUsed: multiplier
  };
}

/**
 * Calculate total potential savings across multiple plans
 */
export function calculateTotalSavings(
  plans: Array<{ adjustedPrice: number; originalPrice: number }>
): number {
  return plans.reduce((total, plan) => {
    const traditionalPrice = Math.round(plan.originalPrice * 1.30);
    const savings = traditionalPrice - plan.adjustedPrice;
    return total + Math.max(0, savings);
  }, 0);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'RM'): string {
  return `${currency} ${price.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Calculate annual price
 */
export function calculateAnnualPrice(monthlyPrice: number): number {
  return monthlyPrice * 12;
}

/**
 * Get price comparison text
 */
export function getPriceComparisonText(savings: number, savingsPercentage: number): string {
  if (savings <= 0) {
    return 'Standard pricing';
  }
  
  if (savingsPercentage >= 25) {
    return `Exceptional savings of ${savingsPercentage}%`;
  } else if (savingsPercentage >= 15) {
    return `Great savings of ${savingsPercentage}%`;
  } else if (savingsPercentage >= 5) {
    return `Save ${savingsPercentage}% with DNA-powered pricing`;
  } else {
    return 'Competitive pricing';
  }
}
