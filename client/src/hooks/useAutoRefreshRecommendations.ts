import { useEffect, useState } from 'react';
import { forceRecommendationRefresh } from '../utils/recommendationEngine';

/**
 * Hook that forces recommendation refresh every time component mounts
 * Ensures users see different prices and recommendations on each page visit
 */
export function useAutoRefreshRecommendations() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Force refresh on mount
    forceRecommendationRefresh();
    
    // Increment refresh key to trigger re-renders
    setRefreshKey(prev => prev + 1);

    // Log for debugging
    console.log('🔄 Recommendations refreshed - new prices generated');
  }, []); // Empty dependency array = runs only on mount

  return refreshKey;
}

/**
 * Hook that provides manual refresh capability
 */
export function useManualRefreshRecommendations() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    forceRecommendationRefresh();
    setRefreshKey(prev => prev + 1);
    console.log('🔄 Manual refresh triggered - new prices generated');
  };

  return { refreshKey, refresh };
}
