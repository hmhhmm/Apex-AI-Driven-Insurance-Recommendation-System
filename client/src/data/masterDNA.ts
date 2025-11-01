import { DNAReport } from '../types/dna.types';

/**
 * MASTER DNA REPORT
 * This is the SINGLE static DNA report used for ALL users.
 * The data never changes, but interpretation is contextual based on user profile.
 */
export const MASTER_DNA_REPORT: DNAReport = {
  fileId: "dna-sample-001",
  analyzedDate: "2024-10-15",
  labSource: "LabCorp",
  markers: {
    // Cardiovascular
    APOE: { 
      genotype: "e3/e4", 
      cardiovascularRisk: "moderate",
      alzheimerRisk: "moderate",
      score: 65 
    },
    LDLR: { 
      variant: "risk", 
      cholesterolImpact: "high",
      score: 72 
    },
    
    // Metabolic
    TCF7L2: { 
      variant: "risk", 
      diabetesRisk: "high",
      score: 78 
    },
    PPARG: { 
      variant: "normal", 
      diabetesRisk: "low",
      score: 35 
    },
    
    // Cancer
    BRCA1: { 
      variant: "moderate", 
      cancerRisk: "moderate",
      score: 55 
    },
    BRCA2: { 
      variant: "normal", 
      cancerRisk: "low",
      score: 25 
    },
    
    // Athletic/Physical
    ACTN3: { 
      genotype: "R/R", 
      athleticAdvantage: true,
      powerPerformance: "high",
      score: 85 
    },
    COL1A1: { 
      variant: "normal", 
      injurySusceptibility: "low",
      score: 30 
    },
    IL6: { 
      variant: "moderate", 
      recoveryRate: "moderate",
      inflammationResponse: "moderate",
      score: 60 
    },
    
    // Cognitive/Behavioral
    COMT: { 
      genotype: "met/met", 
      cognitiveFunction: "good",
      stressResponse: "resilient",
      score: 72 
    },
    DRD4: { 
      variant: "7R", 
      riskTaking: "moderate",
      noveltySeek: "moderate",
      score: 55 
    },
    
    // Longevity
    FOXO3: { 
      variant: "longevity", 
      lifespan: "extended",
      score: 80 
    }
  }
};
