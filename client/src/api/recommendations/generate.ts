import { RecommendationRequest, RecommendationResponse } from '../../types/recommendation.types';
import { UserProfile } from '../../types/user.types';
import { calculateRiskProfile } from '../../services/riskScoring';
import { interpretDNA, calculateDNARiskScore } from '../../services/dnaInterpretation';
import { matchAndRecommendPlans, calculateConfidenceScore } from '../../services/planMatching';
import { calculateTotalSavings } from '../../utils/pricingCalculator';
import { MASTER_DNA_REPORT } from '../../data/masterDNA';
import { analyzeAndRecommendPlans } from '../../services/geminiService';

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

    // Step 3: Match and recommend plans (algorithmic baseline)
    const { recommendations, alternativePlans } = matchAndRecommendPlans(
      userProfile as UserProfile,
      riskProfile,
      dnaInterpretation,
      4 // Top 4 recommendations
    );

    // Step 4: AI Enhancement - Get intelligent recommendations with dynamic pricing
    let finalRecommendations = recommendations;
    let aiInsights = {
      overallAnalysis: '',
      riskFactors: [] as string[],
      savingsTips: [] as string[]
    };

    try {
      const allPlans = [...recommendations, ...alternativePlans].map(rec => rec.plan);
      
      const aiAnalysis = await analyzeAndRecommendPlans(
        {
          age: userProfile.age,
          lifestyle: userProfile.lifestyle,
          dnaRisks: dnaInterpretation.displayRisks,
          geneticStrengths: dnaInterpretation.geneticStrengths,
          familyHistory: userProfile.familyHistory ? Object.keys(userProfile.familyHistory).filter(k => userProfile.familyHistory[k as keyof typeof userProfile.familyHistory]) : [],
          exerciseFrequency: userProfile.exerciseFrequency,
          budget: userProfile.budget || 500,
          selectedTypes: userProfile.selectedInsuranceTypes
        },
        allPlans
      );

      console.log('🤖 AI Analysis:', aiAnalysis);
      
      // Apply AI recommendations and dynamic pricing
      if (aiAnalysis.topRecommendations && aiAnalysis.topRecommendations.length > 0) {
        finalRecommendations = recommendations.map(rec => {
          // Find AI recommendation for this plan
          const aiRec = aiAnalysis.topRecommendations.find(
            (ar: any) => ar.planId === rec.plan.id || ar.planId === rec.plan.name
          );
          
          if (aiRec) {
            // Apply dynamic pricing based on risk profile
            const priceAdjustment = aiRec.priceAdjustment || 0;
            const adjustedPrice = rec.plan.basePrice * (1 + priceAdjustment / 100);
            const savings = rec.plan.basePrice - adjustedPrice;
            
            return {
              ...rec,
              matchPercentage: aiRec.matchScore || rec.matchPercentage,
              reasoning: aiRec.reasoning || rec.reasoning,
              plan: {
                ...rec.plan,
                basePrice: Math.round(adjustedPrice),
                originalPrice: rec.plan.basePrice,
                priceAdjustment,
                aiGenerated: true
              },
              potentialSavings: savings > 0 ? Math.round(savings) : 0
            };
          }
          
          return rec;
        });
        
        // Sort by AI match score
        finalRecommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
      }
      
      aiInsights = {
        overallAnalysis: aiAnalysis.overallAnalysis,
        riskFactors: aiAnalysis.riskFactors,
        savingsTips: aiAnalysis.savingsTips
      };
      
    } catch (aiError) {
      console.log('AI enhancement unavailable, using standard algorithm:', aiError);
    }

    // Step 5: Calculate total potential savings (with adjusted prices)
    const totalPotentialSavings = calculateTotalSavings(finalRecommendations);

    // Step 6: Calculate confidence score
    const confidence = calculateConfidenceScore(userProfile as UserProfile);

    // Return formatted response with AI insights
    return {
      success: true,
      data: {
        userRiskProfile: {
          ...riskProfile,
          dnaInterpretation
        },
        recommendations: finalRecommendations,
        alternativePlans,
        totalPotentialSavings,
        confidence,
        aiInsights // Include AI analysis in response
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
