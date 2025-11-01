import { InsurancePlan } from '../types/insurance.types';

/**
 * INSURANCE PLANS DATABASE
 * Comprehensive database of 25 insurance plans across 5 types
 */
export const INSURANCE_PLANS: InsurancePlan[] = [
  // ==================== HEALTH INSURANCE ====================
  {
    id: "health-001",
    provider: "AIA Malaysia",
    name: "AIA Med Premier",
    type: "Health",
    basePrice: 450,
    currency: "RM",
    coverage: "Comprehensive medical coverage with unlimited annual limit",
    features: [
      "Unlimited annual limit",
      "Coverage up to age 100",
      "Cardiac and cancer care",
      "Preventive health screenings",
      "Outpatient specialist visits",
      "Emergency dental treatment"
    ],
    targetAgeRange: [25, 55],
    targetRiskProfile: [50, 85],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["cardiovascularRisk", "diabetesRisk", "cancerRisk"],
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "health-002",
    provider: "Prudential",
    name: "PRUBSNMediCare Plus",
    type: "Health",
    basePrice: 320,
    currency: "RM",
    coverage: "Standard medical coverage for hospitalization and surgery",
    features: [
      "RM 300,000 annual limit",
      "Room & board coverage",
      "Surgical procedures",
      "ICU coverage",
      "Pre & post hospitalization",
      "Ambulance services"
    ],
    targetAgeRange: [20, 60],
    targetRiskProfile: [30, 70],
    idealLifestyle: ["Moderate", "Sedentary"],
    dnaFactors: ["cardiovascularRisk", "cancerRisk"],
    riskMultipliers: {
      low: 0.88,
      medium: 1.0,
      high: 1.12
    }
  },
  {
    id: "health-003",
    provider: "Great Eastern",
    name: "MediShield Basic",
    type: "Health",
    basePrice: 180,
    currency: "RM",
    coverage: "Essential medical protection for hospitalization",
    features: [
      "RM 150,000 annual limit",
      "Hospital room coverage",
      "Basic surgical procedures",
      "Emergency treatment",
      "Day surgery coverage"
    ],
    targetAgeRange: [18, 50],
    targetRiskProfile: [20, 50],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: [],
    riskMultipliers: {
      low: 0.90,
      medium: 1.0,
      high: 1.10
    }
  },
  {
    id: "health-004",
    provider: "Allianz",
    name: "CareAdvantage Premium",
    type: "Health",
    basePrice: 580,
    currency: "RM",
    coverage: "Premium comprehensive coverage with wellness benefits",
    features: [
      "Unlimited annual limit",
      "Private hospital room",
      "Advanced cancer treatment",
      "Organ transplant coverage",
      "Mental health support",
      "Annual health checkup",
      "Wellness rewards program"
    ],
    targetAgeRange: [30, 65],
    targetRiskProfile: [60, 95],
    idealLifestyle: ["Active", "Moderate", "Sedentary"],
    dnaFactors: ["cardiovascularRisk", "diabetesRisk", "cancerRisk", "alzheimerRisk"],
    riskMultipliers: {
      low: 0.82,
      medium: 1.0,
      high: 1.18
    }
  },
  {
    id: "health-005",
    provider: "Tune Protect",
    name: "Cardiac-Specific Plan",
    type: "Health",
    basePrice: 420,
    currency: "RM",
    coverage: "Specialized coverage for cardiovascular conditions",
    features: [
      "Cardiac surgery coverage",
      "Angioplasty procedures",
      "Cardiac rehabilitation",
      "Regular heart screenings",
      "Cholesterol management",
      "24/7 cardiac hotline"
    ],
    targetAgeRange: [35, 70],
    targetRiskProfile: [65, 100],
    idealLifestyle: ["Moderate", "Sedentary"],
    dnaFactors: ["cardiovascularRisk", "cholesterolImpact"],
    requiresCondition: {
      type: "dna",
      field: "cardiovascularRisk",
      value: "high",
      operator: "equals"
    },
    riskMultipliers: {
      low: 0.88,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "health-006",
    provider: "Pacific Insurance",
    name: "Diabetes Care Plus",
    type: "Health",
    basePrice: 380,
    currency: "RM",
    coverage: "Comprehensive diabetes management and complications coverage",
    features: [
      "Diabetes medication coverage",
      "Regular HbA1c monitoring",
      "Diabetic complications treatment",
      "Nutritionist consultations",
      "Insulin pump coverage",
      "Foot care services"
    ],
    targetAgeRange: [30, 75],
    targetRiskProfile: [70, 100],
    idealLifestyle: ["Moderate", "Sedentary"],
    dnaFactors: ["diabetesRisk"],
    requiresCondition: {
      type: "dna",
      field: "diabetesRisk",
      value: "high",
      operator: "equals"
    },
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.20
    }
  },

  // ==================== AUTO INSURANCE ====================
  {
    id: "auto-001",
    provider: "AIA General",
    name: "AIA Auto Safe",
    type: "Auto",
    basePrice: 220,
    currency: "RM",
    coverage: "Comprehensive auto insurance with windscreen and flood coverage",
    features: [
      "Own damage coverage",
      "Third party liability",
      "Windscreen coverage",
      "Flood damage protection",
      "Legal liability coverage",
      "Passenger liability"
    ],
    targetAgeRange: [21, 70],
    targetRiskProfile: [20, 60],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["cognitiveFunction", "stressResponse"],
    riskMultipliers: {
      low: 0.80,
      medium: 1.0,
      high: 1.25
    }
  },
  {
    id: "auto-002",
    provider: "Allianz General",
    name: "Motor Insurance Plus",
    type: "Auto",
    basePrice: 180,
    currency: "RM",
    coverage: "Third party coverage with fire and theft protection",
    features: [
      "Third party liability",
      "Fire & theft coverage",
      "Legal costs coverage",
      "Towing services",
      "Basic roadside assistance"
    ],
    targetAgeRange: [21, 65],
    targetRiskProfile: [30, 70],
    idealLifestyle: ["Moderate", "Sedentary"],
    dnaFactors: [],
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.20
    }
  },
  {
    id: "auto-003",
    provider: "Zurich Insurance",
    name: "DriveShield Premium",
    type: "Auto",
    basePrice: 320,
    currency: "RM",
    coverage: "Premium auto coverage with extensive roadside assistance",
    features: [
      "Comprehensive coverage",
      "24/7 roadside assistance",
      "Replacement vehicle",
      "Windscreen & flood coverage",
      "Personal accident benefit",
      "Legal protection",
      "Workshop guarantee"
    ],
    targetAgeRange: [25, 70],
    targetRiskProfile: [20, 50],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["cognitiveFunction", "stressResponse", "riskTaking"],
    riskMultipliers: {
      low: 0.75,
      medium: 1.0,
      high: 1.30
    }
  },
  {
    id: "auto-004",
    provider: "MSIG Insurance",
    name: "MotorCare Budget",
    type: "Auto",
    basePrice: 150,
    currency: "RM",
    coverage: "Affordable third party coverage for budget-conscious drivers",
    features: [
      "Third party liability",
      "Legal liability coverage",
      "Basic towing services",
      "Fire coverage"
    ],
    targetAgeRange: [21, 60],
    targetRiskProfile: [20, 50],
    idealLifestyle: ["Moderate"],
    dnaFactors: [],
    riskMultipliers: {
      low: 0.90,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "auto-005",
    provider: "Progressive Insurance",
    name: "Safe Driver Rewards",
    type: "Auto",
    basePrice: 200,
    currency: "RM",
    coverage: "Rewards program for low-risk, safe drivers",
    features: [
      "Comprehensive coverage",
      "No-claim bonus protection",
      "Telematics-based pricing",
      "Safe driving cashback",
      "Windscreen coverage",
      "Monthly rewards points"
    ],
    targetAgeRange: [25, 65],
    targetRiskProfile: [10, 40],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["cognitiveFunction", "stressResponse"],
    requiresCondition: {
      type: "lifestyle",
      field: "accidentHistory",
      value: 1,
      operator: "lessThan"
    },
    riskMultipliers: {
      low: 0.70,
      medium: 0.90,
      high: 1.10
    }
  },

  // ==================== LIFE INSURANCE ====================
  {
    id: "life-001",
    provider: "AIA Malaysia",
    name: "AIA Term Life 25",
    type: "Life",
    basePrice: 180,
    currency: "RM",
    coverage: "25-year term life insurance with death and TPD coverage",
    features: [
      "RM 500,000 coverage",
      "25-year term",
      "Death benefit",
      "Total permanent disability",
      "Premium waiver benefit",
      "Renewable option"
    ],
    targetAgeRange: [25, 50],
    targetRiskProfile: [20, 60],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["lifespan", "cardiovascularRisk"],
    riskMultipliers: {
      low: 0.80,
      medium: 1.0,
      high: 1.20
    }
  },
  {
    id: "life-002",
    provider: "Prudential",
    name: "PRULife Vantage",
    type: "Life",
    basePrice: 420,
    currency: "RM",
    coverage: "Whole life insurance with investment component",
    features: [
      "Lifetime coverage",
      "Cash value accumulation",
      "Death benefit",
      "Living benefits",
      "Dividend participation",
      "Policy loan facility"
    ],
    targetAgeRange: [25, 60],
    targetRiskProfile: [30, 70],
    idealLifestyle: ["Active", "Moderate", "Sedentary"],
    dnaFactors: ["lifespan", "cardiovascularRisk", "cancerRisk"],
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "life-003",
    provider: "Great Eastern",
    name: "Supreme Assurance",
    type: "Life",
    basePrice: 350,
    currency: "RM",
    coverage: "Universal life insurance with flexible premiums",
    features: [
      "Flexible premium payments",
      "Investment options",
      "Death benefit",
      "Critical illness rider",
      "Partial withdrawal option",
      "Coverage to age 99"
    ],
    targetAgeRange: [30, 65],
    targetRiskProfile: [40, 80],
    idealLifestyle: ["Moderate", "Sedentary"],
    dnaFactors: ["cardiovascularRisk", "diabetesRisk", "cancerRisk"],
    riskMultipliers: {
      low: 0.82,
      medium: 1.0,
      high: 1.18
    }
  },
  {
    id: "life-004",
    provider: "Manulife",
    name: "ReadyProtect Term",
    type: "Life",
    basePrice: 120,
    currency: "RM",
    coverage: "Affordable term life protection for young families",
    features: [
      "RM 300,000 coverage",
      "20-year term",
      "Death benefit",
      "Affordable premiums",
      "Online application",
      "Fast approval"
    ],
    targetAgeRange: [21, 45],
    targetRiskProfile: [15, 50],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: [],
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "life-005",
    provider: "Zurich Life",
    name: "High Coverage Elite",
    type: "Life",
    basePrice: 650,
    currency: "RM",
    coverage: "Premium life insurance for high-income individuals",
    features: [
      "RM 2,000,000+ coverage",
      "Whole life protection",
      "Estate planning benefits",
      "Critical illness coverage",
      "Investment component",
      "Premium financing options",
      "Global coverage"
    ],
    targetAgeRange: [30, 60],
    targetRiskProfile: [30, 70],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["lifespan", "cardiovascularRisk", "cancerRisk"],
    requiresCondition: {
      type: "lifestyle",
      field: "annualIncome",
      value: 150000,
      operator: "greaterThan"
    },
    riskMultipliers: {
      low: 0.80,
      medium: 1.0,
      high: 1.20
    }
  },

  // ==================== TRAVEL INSURANCE ====================
  {
    id: "travel-001",
    provider: "AIA Travel",
    name: "AIA Travel Safe",
    type: "Travel",
    basePrice: 45,
    currency: "RM",
    coverage: "ASEAN regional travel insurance coverage",
    features: [
      "Medical expenses coverage",
      "Trip cancellation",
      "Baggage loss protection",
      "Travel delay compensation",
      "Personal accident coverage",
      "24/7 travel assistance"
    ],
    targetAgeRange: [18, 70],
    targetRiskProfile: [20, 60],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: [],
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "travel-002",
    provider: "Allianz Travel",
    name: "Travel Care Worldwide",
    type: "Travel",
    basePrice: 85,
    currency: "RM",
    coverage: "Comprehensive worldwide travel insurance",
    features: [
      "Worldwide coverage",
      "Up to RM 500,000 medical",
      "Trip cancellation up to RM 10,000",
      "Baggage protection",
      "Flight delay compensation",
      "Emergency evacuation",
      "COVID-19 coverage"
    ],
    targetAgeRange: [18, 75],
    targetRiskProfile: [25, 70],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["cardiovascularRisk"],
    riskMultipliers: {
      low: 0.82,
      medium: 1.0,
      high: 1.18
    }
  },
  {
    id: "travel-003",
    provider: "Zurich Travel",
    name: "TravelShield Annual",
    type: "Travel",
    basePrice: 280,
    currency: "RM",
    coverage: "Annual multi-trip travel insurance for frequent travelers",
    features: [
      "Unlimited trips per year",
      "Up to 90 days per trip",
      "Worldwide coverage",
      "Medical expenses",
      "Trip cancellation",
      "Business travel included",
      "Golf coverage"
    ],
    targetAgeRange: [25, 70],
    targetRiskProfile: [20, 60],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: [],
    requiresCondition: {
      type: "lifestyle",
      field: "travelFrequency",
      value: "Frequent",
      operator: "equals"
    },
    riskMultipliers: {
      low: 0.80,
      medium: 1.0,
      high: 1.20
    }
  },
  {
    id: "travel-004",
    provider: "World Nomads",
    name: "Adventure Sports Cover",
    type: "Travel",
    basePrice: 120,
    currency: "RM",
    coverage: "Specialized coverage for adventure and extreme sports",
    features: [
      "Adventure sports coverage",
      "Scuba diving up to 40m",
      "Mountain climbing",
      "Skiing and snowboarding",
      "Emergency rescue",
      "Equipment coverage",
      "Worldwide protection"
    ],
    targetAgeRange: [18, 60],
    targetRiskProfile: [40, 80],
    idealLifestyle: ["Active"],
    dnaFactors: ["athleticAdvantage", "injurySusceptibility", "riskTaking"],
    requiresCondition: {
      type: "lifestyle",
      field: "exerciseTypes",
      value: ["Hiking", "Climbing", "Skiing", "Diving"],
      operator: "includes"
    },
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.25
    }
  },

  // ==================== SPORTS INSURANCE ====================
  {
    id: "sports-001",
    provider: "Allianz Sports",
    name: "SportShield Active",
    type: "Sports",
    basePrice: 95,
    currency: "RM",
    coverage: "Coverage for recreational sports and fitness activities",
    features: [
      "Sports injury coverage",
      "Gym accident protection",
      "Physiotherapy coverage",
      "Medical expenses",
      "Temporary disability benefit",
      "Equipment protection"
    ],
    targetAgeRange: [18, 60],
    targetRiskProfile: [30, 70],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["athleticAdvantage", "injurySusceptibility", "recoveryRate"],
    riskMultipliers: {
      low: 0.80,
      medium: 1.0,
      high: 1.20
    }
  },
  {
    id: "sports-002",
    provider: "Zurich Sports",
    name: "AthleteCare Pro",
    type: "Sports",
    basePrice: 280,
    currency: "RM",
    coverage: "Professional athlete insurance with comprehensive coverage",
    features: [
      "Professional sports coverage",
      "Career-ending injury benefit",
      "Surgery and rehabilitation",
      "Loss of income protection",
      "Mental health support",
      "Nutrition consultation",
      "Performance enhancement coverage"
    ],
    targetAgeRange: [18, 45],
    targetRiskProfile: [50, 90],
    idealLifestyle: ["Active"],
    dnaFactors: ["athleticAdvantage", "powerPerformance", "recoveryRate", "injurySusceptibility"],
    requiresCondition: {
      type: "lifestyle",
      field: "occupation",
      value: ["Athlete", "Sports", "Coach", "Trainer"],
      operator: "includes"
    },
    riskMultipliers: {
      low: 0.75,
      medium: 1.0,
      high: 1.30
    }
  },
  {
    id: "sports-003",
    provider: "K&K Insurance",
    name: "Fitness Protection",
    type: "Sports",
    basePrice: 65,
    currency: "RM",
    coverage: "Basic protection for gym and fitness center injuries",
    features: [
      "Gym accident coverage",
      "Equipment-related injuries",
      "Medical expenses",
      "Physiotherapy sessions",
      "Chiropractic care"
    ],
    targetAgeRange: [18, 65],
    targetRiskProfile: [25, 60],
    idealLifestyle: ["Active", "Moderate"],
    dnaFactors: ["injurySusceptibility", "recoveryRate"],
    riskMultipliers: {
      low: 0.85,
      medium: 1.0,
      high: 1.15
    }
  },
  {
    id: "sports-004",
    provider: "ACE Insurance",
    name: "Extreme Sports Elite",
    type: "Sports",
    basePrice: 320,
    currency: "RM",
    coverage: "High-risk sports and extreme activities coverage",
    features: [
      "Extreme sports coverage",
      "Skydiving & paragliding",
      "Rock climbing protection",
      "Water sports coverage",
      "Emergency rescue",
      "Permanent disability benefit",
      "Worldwide coverage"
    ],
    targetAgeRange: [21, 55],
    targetRiskProfile: [60, 100],
    idealLifestyle: ["Active"],
    dnaFactors: ["athleticAdvantage", "riskTaking", "injurySusceptibility", "recoveryRate"],
    requiresCondition: {
      type: "lifestyle",
      field: "exerciseTypes",
      value: ["Climbing", "Skydiving", "Paragliding", "Extreme"],
      operator: "includes"
    },
    riskMultipliers: {
      low: 0.80,
      medium: 1.0,
      high: 1.35
    }
  }
];

/**
 * Helper function to get plans by type
 */
export const getPlansByType = (type: string): InsurancePlan[] => {
  return INSURANCE_PLANS.filter(plan => plan.type === type);
};

/**
 * Helper function to get plan by ID
 */
export const getPlanById = (id: string): InsurancePlan | undefined => {
  return INSURANCE_PLANS.find(plan => plan.id === id);
};
