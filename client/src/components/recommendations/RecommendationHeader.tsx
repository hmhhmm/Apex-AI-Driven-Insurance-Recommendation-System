import { motion } from 'framer-motion';
import { User, Activity, Dna, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types/user.types';
import { DNAInterpretation } from '../../types/dna.types';

interface RecommendationHeaderProps {
  userProfile: UserProfile;
  dnaInterpretation: DNAInterpretation;
  riskCategory: string;
  confidence: number;
}

export default function RecommendationHeader({
  userProfile,
  dnaInterpretation,
  riskCategory,
  confidence
}: RecommendationHeaderProps) {
  const insuranceTypesText = userProfile.selectedInsuranceTypes
    .join(', ')
    .replace(/, ([^,]*)$/, ' and $1');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-2xl border border-white/10 rounded-3xl p-10 mb-8"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-light text-white mb-2">
            Your <span className="font-normal">Personalized Recommendations</span>
          </h1>
          <p className="text-white/60 font-light">
            Based on your DNA analysis, {userProfile.lifestyle.toLowerCase()} lifestyle, and {insuranceTypesText} coverage needs
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-purple-400 font-light">Confidence Score</div>
          <div className="text-3xl font-light text-white">{confidence}%</div>
        </div>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <User className="w-5 h-5 text-white mb-2" />
          <div className="text-sm text-white/50 font-light">Age</div>
          <div className="text-xl font-medium text-white">{userProfile.age} years</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Activity className="w-5 h-5 text-white mb-2" />
          <div className="text-sm text-white/50 font-light">Lifestyle</div>
          <div className="text-xl font-medium text-white">{userProfile.lifestyle}</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Dna className="w-5 h-5 text-white mb-2" />
          <div className="text-sm text-white/50 font-light">Risk Category</div>
          <div className="text-xl font-medium text-white">
            {riskCategory}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <TrendingUp className="w-5 h-5 text-white mb-2" />
          <div className="text-sm text-white/50 font-light">Exercise</div>
          <div className="text-xl font-medium text-white">{userProfile.exerciseFrequency}</div>
        </div>
      </div>

      {/* DNA Analysis Results */}
      {dnaInterpretation.displayRisks.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium mb-2">🧬 DNA Risk Factors</h3>
              <div className="space-y-1">
                {dnaInterpretation.displayRisks.map((risk, index) => (
                  <div key={index} className="text-white/70 text-sm font-light">
                    • {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genetic Strengths */}
      {dnaInterpretation.geneticStrengths.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
          <div className="flex items-start gap-3">
            <Dna className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium mb-2">💪 Genetic Strengths</h3>
              <div className="space-y-1">
                {dnaInterpretation.geneticStrengths.map((strength, index) => (
                  <div key={index} className="text-white/70 text-sm font-light">
                    • {strength}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prioritization Notice */}
      <div className="mt-4 flex items-center gap-2 text-sm text-white/50 font-light">
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
        We prioritized {insuranceTypesText} coverage based on your selections
      </div>
    </motion.div>
  );
}
