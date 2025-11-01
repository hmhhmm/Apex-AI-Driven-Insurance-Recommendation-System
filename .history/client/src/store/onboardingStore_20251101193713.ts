import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define onboarding steps
export type OnboardingStep = 
  | 'quick-assessment'
  | 'account-creation'
  | 'dna-test-option'
  | 'document-vault'
  | 'complete'

export interface QuickAssessmentData {
  age: number
  gender: string
  occupation: string
  healthGoals: string[]
  existingConditions: string[]
  familyHistory: string[]
}

export interface AccountCreationData {
  fullName: string
  email: string
  phone: string
  password: string
  agreeToTerms: boolean
}

export interface DNATestData {
  option: 'order-kit' | 'upload-existing' | 'schedule-lab'
  kitDetails?: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  existingProvider?: string
  existingFileUrl?: string
  labAppointment?: {
    location: string
    date: string
    time: string
  }
}

export interface DocumentVaultData {
  uploadedDocs: Array<{
    id: string
    name: string
    type: 'medical' | 'insurance' | 'prescription' | 'lab-report'
    uploadDate: string
    url: string
  }>
  connectedProviders: string[]
}

interface OnboardingData {
  quickAssessment?: QuickAssessmentData
  accountCreation?: AccountCreationData
  dnaTest?: DNATestData
  documentVault?: DocumentVaultData
}

interface OnboardingState {
  currentStep: OnboardingStep
  data: OnboardingData
  isComplete: boolean
  selectedGender?: 'male' | 'female'
  
  // Actions
  setCurrentStep: (step: OnboardingStep) => void
  setSelectedGender: (gender: 'male' | 'female') => void
  saveQuickAssessment: (data: QuickAssessmentData) => void
  saveAccountCreation: (data: AccountCreationData) => void
  saveDNATest: (data: DNATestData) => void
  saveDocumentVault: (data: DocumentVaultData) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  
  // Navigation helpers
  goToNextStep: () => void
  goToPreviousStep: () => void
  getStepProgress: () => number
}

const stepOrder: OnboardingStep[] = [
  'quick-assessment',
  'account-creation',
  'dna-test-option',
  'document-vault',
  'complete'
]

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 'quick-assessment',
      data: {},
      isComplete: false,
      selectedGender: undefined,

      setCurrentStep: (step) => {
        set({ currentStep: step })
      },

      setSelectedGender: (gender) => {
        set({ selectedGender: gender })
      },

      saveQuickAssessment: (data) => {
        set((state) => ({
          data: { ...state.data, quickAssessment: data }
        }))
      },

      saveAccountCreation: (data) => {
        set((state) => ({
          data: { ...state.data, accountCreation: data }
        }))
      },

      saveDNATest: (data) => {
        set((state) => ({
          data: { ...state.data, dnaTest: data }
        }))
      },

      saveDocumentVault: (data) => {
        set((state) => ({
          data: { ...state.data, documentVault: data }
        }))
      },

      completeOnboarding: () => {
        set({ isComplete: true, currentStep: 'complete' })
      },

      resetOnboarding: () => {
        set({ 
          currentStep: 'quick-assessment', 
          data: {}, 
          isComplete: false 
        })
      },

      goToNextStep: () => {
        const { currentStep } = get()
        const currentIndex = stepOrder.indexOf(currentStep)
        if (currentIndex < stepOrder.length - 1) {
          set({ currentStep: stepOrder[currentIndex + 1] })
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get()
        const currentIndex = stepOrder.indexOf(currentStep)
        if (currentIndex > 0) {
          set({ currentStep: stepOrder[currentIndex - 1] })
        }
      },

      getStepProgress: () => {
        const { currentStep } = get()
        const currentIndex = stepOrder.indexOf(currentStep)
        return Math.round(((currentIndex + 1) / stepOrder.length) * 100)
      }
    }),
    {
      name: 'apex-onboarding',
    }
  )
)
