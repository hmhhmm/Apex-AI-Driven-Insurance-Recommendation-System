import { UserProfile } from '../types/user.types';
import { DNAInterpretation } from '../types/dna.types';
import { PlanRecommendation } from '../types/insurance.types';

/**
 * RECOMMENDATION TEXT GENERATOR
 * Generates personalized, contextual text for recommendations
 */

/**
 * Generate header summary text
 */
export function generateHeaderSummary(
  userProfile: UserProfile,
  dnaInterpretation: DNAInterpretation
): {
  title: string;
  subtitle: string;
  highlights: string[];
} {
  const { age, lifestyle, selectedInsuranceTypes } = userProfile;
  
  const insuranceTypesText = selectedInsuranceTypes
    .map(type => type.toLowerCase())
    .join(', ')
    .replace(/, ([^,]*)$/, ' and $1');

  return {
    title: 'Your Personalized Insurance Recommendations',
    subtitle: `Based on your DNA analysis, ${lifestyle.toLowerCase()} lifestyle, and ${insuranceTypesText} coverage needs`,
    highlights: [
      `Age: ${age} years`,
      `Lifestyle: ${lifestyle}`,
      `Risk Factors: ${dnaInterpretation.displayRisks.join(', ') || 'Favorable profile'}`
    ]
  };
}

/**
 * Generate recommendation confidence text
 */
export function generateConfidenceText(confidence: number): string {
  if (confidence >= 95) {
    return `We're ${confidence}% confident these are your optimal choices`;
  } else if (confidence >= 85) {
    return `We're ${confidence}% confident in these recommendations`;
  } else if (confidence >= 75) {
    return `These plans match ${confidence}% of your profile`;
  } else {
    return `Based on available data (${confidence}% confidence)`;
  }
}

/**
 * Generate savings summary text
 */
export function generateSavingsSummary(
  totalSavings: number,
  recommendationCount: number
): string {
  if (totalSavings === 0) {
    return 'Competitive market pricing';
  }
  
  const avgSavings = Math.round(totalSavings / recommendationCount);
  
  if (avgSavings >= 100) {
    return `Save up to RM ${totalSavings}/month with DNA-powered pricing`;
  } else if (avgSavings >= 50) {
    return `Save RM ${totalSavings}/month compared to traditional insurance`;
  } else {
    return `DNA-optimized pricing saves you money`;
  }
}

/**
 * Generate match badge text
 */
export function generateMatchBadgeText(matchPercentage: number): string {
  if (matchPercentage >= 91) {
    return 'Excellent Match';
  } else if (matchPercentage >= 85) {
    return 'Great Match';
  } else if (matchPercentage >= 75) {
    return 'Good Match';
  } else {
    return 'Consider';
  }
}

/**
 * Generate plan comparison text
 */
export function generateComparisonText(
  plan1: PlanRecommendation,
  plan2: PlanRecommendation
): string[] {
  const comparisons: string[] = [];

  // Price comparison
  const priceDiff = Math.abs(plan1.monthlyPrice - plan2.monthlyPrice);
  if (priceDiff > 50) {
    const cheaper = plan1.monthlyPrice < plan2.monthlyPrice ? plan1.plan.name : plan2.plan.name;
    comparisons.push(`${cheaper} is RM ${priceDiff}/month more affordable`);
  }

  // Match percentage comparison
  const matchDiff = Math.abs(plan1.matchPercentage - plan2.matchPercentage);
  if (matchDiff > 5) {
    const better = plan1.matchPercentage > plan2.matchPercentage ? plan1.plan.name : plan2.plan.name;
    comparisons.push(`${better} is a ${matchDiff}% better match for your profile`);
  }

  // Coverage comparison
  const coverage1 = plan1.features.length;
  const coverage2 = plan2.features.length;
  const coverageDiff = Math.abs(coverage1 - coverage2);
  if (coverageDiff >= 2) {
    const moreCoverage = coverage1 > coverage2 ? plan1.plan.name : plan2.plan.name;
    comparisons.push(`${moreCoverage} offers ${coverageDiff} more features`);
  }

  return comparisons;
}

/**
 * Generate empty state text
 */
export function generateEmptyStateText(selectedTypes: string[]): {
  title: string;
  message: string;
  suggestions: string[];
} {
  return {
    title: 'No plans found',
    message: `We couldn't find insurance plans matching your selection: ${selectedTypes.join(', ')}`,
    suggestions: [
      'Try selecting different insurance types',
      'Adjust your budget preferences',
      'Contact our support team for custom options'
    ]
  };
}

/**
 * Generate DNA insight text for display
 */
export function generateDNAInsightText(dnaInterpretation: DNAInterpretation): string[] {
  const insights: string[] = [];

  // Add risk insights
  if (dnaInterpretation.displayRisks.length > 0) {
    insights.push(`🧬 Genetic Analysis: ${dnaInterpretation.displayRisks.join(', ')}`);
  }

  // Add strength insights
  if (dnaInterpretation.geneticStrengths.length > 0) {
    insights.push(`💪 Genetic Strengths: ${dnaInterpretation.geneticStrengths.join(', ')}`);
  }

  // Add concern insights
  if (dnaInterpretation.primaryConcerns.length > 0) {
    insights.push(`⚠️ Focus Areas: ${dnaInterpretation.primaryConcerns.join(', ')}`);
  }

  return insights;
}

/**
 * Generate call-to-action text based on plan match
 */
export function generateCTAText(matchPercentage: number): string {
  if (matchPercentage >= 90) {
    return 'Perfect for You - Select Now';
  } else if (matchPercentage >= 80) {
    return 'Great Match - View Details';
  } else if (matchPercentage >= 70) {
    return 'Good Option - Learn More';
  } else {
    return 'View Details';
  }
}

/**
 * Generate plan feature highlights based on user needs
 */
export function generateFeatureHighlights(
  features: string[],
  userProfile: UserProfile,
  dnaInterpretation: DNAInterpretation
): string[] {
  const highlighted: string[] = [];

  // Prioritize features based on DNA risks
  dnaInterpretation.displayRisks.forEach(risk => {
    const riskKeyword = risk.split(' ')[0].toLowerCase();
    features.forEach(feature => {
      if (feature.toLowerCase().includes(riskKeyword) && !highlighted.includes(feature)) {
        highlighted.push(feature);
      }
    });
  });

  // Add lifestyle-relevant features
  if (userProfile.lifestyle === 'Active') {
    features.forEach(feature => {
      if ((feature.toLowerCase().includes('sports') || 
           feature.toLowerCase().includes('injury') ||
           feature.toLowerCase().includes('fitness')) && 
          !highlighted.includes(feature)) {
        highlighted.push(feature);
      }
    });
  }

  // Fill remaining with top features
  features.forEach(feature => {
    if (highlighted.length < 5 && !highlighted.includes(feature)) {
      highlighted.push(feature);
    }
  });

  return highlighted.slice(0, 5);
}
