import { RecommendationRequest, RecommendationResponse } from '../../types/recommendation.types';
import { UserProfile } from '../../types/user.types';
import { calculateRiskProfile } from '../../services/riskScoring';
import { interpretDNA, calculateDNARiskScore } from '../../services/dnaInterpretation';
import { matchAndRecommendPlans, calculateConfidenceScore } from '../../services/planMatching';
import { calculateTotalSavings } from '../../utils/pricingCalculator';
import { MASTER_DNA_REPORT } from '../../data/masterDNA';

/**
 * RECOMMENDATIONS API
 * Main endpoint for generating personalized insurance recommendations
 */

/**
 * Generate recommendations (can be used as API call or direct function)
 */
export async function generateRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  try {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const { userProfile } = request;

    // Validate user profile
    if (!userProfile || !userProfile.selectedInsuranceTypes || userProfile.selectedInsuranceTypes.length === 0) {
      return {
        success: false,
        data: {
          userRiskProfile: {
            overallRiskScore: 0,
            riskCategory: 'Medium',
            dnaRisk: 0,
            lifestyleRisk: 0,
            ageRisk: 0,
            familyHistoryRisk: 0,
            dnaInterpretation: {
              displayRisks: [],
              primaryConcerns: [],
              geneticStrengths: [],
              relevantMarkers: []
            }
          },
          recommendations: [],
          alternativePlans: [],
          totalPotentialSavings: 0,
          confidence: 0
        }
      };
    }

    // Step 1: Calculate risk profile
    const riskProfile = calculateRiskProfile(userProfile as UserProfile);

    // Step 2: Interpret DNA contextually
    const dnaInterpretation = interpretDNA(MASTER_DNA_REPORT, userProfile as UserProfile);

    // Step 3: Match and recommend plans
    const { recommendations, alternativePlans } = matchAndRecommendPlans(
      userProfile as UserProfile,
      riskProfile,
      dnaInterpretation,
      4 // Top 4 recommendations
    );

    // Step 4: Calculate total potential savings
    const totalPotentialSavings = calculateTotalSavings(recommendations);

    // Step 5: Calculate confidence score
    const confidence = calculateConfidenceScore(userProfile as UserProfile);

    // Return formatted response
    return {
      success: true,
      data: {
        userRiskProfile: {
          ...riskProfile,
          dnaInterpretation
        },
        recommendations,
        alternativePlans,
        totalPotentialSavings,
        confidence
      }
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
  }
}

/**
 * Mock API endpoint (for development)
 * In production, this would be a real API call
 */
export async function fetchRecommendationsAPI(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  // This simulates an API call
  // In production, replace with: axios.post('/api/recommendations/generate', request)
  return generateRecommendations(request);
}
