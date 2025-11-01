import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'

export default function OnboardingPage() {
  const navigate = useNavigate()

  const handleAnalyze = async (userProfile: any, dnaData: any) => {
    // Store data in sessionStorage to pass to analysis page
    sessionStorage.setItem('analysisInput', JSON.stringify({ userProfile, dnaData }))
    navigate('/analysis')
  }

  return (
    <div className="onboarding-page">
      <ProfileForm onAnalyze={handleAnalyze} />
    </div>
  )
}
