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
  points: number
  min?: number
  max?: number
}

const questions: Question[] = [
  { id: 'fullName', question: "What's your name?", type: 'text', placeholder: 'John Doe', emoji: '👤', category: 'Personal', points: 10 },
  { id: 'age', question: 'How old are you?', type: 'slider', emoji: '🎂', category: 'Personal', points: 10, min: 18, max: 100 },
  { id: 'location', question: 'Where do you live?', type: 'text', placeholder: 'Kuala Lumpur', emoji: '📍', category: 'Personal', points: 10 },
  { id: 'occupation', question: "What's your occupation?", type: 'text', placeholder: 'Software Engineer', emoji: '💼', category: 'Personal', points: 10 },
  { 
    id: 'insuranceNeeds', 
    question: 'What insurance are you looking for?', 
    type: 'multi-select',
    options: ['Health', 'Life', 'Car', 'Travel'],
    emoji: '🛡️',
    category: 'Insurance',
    points: 20
  },
  {
    id: 'healthStatus',
    question: 'How would you rate your health?',
    type: 'radio',
    options: ['Excellent', 'Good', 'Fair', 'Need Improvement'],
    emoji: '❤️',
    category: 'Health',
    points: 15
  },
  {
    id: 'exercise',
    question: 'How often do you exercise?',
    type: 'radio',
    options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely'],
    emoji: '🏃',
    category: 'Lifestyle',
    points: 15
  },
  {
    id: 'smoking',
    question: 'Do you smoke?',
    type: 'radio',
    options: ['Never', 'Former smoker', 'Occasionally', 'Regularly'],
    emoji: '🚭',
    category: 'Lifestyle',
    points: 15
  },
]

export default function QuickAssessment() {
  const navigate = useNavigate()
  const { saveQuickAssessment, selectedGender } = useOnboardingStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [error, setError] = useState('')

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const totalSteps = questions.length

  const validateAnswer = (value: any): boolean => {
    if (!value) return false
    if (typeof value === 'string' && value.trim() === '') return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  }

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    setError('')
  }

  const handleNext = () => {
    if (!validateAnswer(answers[currentQuestion.id])) {
      setError('Please answer this question to continue')
      return
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
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
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setError('')
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && validateAnswer(answers[currentQuestion.id])) {
        handleNext()
      }
    }
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [currentStep, answers])

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
              {/* Level Badge */}
              <motion.div 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
              >
                {Math.floor(score / 50) + 1}
              </motion.div>
            </motion.div>
            <div>
              <div className="text-sm text-gray-400">Level {Math.floor(score / 50) + 1}</div>
              <div className="text-xs text-gray-500">Profile Builder</div>
            </div>
          </div>

          {/* Score & Streak */}
          <div className="flex gap-4">
            <motion.div 
              className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 backdrop-blur-sm"
              animate={showCelebration ? { scale: [1, 1.2, 1] } : {}}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
            </motion.div>
            {streak > 0 && (
              <motion.div 
                className="px-4 py-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-full border border-orange-500/30 backdrop-blur-sm"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{streak}🔥</div>
                  <div className="text-xs text-gray-400">Streak</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar with Categories */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-white">
              Question {currentStep + 1} of {totalSteps}
            </div>
            <div className="text-sm text-gray-400">
              <span className="px-2 py-1 bg-zinc-800 rounded-full text-xs">
                {currentQuestion.category}
              </span>
            </div>
          </div>
          <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            {/* Milestone Markers */}
            {questions.map((_, i) => (
              <div
                key={i}
                className={`absolute top-0 bottom-0 w-0.5 ${
                  i < currentStep ? 'bg-white/50' : 'bg-zinc-700'
                }`}
                style={{ left: `${((i + 1) / totalSteps) * 100}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100, rotateY: -90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: 90 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-effect rounded-3xl p-8 border border-zinc-800/50 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.8) 0%, rgba(9, 9, 11, 0.9) 100%)'
            }}
          >
            {/* Question Header */}
            <div className="flex items-start gap-6 mb-8">
              <motion.div 
                className="text-6xl"
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                {currentQuestion.emoji}
              </motion.div>
              <div className="flex-1">
                <motion.h2 
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentQuestion.question}
                </motion.h2>
                <motion.div 
                  className="text-sm text-gray-400 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Earn {currentQuestion.points} points
                </motion.div>
              </div>
            </div>

            {/* Answer Input */}
            <motion.div 
              className="space-y-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full px-6 py-4 bg-zinc-900/50 border-2 border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-lg placeholder-gray-500 transition-all"
                  autoFocus
                />
              )}

              {currentQuestion.type === 'slider' && (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    value={answers[currentQuestion.id] || currentQuestion.min}
                    onChange={(e) => handleAnswer(Number(e.target.value))}
                    className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-center">
                    <span className="text-5xl font-bold text-gradient">
                      {answers[currentQuestion.id] || currentQuestion.min}
                    </span>
                    <span className="text-2xl text-gray-400 ml-2">years old</span>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'radio' && currentQuestion.options?.map((option, index) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                    answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-lg shadow-blue-500/20'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-zinc-600'
                    }`}>
                      {answers[currentQuestion.id] === option && (
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

              {currentQuestion.type === 'multi-select' && currentQuestion.options?.map((option, index) => {
                const selected = Array.isArray(answers[currentQuestion.id]) 
                  ? answers[currentQuestion.id].includes(option)
                  : false

                return (
                  <motion.button
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                      selected
                        ? 'border-blue-500 bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-lg shadow-blue-500/20'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-white">{option}</span>
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        selected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-zinc-600'
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
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-950/30 border border-red-800/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                >
                  <span>⚠️</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-zinc-900 text-gray-300 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all font-medium flex items-center gap-2"
                >
                  <span>←</span>
                  Previous
                </motion.button>
              )}
              
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!validateAnswer(answers[currentQuestion.id])}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {currentStep === questions.length - 1 ? (
                  <>
                    Complete Assessment
                    <span className="text-2xl">🎉</span>
                  </>
                ) : (
                  <>
                    Next Question
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Hint */}
            <motion.div 
              className="mt-4 text-center text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              💡 Press Enter to continue
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Question Dots */}
        <motion.div 
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep 
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' 
                  : i < currentStep
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-zinc-800'
              }`}
              whileHover={{ scale: 1.2 }}
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
