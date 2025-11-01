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

  // Mock DNA test progress - automatically advances through stages
  useEffect(() => {
    if (!isComplete) return

    const progressStages = [
      { stage: 0, delay: 0 },      // Kit Shipped (immediate)
      { stage: 1, delay: 3000 },   // Sample Received (after 3s)
      { stage: 2, delay: 6000 },   // Processing (after 6s)
      { stage: 3, delay: 10000 },  // Results Ready (after 10s)
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
          <section id="dna-status" className="card">
            <h2 className="text-3xl font-bold mb-6 text-white">DNA Test Status</h2>
            
            <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">Test Kit Ordered</h3>
                  <p className="text-gray-400">Track your DNA test progress</p>
                </div>
                <div className="text-5xl">🧬</div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Kit Shipped', status: 'complete' },
                  { label: 'Sample Received', status: 'complete' },
                  { label: 'Processing', status: 'in-progress' },
                  { label: 'Results Ready', status: 'pending' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'complete' ? 'bg-green-500 text-white' :
                      item.status === 'in-progress' ? 'bg-blue-500 text-white animate-pulse' :
                      'bg-zinc-800 text-gray-500'
                    }`}>
                      {item.status === 'complete' ? '✓' : i + 1}
                    </div>
                    <span className={`font-medium ${
                      item.status === 'pending' ? 'text-gray-600' : 'text-gray-300'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-950/50 rounded-lg border border-blue-800/30">
                <p className="text-blue-200 text-sm font-medium">
                  ⏱️ Estimated completion: 2-3 business days
                </p>
              </div>
            </div>
          </section>
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
