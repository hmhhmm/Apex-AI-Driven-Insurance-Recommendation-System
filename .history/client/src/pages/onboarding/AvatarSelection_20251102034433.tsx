import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'
import Spline from '@splinetool/react-spline'

type Gender = 'male' | 'female' | null

export default function AvatarSelection() {
  const navigate = useNavigate()
  const { setSelectedGender: saveGender } = useOnboardingStore()
  const [selectedGender, setSelectedGender] = useState<Gender>(null)
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [points, setPoints] = useState(0)
  
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
    setPoints(prev => prev + 10)
    if (currentQuestion < getTotalQuestions() - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleContinue()
    }
  }

  const getTotalQuestions = () => {
    let total = 1 // Personal info page
    if (formData.insuranceTypes.includes('Health')) total += 2
    if (formData.insuranceTypes.includes('Life')) total += 1
    if (formData.insuranceTypes.includes('Car')) {
      total += 1
      if (formData.hasCar === 'Yes') {
        total += 1
        if (formData.hasCarInsurance === 'No') total += 1
      }
    }
    total += 1 // Travel frequency
    return total
  }

  const canProceedFromPersonalInfo = () => {
    return formData.name && 
           formData.dateOfBirth && 
           formData.zipCode && 
           formData.insuranceTypes.length > 0 && 
           formData.annualIncome && 
           formData.occupation
  }

  // Aggressive watermark removal
  useEffect(() => {
    const removeWatermark = () => {
      const watermarks = document.querySelectorAll(
        '#logo, [id*="logo"], [class*="spline"], a[href*="spline"], canvas + div, canvas ~ div'
      );
      watermarks.forEach(el => el.remove());

      const allDivs = document.querySelectorAll('div, a');
      allDivs.forEach(el => {
        if (el.textContent?.includes('Spline') || el.textContent?.includes('Built with')) {
          el.remove();
        }
      });
    };

    removeWatermark();
    const interval = setInterval(removeWatermark, 50);
    
    return () => clearInterval(interval);
  }, [selectedGender]);

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

  const handleContinue = () => {
    navigate('/onboarding/quick-assessment')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden overflow-y-auto py-12">
      <style dangerouslySetInnerHTML={{
        __html: `
          #logo, 
          [id*="logo"],
          [class*="spline"],
          canvas + div,
          canvas ~ div,
          a[href*="spline"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `
      }} />

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-black">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!selectedGender ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-gradient">Let's Get to Know You</span>
              </h1>
              <p className="text-xl text-gray-400 mb-16">
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
                  {selectedGender === 'female' ? (
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
                  ) : (
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
                  )}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-950/30 text-green-400 rounded-full border border-green-800/30 mb-8">
                  <span>✓</span>
                  <span>Great choice!</span>
                </div>
              </motion.div>

              {/* Questions Section */}
              <AnimatePresence>
                {showQuestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                  >
                    {/* Progress Header */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          Step {currentQuestion + 1} of {getTotalQuestions()}
                        </h3>
                        <span className="px-4 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                          {currentQuestion === 0 ? 'Personal Information' : 'Insurance Details'}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestion + 1) / getTotalQuestions()) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      {/* Page 1: Personal Information - All in One */}
                      {currentQuestion === 0 && (
                        <motion.div 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                              Personal Information
                            </h2>
                            <p className="text-gray-400">
                              Please provide your details to help us personalize your insurance recommendations
                            </p>
                          </div>

                          {/* 1. Full Name */}
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

                          {/* 2. Date of Birth */}
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

                          {/* 3. Postcode */}
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

                          {/* 4. Type of Insurance */}
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

                          {/* 5. Annual Income */}
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

                          {/* 6. Occupation */}
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

                          {/* Continue Button */}
                          <button
                            onClick={handleNext}
                            disabled={!canProceedFromPersonalInfo()}
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                          >
                            Continue to Insurance Details →
                          </button>
                        </motion.div>
                      )}

                      {/* Question 7: Exercise (if Health selected) */}
                      {currentQuestion === 6 && formData.insuranceTypes.includes('Health') && (
                        <motion.div 
                          className="card p-8"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">🏃‍♂️</span>
                            </div>
                            <div className="flex-1">
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Do you exercise regularly?
                              </h2>
                              <p className="text-green-400 text-sm flex items-center gap-1">
                                <span>●</span> Earn 10 points
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {['Rarely', 'Sometimes', 'Often'].map((freq) => (
                              <button
                                key={freq}
                                onClick={() => {
                                  updateFormData('exerciseFrequency', freq)
                                  setTimeout(handleNext, 300)
                                }}
                                className="px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 bg-zinc-800 text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 font-semibold"
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Question 8: Smoking (if Health selected) */}
                      {currentQuestion === 7 && formData.insuranceTypes.includes('Health') && (
                        <motion.div 
                          className="card p-8"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">🚭</span>
                            </div>
                            <div className="flex-1">
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Do you smoke?
                              </h2>
                              <p className="text-green-400 text-sm flex items-center gap-1">
                                <span>●</span> Earn 10 points
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {['Yes', 'No'].map((answer) => (
                              <button
                                key={answer}
                                onClick={() => {
                                  updateFormData('smokes', answer)
                                  setTimeout(handleNext, 300)
                                }}
                                className="px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 bg-zinc-800 text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 font-semibold"
                              >
                                {answer}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Question 9: Life Coverage (if Life selected) */}
                      {currentQuestion === (formData.insuranceTypes.includes('Health') ? 8 : 6) && formData.insuranceTypes.includes('Life') && (
                        <motion.div 
                          className="card p-8"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">💰</span>
                            </div>
                            <div className="flex-1">
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Expected coverage amount?
                              </h2>
                              <p className="text-green-400 text-sm flex items-center gap-1">
                                <span>●</span> Earn 10 points
                              </p>
                            </div>
                          </div>
                          <select
                            value={formData.lifeCoverage}
                            onChange={(e) => updateFormData('lifeCoverage', e.target.value)}
                            className="w-full px-6 py-4 bg-zinc-900 text-white text-lg rounded-xl border-2 border-blue-500 focus:border-purple-500 focus:outline-none transition-all"
                          >
                            <option value="">Select coverage amount</option>
                            <option value="100000">$100,000</option>
                            <option value="250000">$250,000</option>
                            <option value="500000">$500,000</option>
                            <option value="1000000">$1,000,000</option>
                            <option value="1000000+">$1,000,000+</option>
                          </select>
                          <button
                            onClick={handleNext}
                            disabled={!formData.lifeCoverage}
                            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next Question →
                          </button>
                        </motion.div>
                      )}

                      {/* Question 10: Has Car (if Car selected) - Dynamic question number */}
                      {currentQuestion === getTotalQuestions() - 2 && formData.insuranceTypes.includes('Car') && (
                        <motion.div 
                          className="card p-8"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">🚗</span>
                            </div>
                            <div className="flex-1">
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Do you have a car?
                              </h2>
                              <p className="text-green-400 text-sm flex items-center gap-1">
                                <span>●</span> Earn 10 points
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {['Yes', 'No'].map((answer) => (
                              <button
                                key={answer}
                                onClick={() => {
                                  updateFormData('hasCar', answer)
                                  setTimeout(handleNext, 300)
                                }}
                                className="px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 bg-zinc-800 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-600 font-semibold"
                              >
                                {answer}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Question 11: Travel Frequency */}
                      {currentQuestion === getTotalQuestions() - 1 && (
                        <motion.div 
                          className="card p-8"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-3xl">✈️</span>
                            </div>
                            <div className="flex-1">
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                How often do you travel per year?
                              </h2>
                              <p className="text-green-400 text-sm flex items-center gap-1">
                                <span>●</span> Earn 10 points
                              </p>
                              {formData.travelFrequency && parseInt(formData.travelFrequency.split('-')[0]) >= 3 && (
                                <p className="text-yellow-400 text-sm mt-1">✨ We recommend Travel Insurance!</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['0-1', '2', '3-5', '6+'].map((freq) => (
                              <button
                                key={freq}
                                onClick={() => {
                                  updateFormData('travelFrequency', freq)
                                  setTimeout(handleNext, 300)
                                }}
                                className="px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 bg-zinc-800 text-white hover:bg-gradient-to-r hover:from-yellow-600 hover:to-orange-600 font-semibold"
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
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