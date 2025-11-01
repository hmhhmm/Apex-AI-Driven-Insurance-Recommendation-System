import { DNAReport, DNAInterpretation } from '../types/dna.types';
import { UserProfile } from '../types/user.types';
import { InsuranceType } from '../types/insurance.types';

/**
 * DNA INTERPRETATION SERVICE
 * Dynamically interprets the SAME DNA report based on user context
 * Shows different risk factors based on age, lifestyle, and insurance selection
 */

export function interpretDNA(
  dnaReport: DNAReport,
  userProfile: UserProfile
): DNAInterpretation {
  const { age, lifestyle, exerciseFrequency, selectedInsuranceTypes } = userProfile;
  
  const displayRisks: string[] = [];
  const primaryConcerns: string[] = [];
  const geneticStrengths: string[] = [];
  const relevantMarkers: Array<{ name: string; value: string; score: number }> = [];

  // Determine priority based on insurance types selected
  const prioritizeHealth = selectedInsuranceTypes.includes('Health' as InsuranceType);
  const prioritizeSports = selectedInsuranceTypes.includes('Sports' as InsuranceType);
  const prioritizeLife = selectedInsuranceTypes.includes('Life' as InsuranceType);
  const prioritizeAuto = selectedInsuranceTypes.includes('Auto' as InsuranceType);

  // ========== CARDIOVASCULAR RISK ==========
  if (prioritizeHealth || prioritizeLife) {
    const apoeScore = dnaReport.markers.APOE.score;
    const ldlrScore = dnaReport.markers.LDLR.score;
    const avgCardioScore = (apoeScore + ldlrScore) / 2;

    if (avgCardioScore >= 65) {
      if (age >= 45 || lifestyle === 'Sedentary') {
        displayRisks.push('High cardiovascular risk');
        primaryConcerns.push('Heart disease prevention');
        relevantMarkers.push({
          name: 'APOE & LDLR',
          value: 'Risk variants detected',
          score: avgCardioScore
        });
      } else if (age >= 35) {
        displayRisks.push('Moderate cardiovascular risk');
        primaryConcerns.push('Cholesterol management');
      }
    }

    // Alzheimer's risk (relevant for older users or life insurance)
    if (age >= 50 && prioritizeLife) {
      if (dnaReport.markers.APOE.alzheimerRisk === 'moderate') {
        displayRisks.push('Moderate Alzheimer\'s risk');
        primaryConcerns.push('Cognitive health monitoring');
      }
    }
  }

  // ========== DIABETES RISK ==========
  if (prioritizeHealth) {
    const diabetesScore = dnaReport.markers.TCF7L2.score;
    
    if (diabetesScore >= 70) {
      if (lifestyle === 'Sedentary' || age >= 40) {
        displayRisks.push('High diabetes risk');
        primaryConcerns.push('Blood sugar monitoring');
        relevantMarkers.push({
          name: 'TCF7L2',
          value: 'High-risk variant',
          score: diabetesScore
        });
      } else {
        displayRisks.push('Moderate diabetes risk');
      }
    }
  }

  // ========== CANCER RISK ==========
  if (prioritizeHealth || prioritizeLife) {
    const brca1Score = dnaReport.markers.BRCA1.score;
    
    if (brca1Score >= 50 && age >= 35) {
      displayRisks.push('Moderate cancer risk');
      primaryConcerns.push('Regular cancer screenings');
      relevantMarkers.push({
        name: 'BRCA1',
        value: 'Moderate variant',
        score: brca1Score
      });
    }
  }

  // ========== ATHLETIC PERFORMANCE ==========
  if (prioritizeSports || (lifestyle === 'Active' && exerciseFrequency === 'Regularly')) {
    const actn3Score = dnaReport.markers.ACTN3.score;
    
    if (actn3Score >= 80) {
      geneticStrengths.push('Excellent athletic performance genes');
      geneticStrengths.push('High power and strength potential');
      relevantMarkers.push({
        name: 'ACTN3',
        value: 'R/R genotype - Elite power',
        score: actn3Score
      });
    }

    // Injury susceptibility
    const col1a1Score = dnaReport.markers.COL1A1.score;
    if (col1a1Score <= 35) {
      geneticStrengths.push('Low injury susceptibility');
    }

    // Recovery rate
    const il6Score = dnaReport.markers.IL6.score;
    if (il6Score >= 55 && il6Score <= 65) {
      displayRisks.push('Moderate recovery rate');
      primaryConcerns.push('Adequate rest between workouts');
      relevantMarkers.push({
        name: 'IL6',
        value: 'Moderate inflammation response',
        score: il6Score
      });
    }
  }

  // ========== COGNITIVE & BEHAVIORAL ==========
  if (prioritizeAuto) {
    const comtScore = dnaReport.markers.COMT.score;
    const drd4Score = dnaReport.markers.DRD4.score;
    
    if (comtScore >= 70) {
      geneticStrengths.push('Good cognitive function');
      geneticStrengths.push('Resilient stress response');
    }

    if (drd4Score >= 50 && drd4Score <= 60) {
      relevantMarkers.push({
        name: 'DRD4',
        value: 'Moderate risk-taking tendency',
        score: drd4Score
      });
    }
  }

  // ========== LONGEVITY ==========
  if (prioritizeLife || age >= 50) {
    const foxo3Score = dnaReport.markers.FOXO3.score;
    
    if (foxo3Score >= 75) {
      geneticStrengths.push('Extended lifespan genes');
      geneticStrengths.push('Healthy aging potential');
      relevantMarkers.push({
        name: 'FOXO3',
        value: 'Longevity variant',
        score: foxo3Score
      });
    }
  }

  // Limit to top 2-3 display risks for clarity
  const topRisks = displayRisks.slice(0, 3);
  
  // If no risks found, add a generic positive message
  if (topRisks.length === 0 && displayRisks.length === 0) {
    geneticStrengths.push('Overall favorable genetic profile');
  }

  return {
    displayRisks: topRisks,
    primaryConcerns: primaryConcerns.slice(0, 3),
    geneticStrengths: geneticStrengths.slice(0, 3),
    relevantMarkers: relevantMarkers.slice(0, 4)
  };
}

/**
 * Calculate DNA risk score (0-100)
 * Based on insurance types selected, average relevant marker scores
 */
export function calculateDNARiskScore(
  dnaReport: DNAReport,
  selectedInsuranceTypes: InsuranceType[]
): number {
  const scores: number[] = [];

  // Health/Life insurance - cardiovascular, diabetes, cancer markers
  if (selectedInsuranceTypes.includes('Health') || selectedInsuranceTypes.includes('Life')) {
    scores.push(dnaReport.markers.APOE.score);
    scores.push(dnaReport.markers.LDLR.score);
    scores.push(dnaReport.markers.TCF7L2.score);
    scores.push(dnaReport.markers.BRCA1.score);
  }

  // Sports insurance - athletic, injury, recovery markers
  if (selectedInsuranceTypes.includes('Sports')) {
    // Lower scores are better for injury susceptibility, so invert
    scores.push(100 - dnaReport.markers.COL1A1.score);
    scores.push(dnaReport.markers.IL6.score);
  }

  // Auto insurance - cognitive and behavioral markers
  if (selectedInsuranceTypes.includes('Auto')) {
    // Lower cognitive function score means higher risk, so invert
    scores.push(100 - dnaReport.markers.COMT.score);
    scores.push(dnaReport.markers.DRD4.score);
  }

  // Travel insurance - general health markers
  if (selectedInsuranceTypes.includes('Travel')) {
    scores.push(dnaReport.markers.APOE.score);
    scores.push(dnaReport.markers.BRCA1.score);
  }

  // If no specific markers selected, use general health markers
  if (scores.length === 0) {
    scores.push(dnaReport.markers.APOE.score);
    scores.push(dnaReport.markers.TCF7L2.score);
    scores.push(dnaReport.markers.BRCA1.score);
  }

  // Calculate average
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  return Math.round(avgScore);
}
