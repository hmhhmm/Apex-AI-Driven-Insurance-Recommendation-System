import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCDCAldGNNXk8DS5ydJlcQmgdD87FGdiGQ';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const { prompt, config } = await request.json();
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      ...config
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
