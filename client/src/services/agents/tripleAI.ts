// Triple AI Orchestrator
// Runs DNA, Cognitive, and Quantum agents in parallel

import { analyzeDNA, DNAData, DNAAnalysisResult } from './dnaAgent'
import { assessCognitiveRisk, UserProfile, CognitiveRiskResult } from './cognitiveAgent'
import { simulateQuantumTimelines, QuantumPredictionResult } from './quantumAgent'

export interface TripleAIResult {
  dnaAnalysis: DNAAnalysisResult
  cognitiveRisk: CognitiveRiskResult
  quantumPredictions: QuantumPredictionResult
  riskProfile: {
    health: number
    auto: number
    travel: number
    life: number
    sports: number
  }
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
  timestamp: string
}

export async function runTripleAIAnalysis(
  userProfile: UserProfile,
  dnaData: DNAData
): Promise<TripleAIResult> {
  console.log('🚀 Starting Triple AI Analysis...')
  
  // Run all three agents in parallel
  const [dnaAnalysis, cognitiveRisk, quantumPredictions] = await Promise.all([
    analyzeDNA(dnaData).then(result => {
      console.log('🧬 DNA Analysis Agent completed')
      return result
    }),
    assessCognitiveRisk(userProfile).then(result => {
      console.log('🧠 Cognitive Risk Agent completed')
      return result
    }),
    // Quantum agent needs results from first two, so it waits
    Promise.all([analyzeDNA(dnaData), assessCognitiveRisk(userProfile)]).then(
      ([dna, cognitive]) => {
        console.log('⚛️  Quantum Prediction Agent starting...')
        return simulateQuantumTimelines(userProfile, dna, cognitive)
      }
    )
  ])

  console.log('✨ All agents completed, synthesizing results...')

  // Calculate overall risk scores (0-100 scale)
  const riskProfile = {
    health: calculateHealthRisk(dnaAnalysis, cognitiveRisk),
    auto: calculateAutoRisk(dnaAnalysis, cognitiveRisk),
    travel: calculateTravelRisk(dnaAnalysis, cognitiveRisk),
    life: calculateLifeRisk(dnaAnalysis, cognitiveRisk),
    sports: calculateSportsRisk(dnaAnalysis, cognitiveRisk)
  }

  // Generate insurance recommendations
  const recommendations = generateRecommendations(
    riskProfile,
    dnaAnalysis,
    cognitiveRisk,
    quantumPredictions
  )

  // Optimize bundle
  const bundle = optimizeBundle(recommendations)

  return {
    dnaAnalysis,
    cognitiveRisk,
    quantumPredictions,
    riskProfile,
    recommendations,
    bundle,
    timestamp: new Date().toISOString()
  }
}

function calculateHealthRisk(dna: DNAAnalysisResult, cognitive: CognitiveRiskResult): number {
  const geneticRisk = (
    dna.healthRisks.cardiovascular.risk +
    dna.healthRisks.diabetes.risk +
    dna.healthRisks.cancer.risk +
    dna.healthRisks.mental.risk
  ) / 4

  const lifestyleRisk = cognitive.environmentalRisks.lifestyleRisk
  const occupationRisk = cognitive.environmentalRisks.occupationHazard

  return Math.round((geneticRisk * 0.5) + (lifestyleRisk * 0.3) + (occupationRisk * 0.2))
}

function calculateAutoRisk(dna: DNAAnalysisResult, cognitive: CognitiveRiskResult): number {
  const geneticFactors = (
    (100 - dna.autoRiskFactors.reactionTime) +
    dna.autoRiskFactors.impulsivity
  ) / 2

  const behavioralRisk = (100 - cognitive.insuranceFactors.auto.drivingScore)
  const accidentProb = cognitive.insuranceFactors.auto.accidentProbability * 100

  return Math.round((geneticFactors * 0.3) + (behavioralRisk * 0.4) + (accidentProb * 0.3))
}

function calculateTravelRisk(dna: DNAAnalysisResult, cognitive: CognitiveRiskResult): number {
  const geneticResistance = 100 - dna.travelResistance.diseaseResistance
  const travelFrequency = cognitive.insuranceFactors.travel.tripRisk
  const medicalNeed = cognitive.insuranceFactors.travel.medicalNeed

  return Math.round((geneticResistance * 0.3) + (travelFrequency * 0.4) + (medicalNeed * 0.3))
}

function calculateLifeRisk(dna: DNAAnalysisResult, cognitive: CognitiveRiskResult): number {
  const mortalityRisk = cognitive.insuranceFactors.life.mortalityRisk
  const geneticLongevity = 100 - ((dna.lifePredictions.longevity - 60) * 2)
  const healthRisk = calculateHealthRisk(dna, cognitive)

  return Math.round((mortalityRisk * 0.4) + (geneticLongevity * 0.3) + (healthRisk * 0.3))
}

function calculateSportsRisk(dna: DNAAnalysisResult, cognitive: CognitiveRiskResult): number {
  const geneticInjuryRisk = dna.sportsProfile.injuryRisk
  const recoveryRate = 100 - dna.sportsProfile.recoveryRate
  const activityRisk = cognitive.insuranceFactors.sports.activityRisk

  return Math.round((geneticInjuryRisk * 0.4) + (recoveryRate * 0.3) + (activityRisk * 0.3))
}

function generateRecommendations(
  risk: any,
  dna: DNAAnalysisResult,
  cognitive: CognitiveRiskResult,
  quantum: QuantumPredictionResult
): any[] {
  const recommendations = []

  // Health Insurance
  const healthTier = risk.health > 70 ? 'Platinum' : risk.health > 50 ? 'Premium' : risk.health > 30 ? 'Standard' : 'Essential'
  const healthPremium = risk.health > 70 ? 499 : risk.health > 50 ? 349 : risk.health > 30 ? 199 : 49
  
  recommendations.push({
    type: 'Health',
    tier: healthTier,
    monthlyPremium: healthPremium,
    coverage: `$${risk.health > 50 ? '2M' : '1M'} coverage with DNA-optimized benefits`,
    reason: risk.health > 60 
      ? `High genetic risk detected (${Math.round(risk.health)}). Comprehensive coverage recommended.`
      : 'Standard coverage with preventive care focus.',
    savings: quantum.optimizedStrategy.immediate.includes('preventive') ? 'Save 20% with preventive program' : undefined
  })

  // Auto Insurance
  const autoTier = risk.auto > 60 ? 'Premium' : risk.auto > 35 ? 'Standard' : 'Basic'
  const autoPremium = risk.auto > 60 ? 249 : risk.auto > 35 ? 149 : 89
  
  recommendations.push({
    type: 'Auto',
    tier: autoTier,
    monthlyPremium: autoPremium,
    coverage: `Full coverage with $${risk.auto > 50 ? '500k' : '250k'} liability`,
    reason: risk.auto > 50
      ? `Elevated accident risk (${Math.round(risk.auto)}). Enhanced coverage advised.`
      : 'Standard auto protection.',
    savings: cognitive.insuranceFactors.auto.drivingScore > 80 ? 'Good driver discount available' : undefined
  })

  // Travel Insurance
  if (cognitive.insuranceFactors.travel.tripRisk > 20) {
    const travelPremium = risk.travel > 50 ? 129 : 79
    recommendations.push({
      type: 'Travel',
      tier: risk.travel > 50 ? 'Comprehensive' : 'Standard',
      monthlyPremium: travelPremium,
      coverage: 'Trip cancellation, medical emergency, evacuation',
      reason: `Travel frequency detected. Medical coverage abroad essential.`,
      savings: 'Annual plan saves 30% vs per-trip'
    })
  }

  // Life Insurance
  const lifeTier = risk.life > 60 ? 'High Coverage' : risk.life > 40 ? 'Standard' : 'Basic'
  const lifePremium = risk.life > 60 ? 299 : risk.life > 40 ? 179 : 99
  
  recommendations.push({
    type: 'Life',
    tier: lifeTier,
    monthlyPremium: lifePremium,
    coverage: `$${risk.life > 50 ? '1M' : '500k'} term life`,
    reason: `Based on longevity prediction (${dna.lifePredictions.longevity} years) and risk factors.`,
    savings: undefined
  })

  // Sports Insurance
  if (cognitive.insuranceFactors.sports.activityRisk > 40 || dna.sportsProfile.injuryRisk > 50) {
    recommendations.push({
      type: 'Sports',
      tier: risk.sports > 60 ? 'Pro Athlete' : 'Active',
      monthlyPremium: risk.sports > 60 ? 189 : 99,
      coverage: 'Injury coverage, equipment protection, recovery support',
      reason: `Genetic injury risk: ${dna.sportsProfile.injuryRisk}. Recovery rate: ${dna.sportsProfile.recoveryRate}.`,
      savings: 'DNA-optimized recovery plan included'
    })
  }

  return recommendations
}

function optimizeBundle(recommendations: any[]): any {
  const totalMonthly = recommendations.reduce((sum, r) => sum + r.monthlyPremium, 0)
  const numPolicies = recommendations.length
  
  let discountRate = 0
  if (numPolicies >= 5) discountRate = 0.40
  else if (numPolicies >= 4) discountRate = 0.30
  else if (numPolicies >= 3) discountRate = 0.20
  else if (numPolicies >= 2) discountRate = 0.10

  const discount = totalMonthly * discountRate
  const finalTotal = totalMonthly - discount

  return {
    selected: recommendations.map(r => r.type),
    totalMonthly: Math.round(finalTotal),
    discount: Math.round(discountRate * 100),
    savings: Math.round(discount)
  }
}
