import { DNAInterpretation } from './dna.types';
import { PlanRecommendation } from './insurance.types';
import { RiskProfile } from './user.types';

export interface RecommendationRequest {
  userId: string;
  userProfile: any;
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
  };
}

export interface SavedPlan {
  planId: string;
  savedAt: string;
}
