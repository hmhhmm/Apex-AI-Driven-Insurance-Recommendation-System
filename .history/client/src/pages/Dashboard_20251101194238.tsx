import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { isComplete } = useOnboardingStore()
  const [dnaProgress, setDnaProgress] = useState(0)

  useEffect(() => {
    // Auto-scroll to onboarding if not complete
    if (!isComplete) {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isComplete])

  // Mock DNA test progress - automatically advances through stages (2-3 days total)
  useEffect(() => {
    if (!isComplete) return

    const progressStages = [
      { stage: 0, delay: 0 },      // Kit Shipped (immediate)
      { stage: 1, delay: 2000 },   // Sample Received (after 2s)
      { stage: 2, delay: 4000 },   // Processing (after 4s)
      { stage: 3, delay: 7000 },   // Results Ready (after 7s)
    ]

    progressStages.forEach(({ stage, delay }) => {
      setTimeout(() => {
        setDnaProgress(stage)
      }, delay)
    })
  }, [isComplete])

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-lg opacity-90">Your personalized insurance dashboard</p>
        </motion.div>

        {/* Onboarding Section */}
        {!isComplete && (
          <section id="onboarding" className="card">
            <h2 className="text-3xl font-bold mb-6 text-white">Complete Your Profile</h2>
            <p className="text-gray-400 mb-8">
              Let's get started! Complete your profile to receive personalized insurance recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Personal Info', icon: '👤', desc: 'Basic information' },
                { step: 2, title: 'Medical History', icon: '🏥', desc: 'Health background' },
                { step: 3, title: 'Lifestyle', icon: '🏃', desc: 'Daily habits' },
                { step: 4, title: 'DNA Test', icon: '🧬', desc: 'Genetic analysis' },
              ].map((item) => (
                <div key={item.step} className="bg-zinc-900 rounded-xl p-6 text-center hover:shadow-xl hover:shadow-blue-500/10 transition border border-zinc-800 hover:border-blue-500/50">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold mb-1 text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <button className="btn-primary mt-8">
              Start Onboarding →
            </button>
          </section>
        )}

        {/* DNA Status Section */}
        {isComplete && (
          <motion.section 
            id="dna-status" 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Track your DNA test progress</h2>
              <motion.div 
                className="text-5xl"
                animate={{ rotate: dnaProgress === 3 ? 360 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                🧬
              </motion.div>
            </div>
            
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800">
              <div className="space-y-6">
                {[
                  { label: 'Kit Shipped', icon: '📦', description: 'Your DNA kit has been shipped' },
                  { label: 'Sample Received', icon: '✅', description: 'We received your sample at our lab' },
                  { label: 'Processing', icon: '🔬', description: 'Our team is analyzing your DNA' },
                  { label: 'Results Ready', icon: '✨', description: 'Your results are ready to view' },
                ].map((item, i) => {
                  const isComplete = i < dnaProgress
                  const isCurrent = i === dnaProgress
                  const isPending = i > dnaProgress

                  return (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                          isComplete ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-blue-500 text-white' :
                          'bg-zinc-800 text-gray-500'
                        }`}
                        animate={isCurrent ? { 
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ 
                          repeat: isCurrent ? Infinity : 0,
                          duration: 2 
                        }}
                      >
                        {isComplete ? '✓' : isCurrent ? item.icon : i + 1}
                      </motion.div>
                      <div className="flex-1">
                        <div className={`font-bold text-lg mb-1 ${
                          isPending ? 'text-gray-600' : 'text-white'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-sm ${
                          isPending ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full"
                        >
                          In Progress
                        </motion.div>
                      )}
                      {isComplete && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-2xl"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {dnaProgress < 3 ? (
                <motion.div 
                  className="mt-8 p-4 bg-blue-950/50 rounded-lg border border-blue-800/30"
                  key="estimating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-blue-200 text-sm font-medium flex items-center gap-2">
                    <span className="animate-pulse">⏱️</span>
                    Estimated completion: 2-3 days
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="mt-8 p-6 bg-gradient-to-r from-green-950/50 to-blue-950/50 rounded-lg border border-green-800/30"
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        Results Complete!
                      </p>
                      <p className="text-gray-300 text-sm">
                        Your DNA analysis is ready. Click below to view your personalized insights.
                      </p>
                    </div>
                    <button className="btn-primary whitespace-nowrap">
                      View Results →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* Coming Soon Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-2 text-white">AI Analysis</h3>
            <p className="text-gray-400">Triple AI agents will analyze your DNA results</p>
          </div>

          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-2xl font-bold mb-2 text-white">Personalized Plans</h3>
            <p className="text-gray-400">Get recommendations tailored to your genetics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
