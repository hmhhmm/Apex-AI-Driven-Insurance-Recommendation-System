import React, { useState } from 'react'
import type { UserProfile, DNAData } from '../services/api'

const sampleProfile: UserProfile = {
  personal: {
    age: 32,
    gender: 'Male',
    occupation: 'Software Engineer',
    income: 120000
  },
  lifestyle: {
    smoking: false,
    alcohol: 'occasional',
    exercise: 'regular',
    driving: {
      experience: 12,
      violations: 0,
      accidents: 0
    },
    travel: {
      frequency: 'occasional',
      destinations: ['USA', 'Europe', 'Asia']
    }
  },
  health: {
    chronicConditions: [],
    medications: [],
    familyHistory: ['Hypertension (father)']
  },
  assets: {
    vehicles: [{
      type: 'Sedan',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      value: 25000,
      usage: 'daily'
    }],
    property: {
      type: 'Condo',
      value: 350000
    }
  }
}

const sampleDNA: DNAData = {
  markers: {
    health: ['APOE3', 'TCF7L2'],
    sports: ['ACTN3-RX', 'COL1A1'],
    cognitive: ['COMT-Val'],
    behavioral: ['DRD4-4R']
  }
}

interface Props {
  onAnalyze: (profile: any, dna: any) => void
}

export default function ProfileForm({ onAnalyze }: Props) {
  const [useSample, setUseSample] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(sampleProfile, sampleDNA)
  }

  return (
    <div className="panel">
      <h2>User Profile & DNA Data</h2>
      <p>Submit your profile and DNA analysis to get personalized insurance recommendations from the APEX Agent.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Sample Data</h3>
          <label>
            <input
              type="checkbox"
              checked={useSample}
              onChange={(e) => setUseSample(e.target.checked)}
            />
            Use sample profile and DNA data (demo mode)
          </label>
        </div>

        <div className="sample-preview">
          <details>
            <summary>View sample data</summary>
            <pre>{JSON.stringify({ profile: sampleProfile, dna: sampleDNA }, null, 2)}</pre>
          </details>
        </div>

        <button type="submit" className="btn-primary">
          Run APEX Analysis
        </button>
      </form>
    </div>
  )
}
