# APEX — Autonomous AI Insurance Advisor

**One DNA Test. Five Personalized Insurance Plans. Autonomous Agent Analysis.**

## Overview

APEX is a **client-side autonomous AI agent system** that runs entirely in your browser. It analyzes user profiles, lifestyle data, financial information, assets, and DNA results to generate personalized insurance recommendations across five categories:

- **Health Insurance**
- **Auto Insurance**
- **Travel Insurance**
- **Life Insurance**
- **Sports Insurance**

## Architecture

**Pure Client-Side React Application** - No backend server required!

### Agent System
- **APEX Agent**: Autonomous decision-making agent with full context (runs in browser)
- **Risk Calculation Engine**: Real-time risk scoring 0-100 for all insurance types
- **Plan Recommendation Engine**: Generates personalized insurance plans with pricing
- **Bundle Optimizer**: Calculates optimal insurance bundles with savings

### JSON I/O Format

**Input:**
```json
{
  "personalInfo": { "age": 32, "gender": "M", "occupation": "Software Engineer" },
  "medicalHistory": { "conditions": [], "medications": [] },
  "lifestyle": { "exercise": "3x/week", "smoking": false },
  "assets": { "vehicles": [{ "type": "car", "value": 25000 }] },
  "financials": { "income": 120000, "dependents": 2 }
}
```

**Output:**
```json
{
  "riskProfile": {
    "health": { "score": 28, "insights": ["Low cardiovascular risk", "Good exercise habits"] },
    "auto": { "score": 45, "insights": ["Moderate commute risk"] },
    "travel": { "score": 22, "insights": ["Infrequent international travel"] },
    "life": { "score": 35, "insights": ["Young dependents require coverage"] },
    "sports": { "score": 18, "insights": ["Recreational activity only"] }
  },
  "recommendations": {
    "health": { "planName": "Standard Plus", "price": "$129/mo", "coverage": "$500k" },
    "auto": { "planName": "Comprehensive", "price": "$89/mo", "coverage": "Full" },
    "travel": { "planName": "Annual", "price": "$199/yr", "coverage": "Worldwide" },
    "life": { "planName": "Term 20yr", "price": "$49/mo", "coverage": "$1M" },
    "sports": { "planName": "Amateur", "price": "$19/mo", "coverage": "Injury" },
    "bundle": { "bestCombination": ["health","auto","life"], "discount": "30%" }
  },
  "confidence": "94%",
  "nextActions": [
    "Schedule annual health screening",
    "Install telematics device for auto discount",
    "Review beneficiaries for life insurance"
  ]
}
```

## Quick Start

### Installation
```bash
npm install
```

### Environment Variables
Create `.env` file:
```
OPENAI_API_KEY=your_key_here
PORT=3000
VITE_API_URL=http://localhost:3000
```

### Development
```bash
# Start server (port 3000)
npm run server

# Start client (port 5173)
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure
```
apex-insurance-ai/
├── server/
│   ├── agents/
│   │   ├── apexAgent.ts           # Main autonomous agent
│   │   ├── dnaAgent.ts            # DNA analysis
│   │   ├── cognitiveAgent.ts      # Risk assessment
│   │   ├── quantumAgent.ts        # Predictions
│   │   └── orchestrator.ts        # Agent coordination
│   ├── routes/
│   │   ├── analyze.ts             # POST /api/analyze
│   │   ├── recommend.ts           # POST /api/recommend
│   │   └── bundle.ts              # POST /api/bundle
│   ├── data/
│   │   └── sampleProfiles.ts      # Test data
│   └── index.ts                   # Express server
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProfileForm.tsx    # User input
│   │   │   ├── AgentStatus.tsx    # Agent processing
│   │   │   └── Results.tsx        # Recommendations
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   └── AnalysisPage.tsx
│   │   ├── services/
│   │   │   └── api.ts             # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Agent Capabilities

The APEX Agent is autonomous and:
- **Prioritizes** which risks need immediate attention
- **Assesses** complex multi-factor scenarios
- **Recommends** optimal coverage and bundles
- **Explains** each decision with clear insights
- **Suggests** actionable next steps

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **AI**: OpenAI GPT-4 (with local fallback mocks)
- **Styling**: Pure CSS (dark theme)

## License
MIT

---
Built with ❤️ by the Apex team
