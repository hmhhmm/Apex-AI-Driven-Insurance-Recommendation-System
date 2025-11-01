import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Heart, Activity, Dna, Package, CheckCircle, Microscope, Sparkles, Bot, Gem } from 'lucide-react'
import ParticleBackground from '../components/landing/ParticleBackground'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { isComplete } = useOnboardingStore()
  const [dnaProgress, setDnaProgress] = useState(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('dnaProgress')
    return saved ? parseInt(saved) : 0
  })

  useEffect(() => {
    // Auto-scroll to onboarding if not complete
    if (!isComplete) {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isComplete])

  // Mock DNA test progress - automatically advances through stages (2-3 days total)
  useEffect(() => {
    if (!isComplete) return

    // Check if progress is already complete
    const savedProgress = localStorage.getItem('dnaProgress')
    if (savedProgress && parseInt(savedProgress) >= 3) {
      setDnaProgress(3)
      return
    }

    const progressStages = [
      { stage: 0, delay: 0 },      // Kit Shipped (immediate)
      { stage: 1, delay: 2000 },   // Sample Received (after 2s)
      { stage: 2, delay: 4000 },   // Processing (after 4s)
      { stage: 3, delay: 7000 },   // Results Ready (after 7s)
    ]

    const timeouts: number[] = []

    progressStages.forEach(({ stage, delay }) => {
      const timeout = setTimeout(() => {
        setDnaProgress(stage)
        localStorage.setItem('dnaProgress', stage.toString())
      }, delay)
      timeouts.push(timeout as unknown as number)
    })

    // Cleanup timeouts on unmount
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [isComplete])

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Animated Background */}
      <ParticleBackground />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-8 backdrop-blur-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 text-white">Welcome back, {user?.name}! 👋</h1>
            <p className="text-lg text-gray-300">Your personalized insurance dashboard</p>
          </div>
        </motion.div>

        {/* Onboarding Section */}
        {!isComplete && (
          <motion.section 
            id="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Complete Your Profile</h2>
            <p className="text-gray-400 mb-8">
              Let's get started! Complete your profile to receive personalized insurance recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { step: 1, title: 'Personal Info', icon: User, desc: 'Basic information' },
                { step: 2, title: 'Medical History', icon: Heart, desc: 'Health background' },
                { step: 3, title: 'Lifestyle', icon: Activity, desc: 'Daily habits' },
                { step: 4, title: 'DNA Test', icon: Dna, desc: 'Genetic analysis' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <motion.div 
                    key={item.step} 
                    whileHover={{ y: -5 }}
                    className="bg-zinc-900/50 rounded-xl p-6 text-center hover:bg-zinc-800/60 transition border border-zinc-700/50 hover:border-purple-500/30 group"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Start Onboarding →
            </motion.button>
          </motion.section>
        )}

        {/* DNA Status Section */}
        {isComplete && (
          <motion.section 
            id="dna-status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Track your DNA test progress</h2>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Dna className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
              <div className="space-y-6">
                {[
                  { label: 'Kit Shipped', icon: Package, description: 'Your DNA kit has been shipped' },
                  { label: 'Sample Received', icon: CheckCircle, description: 'We received your sample at our lab' },
                  { label: 'Processing', icon: Microscope, description: 'Our team is analyzing your DNA' },
                  { label: 'Results Ready', icon: Sparkles, description: 'Your results are ready to view' },
                ].map((item, i) => {
                  const isComplete = i < dnaProgress
                  const isCurrent = i === dnaProgress
                  const isPending = i > dnaProgress
                  const Icon = item.icon

                  return (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isComplete ? 'bg-green-500/20 border-2 border-green-500' :
                          isCurrent ? 'bg-purple-500/20 border-2 border-purple-500' :
                          'bg-zinc-800/50 border-2 border-zinc-700'
                        }`}
                        animate={isCurrent ? { 
                          scale: [1, 1.05, 1],
                        } : {}}
                        transition={{ 
                          repeat: isCurrent ? Infinity : 0,
                          duration: 2 
                        }}
                      >
                        {isComplete ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isCurrent ? 'text-purple-400' : 'text-gray-600'}`} />
                        )}
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
                          className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full"
                        >
                          In Progress
                        </motion.div>
                      )}
                      {isComplete && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {dnaProgress < 3 ? (
                <motion.div 
                  className="mt-8 p-5 bg-purple-950/30 rounded-lg border border-purple-800/30"
                  key="estimating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-purple-300 text-sm font-medium flex items-center gap-2">
                    <span className="animate-pulse">⏱️</span>
                    Estimated completion: 2-3 days
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="mt-8 p-6 bg-gradient-to-r from-green-950/30 to-purple-950/30 rounded-lg border border-green-800/30"
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 text-lg font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Results Complete!
                      </p>
                      <p className="text-gray-300 text-sm">
                        Your DNA analysis is ready. View your personalized insurance recommendations now.
                      </p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/purchase')}
                      className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition font-medium whitespace-nowrap"
                    >
                      View Plans →
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* Coming Soon Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 text-center group"
            onClick={() => navigate('/analysis')}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">AI Analysis</h3>
            <p className="text-gray-400">Triple AI agents will analyze your DNA results</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition">
              <Gem className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Personalized Plans</h3>
            <p className="text-gray-400">Get recommendations tailored to your genetics</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
