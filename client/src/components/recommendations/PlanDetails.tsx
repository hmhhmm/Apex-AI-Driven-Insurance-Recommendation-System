import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Info, Shield, DollarSign, FileText, Sparkles, Heart, Activity } from 'lucide-react';
import { PlanRecommendation } from '../../types/insurance.types';
import { useRecommendationsStore } from '../../store/recommendationsStore';

interface PlanDetailsProps {
  recommendation: PlanRecommendation;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanDetails({ recommendation, isOpen, onClose }: PlanDetailsProps) {
  const { plan, matchPercentage, monthlyPrice, originalPrice, savings, dnaHighlights } = recommendation;
  const { selectedPlans, selectPlan, deselectPlan } = useRecommendationsStore();
  const isSelected = selectedPlans.includes(plan.id);

  const handleSelect = () => {
    if (isSelected) {
      deselectPlan(plan.id);
    } else {
      selectPlan(plan.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal Container with Landing Page Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-3xl max-h-[80vh] z-50 overflow-hidden flex flex-col rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Background - Same as Landing Page */}
            <div className="absolute inset-0 -z-10">
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
              
              {/* Animated gradient orbs */}
              <motion.div 
                className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-0 left-1/3 w-1/2 h-1/2 bg-cyan-500/15 rounded-full blur-[100px]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Subtle grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
            </div>

            {/* Header */}
            <div className="relative backdrop-blur-2xl bg-white/[0.03] border-b border-white/10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                      <span className="text-2xl font-bold text-white">{plan.provider.charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-light text-white mb-1">
                        <span className="font-normal">{plan.name}</span>
                      </h2>
                      <div className="text-white/60 text-sm font-light">{plan.provider}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl text-green-400 px-4 py-1.5 rounded-full text-sm font-medium border border-green-500/30">
                      {matchPercentage}% DNA Match
                    </div>
                    <div className="bg-purple-500/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm text-purple-300 border border-purple-500/20">
                      {plan.type} Insurance
                    </div>
                    {isSelected && (
                      <div className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm text-white border border-white/20 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all backdrop-blur-xl border border-white/10"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Pricing Section - Prominent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <h3 className="text-2xl font-light text-white">
                    Your <span className="font-normal">Pricing</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-white/60 font-light mb-2">Monthly Premium</div>
                    <div className="text-4xl font-light text-white mb-1">
                      <span className="font-normal">{plan.currency} {monthlyPrice}</span>
                    </div>
                    {originalPrice && originalPrice > monthlyPrice && (
                      <div className="text-sm text-white/40 line-through">
                        {plan.currency} {originalPrice}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-white/60 font-light mb-2">Annual Premium</div>
                    <div className="text-3xl font-light text-white">
                      <span className="font-normal">{plan.currency} {(monthlyPrice * 12).toFixed(0)}</span>
                    </div>
                    <div className="text-xs text-white/50 mt-1">Paid annually</div>
                  </div>
                  {savings > 0 && (
                    <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
                      <div className="text-sm text-green-300 font-light mb-2">Your Savings</div>
                      <div className="text-3xl font-light text-green-400">
                        <span className="font-normal">{plan.currency} {savings}</span>
                      </div>
                      <div className="text-xs text-green-300/70 mt-1">per month vs traditional</div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* DNA Highlights - If available */}
              {dnaHighlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    <h3 className="text-xl font-light text-white">
                      DNA-Matched <span className="font-normal">Coverage</span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {dnaHighlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-start gap-3 text-orange-100"
                      >
                        <Check className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="font-light">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Coverage Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-2xl bg-white/[0.03] rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-light text-white">
                    <span className="font-normal">Coverage</span> Details
                  </h3>
                </div>
                <p className="text-white/70 font-light leading-relaxed">{plan.coverage}</p>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-2xl bg-white/[0.03] rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-light text-white">
                    Features & <span className="font-normal">Benefits</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="flex items-start gap-3 text-white/70 font-light hover:text-white/90 transition-colors p-3 rounded-lg hover:bg-white/5"
                    >
                      <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Additional Info Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="backdrop-blur-2xl bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <div className="text-sm text-white/60 font-light">Target Age Range</div>
                  </div>
                  <div className="text-2xl font-light text-white">
                    <span className="font-normal">{plan.targetAgeRange[0]} - {plan.targetAgeRange[1]}</span> years
                  </div>
                </div>
                <div className="backdrop-blur-2xl bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-purple-400" />
                    <div className="text-sm text-white/60 font-light">Ideal Lifestyle</div>
                  </div>
                  <div className="text-lg font-light text-white">
                    <span className="font-normal">{plan.idealLifestyle.join(', ')}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Actions */}
            <div className="relative backdrop-blur-2xl bg-white/[0.03] border-t border-white/10 p-6">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl transition-all duration-300 font-light border border-white/20"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSelect}
                  className={`flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-medium ${
                    isSelected
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Select This Plan'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
