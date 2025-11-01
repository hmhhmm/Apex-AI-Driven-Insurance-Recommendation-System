import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '../../store/onboardingStore'
import { useNavigate } from 'react-router-dom'

// Validation schema
const quickAssessmentSchema = z.object({
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Please enter a valid age'),
  gender: z.string().min(1, 'Please select your gender'),
  occupation: z.string().min(2, 'Please enter your occupation'),
  healthGoals: z.array(z.string()).min(1, 'Select at least one health goal'),
  existingConditions: z.array(z.string()),
  familyHistory: z.array(z.string())
})

type FormData = z.infer<typeof quickAssessmentSchema>

const healthGoalOptions = [
  { id: 'preventive-care', label: 'Preventive Care', icon: '🛡️' },
  { id: 'chronic-management', label: 'Chronic Disease Management', icon: '💊' },
  { id: 'family-planning', label: 'Family Planning', icon: '👶' },
  { id: 'fitness', label: 'Fitness & Wellness', icon: '💪' },
  { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { id: 'longevity', label: 'Longevity & Anti-Aging', icon: '🌟' }
]

const conditionOptions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Allergies', 
  'Arthritis', 'Thyroid Disorder', 'None'
]

const familyHistoryOptions = [
  'Heart Disease', 'Cancer', 'Diabetes', 'Alzheimer\'s', 'Stroke',
  'High Blood Pressure', 'None'
]

export default function QuickAssessment() {
  const navigate = useNavigate()
  const { saveQuickAssessment, setCurrentStep } = useOnboardingStore()
  const [selectedHealthGoals, setSelectedHealthGoals] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedFamilyHistory, setSelectedFamilyHistory] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(quickAssessmentSchema),
    defaultValues: {
      healthGoals: [],
      existingConditions: [],
      familyHistory: []
    }
  })

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void, fieldName: keyof FormData) => {
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item]
    setList(newList)
    setValue(fieldName, newList as any)
  }

  const onSubmit = (data: FormData) => {
    saveQuickAssessment(data as QuickAssessmentData)
    setCurrentStep('account-creation')
    navigate('/onboarding/account')
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-950/50 text-blue-400 rounded-full text-sm font-semibold border border-blue-800/30">
              Step 1 of 4
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Quick Assessment</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Let's get to know you better. This will take about 2 minutes.
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 w-full bg-zinc-900 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="card space-y-8"
        >
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>👤</span> Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="32"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('occupation')}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Software Engineer"
              />
              {errors.occupation && (
                <p className="mt-1 text-sm text-red-500">{errors.occupation.message}</p>
              )}
            </div>
          </div>

          {/* Health Goals */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🎯</span> Your Health Goals
            </h2>
            <p className="text-gray-400 text-sm">Select all that apply</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {healthGoalOptions.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleSelection(goal.id, selectedHealthGoals, setSelectedHealthGoals, 'healthGoals')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    selectedHealthGoals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/20'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <span className="font-medium text-white">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.healthGoals && (
              <p className="mt-1 text-sm text-red-500">{errors.healthGoals.message}</p>
            )}
          </div>

          {/* Existing Conditions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🏥</span> Existing Health Conditions
            </h2>
            <p className="text-gray-400 text-sm">Select all that apply (optional)</p>
            
            <div className="flex flex-wrap gap-3">
              {conditionOptions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleSelection(condition, selectedConditions, setSelectedConditions, 'existingConditions')}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                    selectedConditions.includes(condition)
                      ? 'border-purple-500 bg-purple-950/30 text-purple-300'
                      : 'border-zinc-700 bg-zinc-900 text-gray-300 hover:border-zinc-600'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Family History */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span> Family Medical History
            </h2>
            <p className="text-gray-400 text-sm">Select all that apply (optional)</p>
            
            <div className="flex flex-wrap gap-3">
              {familyHistoryOptions.map((history) => (
                <button
                  key={history}
                  type="button"
                  onClick={() => toggleSelection(history, selectedFamilyHistory, setSelectedFamilyHistory, 'familyHistory')}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                    selectedFamilyHistory.includes(history)
                      ? 'border-pink-500 bg-pink-950/30 text-pink-300'
                      : 'border-zinc-700 bg-zinc-900 text-gray-300 hover:border-zinc-600'
                  }`}
                >
                  {history}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-zinc-800">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              Continue to Account Setup
              <span>→</span>
            </button>
          </div>
        </motion.form>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Data Privacy Guaranteed</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
