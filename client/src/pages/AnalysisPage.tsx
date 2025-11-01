import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeProfile } from '../services/api'
import AgentStatus from '../components/AgentStatus'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'complete' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const inputData = sessionStorage.getItem('analysisInput')
        if (!inputData) {
          navigate('/onboarding')
          return
        }

        const { userProfile, dnaData } = JSON.parse(inputData)
        const results = await analyzeProfile(userProfile, dnaData)
        
        // Store results and navigate to recommendations
        sessionStorage.setItem('analysisResults', JSON.stringify(results))
        setTimeout(() => {
          navigate('/recommendations')
        }, 1500)
      } catch (err: any) {
        console.error('Analysis error:', err)
        setError(err.message || 'Analysis failed')
        setStatus('error')
      }
    }

    runAnalysis()
  }, [navigate])

  if (status === 'error') {
    return (
      <div className="panel">
        <h2>Analysis Error</h2>
        <p className="error-text">{error}</p>
        <button onClick={() => navigate('/onboarding')} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return <AgentStatus />
}
