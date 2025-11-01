import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'

interface Question {
  id: string
  question: string
  type: 'text' | 'radio' | 'multi-select' | 'number' | 'slider'
  options?: string[]
  placeholder?: string
  emoji: string
  category: string
  min?: number
  max?: number
}

const questions: Question[] = [
  // UNIVERSAL Questions (Always shown)
  { id: 'fullName', question: "What's your name?", type: 'text', placeholder: 'John Doe', emoji: '👤', category: 'Universal' },
  { id: 'dateOfBirth', question: "What's your date of birth?", type: 'text', placeholder: 'DD/MM/YYYY', emoji: '�', category: 'Universal' },
  { id: 'zipCode', question: "What's your ZIP code?", type: 'text', placeholder: '50000', emoji: '�', category: 'Universal' },
  { 
    id: 'insuranceNeeds', 
    question: 'Which insurance types do you need?', 
    type: 'multi-select',
    options: ['Health', 'Life', 'Car', 'Travel'],
    emoji: '🛡️',
    category: 'Universal'
  },
  { id: 'annualIncome', question: "What's your annual household income?", type: 'text', placeholder: 'RM 50,000', emoji: '💰', category: 'Universal' },
  { id: 'occupation', question: "What's your occupation?", type: 'text', placeholder: 'Software Engineer', emoji: '💼', category: 'Universal' },
  
  // HEALTH Questions (Conditional - shown if Health insurance selected)
  {
    id: 'smoking',
    question: 'Do you smoke or use tobacco?',
    type: 'radio',
    options: ['Never', 'Former smoker', 'Occasionally', 'Regularly'],
    emoji: '🚭',
    category: 'Health'
  },
  {
    id: 'exercise',
    question: 'How often do you exercise?',
    type: 'radio',
    options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely'],
    emoji: '🏃',
    category: 'Health'
  },
  
  // CAR Questions (Conditional - shown if Car insurance selected)
  { id: 'vehicleInfo', question: 'Vehicle make, model, year?', type: 'text', placeholder: 'Toyota Camry 2020', emoji: '🚗', category: 'Car' },
  
  // TRAVEL Questions (Conditional - shown if Travel insurance selected)
  {
    id: 'travelFrequency',
    question: 'How often do you travel?',
    type: 'radio',
    options: ['1-2 times/year', '3-4 times/year', '5+ times/year', 'Rarely'],
    emoji: '✈️',
    category: 'Travel'
  },
]

// Group questions by category
const questionGroups = [
  {
    title: 'Personal Information',
    subtitle: 'Tell us about yourself',
    emoji: '👤',
    questions: questions.filter(q => q.category === 'Personal')
  },
  {
    title: 'Insurance Needs',
    subtitle: 'What coverage are you looking for?',
    emoji: '🛡️',
    questions: questions.filter(q => q.category === 'Insurance')
  },
  {
    title: 'Health & Lifestyle',
    subtitle: 'Help us understand your health profile',
    emoji: '❤️',
    questions: questions.filter(q => q.category === 'Health' || q.category === 'Lifestyle')
  }
]

export default function QuickAssessment() {
  const navigate = useNavigate()
  const { saveQuickAssessment, selectedGender } = useOnboardingStore()
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentGroup = questionGroups[currentGroupIndex]
  const progress = ((currentGroupIndex + 1) / questionGroups.length) * 100

  const validateGroup = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    currentGroup.questions.forEach(question => {
      const value = answers[question.id]
      if (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
        newErrors[question.id] = 'This field is required'
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setErrors(prev => ({ ...prev, [questionId]: '' }))
  }

  const handleNext = () => {
    if (!validateGroup()) {
      return
    }

    if (currentGroupIndex < questionGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1)
    } else {
      // Format answers to match QuickAssessmentData interface
      const formattedData = {
        age: answers.age || 25,
        gender: selectedGender || 'male',
        occupation: answers.occupation || '',
        healthGoals: Array.isArray(answers.insuranceNeeds) ? answers.insuranceNeeds : [],
        existingConditions: answers.healthStatus ? [answers.healthStatus] : [],
        familyHistory: []
      }
      saveQuickAssessment(formattedData)
      navigate('/onboarding/account')
    }
  }

  const handleBack = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1)
      setErrors({})
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Enhanced Background - Same as Landing */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
        <motion.div 
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20 backdrop-blur-xl">
              Step 1 of 4
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-light mb-4">
            Tell Us <span className="font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">About Yourself</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Help us personalize your insurance recommendations
          </p>
        </motion.div>

        {/* Avatar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 relative"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                {selectedGender === 'female' ? (
                  <>
                    <ellipse cx="100" cy="80" rx="35" ry="40" fill="#FFD1B8" />
                    <path d="M 65 60 Q 65 30, 100 30 Q 135 30, 135 60 L 135 100 Q 135 110, 125 110 L 75 110 Q 65 110, 65 100 Z" fill="#4A3426" />
                    <circle cx="85" cy="75" r="4" fill="#2C1810" />
                    <circle cx="115" cy="75" r="4" fill="#2C1810" />
                    <path d="M 85 90 Q 100 95, 115 90" stroke="#FF8B9A" strokeWidth="2" fill="none" />
                    <circle cx="75" cy="85" r="8" fill="#FFB3C1" opacity="0.4" />
                    <circle cx="125" cy="85" r="8" fill="#FFB3C1" opacity="0.4" />
                    <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#E8B4F9" />
                    <ellipse cx="55" cy="140" rx="12" ry="30" fill="#FFD1B8" transform="rotate(-20 55 140)" />
                    <ellipse cx="145" cy="140" rx="12" ry="30" fill="#FFD1B8" transform="rotate(20 145 140)" />
                  </>
                ) : (
                  <>
                    <ellipse cx="100" cy="80" rx="35" ry="38" fill="#F4C4A0" />
                    <path d="M 65 55 Q 65 30, 100 28 Q 135 30, 135 55 L 135 70 Q 130 75, 125 70 L 75 70 Q 70 75, 65 70 Z" fill="#2C2416" />
                    <circle cx="85" cy="75" r="4" fill="#1A120C" />
                    <circle cx="115" cy="75" r="4" fill="#1A120C" />
                    <path d="M 85 92 Q 100 97, 115 92" stroke="#D4876F" strokeWidth="2" fill="none" />
                    <path d="M 78 68 Q 85 66, 92 68" stroke="#2C2416" strokeWidth="2.5" fill="none" />
                    <path d="M 108 68 Q 115 66, 122 68" stroke="#2C2416" strokeWidth="2.5" fill="none" />
                    <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#5DADE2" />
                    <ellipse cx="55" cy="145" rx="13" ry="32" fill="#F4C4A0" transform="rotate(-20 55 145)" />
                    <ellipse cx="145" cy="145" rx="13" ry="32" fill="#F4C4A0" transform="rotate(20 145 145)" />
                  </>
                )}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">
              Step {currentGroupIndex + 1} of {questionGroups.length}
            </div>
            <div className="text-sm text-gray-500">
              {currentGroup.title}
            </div>
          </div>
          <div className="relative w-full h-2 bg-zinc-900/50 rounded-full overflow-hidden backdrop-blur-xl border border-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Question Group Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGroupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl"
            style={{
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            {/* Group Header */}
            <div className="flex items-start gap-6 mb-8">
              <motion.div 
                className="text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {currentGroup.emoji}
              </motion.div>
              <div className="flex-1">
                <motion.h2 
                  className="text-2xl font-light text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentGroup.title}
                </motion.h2>
                <motion.p 
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentGroup.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Questions Grid */}
            <motion.div 
              className="space-y-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentGroup.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3">
                  {/* Question Label */}
                  <label className="block">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{question.emoji}</span>
                      <span className="text-lg text-white font-medium">
                        {question.question}
                      </span>
                    </div>

                    {/* Input based on type */}
                    {question.type === 'text' && (
                      <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        placeholder={question.placeholder}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-lg placeholder-gray-500 transition-all backdrop-blur-xl"
                      />
                    )}

                    {question.type === 'slider' && (
                      <div className="space-y-4">
                        <input
                          type="range"
                          min={question.min}
                          max={question.max}
                          value={answers[question.id] || question.min}
                          onChange={(e) => handleAnswer(question.id, Number(e.target.value))}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-center">
                          <span className="text-4xl font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {answers[question.id] || question.min}
                          </span>
                          <span className="text-lg text-gray-400 ml-2">years old</span>
                        </div>
                      </div>
                    )}
                  </label>

                  {question.type === 'radio' && (
                    <div className="space-y-3">
                      {question.options?.map((option) => (
                        <motion.button
                          key={option}
                          onClick={() => handleAnswer(question.id, option)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full p-4 rounded-xl border text-left transition-all duration-300 backdrop-blur-xl ${
                            answers[question.id] === option
                              ? 'border-blue-500/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20 shadow-lg shadow-blue-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-medium text-white">{option}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              answers[question.id] === option
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-white/30'
                            }`}>
                              {answers[question.id] === option && (
                                <motion.div 
                                  className="w-3 h-3 bg-white rounded-full"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {question.type === 'multi-select' && (
                    <div className="space-y-3">
                      {question.options?.map((option) => {
                        const selected = Array.isArray(answers[question.id]) 
                          ? answers[question.id].includes(option)
                          : false

                        return (
                          <motion.button
                            key={option}
                            onClick={() => {
                              const current = Array.isArray(answers[question.id]) 
                                ? answers[question.id] 
                                : []
                              const updated = selected
                                ? current.filter((o: string) => o !== option)
                                : [...current, option]
                              handleAnswer(question.id, updated)
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full p-4 rounded-xl border text-left transition-all duration-300 backdrop-blur-xl ${
                              selected
                                ? 'border-blue-500/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20 shadow-lg shadow-blue-500/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-base font-medium text-white">{option}</span>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                selected
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-white/30'
                              }`}>
                                {selected && (
                                  <motion.span 
                                    className="text-white text-sm font-bold"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  >
                                    ✓
                                  </motion.span>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  )}

                  {/* Error Message for this question */}
                  <AnimatePresence>
                    {errors[question.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-red-950/30 border border-red-800/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                      >
                        <span>⚠️</span>
                        {errors[question.id]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentGroupIndex > 0 && (
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all backdrop-blur-xl flex items-center gap-2"
                >
                  <span>←</span>
                  Back
                </motion.button>
              )}
              
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {currentGroupIndex === questionGroups.length - 1 ? (
                  <>
                    Complete
                    <span>✓</span>
                  </>
                ) : (
                  <>
                    Continue
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Question Dots */}
        <motion.div 
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {questionGroups.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentGroupIndex 
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' 
                  : i < currentGroupIndex
                  ? 'w-1.5 bg-blue-500/50'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </motion.div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  )
}
