import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboardingStore } from '../../store/onboardingStore'
import { useNavigate } from 'react-router-dom'

interface Question {
  id: string
  question: string
  type: 'text' | 'number' | 'select' | 'multi-select' | 'radio'
  options?: string[]
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    required?: boolean
  }
}

const questions: Question[] = [
  // Basic Info
  { id: 'fullName', question: "What's your full name?", type: 'text', placeholder: 'John Doe', validation: { required: true } },
  { id: 'email', question: "What's your email address?", type: 'text', placeholder: 'john@example.com', validation: { required: true } },
  { id: 'age', question: 'How old are you?', type: 'number', placeholder: '32', validation: { min: 18, max: 100, required: true } },
  { id: 'location', question: 'Where do you live?', type: 'text', placeholder: 'San Francisco, CA' },
  { id: 'occupation', question: "What's your occupation?", type: 'text', placeholder: 'Software Engineer' },
  
  // Insurance Needs
  { 
    id: 'insuranceNeeds', 
    question: 'What type of insurance are you looking for?', 
    type: 'multi-select',
    options: ['Health Insurance', 'Life Insurance', 'Car Insurance', 'Travel Insurance']
  },
  {
    id: 'hasInsurance',
    question: 'Do you currently have insurance?',
    type: 'radio',
    options: ['Yes, and I want to switch', 'Yes, but looking for additional coverage', 'No, this is my first time']
  },
  
  // Health Quick Check
  {
    id: 'smoking',
    question: 'Do you smoke?',
    type: 'radio',
    options: ['Never smoked', 'Former smoker', 'Currently smoke']
  },
  {
    id: 'exercise',
    question: 'How often do you exercise?',
    type: 'radio',
    options: ['Never', '1-2 times per week', '3-4 times per week', '5+ times per week']
  },
  {
    id: 'healthConditions',
    question: 'Do you have any major health conditions?',
    type: 'radio',
    options: ['No conditions', 'Yes, but managed', 'Yes, currently treating']
  },
  {
    id: 'familyHistory',
    question: 'Family history of genetic conditions?',
    type: 'radio',
    options: ['No family history', 'Yes, some history', 'Not sure']
  },
]

export default function QuickAssessment() {
  const navigate = useNavigate()
  const { data, saveQuickAssessment } = useOnboardingStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [error, setError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutes in seconds
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const selectedGender = data.quickAssessment?.gender || 'male'
  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const totalSteps = questions.length

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('quickAssessmentAnswers', JSON.stringify(answers))
  }, [answers])

  // Load saved answers
  useEffect(() => {
    const saved = localStorage.getItem('quickAssessmentAnswers')
    if (saved) {
      setAnswers(JSON.parse(saved))
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    setError('')
  }

  const validateAnswer = () => {
    const answer = answers[currentQuestion.id]
    const validation = currentQuestion.validation

    if (validation?.required && !answer) {
      setError('This question is required')
      return false
    }

    if (currentQuestion.type === 'number') {
      const num = Number(answer)
      if (validation?.min && num < validation.min) {
        setError(`Minimum value is ${validation.min}`)
        return false
      }
      if (validation?.max && num > validation.max) {
        setError(`Maximum value is ${validation.max}`)
        return false
      }
    }

    if (currentQuestion.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(answer)) {
        setError('Please enter a valid email address')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (!validateAnswer()) return

    setDirection('forward')
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Submit
      saveQuickAssessment(answers as any)
      navigate('/onboarding/dna-test')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('backward')
      setCurrentStep(prev => prev - 1)
      setError('')
    }
  }

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? -300 : 300,
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with Avatar */}
      <div className="w-full py-6 px-4 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Avatar (Small) */}
          <div className="w-16 h-16">
            <svg viewBox="0 0 200 200" className="w-full h-full">
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

          {/* Progress */}
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm text-blue-400">
                ⏱️ {formatTime(timeRemaining)} remaining
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="glass-effect rounded-3xl p-8 md:p-12 border border-zinc-800/50"
            >
              {/* Question */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {currentQuestion.question}
              </h2>

              {/* Answer Input */}
              <div className="space-y-4">
                {currentQuestion.type === 'text' && (
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-lg placeholder-gray-500"
                    autoFocus
                  />
                )}

                {currentQuestion.type === 'number' && (
                  <input
                    type="number"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    min={currentQuestion.validation?.min}
                    max={currentQuestion.validation?.max}
                    className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-lg placeholder-gray-500"
                    autoFocus
                  />
                )}

                {currentQuestion.type === 'radio' && currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-950/30 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === option
                          ? 'border-blue-500'
                          : 'border-zinc-600'
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                ))}

                {currentQuestion.type === 'multi-select' && currentQuestion.options?.map((option) => {
                  const selected = Array.isArray(answers[currentQuestion.id]) 
                    ? answers[currentQuestion.id].includes(option)
                    : false

                  return (
                    <button
                      key={option}
                      onClick={() => {
                        const current = Array.isArray(answers[currentQuestion.id]) 
                          ? answers[currentQuestion.id] 
                          : []
                        const updated = selected
                          ? current.filter((o: string) => o !== option)
                          : [...current, option]
                        handleAnswer(updated)
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        selected
                          ? 'border-blue-500 bg-blue-950/30 text-white'
                          : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selected ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'
                        }`}>
                          {selected && <span className="text-white text-sm">✓</span>}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-950/30 border border-red-800/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-zinc-900 text-gray-300 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all font-medium"
                  >
                    ← Previous
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all"
                >
                  {currentStep === questions.length - 1 ? 'Complete Assessment →' : 'Next →'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
