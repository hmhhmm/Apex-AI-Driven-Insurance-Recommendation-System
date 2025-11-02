import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'
import Spline from '@splinetool/react-spline'
import ParticleBackground from '../../components/landing/ParticleBackground'

type Gender = 'male' | 'female' | null

export default function AvatarSelection() {
  const navigate = useNavigate()
  const { setSelectedGender: saveGender, hasCompletedDNATest, saveQuickAssessment } = useOnboardingStore()
  const [selectedGender, setSelectedGender] = useState<Gender>(null)
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    zipCode: '',
    insuranceTypes: [] as string[],
    annualIncome: '',
    occupation: '',
    exerciseFrequency: '',
    smokes: '',
    lifeCoverage: '',
    hasCar: '',
    hasCarInsurance: '',
    carPlate: '',
    carModel: '',
    travelFrequency: ''
  })

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleInsuranceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceTypes: prev.insuranceTypes.includes(type)
        ? prev.insuranceTypes.filter(t => t !== type)
        : [...prev.insuranceTypes, type]
    }))
  }

  const handleNext = () => {
    // Move to next question or navigate
    if (currentQuestion < getTotalQuestions() - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Save questionnaire data to store
      saveQuickAssessment({
        age: formData.dateOfBirth ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear() : 0,
        gender: selectedGender || '',
        occupation: formData.occupation,
        healthGoals: formData.insuranceTypes,
        existingConditions: formData.smokes === 'yes' ? ['Smoker'] : [],
        familyHistory: []
      })
      
      // If user already has DNA test, skip account creation and DNA test steps
      if (hasCompletedDNATest) {
        navigate('/purchase') // Go directly to view new personalized plans
      } else {
        navigate('/onboarding/account') // New user flow
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const questionOrder = useMemo(() => {
    const order: string[] = ['personal']
    if (formData.insuranceTypes.includes('Health')) order.push('health')
    if (formData.insuranceTypes.includes('Life')) order.push('life')
    if (formData.insuranceTypes.includes('Car')) order.push('car')
    if (formData.insuranceTypes.includes('Travel')) order.push('travel')
    return order
  }, [formData.insuranceTypes])

  const getTotalQuestions = () => questionOrder.length

  const canProceedFromPersonalInfo = () => {
    return formData.name && 
           formData.dateOfBirth && 
           formData.zipCode && 
           formData.insuranceTypes.length > 0 && 
           formData.annualIncome && 
           formData.occupation
  }

  const canProceedFromHealth = () => {
    return formData.exerciseFrequency && formData.smokes
  }

  const canProceedFromLife = () => {
    return formData.lifeCoverage !== ''
  }

  const canProceedFromCar = () => {
    if (formData.hasCar === 'no') return true
    if (formData.hasCar === 'yes') {
      // Must have insurance status selected
      if (!formData.hasCarInsurance) return false
      
      // If they have insurance, they can proceed
      if (formData.hasCarInsurance === 'yes') return true
      
      // If they don't have insurance, need car plate and model
      if (formData.hasCarInsurance === 'no') {
        return formData.carPlate && formData.carModel
      }
    }
    return false
  }

  const canProceedFromTravel = () => {
    return formData.travelFrequency !== ''
  }

  const canProceed = () => {
    const key = questionOrder[currentQuestion]
    switch (key) {
      case 'personal':
        return canProceedFromPersonalInfo()
      case 'health':
        return canProceedFromHealth()
      case 'life':
        return canProceedFromLife()
      case 'car':
        return canProceedFromCar()
      case 'travel':
        return canProceedFromTravel()
      default:
        return false
    }
  }

  // Minimal watermark removal - run once on mount, no observers or polling
  useEffect(() => {
    const removeWatermark = () => {
      const selectors = ['#logo', '[id*="logo"]', 'a[href*="spline"]']
      document.querySelectorAll(selectors.join(',')).forEach(el => {
        try { el.remove() } catch (e) { /* ignore */ }
      })
    }
    // Single removal on mount - no repeated attempts
    removeWatermark()
  }, [])

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender)
    if (gender) {
      saveGender(gender)
    }
    // Show questions after avatar animation
    setTimeout(() => {
      setShowQuestions(true)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden overflow-y-auto py-12">
      <style dangerouslySetInnerHTML={{
        __html: `
          #logo,
          [id*="logo"],
          a[href*="spline"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `
      }} />

      {/* Landing-style Background (particles + animated orbs + grid) */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />

        {/* Animated gradient orbs - static positions, no animation */}
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-1/2 h-1/2 bg-cyan-500/15 rounded-full blur-[100px] opacity-20" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Particle system removed to eliminate animation-related blinking */}      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!selectedGender ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight">
                <span className="text-white font-light">Let's Get to </span>
                <span className="text-white font-normal">Know You</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-16">
                Select your avatar to begin
              </p>

              <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Female Avatar */}
                <motion.button
                  onClick={() => handleGenderSelect('female')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="flex flex-col items-center">
                    {/* Female 3D Avatar - Wrapper with extra height */}
                    <div className="w-64 mb-6 relative overflow-hidden" style={{ height: '280px' }}>
                      {/* Inner container that clips bottom 20% */}
                      <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                          height: '320px',
                          clipPath: 'inset(0 0 20% 0)'
                        }}
                      >
                        <Spline
                          scene="https://prod.spline.design/xWHBgK2bOBQRvsmd/scene.splinecode"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                   
                    <h3 className="text-2xl font-bold text-white mb-2">Female</h3>
                    <p className="text-gray-400">Select this avatar</p>
                  </div>
                </motion.button>

                {/* Male Avatar */}
                <motion.button
                  onClick={() => handleGenderSelect('male')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="flex flex-col items-center">
                    {/* Male 3D Avatar - Scaled to match female */}
                    <div className="w-64 mb-6 relative overflow-hidden" style={{ height: '280px' }}>
                      {/* Inner container - scaled to match female size */}
                      <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                          height: '320px',
                          clipPath: 'inset(0 0 20% 0)',
                          transform: 'scale(1.1)',
                          transformOrigin: 'center center'
                        }}
                      >
                        <Spline
                          scene="https://prod.spline.design/PuH8zLiZwiK61OXD/scene.splinecode"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                   
                    <h3 className="text-2xl font-bold text-white mb-2">Male</h3>
                    <p className="text-gray-400">Select this avatar</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              {/* Selected Avatar - Centered */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-64 mb-6 mx-auto relative overflow-hidden" style={{ height: '280px' }}>
                    <div className="absolute top-0 left-0 right-0" style={{ height: '320px', clipPath: 'inset(0 0 20% 0)', transform: selectedGender === 'male' ? 'scale(1.1)' : undefined, transformOrigin: 'center center' }}>
                      <Spline
                        scene={selectedGender === 'female' ? 'https://prod.spline.design/xWHBgK2bOBQRvsmd/scene.splinecode' : 'https://prod.spline.design/PuH8zLiZwiK61OXD/scene.splinecode'}
                        className="w-full h-full"
                      />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-950/30 text-green-400 rounded-full border border-green-800/30 mb-8">
                  <span>✓</span>
                  <span>Great choice!</span>
                </div>
              </motion.div>

              {/* Questions Section */}
              <AnimatePresence mode="wait">
                {showQuestions && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className="text-left">
                      {/* Progress Indicator */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Step {currentQuestion + 1} of {getTotalQuestions()}
                          </span>
                          <span className="text-sm text-gray-400">
                            {Math.round(((currentQuestion + 1) / getTotalQuestions()) * 100)}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestion + 1) / getTotalQuestions()) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Question 0: Personal Information */}
                      {currentQuestion === 0 && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                              Personal Information
                            </h2>
                            <p className="text-gray-400">
                              Please provide your details to help us personalize your insurance recommendations
                            </p>
                          </div>

                          {/* Full Name */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => updateFormData('name', e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Date of Birth */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Date of Birth <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Postcode */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Postcode <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.zipCode}
                              onChange={(e) => updateFormData('zipCode', e.target.value)}
                              placeholder="e.g., 50000"
                              maxLength={5}
                              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Type of Insurance */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Type of Insurance Interested <span className="text-red-400">*</span>
                            </label>
                            <p className="text-gray-400 text-sm mb-4">Select all that apply</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {['Health', 'Life', 'Car', 'Travel'].map((type) => (
                                <button
                                  key={type}
                                  onClick={() => toggleInsuranceType(type)}
                                  className={`px-4 py-3 rounded-lg transition-all duration-200 text-left flex items-center justify-between ${
                                    formData.insuranceTypes.includes(type)
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  <span>{type} Insurance</span>
                                  {formData.insuranceTypes.includes(type) && <span>✓</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Annual Income */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Annual Income (RM) <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={formData.annualIncome}
                              onChange={(e) => updateFormData('annualIncome', e.target.value)}
                              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                            >
                              <option value="">Select your income range</option>
                              <option value="0-30000">Below RM 30,000</option>
                              <option value="30000-60000">RM 30,000 - RM 60,000</option>
                              <option value="60000-100000">RM 60,000 - RM 100,000</option>
                              <option value="100000-150000">RM 100,000 - RM 150,000</option>
                              <option value="150000-250000">RM 150,000 - RM 250,000</option>
                              <option value="250000+">Above RM 250,000</option>
                            </select>
                          </div>

                          {/* Occupation */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Occupation <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.occupation}
                              onChange={(e) => updateFormData('occupation', e.target.value)}
                              placeholder="e.g., Software Engineer, Teacher, Business Owner"
                              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Health Assessment */}
                      {formData.insuranceTypes.includes('Health') && currentQuestion === (formData.insuranceTypes.indexOf('Health') < formData.insuranceTypes.indexOf('Life') || !formData.insuranceTypes.includes('Life') ? 1 : formData.insuranceTypes.includes('Life') ? 2 : 1) && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                              🏃 Health Assessment
                            </h2>
                            <p className="text-gray-400">
                              Help us understand your health and lifestyle
                            </p>
                          </div>

                          {/* Exercise Frequency */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              How often do you exercise? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              {['Daily', '3-4 times a week', '1-2 times a week', 'Rarely', 'Never'].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateFormData('exerciseFrequency', option)}
                                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                    formData.exerciseFrequency === option
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Smoking Status */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Do you smoke? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              {['Yes', 'No', 'Occasionally'].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateFormData('smokes', option)}
                                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                    formData.smokes === option
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Life Insurance Assessment */}
                      {questionOrder[currentQuestion] === 'life' && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                              🛡️ Life Insurance Assessment
                            </h2>
                            <p className="text-gray-400">
                              Let's determine the right coverage for you
                            </p>
                          </div>

                          {/* Life Coverage */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              What coverage amount are you looking for? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              {[
                                'RM 100,000 - RM 250,000',
                                'RM 250,000 - RM 500,000',
                                'RM 500,000 - RM 1,000,000',
                                'Above RM 1,000,000',
                                'Not sure'
                              ].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateFormData('lifeCoverage', option)}
                                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                    formData.lifeCoverage === option
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Car Insurance Assessment */}
                      {questionOrder[currentQuestion] === 'car' && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                              🚗 Car Insurance Assessment
                            </h2>
                            <p className="text-gray-400">
                              Tell us about your vehicle
                            </p>
                          </div>

                          {/* Car Ownership */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3">
                              Do you own a car? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              {['Yes', 'No'].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateFormData('hasCar', option.toLowerCase())}
                                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                    formData.hasCar === option.toLowerCase()
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          {formData.hasCar === 'yes' && (
                            <>
                              {/* Current Insurance Status */}
                              <div className="card p-6">
                                <label className="block text-white font-semibold mb-3">
                                  Do you currently have car insurance? <span className="text-red-400">*</span>
                                </label>
                                <div className="space-y-2">
                                  {['Yes', 'No'].map((option) => (
                                    <button
                                      key={option}
                                      onClick={() => updateFormData('hasCarInsurance', option.toLowerCase())}
                                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                        formData.hasCarInsurance === option.toLowerCase()
                                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Only ask for car details if they DON'T have car insurance */}
                              {formData.hasCarInsurance === 'no' && (
                                <>
                                  {/* Car Plate */}
                                  <div className="card p-6">
                                    <label className="block text-white font-semibold mb-3">
                                      Car Plate Number <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.carPlate}
                                      onChange={(e) => updateFormData('carPlate', e.target.value.toUpperCase())}
                                      placeholder="e.g., ABC 1234"
                                      className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                  </div>

                                  {/* Car Model */}
                                  <div className="card p-6">
                                    <label className="block text-white font-semibold mb-3">
                                      Car Model <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={formData.carModel}
                                      onChange={(e) => updateFormData('carModel', e.target.value)}
                                      placeholder="e.g., Honda Civic 2020"
                                      className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* Travel Insurance Assessment */}
                      {questionOrder[currentQuestion] === 'travel' && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                              ✈️ Travel Insurance Assessment
                            </h2>
                            <p className="text-gray-400">
                              How often do you travel?
                            </p>
                          </div>

                          {/* Travel Frequency */}
                          <div className="card p-6">
                            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                              ✈️ How many times do you travel internationally per year? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              {[
                                { label: '0-1 times per year', value: '0-1' },
                                { label: '2 times per year', value: '2' },
                                { label: '3-5 times per year', value: '3-5' },
                                { label: '6+ times per year', value: '6+' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => updateFormData('travelFrequency', option.value)}
                                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                    formData.travelFrequency === option.value
                                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Recommendation Message for Frequent Travelers */}
                          {(formData.travelFrequency === '3-5' || formData.travelFrequency === '6+') && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="card p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/30"
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">💡</div>
                                <div>
                                  <h4 className="text-white font-semibold mb-2">Frequent Traveler Recommendation</h4>
                                  <p className="text-gray-300 text-sm">
                                    Based on your travel frequency, we highly recommend adding travel insurance to your plan. 
                                    Our recommendations will include comprehensive travel coverage options tailored to frequent travelers.
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 mt-8">
                        {currentQuestion > 0 && (
                          <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all duration-200"
                          >
                            ← Back
                          </button>
                        )}
                        <button
                          onClick={handleNext}
                          disabled={!canProceed()}
                          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {currentQuestion === getTotalQuestions() - 1 ? 'Complete Assessment →' : 'Continue →'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}