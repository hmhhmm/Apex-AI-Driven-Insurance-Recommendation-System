export interface DNAMarker {
  genotype?: string;
  variant?: string;
  score: number;
  [key: string]: any;
}

export interface DNAMarkers {
  // Cardiovascular
  APOE: DNAMarker & {
    cardiovascularRisk: string;
    alzheimerRisk: string;
  };
  LDLR: DNAMarker & {
    cholesterolImpact: string;
  };
  
  // Metabolic
  TCF7L2: DNAMarker & {
    diabetesRisk: string;
  };
  PPARG: DNAMarker & {
    diabetesRisk: string;
  };
  
  // Cancer
  BRCA1: DNAMarker & {
    cancerRisk: string;
  };
  BRCA2: DNAMarker & {
    cancerRisk: string;
  };
  
  // Athletic/Physical
  ACTN3: DNAMarker & {
    athleticAdvantage: boolean;
    powerPerformance: string;
  };
  COL1A1: DNAMarker & {
    injurySusceptibility: string;
  };
  IL6: DNAMarker & {
    recoveryRate: string;
    inflammationResponse: string;
  };
  
  // Cognitive/Behavioral
  COMT: DNAMarker & {
    cognitiveFunction: string;
    stressResponse: string;
  };
  DRD4: DNAMarker & {
    riskTaking: string;
    noveltySeek: string;
  };
  
  // Longevity
  FOXO3: DNAMarker & {
    lifespan: string;
  };
}

export interface DNAReport {
  fileId: string;
  analyzedDate: string;
  labSource: string;
  markers: DNAMarkers;
}

export interface DNAInterpretation {
  displayRisks: string[];
  primaryConcerns: string[];
  geneticStrengths: string[];
  relevantMarkers: {
    name: string;
    value: string;
    score: number;
  }[];
}
