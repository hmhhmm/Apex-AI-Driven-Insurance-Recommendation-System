import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-panel panel">
        <h2>One DNA Test. Five Personalized Insurance Plans.</h2>
        <p className="hero-text">
          APEX uses autonomous AI agents to analyze your DNA, lifestyle, and financial profile 
          to recommend perfectly tailored insurance across Health, Auto, Travel, Life, and Sports.
        </p>
        
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">94%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">30%</div>
            <div className="stat-label">Average Bundle Savings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5</div>
            <div className="stat-label">Insurance Types Covered</div>
          </div>
        </div>

        <Link to="/onboarding" className="btn-primary btn-large">
          Start Your Analysis
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-card panel">
          <h3>🧬 DNA-Driven Insights</h3>
          <p>Genetic risk analysis for health, sports injury susceptibility, and longevity predictions.</p>
        </div>
        <div className="feature-card panel">
          <h3>🤖 Autonomous AI Agents</h3>
          <p>Three specialized agents work in parallel to assess risk and optimize recommendations.</p>
        </div>
        <div className="feature-card panel">
          <h3>📊 Unified Risk Profile</h3>
          <p>Single comprehensive analysis across all five insurance categories.</p>
        </div>
        <div className="feature-card panel">
          <h3>💰 Bundle Optimization</h3>
          <p>Automatic savings calculation when combining multiple insurance plans.</p>
        </div>
      </div>
    </div>
  )
}
