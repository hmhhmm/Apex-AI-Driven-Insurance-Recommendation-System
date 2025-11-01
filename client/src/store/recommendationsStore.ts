import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecommendationResponse, SavedPlan } from '../types/recommendation.types';
import { PlanRecommendation } from '../types/insurance.types';

interface RecommendationsState {
  // Data
  recommendationData: RecommendationResponse['data'] | null;
  selectedPlans: string[];
  savedPlans: SavedPlan[];
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;

  // Actions
  setRecommendations: (data: RecommendationResponse['data']) => void;
  selectPlan: (planId: string) => void;
  deselectPlan: (planId: string) => void;
  clearSelections: () => void;
  savePlan: (planId: string) => void;
  unsavePlan: (planId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRecommendations: () => void;
  
  // Computed helpers
  getSelectedPlansData: () => PlanRecommendation[];
  getSavedPlansData: () => PlanRecommendation[];
  isPlanSelected: (planId: string) => boolean;
  isPlanSaved: (planId: string) => boolean;
}

export const useRecommendationsStore = create<RecommendationsState>()(
  persist(
    (set, get) => ({
      // Initial state
      recommendationData: null,
      selectedPlans: [],
      savedPlans: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      // Set recommendations data
      setRecommendations: (data) => {
        set({
          recommendationData: data,
          error: null,
          lastFetched: new Date().toISOString()
        });
      },

      // Select a plan for comparison
      selectPlan: (planId) => {
        set((state) => {
          // Limit to 3 plans for comparison
          if (state.selectedPlans.length >= 3 && !state.selectedPlans.includes(planId)) {
            return state;
          }
          
          if (!state.selectedPlans.includes(planId)) {
            return { selectedPlans: [...state.selectedPlans, planId] };
          }
          return state;
        });
      },

      // Deselect a plan
      deselectPlan: (planId) => {
        set((state) => ({
          selectedPlans: state.selectedPlans.filter(id => id !== planId)
        }));
      },

      // Clear all selections
      clearSelections: () => {
        set({ selectedPlans: [] });
      },

      // Save a plan for later
      savePlan: (planId) => {
        set((state) => {
          if (!state.savedPlans.some(p => p.planId === planId)) {
            return {
              savedPlans: [
                ...state.savedPlans,
                { planId, savedAt: new Date().toISOString() }
              ]
            };
          }
          return state;
        });
      },

      // Remove saved plan
      unsavePlan: (planId) => {
        set((state) => ({
          savedPlans: state.savedPlans.filter(p => p.planId !== planId)
        }));
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading, error: loading ? null : get().error });
      },

      // Set error
      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Clear all recommendation data
      clearRecommendations: () => {
        set({
          recommendationData: null,
          selectedPlans: [],
          error: null,
          lastFetched: null
        });
      },

      // Get selected plans data
      getSelectedPlansData: () => {
        const state = get();
        if (!state.recommendationData) return [];
        
        const allPlans = [
          ...state.recommendationData.recommendations,
          ...state.recommendationData.alternativePlans
        ];
        
        return allPlans.filter(rec => 
          state.selectedPlans.includes(rec.plan.id)
        );
      },

      // Get saved plans data
      getSavedPlansData: () => {
        const state = get();
        if (!state.recommendationData) return [];
        
        const allPlans = [
          ...state.recommendationData.recommendations,
          ...state.recommendationData.alternativePlans
        ];
        
        return allPlans.filter(rec => 
          state.savedPlans.some(saved => saved.planId === rec.plan.id)
        );
      },

      // Check if plan is selected
      isPlanSelected: (planId) => {
        return get().selectedPlans.includes(planId);
      },

      // Check if plan is saved
      isPlanSaved: (planId) => {
        return get().savedPlans.some(p => p.planId === planId);
      }
    }),
    {
      name: 'apex-recommendations-storage',
      partialize: (state) => ({
        savedPlans: state.savedPlans,
        lastFetched: state.lastFetched
      })
    }
  )
);
