import { motion } from 'framer-motion';
import { Heart, Info, Star, TrendingDown, Check } from 'lucide-react';
import { PlanRecommendation } from '../../types/insurance.types';
import { useState } from 'react';
import { useRecommendationsStore } from '../../store/recommendationsStore';
import PlanDetails from './PlanDetails';

interface RecommendationCardProps {
  recommendation: PlanRecommendation;
  index: number;
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const { plan, matchPercentage, monthlyPrice, savings, savingsPercentage, whyRecommended, dnaHighlights } = recommendation;
  
  const [showDetails, setShowDetails] = useState(false);
  const { isPlanSaved, savePlan, unsavePlan, selectPlan, isPlanSelected } = useRecommendationsStore();
  
  const isSaved = isPlanSaved(plan.id);
  const isSelected = isPlanSelected(plan.id);

  const handleSave = () => {
    if (isSaved) {
      unsavePlan(plan.id);
    } else {
      savePlan(plan.id);
    }
  };

  const handleSelect = () => {
    selectPlan(plan.id);
  };

  // Determine match badge color
  const getBadgeColor = () => {
    return 'from-white to-white/90';
  };

  const getMatchLabel = () => {
    if (matchPercentage >= 91) return 'Excellent Match';
    if (matchPercentage >= 85) return 'Great Match';
    if (matchPercentage >= 75) return 'Good Match';
    return 'Consider';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`relative bg-white/[0.03] backdrop-blur-2xl border rounded-2xl p-6 group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col h-full ${
          isSelected ? 'border-purple-500/50 ring-2 ring-purple-500/30' : 'border-white/10 hover:border-purple-500/30'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Match Badge */}
        <div className="absolute -top-3 -right-3 flex flex-col items-end gap-2">
          <div className={`bg-gradient-to-r ${getBadgeColor()} text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2`}>
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold">{matchPercentage}%</span>
          </div>
          {index === 0 && (
            <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              TOP MATCH
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-white text-white' : 'text-white'}`} />
        </button>

        {/* Provider Logo/Icon */}
        <div className="mt-8 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:from-purple-500/30 transition-all duration-300">
            <span className="text-2xl font-bold text-white">{plan.provider.charAt(0)}</span>
          </div>
          <div className="text-white/50 text-sm font-light">{plan.provider}</div>
          <h3 className="text-xl font-bold text-white mt-1">{plan.name}</h3>
          <div className="text-xs text-purple-400 mt-1 font-light">{getMatchLabel()}</div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{plan.currency} {monthlyPrice}</span>
            <span className="text-white/60">/month</span>
          </div>
          
          {/* Show AI-adjusted pricing */}
          {(plan as any).originalPrice && (plan as any).priceAdjustment !== undefined && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="line-through">RM {(plan as any).originalPrice}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  (plan as any).priceAdjustment < 0 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-orange-500/20 text-orange-300'
                }`}>
                  {(plan as any).priceAdjustment > 0 ? '+' : ''}{(plan as any).priceAdjustment}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <span>🤖</span>
                <span>AI-personalized pricing based on your risk profile</span>
              </div>
            </div>
          )}
          
          {savingsPercentage > 0 && (
            <div className="flex items-center gap-2 mt-2 text-white text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>Save {savingsPercentage}% (RM {savings}/month)</span>
            </div>
          )}
        </div>

        {/* Coverage */}
        <div className="text-sm text-white/60 mb-4 line-clamp-2 font-light">
          {plan.coverage}
        </div>

        {/* Why Recommended */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-200 font-light">{whyRecommended}</div>
          </div>
        </div>

        {/* DNA Highlights */}
        {dnaHighlights.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="text-xs text-white font-medium">🧬 DNA-Matched Features:</div>
            {dnaHighlights.slice(0, 2).map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-white/70 font-light">
                <Check className="w-4 h-4 text-white" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        )}

        {/* Top Features */}
        <div className="mb-6 space-y-2 flex-grow">
          {plan.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-white/60 font-light">
              <Check className="w-4 h-4 text-white/40" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white px-4 py-3 rounded-lg transition-all duration-300 font-light"
          >
            View Details
          </button>
          <button
            onClick={handleSelect}
            className={`flex-1 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
              isSelected
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {isSelected ? 'Selected ✓' : 'Select Plan'}
          </button>
        </div>
      </motion.div>

      {/* Details Modal */}
      <PlanDetails
        recommendation={recommendation}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}
