import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { useState, useMemo } from 'react'
import ParticleBackground from '../components/landing/ParticleBackground'

// Mock data types
interface Plan {
  id: string
  company: string
  name: string
  type: 'Health' | 'Auto' | 'Travel' | 'Life' | 'Sports'
  monthlyPremiumBase: number
  annualPremiumBase: number
  annualCoverLimit: number
  lifetimeCoverLimit?: number
  deductible: number
  coPay: number
  features: string[]
  benefits: string[]
  coverageDetails: {
    inPatient?: string
    outPatient?: string
    criticalIllness?: string
    dental?: string
    maternity?: string
    collision?: string
    theft?: string
    thirdParty?: string
    personalAccident?: string
    medical?: string
    tripCancellation?: string
    baggageLoss?: string
    deathBenefit?: string
    tpd?: string
    criticalIllnessCover?: string
    injuries?: string
    equipmentCover?: string
  }
  waitingPeriod: string
  exclusions: string[]
  addOns: string[]
  dnaDiscount: boolean
  lifestyleDiscount: boolean
  bundleEligible: boolean
}

interface UserProfile {
  age: number
  smoking: boolean
  occupationRisk: 'Low' | 'Medium' | 'High'
  dnaRiskClass: 'A' | 'B' | 'C' | 'D'
}

// Mock Malaysian insurance plans
const mockPlans: Plan[] = [
  // Health Insurance
  {
    id: 'ge-health-basic',
    company: 'Great Eastern',
    name: 'GreatHealth Essential',
    type: 'Health',
    monthlyPremiumBase: 280,
    annualPremiumBase: 3200,
    annualCoverLimit: 100000,
    lifetimeCoverLimit: 500000,
    deductible: 5000,
    coPay: 10,
    features: ['Basic hospital coverage', 'Emergency care', 'Outpatient benefits up to RM2,000'],
    benefits: ['Panel hospitals nationwide', 'Annual health screening', 'Cashless admission'],
    coverageDetails: {
      inPatient: 'RM100,000 annual limit',
      outPatient: 'RM2,000 annual limit',
      criticalIllness: 'Not covered',
      dental: 'Not covered',
    },
    waitingPeriod: '30 days general, 120 days specified illnesses',
    exclusions: ['Pre-existing conditions', 'Cosmetic procedures', 'Alternative medicine'],
    addOns: ['Maternity coverage +RM80/month', 'Dental & Vision +RM50/month'],
    dnaDiscount: true,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  {
    id: 'aia-health-standard',
    company: 'AIA Malaysia',
    name: 'AIA Med Premier',
    type: 'Health',
    monthlyPremiumBase: 420,
    annualPremiumBase: 4800,
    annualCoverLimit: 250000,
    lifetimeCoverLimit: 1000000,
    deductible: 2000,
    coPay: 10,
    features: ['Comprehensive coverage', 'Dental & Vision included', 'Prescription drugs covered'],
    benefits: ['Private hospital access', 'International coverage (ASEAN)', 'Telemedicine included'],
    coverageDetails: {
      inPatient: 'RM250,000 annual limit',
      outPatient: 'RM5,000 annual limit',
      criticalIllness: 'RM50,000 lump sum',
      dental: 'RM1,500 annual limit',
      maternity: 'RM10,000',
    },
    waitingPeriod: '30 days general, 120 days specified',
    exclusions: ['War & civil unrest', 'Self-inflicted injuries', 'Experimental treatments'],
    addOns: ['Mental health +RM100/month', 'Cancer top-up +RM150/month'],
    dnaDiscount: true,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  {
    id: 'prudential-health-premium',
    company: 'Prudential Malaysia',
    name: 'PRUhealth Elite',
    type: 'Health',
    monthlyPremiumBase: 650,
    annualPremiumBase: 7500,
    annualCoverLimit: 500000,
    lifetimeCoverLimit: 2000000,
    deductible: 500,
    coPay: 0,
    features: ['Full coverage', 'Zero co-payment', 'Mental health & wellness'],
    benefits: ['Global coverage', 'VIP ward access', 'Home nursing care', 'DNA-optimized wellness plan'],
    coverageDetails: {
      inPatient: 'RM500,000 annual limit',
      outPatient: 'RM10,000 annual limit',
      criticalIllness: 'RM100,000 lump sum',
      dental: 'RM3,000 annual limit',
      maternity: 'RM20,000',
    },
    waitingPeriod: '14 days general, 90 days specified',
    exclusions: ['Pre-existing within 5 years', 'High-risk sports'],
    addOns: ['Traditional Chinese Medicine +RM120/month', 'IVF coverage +RM200/month'],
    dnaDiscount: true,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  // Auto Insurance
  {
    id: 'allianz-auto-basic',
    company: 'Allianz Malaysia',
    name: 'Road Protect Basic',
    type: 'Auto',
    monthlyPremiumBase: 120,
    annualPremiumBase: 1400,
    annualCoverLimit: 50000,
    deductible: 500,
    coPay: 0,
    features: ['Third-party liability', 'Basic collision', 'Windscreen cover RM500'],
    benefits: ['24/7 hotline', 'Towing service (50km)', 'Workshop network'],
    coverageDetails: {
      collision: 'Market value',
      theft: 'Market value',
      thirdParty: 'Unlimited liability',
      personalAccident: 'RM10,000 driver',
    },
    waitingPeriod: 'Immediate coverage',
    exclusions: ['Racing', 'Driving under influence', 'Unregistered driver'],
    addOns: ['Legal assistance +RM30/month', 'Car rental +RM50/month'],
    dnaDiscount: false,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  {
    id: 'etiqa-auto-comprehensive',
    company: 'Etiqa Insurance',
    name: 'SafeDrive Comprehensive',
    type: 'Auto',
    monthlyPremiumBase: 180,
    annualPremiumBase: 2100,
    annualCoverLimit: 100000,
    deductible: 300,
    coPay: 0,
    features: ['Full comprehensive', 'Theft & fire', 'Flood coverage', 'Windscreen RM1,500'],
    benefits: ['Roadside assistance 24/7', 'Free towing (100km)', 'Betterment waiver'],
    coverageDetails: {
      collision: 'Agreed value',
      theft: 'Agreed value',
      thirdParty: 'Unlimited',
      personalAccident: 'RM20,000 driver + RM5,000/passenger',
    },
    waitingPeriod: 'Immediate',
    exclusions: ['Wear & tear', 'Modification damage', 'Off-road use'],
    addOns: ['Passenger coverage +RM40/month', 'Accessories cover +RM25/month'],
    dnaDiscount: false,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  {
    id: 'ge-auto-premium',
    company: 'Great Eastern',
    name: 'GreatDrive Elite',
    type: 'Auto',
    monthlyPremiumBase: 250,
    annualPremiumBase: 2900,
    annualCoverLimit: 200000,
    deductible: 0,
    coPay: 0,
    features: ['Zero excess', 'Rental car included', 'Key replacement', 'Windscreen RM3,000'],
    benefits: ['Premium roadside assist', 'Accident concierge', 'Home/work towing', 'Lifetime betterment waiver'],
    coverageDetails: {
      collision: 'Agreed value + betterment',
      theft: 'Agreed value + belongings',
      thirdParty: 'Unlimited',
      personalAccident: 'RM50,000 driver + RM10,000/passenger',
    },
    waitingPeriod: 'Immediate',
    exclusions: ['Intentional damage', 'Racing', 'Commercial use'],
    addOns: ['Premium rental car upgrade +RM80/month', 'Personal effects +RM60/month'],
    dnaDiscount: false,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  // Travel Insurance
  {
    id: 'aia-travel-basic',
    company: 'AIA Malaysia',
    name: 'AIA Travel Safe',
    type: 'Travel',
    monthlyPremiumBase: 45,
    annualPremiumBase: 520,
    annualCoverLimit: 50000,
    deductible: 200,
    coPay: 0,
    features: ['ASEAN coverage', 'Medical up to RM50k', 'Trip cancellation RM2k'],
    benefits: ['Emergency evacuation', 'Lost baggage RM1,000', '24/7 travel assist'],
    coverageDetails: {
      medical: 'RM50,000',
      tripCancellation: 'RM2,000',
      baggageLoss: 'RM1,000',
      personalAccident: 'RM20,000',
    },
    waitingPeriod: 'Immediate upon purchase',
    exclusions: ['War zones', 'Pre-existing medical', 'High-risk activities'],
    addOns: ['Winter sports +RM20/month', 'Adventure sports +RM35/month'],
    dnaDiscount: false,
    lifestyleDiscount: false,
    bundleEligible: true,
  },
  {
    id: 'prudential-travel-premium',
    company: 'Prudential Malaysia',
    name: 'PRUtravel Worldwide',
    type: 'Travel',
    monthlyPremiumBase: 95,
    annualPremiumBase: 1100,
    annualCoverLimit: 200000,
    deductible: 0,
    coPay: 0,
    features: ['Global coverage', 'Medical RM200k', 'Trip cancellation RM10k', 'Flight delay compensation'],
    benefits: ['Premium evacuation', 'Lost baggage RM5,000', 'Concierge service', 'Business travel covered'],
    coverageDetails: {
      medical: 'RM200,000',
      tripCancellation: 'RM10,000',
      baggageLoss: 'RM5,000',
      personalAccident: 'RM100,000',
    },
    waitingPeriod: 'Immediate',
    exclusions: ['Pandemics (optional add-on)', 'Unlawful activities'],
    addOns: ['Pandemic coverage +RM40/month', 'Golf coverage +RM25/month'],
    dnaDiscount: false,
    lifestyleDiscount: false,
    bundleEligible: true,
  },
  // Life Insurance
  {
    id: 'ge-life-term',
    company: 'Great Eastern',
    name: 'GreatLife Term 25',
    type: 'Life',
    monthlyPremiumBase: 150,
    annualPremiumBase: 1750,
    annualCoverLimit: 500000,
    deductible: 0,
    coPay: 0,
    features: ['Death benefit RM500k', 'TPD RM500k', '25-year term'],
    benefits: ['Premium waiver on disability', 'Flexible payment', 'Renewable'],
    coverageDetails: {
      deathBenefit: 'RM500,000',
      tpd: 'RM500,000',
      criticalIllnessCover: 'Not included',
    },
    waitingPeriod: '90 days',
    exclusions: ['Suicide within 2 years', 'War', 'High-risk occupation'],
    addOns: ['Critical illness rider +RM80/month', 'Accidental death +RM50/month'],
    dnaDiscount: true,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  {
    id: 'prudential-life-whole',
    company: 'Prudential Malaysia',
    name: 'PRUlife Protector',
    type: 'Life',
    monthlyPremiumBase: 320,
    annualPremiumBase: 3750,
    annualCoverLimit: 1000000,
    deductible: 0,
    coPay: 0,
    features: ['Death benefit RM1M', 'TPD RM1M', 'Critical illness RM200k', 'Whole life coverage'],
    benefits: ['Investment-linked', 'Premium holiday option', 'Living benefits', 'DNA-based pricing'],
    coverageDetails: {
      deathBenefit: 'RM1,000,000',
      tpd: 'RM1,000,000',
      criticalIllnessCover: 'RM200,000 (36 conditions)',
    },
    waitingPeriod: '90 days',
    exclusions: ['Suicide within 2 years', 'Pre-existing conditions (critical illness)'],
    addOns: ['Income replacement +RM120/month', 'Education fund +RM100/month'],
    dnaDiscount: true,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  // Sports Insurance
  {
    id: 'allianz-sports-active',
    company: 'Allianz Malaysia',
    name: 'SportShield Active',
    type: 'Sports',
    monthlyPremiumBase: 80,
    annualPremiumBase: 920,
    annualCoverLimit: 50000,
    deductible: 300,
    coPay: 10,
    features: ['Sports injury coverage', 'Physiotherapy', 'Equipment cover RM2k'],
    benefits: ['Gym/studio accidents', 'Outdoor activities', 'Emergency transport'],
    coverageDetails: {
      injuries: 'RM50,000 medical',
      equipmentCover: 'RM2,000',
      personalAccident: 'RM30,000',
    },
    waitingPeriod: '14 days',
    exclusions: ['Extreme sports', 'Professional sports', 'Pre-existing injuries'],
    addOns: ['Extreme sports +RM100/month', 'International events +RM60/month'],
    dnaDiscount: false,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
  {
    id: 'etiqa-sports-extreme',
    company: 'Etiqa Insurance',
    name: 'ExtremeCare Pro',
    type: 'Sports',
    monthlyPremiumBase: 180,
    annualPremiumBase: 2100,
    annualCoverLimit: 150000,
    deductible: 500,
    coPay: 10,
    features: ['Extreme sports covered', 'Medical RM150k', 'Equipment RM10k', 'Permanent disability'],
    benefits: ['Rock climbing', 'Scuba diving', 'Martial arts', 'Competition coverage'],
    coverageDetails: {
      injuries: 'RM150,000 medical',
      equipmentCover: 'RM10,000',
      personalAccident: 'RM100,000',
    },
    waitingPeriod: '30 days',
    exclusions: ['Motor racing', 'Base jumping', 'Unlicensed activities'],
    addOns: ['Overseas competition +RM120/month', 'Rehab extension +RM70/month'],
    dnaDiscount: false,
    lifestyleDiscount: true,
    bundleEligible: true,
  },
]

const Purchase = () => {
  const { items, addItem, removeItem, total } = useCartStore()
  
  // State
  const [activeType, setActiveType] = useState<'Health' | 'Auto' | 'Travel' | 'Life' | 'Sports'>('Health')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'premium' | 'coverage' | 'deductible'>('premium')
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<Plan | null>(null)
  const [showPersonalizedPricing, setShowPersonalizedPricing] = useState(true)
  const [showEstimator, setShowEstimator] = useState(false)
  const [showCartOverlay, setShowCartOverlay] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 65,
    smoking: false,
    occupationRisk: 'Low' as 'Low' | 'Medium' | 'High',
    dnaRiskClass: 'B' as 'A' | 'B' | 'C' | 'D',
    maxMonthlyBudget: 1000,
    maxDeductible: 10000,
  })
  
  // User profile for estimator
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    smoking: false,
    occupationRisk: 'Low',
    dnaRiskClass: 'B',
  })
  
  const insuranceTypes: Array<'Health' | 'Auto' | 'Travel' | 'Life' | 'Sports'> = ['Health', 'Auto', 'Travel', 'Life', 'Sports']
  const typeIcons = {
    Health: '🏥',
    Auto: '🚗',
    Travel: '✈️',
    Life: '🛡️',
    Sports: '⚽',
  }
  
  // Premium calculation with DNA & lifestyle adjustments
  const calculatePremium = (plan: Plan, usePersonalized: boolean): { monthly: number; annual: number } => {
    if (!usePersonalized) {
      return {
        monthly: plan.monthlyPremiumBase,
        annual: plan.annualPremiumBase,
      }
    }
    
    let multiplier = 1.0
    
    // Age factor
    if (userProfile.age > 50) multiplier *= 1.3
    else if (userProfile.age > 40) multiplier *= 1.15
    else if (userProfile.age < 25) multiplier *= 0.95
    
    // Smoking
    if (userProfile.smoking) multiplier *= 1.25
    
    // Occupation risk
    if (userProfile.occupationRisk === 'High') multiplier *= 1.2
    else if (userProfile.occupationRisk === 'Medium') multiplier *= 1.1
    
    // DNA risk class (applies to Health & Life)
    if (plan.dnaDiscount && (plan.type === 'Health' || plan.type === 'Life')) {
      switch (userProfile.dnaRiskClass) {
        case 'A':
          multiplier *= 0.85 // Best DNA profile
          break
        case 'B':
          multiplier *= 0.95
          break
        case 'C':
          multiplier *= 1.05
          break
        case 'D':
          multiplier *= 1.15
          break
      }
    }
    
    // Lifestyle discount (good habits)
    if (plan.lifestyleDiscount && !userProfile.smoking) {
      multiplier *= 0.95
    }
    
    return {
      monthly: Math.round(plan.monthlyPremiumBase * multiplier),
      annual: Math.round(plan.annualPremiumBase * multiplier),
    }
  }
  
  // Filter and sort plans
  const filteredPlans = useMemo(() => {
    let filtered = mockPlans.filter((plan) => {
      if (plan.type !== activeType) return false
      if (searchQuery && !plan.name.toLowerCase().includes(searchQuery.toLowerCase()) && !plan.company.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      const pricing = calculatePremium(plan, showPersonalizedPricing)
      if (pricing.monthly > filters.maxMonthlyBudget) return false
      if (plan.deductible > filters.maxDeductible) return false
      
      return true
    })
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'premium') {
        const aPrice = calculatePremium(a, showPersonalizedPricing).monthly
        const bPrice = calculatePremium(b, showPersonalizedPricing).monthly
        return aPrice - bPrice
      } else if (sortBy === 'coverage') {
        return b.annualCoverLimit - a.annualCoverLimit
      } else if (sortBy === 'deductible') {
        return a.deductible - b.deductible
      }
      return 0
    })
    
    return filtered
  }, [activeType, searchQuery, filters, sortBy, showPersonalizedPricing, userProfile])
  
  // Value indicator color
  const getValueColor = (plan: Plan): string => {
    const pricing = calculatePremium(plan, showPersonalizedPricing)
    const valueRatio = plan.annualCoverLimit / pricing.monthly
    
    if (valueRatio > 1500) return 'border-green-500'
    if (valueRatio > 800) return 'border-yellow-500'
    return 'border-red-500'
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Animated Background */}
      <ParticleBackground />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
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
          className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
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
      </div>

      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header with Cart Icon */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-light mb-2 text-white">
              Insurance <span className="font-normal">Plans</span> Marketplace
            </h1>
            <p className="text-gray-400">Compare plans from top Malaysian insurers • All prices in RM</p>
          </div>
          
          {/* Cart Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCartOverlay(true)}
            className="relative p-3 backdrop-blur-xl bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {items.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs flex items-center justify-center font-bold text-white"
              >
                {items.length}
              </motion.span>
            )}
          </motion.button>
        </motion.div>
        
        {/* Platform Differentiator Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 relative overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <div className="flex items-start gap-4 relative z-10">
            <motion.div 
              className="text-4xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧬
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-light text-white mb-2">
                Your Premium is <span className="font-normal">Personalised</span>
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                Our platform uses <strong>DNA profiling</strong>, <strong>cognitive modelling</strong>, and <strong>quantum risk analysis</strong> to adjust your premium based on your unique risk profile — not just generic demographics.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEstimator(!showEstimator)}
                className="text-blue-400 text-sm hover:text-blue-300 underline"
              >
                {showEstimator ? 'Hide' : 'Show'} Premium Estimator
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Show:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPersonalizedPricing(!showPersonalizedPricing)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  showPersonalizedPricing
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'backdrop-blur-xl bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {showPersonalizedPricing ? 'Personalised Pricing' : 'Standard Pricing'}
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Premium Estimator */}
        <AnimatePresence>
          {showEstimator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 overflow-hidden"
            >
              <h3 className="text-lg font-light text-white mb-4">
                Premium <span className="font-normal">Estimator</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Age</label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({ ...userProfile, age: parseInt(e.target.value) || 18 })}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
                    min="18"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Smoking Status</label>
                  <select
                    value={userProfile.smoking ? 'yes' : 'no'}
                    onChange={(e) => setUserProfile({ ...userProfile, smoking: e.target.value === 'yes' })}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="no">Non-smoker</option>
                    <option value="yes">Smoker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Occupation Risk</label>
                  <select
                    value={userProfile.occupationRisk}
                    onChange={(e) => setUserProfile({ ...userProfile, occupationRisk: e.target.value as any })}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">DNA Risk Class</label>
                  <select
                    value={userProfile.dnaRiskClass}
                    onChange={(e) => setUserProfile({ ...userProfile, dnaRiskClass: e.target.value as any })}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="A">Class A (Best)</option>
                    <option value="B">Class B (Good)</option>
                    <option value="C">Class C (Average)</option>
                    <option value="D">Class D (Higher Risk)</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <p>💡 Your personalised premium reflects: age-based risk, smoking status, occupation hazards, DNA-predicted health risk, and lifestyle habits.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Type Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {insuranceTypes.map((type, index) => (
            <motion.button
              key={type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveType(type)
                setSearchQuery('')
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeType === type
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'backdrop-blur-xl bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className="text-xl">{typeIcons[type]}</span>
              {type}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search Plans</label>
              <input
                type="text"
                placeholder="Company or plan name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Monthly Budget (RM)</label>
              <input
                type="number"
                value={filters.maxMonthlyBudget}
                onChange={(e) => setFilters({ ...filters, maxMonthlyBudget: parseInt(e.target.value) || 1000 })}
                className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Deductible (RM)</label>
              <input
                type="number"
                value={filters.maxDeductible}
                onChange={(e) => setFilters({ ...filters, maxDeductible: parseInt(e.target.value) || 10000 })}
                className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="premium">Premium (Low → High)</option>
                <option value="coverage">Coverage (High → Low)</option>
                <option value="deductible">Deductible (Low → High)</option>
              </select>
            </div>
          </div>
        </motion.div>
        
        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredPlans.map((plan, index) => {
            const pricing = calculatePremium(plan, showPersonalizedPricing)
            const valueColor = getValueColor(plan)
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-2 ${valueColor} hover:shadow-2xl transition-all relative group overflow-hidden`}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className="text-4xl"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {typeIcons[plan.type]}
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">{plan.company}</div>
                      <h3 className="text-xl font-light text-white">
                        {plan.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-4 p-4 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          RM {pricing.monthly}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-300">RM {pricing.annual}</div>
                        <div className="text-xs text-gray-500">per year</div>
                      </div>
                    </div>
                    {showPersonalizedPricing && (pricing.monthly !== plan.monthlyPremiumBase) && (
                      <div className="text-xs text-gray-400 border-t border-white/10 pt-2">
                        Standard: RM {plan.monthlyPremiumBase}/month
                        <span className={pricing.monthly < plan.monthlyPremiumBase ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                          {pricing.monthly < plan.monthlyPremiumBase ? '↓' : '↑'} RM {Math.abs(pricing.monthly - plan.monthlyPremiumBase)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500">Annual Cover</div>
                      <div className="font-semibold text-white">RM {plan.annualCoverLimit.toLocaleString()}</div>
                    </div>
                    {plan.lifetimeCoverLimit && (
                      <div>
                        <div className="text-gray-500">Lifetime Limit</div>
                        <div className="font-semibold text-white">RM {plan.lifetimeCoverLimit.toLocaleString()}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-500">Deductible</div>
                      <div className="font-semibold text-white">RM {plan.deductible}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Co-pay</div>
                      <div className="font-semibold text-white">{plan.coPay}%</div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-400 mb-2">Key Features</div>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-500">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.dnaDiscount && (
                      <span className="px-2 py-1 backdrop-blur-xl bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-500/50">
                        🧬 DNA-optimized
                      </span>
                    )}
                    {plan.lifestyleDiscount && (
                      <span className="px-2 py-1 backdrop-blur-xl bg-green-500/20 text-green-300 text-xs rounded-lg border border-green-500/50">
                        💚 Lifestyle discount
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlanDetail(plan)}
                      className="flex-1 px-4 py-2 backdrop-blur-xl bg-white/5 text-white rounded-lg hover:bg-white/10 transition border border-white/10"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addItem({ ...plan, price: pricing.monthly, type: plan.type })}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
                    >
                      Select Plan
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {filteredPlans.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No plans found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
        
        {/* Disclaimers */}
        <div className="card bg-zinc-950 border-zinc-800">
          <h3 className="text-lg font-bold text-white mb-3">Important Notes & Disclaimers</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Premiums shown are estimates and subject to underwriting and final approval by the insurer.</li>
            <li>• Prices vary by age, occupation class, smoking status, selected deductible/co-pay, and risk factors (DNA/lifestyle on applicable plans).</li>
            <li>• Waiting periods apply for certain conditions; pre-existing conditions may be excluded or subject to higher premiums.</li>
            <li>• Premiums may increase annually due to age, inflation, and claims experience.</li>
            <li>• Coverage limits, exclusions, and terms are as per the insurer's policy documents. Always review the full policy wording before purchase.</li>
            <li>• Bundle discounts are applied at checkout and are subject to eligibility and insurer approval.</li>
            <li>
              • For full policy documents and FAQs, visit our{' '}
              <a href="/help" className="text-blue-400 underline">
                Help Center
              </a>
              .
            </li>
          </ul>
        </div>
        
        {/* Cart Overlay */}
        <AnimatePresence>
          {showCartOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowCartOverlay(false)}
            >
              <motion.div
                initial={{ scale: 0.9, x: 100 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0.9, x: 100 }}
                className="bg-zinc-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                  <button
                    onClick={() => setShowCartOverlay(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-gray-500">Your cart is empty</p>
                      <button
                        onClick={() => setShowCartOverlay(false)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {items.map((item) => (
                          <div key={item.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-semibold text-white">{item.name}</div>
                                <div className="text-xs text-blue-400 mt-1">{item.type}</div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-400 ml-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-blue-400">RM {item.price}</span>
                              <span className="text-xs text-gray-500">per month</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-zinc-800 pt-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white font-semibold">RM {total}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold text-white">Total per month</span>
                          <span className="text-3xl font-bold text-blue-400">RM {total}</span>
                        </div>
                        <button className="w-full btn-primary py-3 text-lg">
                          Proceed to Checkout
                        </button>
                      </div>
                      
                      <button
                        onClick={() => setShowCartOverlay(false)}
                        className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                      >
                        Continue Shopping
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Detail Modal */}
        <AnimatePresence>
          {selectedPlanDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPlanDetail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-6 flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{selectedPlanDetail.company}</div>
                    <h2 className="text-2xl font-bold text-white">{selectedPlanDetail.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedPlanDetail(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Pricing Summary */}
                  <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Monthly Premium</span>
                      <span className="text-2xl font-bold text-blue-400">
                        RM {calculatePremium(selectedPlanDetail, showPersonalizedPricing).monthly}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Annual Premium</span>
                      <span className="text-lg font-semibold text-white">
                        RM {calculatePremium(selectedPlanDetail, showPersonalizedPricing).annual}
                      </span>
                    </div>
                  </div>
                  
                  {/* Coverage Breakdown */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Coverage Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(selectedPlanDetail.coverageDetails).map(([key, value]) => (
                        <div key={key} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm font-semibold text-white">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Included Benefits</h3>
                    <ul className="space-y-2">
                      {selectedPlanDetail.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-green-500">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* What This Means For You */}
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <h3 className="text-lg font-bold text-white mb-2">💡 What This Means For You</h3>
                    <p className="text-gray-300 text-sm">
                      This plan covers up to <strong>RM {selectedPlanDetail.annualCoverLimit.toLocaleString()}</strong> annually.
                      You'll pay a <strong>RM {selectedPlanDetail.deductible}</strong> deductible and <strong>{selectedPlanDetail.coPay}% co-insurance</strong> for eligible claims.
                      {selectedPlanDetail.dnaDiscount && (
                        <> With DNA profiling, your premium may be adjusted based on genetic risk factors.</>
                      )}
                    </p>
                  </div>
                  
                  {/* Good to Know */}
                  <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <h3 className="text-lg font-bold text-white mb-2">⚠️ Good to Know</h3>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• <strong>Waiting Period:</strong> {selectedPlanDetail.waitingPeriod}</li>
                      <li>• <strong>Premium Escalation:</strong> Premiums may increase annually based on age and claims experience.</li>
                      {selectedPlanDetail.type === 'Health' && (
                        <li>• <strong>Panel Hospitals:</strong> Lower out-of-pocket costs when using panel hospitals.</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Exclusions */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Exclusions</h3>
                    <ul className="space-y-2">
                      {selectedPlanDetail.exclusions.map((exclusion, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                          <span className="text-red-500">✕</span>
                          <span>{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Add-ons */}
                  {selectedPlanDetail.addOns.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">Available Add-ons</h3>
                      <ul className="space-y-2">
                        {selectedPlanDetail.addOns.map((addon, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                            <span className="text-blue-400">+</span>
                            <span>{addon}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        const pricing = calculatePremium(selectedPlanDetail, showPersonalizedPricing)
                        addItem({ ...selectedPlanDetail, price: pricing.monthly, type: selectedPlanDetail.type })
                        setSelectedPlanDetail(null)
                      }}
                      className="flex-1 btn-primary"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setSelectedPlanDetail(null)}
                      className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Purchase
