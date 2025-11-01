/**
 * APEX Agent - Client-Side (No Server Required)
 * Autonomous AI Insurance Advisor running entirely in the browser
 */

export interface UserProfile {
  personalInfo: {
    age: number
    gender: string
    occupation: string
    location?: string
  }
  medicalHistory: {
    conditions: string[]
    medications: string[]
    familyHistory?: string[]
  }
  lifestyle: {
    exercise: string
    smoking: boolean
    alcohol?: string
    driving?: {
      yearsExperience: number
      accidents: number
    }
  }
  assets: {
    vehicles?: Array<{ type: string; value: number }>
    property?: { type: string; value: number }
  }
  financials: {
    income: number
    dependents: number
    debts?: number
  }
}

export interface DNAData {
  geneticMarkers: Record<string, any>
  diseaseRisks: Record<string, number>
  drugResponses?: Record<string, string>
  traits?: Record<string, any>
}

export interface RiskProfile {
  health: { score: number; insights: string[] }
  auto: { score: number; insights: string[] }
  travel: { score: number; insights: string[] }
  life: { score: number; insights: string[] }
  sports: { score: number; insights: string[] }
}

export interface InsurancePlan {
  planName: string
  coverage: string
  price: string
  addOns: string[]
}

export interface ApexOutput {
  riskProfile: RiskProfile
  recommendations: {
    health: InsurancePlan
    auto: InsurancePlan
    travel: InsurancePlan
    life: InsurancePlan
    sports: InsurancePlan
    bundle: {
      bestCombination: string[]
      discount: string
    }
  }
  confidence: string
  nextActions: string[]
}

export async function runApexAgent(
  userProfile: UserProfile,
  dnaData: DNAData
): Promise<ApexOutput> {
  // Simulate agent processing time
  await new Promise(resolve => setTimeout(resolve, 1500))

  const healthScore = calculateHealthRisk(userProfile, dnaData)
  const autoScore = calculateAutoRisk(userProfile)
  const travelScore = calculateTravelRisk(userProfile)
  const lifeScore = calculateLifeRisk(userProfile, dnaData)
  const sportsScore = calculateSportsRisk(userProfile, dnaData)

  const riskProfile: RiskProfile = {
    health: {
      score: healthScore,
      insights: generateHealthInsights(userProfile, dnaData, healthScore)
    },
    auto: {
      score: autoScore,
      insights: generateAutoInsights(userProfile, autoScore)
    },
    travel: {
      score: travelScore,
      insights: generateTravelInsights(userProfile, travelScore)
    },
    life: {
      score: lifeScore,
      insights: generateLifeInsights(userProfile, dnaData, lifeScore)
    },
    sports: {
      score: sportsScore,
      insights: generateSportsInsights(userProfile, dnaData, sportsScore)
    }
  }

  const recommendations = {
    health: recommendHealthPlan(healthScore, userProfile),
    auto: recommendAutoPlan(autoScore, userProfile),
    travel: recommendTravelPlan(travelScore, userProfile),
    life: recommendLifePlan(lifeScore, userProfile),
    sports: recommendSportsPlan(sportsScore, userProfile),
    bundle: optimizeBundle(riskProfile)
  }

  const confidence = calculateConfidence(userProfile, dnaData)
  const nextActions = generateNextActions(riskProfile, userProfile)

  return {
    riskProfile,
    recommendations,
    confidence,
    nextActions
  }
}

function calculateHealthRisk(profile: UserProfile, dna: DNAData): number {
  let score = 30
  if (profile.medicalHistory.conditions.length > 0) score += 20
  if (profile.lifestyle.smoking) score += 25
  if (dna.diseaseRisks.cardiovascular) score += dna.diseaseRisks.cardiovascular * 0.3
  return Math.min(Math.round(score), 100)
}

function calculateAutoRisk(profile: UserProfile): number {
  let score = 40
  if (profile.lifestyle.driving) {
    score += profile.lifestyle.driving.accidents * 15
    if (profile.lifestyle.driving.yearsExperience < 5) score += 10
  }
  return Math.min(Math.round(score), 100)
}

function calculateTravelRisk(profile: UserProfile): number {
  return Math.round(20 + Math.random() * 15)
}

function calculateLifeRisk(profile: UserProfile, dna: DNAData): number {
  let score = 25
  if (profile.personalInfo.age > 50) score += 20
  if (profile.financials.dependents > 0) score += 15
  return Math.min(Math.round(score), 100)
}

function calculateSportsRisk(profile: UserProfile, dna: DNAData): number {
  let score = 15
  if (profile.lifestyle.exercise.includes('intense')) score += 20
  return Math.min(Math.round(score), 100)
}

function generateHealthInsights(profile: UserProfile, dna: DNAData, score: number): string[] {
  const insights = []
  if (score < 30) insights.push('Low overall health risk profile')
  if (!profile.lifestyle.smoking) insights.push('Non-smoker status reduces risk significantly')
  if (profile.lifestyle.exercise) insights.push(`Regular exercise: ${profile.lifestyle.exercise}`)
  if (dna.diseaseRisks.cardiovascular < 20) insights.push('Low genetic cardiovascular risk')
  return insights
}

function generateAutoInsights(profile: UserProfile, score: number): string[] {
  const insights = []
  if (score < 40) insights.push('Good driving history')
  if (profile.lifestyle.driving && profile.lifestyle.driving.yearsExperience > 10) {
    insights.push('Experienced driver discount eligible')
  }
  insights.push(`Occupation: ${profile.personalInfo.occupation}`)
  return insights
}

function generateTravelInsights(profile: UserProfile, score: number): string[] {
  return ['Moderate travel frequency', 'Annual plan recommended']
}

function generateLifeInsights(profile: UserProfile, dna: DNAData, score: number): string[] {
  const insights = []
  insights.push(`${profile.financials.dependents} dependent(s) require coverage`)
  if (profile.personalInfo.age < 40) insights.push('Young age = lower premiums')
  return insights
}

function generateSportsInsights(profile: UserProfile, dna: DNAData, score: number): string[] {
  return ['Recreational activity level', 'Low injury risk']
}

function recommendHealthPlan(score: number, profile: UserProfile): InsurancePlan {
  if (score < 30) return {
    planName: 'Essential',
    coverage: '$250k',
    price: '$79/mo',
    addOns: ['Dental', 'Vision']
  }
  if (score < 60) return {
    planName: 'Standard Plus',
    coverage: '$500k',
    price: '$129/mo',
    addOns: ['Dental', 'Mental Health', 'Prescription']
  }
  return {
    planName: 'Premium',
    coverage: '$1M',
    price: '$249/mo',
    addOns: ['Full Coverage', 'Genetic Counseling', 'Preventive Care']
  }
}

function recommendAutoPlan(score: number, profile: UserProfile): InsurancePlan {
  if (score < 40) return {
    planName: 'Comprehensive',
    coverage: 'Full Coverage',
    price: '$89/mo',
    addOns: ['Roadside', 'Rental']
  }
  return {
    planName: 'Premium Auto',
    coverage: 'Full + Gap',
    price: '$139/mo',
    addOns: ['Accident Forgiveness', 'New Car Replacement']
  }
}

function recommendTravelPlan(score: number, profile: UserProfile): InsurancePlan {
  return {
    planName: 'Annual Traveler',
    coverage: 'Worldwide',
    price: '$199/yr',
    addOns: ['Trip Cancellation', 'Medical Emergency']
  }
}

function recommendLifePlan(score: number, profile: UserProfile): InsurancePlan {
  const coverage = profile.financials.income * 10
  return {
    planName: 'Term 20yr',
    coverage: `$${Math.round(coverage / 1000)}k`,
    price: '$49/mo',
    addOns: ['Accelerated Death Benefit', 'Waiver of Premium']
  }
}

function recommendSportsPlan(score: number, profile: UserProfile): InsurancePlan {
  return {
    planName: 'Amateur Athlete',
    coverage: 'Injury + Equipment',
    price: '$19/mo',
    addOns: ['Physical Therapy', 'Equipment Replacement']
  }
}

function optimizeBundle(riskProfile: RiskProfile): { bestCombination: string[]; discount: string } {
  return {
    bestCombination: ['health', 'auto', 'life'],
    discount: '30%'
  }
}

function calculateConfidence(profile: UserProfile, dna: DNAData): string {
  let confidence = 70
  if (dna.geneticMarkers && Object.keys(dna.geneticMarkers).length > 0) confidence += 15
  if (profile.medicalHistory.conditions) confidence += 5
  if (profile.lifestyle.driving) confidence += 5
  return `${Math.min(confidence, 98)}%`
}

function generateNextActions(riskProfile: RiskProfile, profile: UserProfile): string[] {
  const actions = []
  if (riskProfile.health.score > 40) actions.push('Schedule annual health screening')
  if (riskProfile.auto.score > 50) actions.push('Consider telematics device for discount')
  if (profile.financials.dependents > 0) actions.push('Review and update beneficiaries')
  if (!profile.lifestyle.exercise || profile.lifestyle.exercise === 'none') {
    actions.push('Start regular exercise routine (reduces health premiums)')
  }
  actions.push('Complete full DNA analysis for personalized coverage')
  return actions
}
