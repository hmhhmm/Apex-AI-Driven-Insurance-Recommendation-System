import { useState, useEffect } from 'react';
import { useRecommendationsStore } from '../store/recommendationsStore';
import { UserProfile } from '../types/user.types';
import { generateRecommendations } from '../api/recommendations/generate';

/**
 * Custom hook for fetching and managing recommendations
 */
export function useRecommendations(userProfile: UserProfile | null) {
  const {
    recommendationData,
    isLoading,
    error,
    setRecommendations,
    setLoading,
    setError,
    clearRecommendations
  } = useRecommendationsStore();

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Fetch recommendations when user profile is available
  useEffect(() => {
    if (userProfile && !hasAttemptedFetch && !recommendationData) {
      fetchRecommendations(userProfile);
    }
  }, [userProfile, hasAttemptedFetch, recommendationData]);

  const fetchRecommendations = async (profile: UserProfile) => {
    console.log('🚀 Starting recommendation fetch for profile:', profile);
    setLoading(true);
    setHasAttemptedFetch(true);

    try {
      console.log('📡 Calling generateRecommendations API...');
      const response = await generateRecommendations({
        userId: profile.userId,
        userProfile: profile
      });

      console.log('✅ API Response:', response);

      if (response.success) {
        setRecommendations(response.data);
        console.log('✅ Recommendations set successfully');
        setLoading(false); // ✅ FIXED: Clear loading state
      } else {
        setError('Failed to generate recommendations');
        setLoading(false); // ✅ FIXED: Clear loading state
        console.error('❌ API returned success: false');
      }
    } catch (err) {
      console.error('❌ Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false); // ✅ FIXED: Clear loading state
    }
  };

  const refetchRecommendations = async () => {
    if (userProfile) {
      setHasAttemptedFetch(false);
      clearRecommendations();
      await fetchRecommendations(userProfile);
    }
  };

  return {
    recommendations: recommendationData?.recommendations || [],
    alternativePlans: recommendationData?.alternativePlans || [],
    userRiskProfile: recommendationData?.userRiskProfile || null,
    totalSavings: recommendationData?.totalPotentialSavings || 0,
    confidence: recommendationData?.confidence || 0,
    isLoading,
    error,
    refetch: refetchRecommendations
  };
}
