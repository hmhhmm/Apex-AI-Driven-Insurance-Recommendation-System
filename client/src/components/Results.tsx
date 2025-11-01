import React from 'react'
import type { TripleAIResult } from '../services/agents/tripleAI'

interface Props {
  data: TripleAIResult
  onPurchase?: () => void
  onRetry?: () => void
}

export default function Results({ data, onPurchase, onRetry }: Props) {
  const { riskProfile, recommendations, bundle, quantumPredictions } = data

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'var(--danger)'
    if (score >= 50) return 'var(--warning)'
    return 'var(--success)'
  }

  return (
    <div className="results-container">
      <div className="panel">
        <div className="results-header">
          <h2>✨ Triple AI Analysis Complete</h2>
          <p style={{ color: '#888', fontSize: '0.9em' }}>
            Analyzed by DNA Analysis Agent + Cognitive Risk Agent + Quantum Prediction Agent
          </p>
        </div>

        <section className="risk-profile">
          <h3>🎯 Unified Risk Profile</h3>
          <div className="risk-grid">
            {Object.entries(riskProfile).map(([type, score]: [string, number]) => (
              <div key={type} className="risk-card">
                <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <div 
                  className="risk-score" 
                  style={{ 
                    color: getRiskColor(score),
                    fontSize: '2em',
                    fontWeight: 'bold'
                  }}
                >
                  {score}/100
                </div>
                <div className="risk-label">
                  {score >= 70 ? '🔴 High Risk' : score >= 50 ? '🟡 Moderate' : '🟢 Low Risk'}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="recommendations">
          <h3>📋 Personalized Insurance Recommendations</h3>
          <div className="plans-grid">
            {recommendations.map((plan, idx) => (
              <div key={idx} className="plan-card">
                <div className="plan-header">
                  <h4>{plan.type} Insurance</h4>
                  <span className="plan-tier">{plan.tier}</span>
                </div>
                <div className="plan-price">${plan.monthlyPremium}/month</div>
                <div className="plan-coverage">{plan.coverage}</div>
                <div className="plan-reason">{plan.reason}</div>
                {plan.savings && (
                  <div className="plan-savings">💰 {plan.savings}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bundle">
          <h3>🎁 Optimized Bundle Package</h3>
          <div className="bundle-card">
            <div className="bundle-combo">
              {bundle.selected.map((type: string) => (
                <span key={type} className="bundle-item">{type}</span>
              ))}
            </div>
            <div className="bundle-pricing">
              <div className="bundle-total">
                Total: <strong>${bundle.totalMonthly}/month</strong>
              </div>
              <div className="bundle-savings" style={{ color: 'var(--success)' }}>
                🎉 {bundle.discount}% discount - Save ${bundle.savings}/month
              </div>
            </div>
          </div>
        </section>

        <section className="quantum-insights">
          <h3>⚛️  Future Timeline Predictions</h3>
          <div className="timeline-preview">
            <p><strong>Immediate Actions:</strong></p>
            <ul>
              {quantumPredictions.optimizedStrategy.immediate.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
            <p style={{ marginTop: '1em' }}><strong>Year 1 Strategy:</strong></p>
            <ul>
              {quantumPredictions.optimizedStrategy.year1.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="action-buttons">
          {onPurchase && (
            <button onClick={onPurchase} className="btn-primary">
              Proceed to Purchase
            </button>
          )}
          {onRetry && (
            <button onClick={onRetry} className="btn-secondary">
              Run New Analysis
            </button>
          )}
        </section>
      </div>
    </div>
  )
}
