import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboardingStore';
import { useRecommendations } from '../hooks/useRecommendations';
import { UserProfile } from '../types/user.types';
import RecommendationHeader from '../components/recommendations/RecommendationHeader';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import LoadingState from '../components/recommendations/LoadingState';
import ParticleBackground from '../components/landing/ParticleBackground';
import { AlertCircle, RefreshCw, TrendingUp, Sparkles, X, ShoppingCart, Bot, AlertTriangle, Lightbulb } from 'lucide-react';
import { useMemo } from 'react';
import { INSURANCE_PLANS } from '../data/insurancePlans';
import { useRecommendationsStore } from '../store/recommendationsStore';

export default function Purchase() {
  const navigate = useNavigate();
  const onboardingData = useOnboardingStore();

  // Build user profile from onboarding data
  const userProfile = useMemo<UserProfile | null>(() => {
    // Check if data exists
    if (!onboardingData?.data?.quickAssessment || !onboardingData?.data?.accountCreation) {
      console.log('❌ Missing onboarding data:', {
        hasData: !!onboardingData?.data,
        hasQuickAssessment: !!onboardingData?.data?.quickAssessment,
        hasAccountCreation: !!onboardingData?.data?.accountCreation
      });
      return null;
    }

    const { quickAssessment, accountCreation } = onboardingData.data;

    console.log('✅ Building user profile from:', { quickAssessment, accountCreation });

    return {
      userId: accountCreation.email,
      age: quickAssessment.age || 25,
      gender: (quickAssessment.gender as 'Male' | 'Female' | 'Other') || 'Other',
      occupation: quickAssessment.occupation || 'Professional',
      annualIncome: parseInt(quickAssessment.annualIncome || '60000'),
      
      lifestyle: quickAssessment.lifestyle || 'Moderate',
      exerciseFrequency: quickAssessment.exerciseFrequency || 'Occasionally',
      exerciseTypes: quickAssessment.exerciseTypes || [],
      smokingStatus: quickAssessment.smokingStatus || 'Never',
      alcoholConsumption: quickAssessment.alcoholConsumption || 'None',
      
      familyHistory: {
        cardiovascular: quickAssessment.familyHistory?.includes('Cardiovascular disease') || false,
        diabetes: quickAssessment.familyHistory?.includes('Diabetes') || false,
        cancer: quickAssessment.familyHistory?.includes('Cancer') || false,
        alzheimers: quickAssessment.familyHistory?.includes("Alzheimer's disease") || false
      },
      existingConditions: quickAssessment.existingConditions || [],
      currentMedications: quickAssessment.currentMedications || [],
      
      selectedInsuranceTypes: (quickAssessment.insuranceType?.split(', ').filter(Boolean) || ['Health']) as any[],
      budget: quickAssessment.budget || 'Medium',
      
      hasDependents: quickAssessment.hasDependents === 'Yes',
      numberOfDependents: parseInt(quickAssessment.numberOfDependents || '0'),
      maritalStatus: quickAssessment.maritalStatus || 'Single',
      drivingExperience: parseInt(quickAssessment.drivingExperience || '0'),
      accidentHistory: parseInt(quickAssessment.accidentHistory || '0'),
      travelFrequency: quickAssessment.travelFrequency || 'None'
    };
  }, [onboardingData]);

  const {
    recommendations,
    alternativePlans,
    userRiskProfile,
    totalSavings,
    confidence,
    aiInsights,
    isLoading,
    error,
    refetch
  } = useRecommendations(userProfile);

  const { selectedPlans, getSelectedPlansData, deselectPlan } = useRecommendationsStore();
  const selectedPlansData = getSelectedPlansData();

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Something Went Wrong</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/onboarding/avatar-selection')}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={refetch}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Empty state - no profile data
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-purple-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 text-center"
        >
          <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">No Profile Data Found</h2>
          <p className="text-purple-200 mb-6">
            Please complete the onboarding questionnaire to get personalized recommendations.
          </p>
          <button
            onClick={() => navigate('/onboarding/avatar-selection')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Start Questionnaire
          </button>
        </motion.div>
      </div>
    );
  }

  // No recommendations found
  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-purple-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 text-center"
        >
          <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">No Plans Found</h2>
          <p className="text-purple-200 mb-6">
            We couldn't find insurance plans matching your selected types. Please try selecting different insurance types.
          </p>
          <button
            onClick={() => navigate('/onboarding/avatar-selection')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Update Preferences
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        {userRiskProfile && (
          <RecommendationHeader
            userProfile={userProfile}
            dnaInterpretation={userRiskProfile.dnaInterpretation}
            riskCategory={userRiskProfile.riskCategory}
            confidence={confidence}
          />
        )}

        {/* Confidence & Savings Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="backdrop-blur-2xl border border-white/10 rounded-xl p-6 flex items-center gap-4"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white/60 text-sm font-light">AI Confidence</div>
              <div className="text-2xl font-light text-white">We're {confidence}% confident</div>
              <div className="text-white/50 text-xs font-light">in these recommendations</div>
            </div>
          </div>

          {totalSavings > 0 && (
            <div className="backdrop-blur-2xl border border-white/10 rounded-xl p-6 flex items-center gap-4"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/60 text-sm font-light">Total Savings</div>
                <div className="text-2xl font-light text-white">RM {totalSavings}/month</div>
                <div className="text-white/50 text-xs font-light">vs traditional insurance</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Selected Plans Section */}
        {selectedPlansData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6"
            style={{
              background: 'rgba(138, 43, 226, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-light text-white">
                  Selected <span className="font-normal">Plans</span> ({selectedPlansData.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 font-medium text-sm"
              >
                Proceed to Checkout
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedPlansData.map((rec) => (
                <div
                  key={rec.plan.id}
                  className="bg-white/5 border border-purple-500/20 rounded-xl p-4 relative group hover:bg-white/10 transition-all duration-300"
                >
                  <button
                    onClick={() => deselectPlan(rec.plan.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-red-500/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="pr-8">
                    <div className="text-sm text-purple-400 font-light">{rec.plan.provider}</div>
                    <h4 className="text-white font-medium mb-2">{rec.plan.name}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">{rec.plan.currency} {rec.monthlyPrice}</span>
                      <span className="text-white/60 text-sm">/mo</span>
                    </div>
                    {rec.savingsPercentage > 0 && (
                      <div className="text-xs text-purple-300 mt-1">
                        Save {rec.savingsPercentage}% • RM {rec.savings}/mo
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Insights Section */}
        {aiInsights?.overallAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI Analysis</h3>
                <p className="text-sm text-white/70 font-light">{aiInsights.overallAnalysis}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {aiInsights.riskFactors?.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Key Risk Factors
                  </h4>
                  <ul className="space-y-1">
                    {aiInsights.riskFactors.map((factor: string, idx: number) => (
                      <li key={idx} className="text-sm text-white/60 font-light">• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiInsights.savingsTips?.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Money-Saving Tips
                  </h4>
                  <ul className="space-y-1">
                    {aiInsights.savingsTips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-sm text-white/60 font-light">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Top 4 Recommendations Grid */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-light text-white mb-6 flex items-center gap-3"
          >
            <span className="w-1 h-8 bg-white/40 rounded-full"></span>
            Top Recommendations for You
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.plan.id}
                recommendation={rec}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Alternative Plans */}
        {alternativePlans.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-light text-white mb-6 flex items-center gap-3"
            >
              <span className="w-1 h-6 bg-white/40 rounded-full"></span>
              Other Plans You Might Consider
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alternativePlans.map((rec, index) => (
                <RecommendationCard
                  key={rec.plan.id}
                  recommendation={rec}
                  index={index + 4}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h3 className="text-2xl font-light text-white mb-3">Ready to Get Started?</h3>
          <p className="text-white/60 mb-6 font-light">
            Select your preferred plans and complete your application to enjoy DNA-powered pricing.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-3 rounded-lg transition-all duration-300 font-light"
            >
              Go to Dashboard
            </button>
            <button
              onClick={refetch}
              className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Recommendations
            </button>
          </div>
        </motion.div>

        {/* Browse All Plans Section - Landing Page Professional Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 pt-16 border-t border-white/5"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/70 tracking-wider uppercase">
                All Plans
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              Browse <span className="font-normal">Insurance Plans</span>
            </h2>
            <p className="text-lg text-white/50 font-light max-w-2xl mx-auto">
              Compare plans from top Malaysian insurers • All prices in RM
            </p>
          </div>

          {/* Filter by Insurance Type - Elegant Pills */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {['All', 'Health', 'Auto', 'Life', 'Travel', 'Sports'].map((type) => (
              <button
                key={type}
                className="px-6 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-full text-sm font-light text-white transition-all duration-300"
              >
                {type}
              </button>
            ))}
          </div>

          {/* All Plans Grid - Landing Page Professional Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INSURANCE_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.05) }}
                className="group relative backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {/* Type Badge - Top Right */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/70">
                    {plan.type}
                  </span>
                </div>

                {/* Provider */}
                <div className="mb-6">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">
                      {plan.provider.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm font-light text-white/50 mb-1">{plan.provider}</div>
                  <h3 className="text-xl font-semibold text-white leading-tight">{plan.name}</h3>
                </div>

                {/* Pricing - Elegant */}
                <div className="mb-8 pb-8 border-b border-white/5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm text-white/60">{plan.currency}</span>
                    <span className="text-4xl font-light text-white tracking-tight">{plan.basePrice}</span>
                    <span className="text-white/60 font-light">/mo</span>
                  </div>
                  <div className="text-sm text-white/40">
                    {plan.currency} {(plan.basePrice * 12).toLocaleString()}/year
                  </div>
                </div>

                {/* Coverage Description */}
                <p className="text-sm font-light text-white/60 leading-relaxed mb-6">
                  {plan.coverage}
                </p>

                {/* Features - Minimalist */}
                <div className="space-y-3 mb-8">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-white/60">
                      <svg className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-light">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons - Landing Page Style */}
                <div className="space-y-3">
                  <button className="w-full bg-white text-black hover:bg-white/90 px-6 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm">
                    Select Plan
                  </button>
                  <button className="w-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-white px-6 py-3.5 rounded-xl transition-all duration-300 font-light text-sm">
                    View Details
                  </button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] rounded-3xl transition-all duration-500 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
