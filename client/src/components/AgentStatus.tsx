import React, { useEffect, useState } from 'react'

export default function AgentStatus() {
  const [step, setStep] = useState(0)
  
  const steps = [
    '🧬 DNA Analysis Agent: Scanning genetic markers...',
    '🧠 Cognitive Risk Agent: Assessing behavioral patterns...',
    '⚛️  Quantum Prediction Agent: Simulating timelines...',
    '✨ Synthesizing triple AI results...',
    '📊 Generating personalized recommendations...',
    '💰 Optimizing bundle savings...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length)
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="panel agent-status">
      <h2>Triple AI Analysis in Progress</h2>
      <p style={{ fontSize: '0.9em', color: '#888', marginBottom: '1.5em' }}>
        Running DNA, Cognitive, and Quantum agents in parallel...
      </p>
      <div className="status-container">
        {steps.map((text, i) => (
          <div key={i} className={`status-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span className="dot"></span>
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div className="loader"></div>
    </div>
  )
}
