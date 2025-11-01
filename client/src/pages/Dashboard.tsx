import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Heart, Activity, Dna, Package, CheckCircle, Microscope, Sparkles, Bot, Gem, RefreshCw } from 'lucide-react'
import ParticleBackground from '../components/landing/ParticleBackground'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { isComplete, hasCompletedDNATest, retakeQuestionnaire } = useOnboardingStore()
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
          className="relative overflow-hidden rounded-3xl p-10 backdrop-blur-2xl border border-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-light text-white mb-2">
              Welcome back, <span className="font-normal">{user?.name}!</span>
            </h1>
            <p className="text-lg text-white/60 font-light">Your personalized insurance dashboard</p>
          </div>
        </motion.div>

        {/* Onboarding Section */}
        {!isComplete && (
          <motion.section 
            id="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 rounded-3xl backdrop-blur-2xl border border-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-3xl font-light text-white mb-2">
              Complete <span className="font-normal">Your Profile</span>
            </h2>
            <p className="text-white/60 font-light mb-8">
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
                    className="backdrop-blur-xl rounded-2xl p-6 text-center hover:bg-white/[0.03] transition border border-white/10 hover:border-white/20 group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium mb-2 text-white">{item.title}</h3>
                    <p className="text-sm text-white/50 font-light">{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/onboarding/avatar-selection')}
              className="mt-8 px-8 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition font-medium"
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
            className="p-10 rounded-3xl backdrop-blur-2xl border border-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-light text-white">
                Track your <span className="font-normal">DNA test progress</span>
              </h2>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <Dna className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="backdrop-blur-xl rounded-2xl p-8 border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
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
                          isComplete ? 'bg-white/10 border-2 border-white' :
                          isCurrent ? 'bg-white/5 border-2 border-white/50' :
                          'bg-white/[0.02] border-2 border-white/10'
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
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-white/30'}`} />
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <div className={`font-medium text-lg mb-1 ${
                          isPending ? 'text-white/40' : 'text-white'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-sm font-light ${
                          isPending ? 'text-white/30' : 'text-white/60'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-full"
                        >
                          In Progress
                        </motion.div>
                      )}
                      {isComplete && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {dnaProgress < 3 ? (
                <motion.div 
                  className="mt-8 p-5 bg-white/[0.02] rounded-lg border border-white/10"
                  key="estimating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-white/70 text-sm font-light flex items-center gap-2">
                    <span className="animate-pulse">⏱️</span>
                    Estimated completion: 2-3 days
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="mt-8 space-y-4"
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="p-6 backdrop-blur-xl rounded-lg border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-lg font-medium mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Results Complete!
                        </p>
                        <p className="text-white/60 text-sm font-light">
                          Your DNA analysis is ready. View your personalized insurance recommendations now.
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/purchase')}
                        className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition font-medium whitespace-nowrap"
                      >
                        View Plans →
                      </motion.button>
                    </div>
                  </div>

                  {/* Retake Questionnaire Section */}
                  {hasCompletedDNATest && (
                    <div className="p-6 backdrop-blur-xl rounded-lg border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white text-base font-medium mb-2 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Want Different Recommendations?
                          </p>
                          <p className="text-white/60 text-sm font-light">
                            Retake the questionnaire to update your lifestyle and health info. We'll use your existing DNA results to generate new personalized plans.
                          </p>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            retakeQuestionnaire()
                            navigate('/onboarding/avatar-selection')
                          }}
                          className="ml-4 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-medium whitespace-nowrap flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retake Questions
                        </motion.button>
                      </div>
                    </div>
                  )}
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
            className="p-8 rounded-3xl backdrop-blur-2xl border border-white/10 text-center group cursor-pointer"
            onClick={() => navigate('/analysis')}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-light mb-3 text-white">
              <span className="font-normal">AI Analysis</span>
            </h3>
            <p className="text-white/60 font-light">Triple AI agents will analyze your DNA results</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl backdrop-blur-2xl border border-white/10 text-center group"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition">
              <Gem className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-light mb-3 text-white">
              <span className="font-normal">Personalized Plans</span>
            </h3>
            <p className="text-white/60 font-light">Get recommendations tailored to your genetics</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
