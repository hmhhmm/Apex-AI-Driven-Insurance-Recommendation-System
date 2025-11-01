import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Shield, Brain, Zap, TrendingUp, Gift, Clock, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react'
import type { TripleAIResult } from '../services/agents/tripleAI'
import ParticleBackground from '../components/landing/ParticleBackground'

export default function RecommendationsPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState<TripleAIResult | null>(null)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('analysisResults')
    if (!storedResults) {
      navigate('/onboarding')
      return
    }
    setResults(JSON.parse(storedResults))
  }, [navigate])

  const handleRetry = () => {
    sessionStorage.removeItem('analysisResults')
    navigate('/analysis')
  }

  const handlePurchase = () => {
    navigate('/purchase')
  }

  const handleSaveForLater = () => {
    localStorage.setItem('savedRecommendations', JSON.stringify(results))
    alert('✓ Recommendations saved! You can access them anytime from your dashboard.')
  }

  if (!results) return null

  const { riskProfile, recommendations, bundle, quantumPredictions } = results

  const getRiskColor = (score: number) => {
    if (score >= 70) return { color: '#ef4444', label: 'High Risk', emoji: '🔴' }
    if (score >= 50) return { color: '#f59e0b', label: 'Moderate', emoji: '🟡' }
    return { color: '#10b981', label: 'Low Risk', emoji: '🟢' }
  }

  const getInsuranceIcon = (type: string) => {
    const lower = type.toLowerCase()
    if (lower.includes('health')) return <Heart className="w-6 h-6" />
    if (lower.includes('life')) return <Shield className="w-6 h-6" />
    if (lower.includes('disability')) return <Brain className="w-6 h-6" />
    return <Shield className="w-6 h-6" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6 shadow-2xl"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Analysis Complete!
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Your Personalized Insurance Blueprint is Ready
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Brain className="w-4 h-4" /> DNA Analysis</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Cognitive Risk</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Quantum Predictions</span>
          </div>
        </motion.div>

        {/* Risk Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            Your Unified Risk Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(riskProfile).map(([type, score]: [string, number], idx) => {
              const riskData = getRiskColor(score)
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Risk
                    </h3>
                    <div className="flex items-end gap-4 mb-4">
                      <span className="text-6xl font-bold" style={{ color: riskData.color }}>
                        {score}
                      </span>
                      <span className="text-gray-400 text-xl mb-2">/100</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg" style={{ color: riskData.color }}>
                      <span>{riskData.emoji}</span>
                      <span className="font-medium">{riskData.label}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: riskData.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Recommendations Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            Personalized Insurance Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        {getInsuranceIcon(plan.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.type}</h3>
                        <span className="text-sm text-blue-400 font-medium">{plan.tier}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold text-white mb-2">
                    ${plan.monthlyPremium}
                    <span className="text-lg text-gray-400 font-normal">/mo</span>
                  </div>
                  
                  <div className="text-gray-300 mb-4 flex-grow">
                    <p className="mb-2"><strong>Coverage:</strong> {plan.coverage}</p>
                    <p className="text-sm text-gray-400">{plan.reason}</p>
                  </div>
                  
                  {plan.savings && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 text-green-400 text-sm font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {plan.savings}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Bundle Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-12"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Gift className="w-7 h-7" />
                    </div>
                    Optimized Bundle Package
                  </h2>
                  <p className="text-gray-400">Maximum coverage, maximum savings</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-green-400">{bundle.discount}%</div>
                  <div className="text-sm text-gray-400">Bundle Discount</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {bundle.selected.map((type: string, idx: number) => (
                  <motion.span
                    key={type}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + idx * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-green-300 font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {type}
                  </motion.span>
                ))}
              </div>

              <div className="flex items-center justify-between bg-slate-900/50 rounded-2xl p-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Monthly Premium</div>
                  <div className="text-4xl font-bold text-white">${bundle.totalMonthly}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">You Save</div>
                  <div className="text-3xl font-bold text-green-400">${bundle.savings}/mo</div>
                  <div className="text-sm text-green-300">= ${bundle.savings * 12}/year</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quantum Predictions Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            Future Timeline Predictions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Immediate Actions
                </h3>
                <ul className="space-y-3">
                  {quantumPredictions.optimizedStrategy.immediate.map((action, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Year 1 Strategy
                </h3>
                <ul className="space-y-3">
                  {quantumPredictions.optimizedStrategy.year1.map((action, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePurchase}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition-all flex items-center gap-2 group"
          >
            Proceed to Purchase
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveForLater}
            className="px-8 py-4 bg-slate-800 border-2 border-purple-500/50 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Save for Later
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-8 py-4 bg-slate-800/50 border-2 border-slate-600 text-gray-300 rounded-xl font-bold text-lg hover:bg-slate-700/50 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Run New Analysis
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
