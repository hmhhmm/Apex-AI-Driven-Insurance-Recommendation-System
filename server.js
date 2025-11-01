import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const API_KEY = 'AIzaSyCDCAldGNNXk8DS5ydJlcQmgdD87FGdiGQ';
const genAI = new GoogleGenerativeAI(API_KEY);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'APEX AI Backend is running' });
});

// Gemini AI endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, config = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        ...config
      },
    });

    console.log('🤖 Processing Gemini request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini response generated');
    res.json({ text, success: true });

  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      message: error.message,
      success: false
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 APEX AI Backend running on http://localhost:${PORT}`);
  console.log(`✅ Gemini API configured and ready`);
});
