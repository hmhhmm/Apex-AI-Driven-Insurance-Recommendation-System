import { GoogleGenerativeAI } from '@google/generative-ai';

// ✅ Get API_KEY from environment variable
const API_KEY = (import.meta as any).env?.API_KEY || 'AIzaSyCDCAldGNNXk8DS5ydJlcQmgdD87FGdiGQ';

const SYSTEM_PROMPT = `You are APEX AI Assistant, an expert insurance advisor.

Your Role:
- Be friendly, professional, and empathetic
- Explain insurance concepts in simple terms
- Keep responses concise (2-3 paragraphs max)
`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Cache the model name so we don't have to fetch it every time
let cachedModelName: string | null = null;

async function getAvailableModel(): Promise<string> {
  if (cachedModelName) return cachedModelName;
  
  try {
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    
    if (listResponse.ok) {
      const models = await listResponse.json();
      console.log('🔍 Available models:', models);
      
      const suitableModel = models.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (suitableModel) {
        cachedModelName = suitableModel.name;
        console.log('✅ Using model:', cachedModelName);
        return cachedModelName;
      }
    }
  } catch (error) {
    console.error('Error fetching models:', error);
  }
  
  // Fallback to a known model
  return 'models/gemini-2.5-flash';
}

export async function generateAIResponse(
  userMessage: string,
  context: any = {},
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    const modelName = await getAvailableModel();
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', response.status, errorText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    
    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our support team for immediate assistance. 😊";
  }
}

export async function analyzeAndRecommendPlans(
  userProfile: {
    age: number;
    lifestyle: string;
    dnaRisks: string[];
    geneticStrengths: string[];
    familyHistory: string[];
    exerciseFrequency: string;
    budget: number;
    selectedTypes: string[];
  },
  availablePlans: Array<{
    id: string;
    name: string;
    provider: string;
    type: string;
    coverage: string;
    basePrice: number;
    features: string[];
  }>
): Promise<{
  topRecommendations: Array<{
    planId: string;
    matchScore: number;
    reasoning: string;
    priceAdjustment: number;
  }>;
  overallAnalysis: string;
  riskFactors: string[];
  savingsTips: string[];
}> {
  console.log('🤖 Starting AI-powered analysis...');
  
  // Try AI first, but use intelligent fallback if it fails
  try {
    const modelName = await getAvailableModel();
    
    // Simplified prompt to avoid safety filters
    const prompt = `Analyze customer and recommend plans.

Age: ${userProfile.age}, Lifestyle: ${userProfile.lifestyle}
Plans: ${availablePlans.slice(0, 3).map(p => p.name).join(', ')}

Return JSON only:
{"topRecommendations":[{"planId":"${availablePlans[0]?.id}","matchScore":90,"reasoning":"Good match","priceAdjustment":0}]}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 512
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text && text.trim()) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ AI analysis successful');
          return {
            topRecommendations: parsed.topRecommendations || [],
            overallAnalysis: parsed.overallAnalysis || 'AI-powered analysis',
            riskFactors: parsed.riskFactors || [],
            savingsTips: parsed.savingsTips || []
          };
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ AI analysis failed, using intelligent fallback:', error);
  }

  // INTELLIGENT FALLBACK - Always works
  console.log('🎯 Using intelligent matching algorithm...');
  return generateIntelligentRecommendations(userProfile, availablePlans);
}

function generateIntelligentRecommendations(
  userProfile: {
    age: number;
    lifestyle: string;
    dnaRisks: string[];
    geneticStrengths: string[];
    familyHistory: string[];
    exerciseFrequency: string;
    budget: number;
    selectedTypes: string[];
  },
  availablePlans: Array<{
    id: string;
    name: string;
    provider: string;
    type: string;
    coverage: string;
    basePrice: number;
    features: string[];
  }>
) {
  // 1. Calculate user risk score
  const riskScore = calculateUserRisk(userProfile);
  
  // 2. Filter plans by selected types
  const relevantPlans = availablePlans.filter(plan => 
    userProfile.selectedTypes.includes(plan.type)
  );
  
  // 3. Score each plan
  const scoredPlans = relevantPlans.map(plan => {
    let matchScore = 70; // Base score
    
    // Age appropriateness
    if (userProfile.age < 35 && plan.type === 'Health') matchScore += 10;
    if (userProfile.age < 35 && plan.type === 'Sports') matchScore += 8;
    if (userProfile.age > 50 && plan.type === 'Life') matchScore += 12;
    
    // Lifestyle match
    if (userProfile.lifestyle === 'Active' && plan.type === 'Sports') matchScore += 15;
    if (userProfile.lifestyle === 'Active' && plan.type === 'Travel') matchScore += 10;
    if (userProfile.lifestyle === 'Sedentary' && plan.type === 'Health') matchScore += 8;
    
    // Budget fit
    const affordability = userProfile.budget / plan.basePrice;
    if (affordability > 2) matchScore += 5;
    if (affordability < 0.8) matchScore -= 10;
    
    // Price adjustment based on risk
    let priceAdjustment = 0;
    if (riskScore < 40) priceAdjustment = -10; // 10% discount for low risk
    else if (riskScore > 65) priceAdjustment = 8; // 8% increase for high risk
    
    // Generate reasoning
    const reasoning = generateReasoning(plan, userProfile, matchScore);
    
    return {
      planId: plan.id,
      matchScore: Math.min(matchScore, 99),
      reasoning,
      priceAdjustment
    };
  });
  
  // 4. Sort by match score
  scoredPlans.sort((a, b) => b.matchScore - a.matchScore);
  
  // 5. Generate analysis
  const overallAnalysis = generateOverallAnalysis(userProfile, riskScore);
  const riskFactors = generateRiskFactors(userProfile);
  const savingsTips = generateSavingsTips(userProfile, riskScore);
  
  return {
    topRecommendations: scoredPlans.slice(0, 4),
    overallAnalysis,
    riskFactors,
    savingsTips
  };
}

function calculateUserRisk(userProfile: any): number {
  let risk = 0;
  
  // Age factor
  if (userProfile.age < 30) risk += 20;
  else if (userProfile.age < 45) risk += 35;
  else if (userProfile.age < 60) risk += 55;
  else risk += 70;
  
  // Lifestyle factor
  if (userProfile.lifestyle === 'Sedentary') risk += 20;
  else if (userProfile.lifestyle === 'Moderate') risk += 10;
  else risk += 5;
  
  // Exercise factor
  if (userProfile.exerciseFrequency === 'Never' || userProfile.exerciseFrequency === 'Rarely') {
    risk += 15;
  }
  
  // DNA risks
  risk += userProfile.dnaRisks.length * 5;
  
  // Family history
  risk += userProfile.familyHistory.length * 8;
  
  return Math.min(risk, 100);
}

function generateReasoning(plan: any, userProfile: any, matchScore: number): string {
  const reasons = [];
  
  if (matchScore > 85) {
    reasons.push('Excellent match for your profile');
  } else if (matchScore > 75) {
    reasons.push('Strong fit for your needs');
  } else {
    reasons.push('Good coverage option');
  }
  
  if (userProfile.age < 35 && plan.type === 'Health') {
    reasons.push('great value at your age');
  }
  
  if (userProfile.lifestyle === 'Active' && (plan.type === 'Sports' || plan.type === 'Travel')) {
    reasons.push('perfect for your active lifestyle');
  }
  
  if (plan.basePrice < userProfile.budget * 0.3) {
    reasons.push('highly affordable');
  }
  
  return reasons.join(', ');
}

function generateOverallAnalysis(userProfile: any, riskScore: number): string {
  if (riskScore < 40) {
    return `Based on your ${userProfile.age}-year profile and ${userProfile.lifestyle.toLowerCase()} lifestyle, you have a favorable risk profile. We've identified plans that maximize your savings while providing comprehensive coverage.`;
  } else if (riskScore < 65) {
    return `Your profile shows moderate risk factors. We've selected plans that balance comprehensive coverage with preventive care benefits, tailored to your ${userProfile.lifestyle.toLowerCase()} lifestyle.`;
  } else {
    return `Given your risk profile, we recommend comprehensive coverage with a focus on preventive care. These plans offer extensive protection while remaining competitively priced.`;
  }
}

function generateRiskFactors(userProfile: any): string[] {
  const factors: string[] = [];
  
  if (userProfile.age > 45) {
    factors.push('Age-related health considerations');
  }
  
  if (userProfile.lifestyle === 'Sedentary') {
    factors.push('Sedentary lifestyle impacts');
  }
  
  if (userProfile.exerciseFrequency === 'Never' || userProfile.exerciseFrequency === 'Rarely') {
    factors.push('Limited physical activity');
  }
  
  if (userProfile.dnaRisks.length > 0) {
    factors.push(`Genetic predispositions: ${userProfile.dnaRisks.slice(0, 2).join(', ')}`);
  }
  
  if (userProfile.familyHistory.length > 0) {
    factors.push('Family medical history considerations');
  }
  
  return factors.length > 0 ? factors : ['Standard risk profile'];
}

function generateSavingsTips(userProfile: any, riskScore: number): string[] {
  const tips: string[] = [];
  
  if (riskScore > 50) {
    tips.push('Regular health screenings can help reduce long-term insurance costs');
  }
  
  if (userProfile.lifestyle !== 'Active') {
    tips.push('Increasing physical activity can lead to better rates and overall health');
  }
  
  if (userProfile.exerciseFrequency === 'Never' || userProfile.exerciseFrequency === 'Rarely') {
    tips.push('Exercise 3-4 times per week to potentially qualify for wellness discounts');
  }
  
  tips.push('Bundling multiple insurance types can save 10-15%');
  tips.push('Annual payment plans often offer 5-8% savings vs monthly payments');
  
  return tips;
}

export function generateWelcomeMessage(context: string): string {
  return "Hi! 👋 I'm your APEX AI Assistant. How can I help you today?";
}