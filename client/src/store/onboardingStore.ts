import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingData {
  personalInfo?: any
  medicalHistory?: any
  lifestyle?: any
  dnaTest?: any
}

interface OnboardingState {
  currentStep: number
  data: OnboardingData
  isComplete: boolean
  completeStep: (step: number, data: any) => void
  resetOnboarding: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: {},
      isComplete: false,

      completeStep: (step, stepData) => {
        set((state) => ({
          data: { ...state.data, [`step${step}`]: stepData },
          currentStep: step + 1,
          isComplete: step === 4, // 4 steps total
        }))
      },

      resetOnboarding: () => {
        set({ currentStep: 1, data: {}, isComplete: false })
      },
    }),
    {
      name: 'apex-onboarding',
    }
  )
)
