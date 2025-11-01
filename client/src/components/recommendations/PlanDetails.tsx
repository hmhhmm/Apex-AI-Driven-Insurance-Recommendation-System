import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Info, Shield, DollarSign, FileText } from 'lucide-react';
import { PlanRecommendation } from '../../types/insurance.types';

interface PlanDetailsProps {
  recommendation: PlanRecommendation;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanDetails({ recommendation, isOpen, onClose }: PlanDetailsProps) {
  const { plan, matchPercentage, monthlyPrice, originalPrice, savings, dnaHighlights } = recommendation;

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{plan.provider.charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                      <div className="text-purple-300 text-sm">{plan.provider}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {matchPercentage}% Match
                    </div>
                    <div className="bg-purple-600/50 px-3 py-1 rounded-full text-sm text-white">
                      {plan.type} Insurance
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Pricing Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Pricing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-purple-300 mb-1">Monthly Premium</div>
                    <div className="text-3xl font-bold text-white">{plan.currency} {monthlyPrice}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 mb-1">Annual Premium</div>
                    <div className="text-2xl font-bold text-white">{plan.currency} {monthlyPrice * 12}</div>
                  </div>
                  {savings > 0 && (
                    <div>
                      <div className="text-sm text-green-300 mb-1">Your Savings</div>
                      <div className="text-2xl font-bold text-green-400">{plan.currency} {savings}/mo</div>
                      <div className="text-xs text-green-300">vs traditional insurance</div>
                    </div>
                  )}
                </div>
              </div>

              {/* DNA Highlights */}
              {dnaHighlights.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">🧬 DNA-Matched Coverage</h3>
                  </div>
                  <div className="space-y-2">
                    {dnaHighlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-orange-200">
                        <Check className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage Description */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Coverage</h3>
                </div>
                <p className="text-purple-200">{plan.coverage}</p>
              </div>

              {/* Features */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Features & Benefits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-purple-200">
                      <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Age & Risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-purple-300 mb-2">Target Age Range</div>
                  <div className="text-lg font-semibold text-white">
                    {plan.targetAgeRange[0]} - {plan.targetAgeRange[1]} years
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-purple-300 mb-2">Ideal Lifestyle</div>
                  <div className="text-lg font-semibold text-white">
                    {plan.idealLifestyle.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Select This Plan
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
