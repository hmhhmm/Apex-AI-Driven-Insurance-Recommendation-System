import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../../store/onboardingStore'

type DNAOption = 'order-kit' | 'upload-existing' | 'schedule-lab' | null

export default function DNATestSelection() {
  const navigate = useNavigate()
  const { goToPreviousStep } = useOnboardingStore()
  const [selectedOption, setSelectedOption] = useState<DNAOption>(null)

  const options = [
    {
      id: 'order-kit' as const,
      icon: '📦',
      title: 'Order DNA Kit',
      price: '$49',
      description: 'Simple at-home saliva test. Results in 2-3 weeks.',
      features: [
        'Free shipping both ways',
        'Easy-to-use saliva collection',
        'CLIA-certified lab processing',
        'Secure online results'
      ],
      popular: true
    }
  ]

  const handleContinue = () => {
    if (selectedOption) {
      navigate(`/onboarding/dna-test/${selectedOption}`)
    }
  }

  const handleBack = () => {
    goToPreviousStep()
    navigate('/onboarding/account')
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-950/50 text-blue-400 rounded-full text-sm font-semibold border border-blue-800/30">
              Step 3 of 4
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Choose Your DNA Test</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select how you'd like to provide your genetic data
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 w-full bg-zinc-900 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
        </motion.div>

        {/* Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => setSelectedOption(option.id)}
              className={`relative card text-left transition-all duration-300 hover:scale-105 ${
                selectedOption === option.id
                  ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/30'
                  : 'hover:border-zinc-700'
              }`}
            >
              {/* Popular Badge */}
              {option.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{option.icon}</div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{option.price}</div>
                  <div className="text-xs text-gray-500">one-time</div>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{option.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              <div className={`mt-4 pt-4 border-t border-zinc-800 text-center font-semibold transition-colors ${
                selectedOption === option.id ? 'text-blue-400' : 'text-gray-600'
              }`}>
                {selectedOption === option.id ? '✓ Selected' : 'Click to Select'}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card bg-blue-950/20 border-blue-800/30 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-bold text-white mb-2">Why we need your DNA</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your genetic data helps us identify predispositions to certain health conditions, 
                allowing us to recommend insurance plans tailored to your unique risk profile. 
                This means better coverage at lower rates because you're not paying for coverage you don't need.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center gap-2"
          >
            <span>←</span>
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedOption}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <span>→</span>
          </button>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid md:grid-cols-4 gap-4"
        >
          {[
            { icon: '🔬', label: 'CLIA Certified Labs' },
            { icon: '🔒', label: 'Encrypted Storage' },
            { icon: '🚫', label: 'Never Sold' },
            { icon: '✓', label: 'HIPAA Compliant' }
          ].map((trust, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-2">{trust.icon}</div>
              <div className="text-xs text-gray-500">{trust.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
