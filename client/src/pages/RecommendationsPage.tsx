import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Results from '../components/Results'
import type { TripleAIResult } from '../services/agents/tripleAI'

export default function RecommendationsPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState<TripleAIResult | null>(null)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('analysisResults')
    if (!storedResults) {
      navigate('/onboarding')
      return
    }
    setResults(JSON.parse(storedResults))
  }, [navigate])

  const handleRetry = () => {
    sessionStorage.clear()
    navigate('/onboarding')
  }

  const handlePurchase = () => {
    // In a real app, would navigate to payment/purchase flow
    alert('🎉 Purchase flow coming soon! Your selected plans will be saved to your dashboard.')
    navigate('/dashboard')
  }

  if (!results) return <div className="panel">Loading...</div>

  return (
    <div className="recommendations-page">
      <Results data={results} onPurchase={handlePurchase} onRetry={handleRetry} />
    </div>
  )
}
