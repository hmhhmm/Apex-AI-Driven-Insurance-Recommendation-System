import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCDCAldGNNXk8DS5ydJlcQmgdD87FGdiGQ';

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
      
      // Find a model that supports generateContent
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
    priceAdjustment: number; // Percentage adjustment based on risk profile
  }>;
  overallAnalysis: string;
  riskFactors: string[];
  savingsTips: string[];
}> {
  try {
    const modelName = await getAvailableModel();
    
    // Create a very simple prompt to avoid safety filters
    const prompt = `You are an insurance advisor. Analyze this customer and recommend insurance plans.

Customer Profile:
- Age: ${userProfile.age} years
- Lifestyle: ${userProfile.lifestyle}
- Exercise: ${userProfile.exerciseFrequency}
- Budget: RM${userProfile.budget} per month

Available Plans (first 6):
${availablePlans.slice(0, 6).map((plan, idx) => 
  `${idx + 1}. ${plan.name} - ${plan.type} insurance - RM${plan.basePrice}/month`
).join('\n')}

Task: Select the best 3 plans and provide analysis.

Return your answer as JSON:
{
  "topRecommendations": [
    {"planId": "${availablePlans[0]?.id || 'plan1'}", "matchScore": 85, "reasoning": "Good fit for lifestyle", "priceAdjustment": -5}
  ],
  "overallAnalysis": "Customer has moderate risk profile",
  "riskFactors": ["Age-related considerations"],
  "savingsTips": ["Maintain healthy lifestyle"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
            topP: 0.95,
            topK: 40
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', response.status, errorText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Full API Response:', data);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Check for blocked content
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      console.warn('⚠️ Content was blocked by safety filters');
      console.log('Safety ratings:', data.candidates?.[0]?.safetyRatings);
    }
    
    console.log('🤖 AI Analysis Response:', text);
    
    // If empty response, return fallback
    if (!text || text.trim().length === 0) {
      console.warn('⚠️ Empty AI response, using fallback');
      throw new Error('Empty response from AI');
    }
    
    // Try to extract and parse JSON
    try {
      // Remove markdown code blocks if present
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Extract JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed AI recommendations:', parsed);
        
        return {
          topRecommendations: parsed.topRecommendations || [],
          overallAnalysis: parsed.overallAnalysis || 'AI analysis completed.',
          riskFactors: parsed.riskFactors || [],
          savingsTips: parsed.savingsTips || []
        };
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError, '\nOriginal text:', text);
    }
    
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('AI Plan Analysis Error:', error);
    // Fallback to empty recommendations - let algorithmic system handle it
    return {
      topRecommendations: [],
      overallAnalysis: 'Using standard recommendation algorithm.',
      riskFactors: [],
      savingsTips: []
    };
  }
}

export function generateWelcomeMessage(context: string): string {
  return "Hi! 👋 I'm your APEX AI Assistant. How can I help you today?";
}
