import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleBackground from '../components/landing/ParticleBackground'
import { Dna, Brain, Zap, CheckCircle, Loader2, ArrowRight, Clock, TrendingUp } from 'lucide-react'

// Lightweight mock of the TripleAIResult shape used by Results.tsx
type TripleAIResult = {
  riskProfile: Record<string, number>
  recommendations: Array<{
    type: string
    tier: string
    monthlyPremium: number
    coverage: string
    reason: string
    savings?: string
  }>
  bundle: {
    selected: string[]
    totalMonthly: number
    discount: number
    savings: number
  }
  quantumPredictions: {
    optimizedStrategy: {
      immediate: string[]
      year1: string[]
    }
  }
}

type AgentStatus = 'pending' | 'running' | 'complete'

interface Agent {
  id: string
  name: string
  icon: any
  description: string
  status: AgentStatus
  progress: number
  color: string
  tasks: string[]
  currentTask: string
  eta: string
}

export default function AIAnalysis() {
  const navigate = useNavigate()
  const [overallProgress, setOverallProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('Initializing')
  const [logs, setLogs] = useState<string[]>([])
  const [estimatedTime, setEstimatedTime] = useState(7)
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'dna',
      name: 'DNA Analysis Agent',
      icon: Dna,
      description: 'Extracting genetic risk markers and trait signals',
      status: 'pending',
      progress: 0,
      color: 'purple',
      tasks: ['Reading genome sequences', 'Identifying SNPs', 'Calculating polygenic scores', 'Risk profiling'],
      currentTask: '',
      eta: '3s'
    },
    {
      id: 'cognitive',
      name: 'Cognitive Risk Agent',
      icon: Brain,
      description: 'Correlating lifestyle, history and population models',
      status: 'pending',
      progress: 0,
      color: 'blue',
      tasks: ['Analyzing health history', 'Lifestyle factors', 'Family history', 'Risk modeling'],
      currentTask: '',
      eta: '2s'
    },
    {
      id: 'quantum',
      name: 'Quantum Prediction Agent',
      icon: Zap,
      description: 'Running probabilistic future scenarios',
      status: 'pending',
      progress: 0,
      color: 'green',
      tasks: ['Monte Carlo simulations', 'Future risk trajectories', 'Optimizing strategies', 'Timeline predictions'],
      currentTask: '',
      eta: '2s'
    }
  ])

  useEffect(() => {
    const timeline = [
      // Phase 1: DNA Agent (0-33%)
      { time: 500, phase: 'DNA Analysis', agent: 'dna', status: 'running' as AgentStatus, progress: 10, overall: 5, task: 0, log: '🧬 DNA Analysis Agent initializing...' },
      { time: 1200, agent: 'dna', progress: 35, overall: 11, task: 1, log: '🧬 Reading genome sequences...' },
      { time: 1500, agent: 'dna', progress: 60, overall: 20, task: 2, log: '🧬 Identifying single nucleotide polymorphisms (SNPs)...' },
      { time: 1200, agent: 'dna', progress: 85, overall: 28, task: 3, log: '🧬 Calculating polygenic risk scores...' },
      { time: 800, agent: 'dna', status: 'complete' as AgentStatus, progress: 100, overall: 33, task: 3, log: '✅ DNA analysis complete - 3 risk markers identified' },
      
      // Phase 2: Cognitive Agent (34-66%)
      { time: 400, phase: 'Cognitive Analysis', agent: 'cognitive', status: 'running' as AgentStatus, progress: 15, overall: 38, task: 0, log: '🧠 Cognitive Risk Agent starting...' },
      { time: 1100, agent: 'cognitive', progress: 40, overall: 45, task: 1, log: '🧠 Analyzing lifestyle and behavioral patterns...' },
      { time: 1300, agent: 'cognitive', progress: 70, overall: 56, task: 2, log: '🧠 Cross-referencing family medical history...' },
      { time: 1000, agent: 'cognitive', progress: 95, overall: 63, task: 3, log: '🧠 Building comprehensive risk model...' },
      { time: 700, agent: 'cognitive', status: 'complete' as AgentStatus, progress: 100, overall: 66, task: 3, log: '✅ Cognitive analysis complete - risk profile generated' },
      
      // Phase 3: Quantum Agent (67-95%)
      { time: 400, phase: 'Quantum Predictions', agent: 'quantum', status: 'running' as AgentStatus, progress: 20, overall: 72, task: 0, log: '⚡ Quantum Prediction Agent launching...' },
      { time: 1200, agent: 'quantum', progress: 45, overall: 78, task: 1, log: '⚡ Running Monte Carlo simulations (1000 iterations)...' },
      { time: 1400, agent: 'quantum', progress: 75, overall: 87, task: 2, log: '⚡ Optimizing insurance strategy across timelines...' },
      { time: 1100, agent: 'quantum', progress: 95, overall: 93, task: 3, log: '⚡ Generating future risk trajectories...' },
      { time: 800, agent: 'quantum', status: 'complete' as AgentStatus, progress: 100, overall: 95, task: 3, log: '✅ Quantum predictions complete - strategy optimized' },
      
      // Final consolidation (96-100%)
      { time: 600, phase: 'Finalizing', overall: 97, log: '🔄 Consolidating results from all agents...' },
      { time: 600, overall: 100, log: '🎉 Analysis complete! Generating recommendations...' },
    ]

    let currentStep = 0
    let timeElapsed = 0

    const processNext = () => {
      if (currentStep >= timeline.length) {
        // Build and save result
        const result: TripleAIResult = {
          riskProfile: {
            cardiovascular: 78,
            cancer: 32,
            metabolic: 44,
          },
          recommendations: [
            {
              type: 'Health',
              tier: 'Premium',
              monthlyPremium: 120,
              coverage: 'RM 500,000',
              reason: 'Includes strong cardiac and hospitalization coverage.',
              savings: 'Save RM 30/month in bundle'
            },
            {
              type: 'Travel',
              tier: 'Standard',
              monthlyPremium: 80,
              coverage: 'Worldwide RM 300,000',
              reason: 'Includes medical evacuation and accident coverage.'
            },
            {
              type: 'Sports',
              tier: 'Standard',
              monthlyPremium: 70,
              coverage: 'RM 250,000',
              reason: 'Ideal for active individuals; covers sports-related injuries.'
            }
          ],
          bundle: {
            selected: ['Health', 'Sports'],
            totalMonthly: 190,
            discount: 15,
            savings: 28
          },
          quantumPredictions: {
            optimizedStrategy: {
              immediate: ['Schedule cardiac screening', 'Consider health top-up'],
              year1: ['Annual checkups', 'Lifestyle coaching']
            }
          }
        }

        sessionStorage.setItem('analysisResults', JSON.stringify(result))
        setTimeout(() => navigate('/recommendations'), 1200)
        return
      }

      const step = timeline[currentStep]
      timeElapsed += step.time

      // Update phase
      if (step.phase) setCurrentPhase(step.phase)
      
      // Update overall progress
      if (step.overall !== undefined) {
        setOverallProgress(step.overall)
        setEstimatedTime(Math.max(0, Math.ceil((7000 - timeElapsed) / 1000)))
      }
      
      // Update agent
      if (step.agent) {
        setAgents(prev => prev.map(a => {
          if (a.id === step.agent) {
            return {
              ...a,
              status: step.status || a.status,
              progress: step.progress || a.progress,
              currentTask: step.task !== undefined ? a.tasks[step.task] : a.currentTask
            }
          }
          return a
        }))
      }
      
      // Add log
      if (step.log) {
        setLogs(prev => [...prev, step.log!])
      }

      currentStep++
      setTimeout(processNext, step.time)
    }

    const starter = setTimeout(processNext, 300)
    return () => clearTimeout(starter)
  }, [navigate])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
          className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"
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
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Triple AI Analysis Pipeline
          </h1>
          <p className="text-gray-400 text-lg">
            Our specialized agents are analyzing your DNA, lifestyle, and future scenarios
          </p>
        </motion.div>

        {/* Overall Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-8 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{currentPhase}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Estimated time remaining: {estimatedTime}s</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-400">{overallProgress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="relative h-3 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {agents.map((agent, index) => {
            const Icon = agent.icon
            const isRunning = agent.status === 'running'
            const isComplete = agent.status === 'complete'
            const isPending = agent.status === 'pending'
            
            const borderColor = 
              isComplete ? 'border-green-500/50' :
              isRunning ? `border-${agent.color}-500/50` :
              'border-zinc-800/50'
            
            const bgColor =
              isComplete ? 'from-green-950/30 to-green-900/10' :
              isRunning ? `from-${agent.color}-950/30 to-${agent.color}-900/10` :
              'from-zinc-900/30 to-zinc-900/10'

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br ${bgColor} border ${borderColor} transition-all duration-500`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                  {isRunning && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className={`w-8 h-8 bg-${agent.color}-500/20 border border-${agent.color}-500 rounded-full flex items-center justify-center`}
                    >
                      <Loader2 className={`w-5 h-5 text-${agent.color}-400`} />
                    </motion.div>
                  )}
                  {isPending && (
                    <div className="w-8 h-8 bg-zinc-800/50 border border-zinc-700 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Agent Icon */}
                <div className={`w-14 h-14 mb-4 rounded-xl bg-${agent.color}-500/10 border border-${agent.color}-500/30 flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 text-${agent.color}-400`} />
                </div>

                {/* Agent Info */}
                <h3 className="text-lg font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{agent.description}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className={`text-sm font-bold ${
                      isComplete ? 'text-green-400' :
                      isRunning ? `text-${agent.color}-400` :
                      'text-gray-600'
                    }`}>
                      {agent.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        isComplete ? 'bg-green-500' :
                        isRunning ? `bg-${agent.color}-500` :
                        'bg-zinc-700'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Current Task */}
                <AnimatePresence mode="wait">
                  {agent.currentTask && (
                    <motion.div
                      key={agent.currentTask}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-xs ${
                        isComplete ? 'text-green-400' :
                        isRunning ? `text-${agent.color}-400` :
                        'text-gray-600'
                      } font-medium flex items-center gap-2`}
                    >
                      {isRunning && <TrendingUp className="w-3 h-3 animate-pulse" />}
                      {isComplete && <CheckCircle className="w-3 h-3" />}
                      <span className="truncate">{agent.currentTask}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ETA */}
                {isPending && (
                  <div className="mt-2 text-xs text-gray-600">
                    ETA: {agent.eta}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Analysis Timeline
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800" />
            <div 
              className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 transition-all duration-500"
              style={{ height: `${overallProgress}%` }}
            />
            
            {/* Timeline Steps */}
            <div className="space-y-4">
              {agents.map((agent, index) => {
                const Icon = agent.icon
                const isComplete = agent.status === 'complete'
                const isRunning = agent.status === 'running'
                
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative flex items-start gap-4 pl-12"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isComplete ? 'bg-green-500/20 border-green-500' :
                      isRunning ? `bg-${agent.color}-500/20 border-${agent.color}-500` :
                      'bg-zinc-900 border-zinc-700'
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : isRunning ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Icon className={`w-4 h-4 text-${agent.color}-400`} />
                        </motion.div>
                      ) : (
                        <Icon className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    
                    {/* Timeline Content */}
                    <div className="flex-1 pb-4">
                      <div className={`text-sm font-semibold ${
                        isComplete ? 'text-green-400' :
                        isRunning ? `text-${agent.color}-400` :
                        'text-gray-600'
                      }`}>
                        {agent.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{agent.description}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Analysis Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10"
        >
          <h4 className="text-lg font-bold text-white mb-4">Real-Time Analysis Log</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-gray-300 font-mono bg-zinc-900/50 px-3 py-2 rounded border border-zinc-800/50"
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {overallProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-gradient-to-r from-green-950/30 to-purple-950/30 rounded-xl border border-green-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <div className="font-bold text-green-400">Analysis Complete!</div>
                    <div className="text-sm text-gray-400">Preparing your personalized recommendations...</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
