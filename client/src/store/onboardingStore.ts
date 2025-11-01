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
  
  // Extended fields for recommendations
  lifestyle?: 'Active' | 'Moderate' | 'Sedentary'
  exerciseFrequency?: 'Regularly' | 'Occasionally' | 'Rarely' | 'Never'
  exerciseTypes?: string[]
  smokingStatus?: 'Never' | 'Former' | 'Current'
  alcoholConsumption?: 'None' | 'Light' | 'Moderate' | 'Heavy'
  currentMedications?: string[]
  insuranceType?: string  // Comma-separated insurance types
  budget?: 'Low' | 'Medium' | 'High'
  hasDependents?: string  // 'Yes' or 'No'
  numberOfDependents?: string
  maritalStatus?: string
  drivingExperience?: string
  accidentHistory?: string
  travelFrequency?: 'None' | 'Occasional' | 'Frequent'
  annualIncome?: string
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
  hasCompletedDNATest: boolean // Track if user already has DNA test results
  
  // Actions
  setCurrentStep: (step: OnboardingStep) => void
  setSelectedGender: (gender: 'male' | 'female') => void
  saveQuickAssessment: (data: QuickAssessmentData) => void
  saveAccountCreation: (data: AccountCreationData) => void
  saveDNATest: (data: DNATestData) => void
  saveDocumentVault: (data: DocumentVaultData) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  retakeQuestionnaire: () => void // New: retake questions without resetting DNA/account
  
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
      hasCompletedDNATest: false,

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
          data: { ...state.data, dnaTest: data },
          hasCompletedDNATest: true
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
          isComplete: false,
          hasCompletedDNATest: false
        })
      },

      retakeQuestionnaire: () => {
        // Keep account, DNA test, and document vault data
        // Reset only questionnaire data and set to questionnaire step
        const { data } = get()
        set({
          currentStep: 'quick-assessment',
          data: {
            ...data,
            quickAssessment: undefined // Clear old questionnaire answers
          },
          isComplete: false,
          selectedGender: undefined // Allow reselecting avatar/gender
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
