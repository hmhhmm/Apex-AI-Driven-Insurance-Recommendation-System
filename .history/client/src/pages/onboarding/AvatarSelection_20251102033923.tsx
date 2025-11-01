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
    let total = 8 // Base questions
    if (formData.insuranceTypes.includes('Health')) total += 2
    if (formData.insuranceTypes.includes('Life')) total += 1
    if (formData.insuranceTypes.includes('Car')) {
      total += 1
      if (formData.hasCar === 'Yes') {
        total += 1
        if (formData.hasCarInsurance === 'No') total += 1
      }
    }
    return total
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
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Tell us a bit about yourself
                    </h2>
                    <p className="text-gray-400 mb-8">Help us personalize your insurance recommendations</p>

                    <div className="space-y-6 text-left">
                      {/* 1. Name */}
                      <motion.div 
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          What's your name? <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </motion.div>

                      {/* 2. Date of Birth */}
                      <motion.div 
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          Date of Birth <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </motion.div>

                      {/* 3. Zip Code */}
                      <motion.div 
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          Zip Code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => updateFormData('zipCode', e.target.value)}
                          placeholder="Enter your zip code"
                          className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </motion.div>

                      {/* 4. Type of Insurance */}
                      <motion.div 
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          What type of insurance are you interested in? <span className="text-red-400">*</span>
                        </label>
                        <p className="text-gray-400 text-sm mb-4">Select all that apply</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {['Health', 'Life', 'Auto', 'Travel'].map((type) => (
                            <button
                              key={type}
                              onClick={() => toggleInsuranceType(type)}
                              className={`px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 text-left flex items-center justify-between ${
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
                      </motion.div>

                      {/* 5. Annual Income */}
                      <motion.div 
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          Annual Income <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.annualIncome}
                          onChange={(e) => updateFormData('annualIncome', e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                        >
                          <option value="">Select your income range</option>
                          <option value="0-25000">$0 - $25,000</option>
                          <option value="25000-50000">$25,000 - $50,000</option>
                          <option value="50000-75000">$50,000 - $75,000</option>
                          <option value="75000-100000">$75,000 - $100,000</option>
                          <option value="100000+">$100,000+</option>
                        </select>
                      </motion.div>

                      {/* 6. Occupation */}
                      <motion.div 
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          Occupation <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => updateFormData('occupation', e.target.value)}
                          placeholder="e.g., Software Engineer, Teacher, etc."
                          className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </motion.div>

                      {/* Health Questions - Show if Health insurance selected */}
                      {formData.insuranceTypes.includes('Health') && (
                        <>
                          {/* 7. Exercise Frequency */}
                          <motion.div 
                            className="card p-6 border-l-4 border-green-500"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                          >
                            <label className="block text-white font-semibold mb-3">
                              Do you exercise regularly? 🏃‍♂️
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {['Rarely', 'Sometimes', 'Often'].map((freq) => (
                                <button
                                  key={freq}
                                  onClick={() => updateFormData('exerciseFrequency', freq)}
                                  className={`px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                                    formData.exerciseFrequency === freq
                                      ? 'bg-green-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {freq}
                                </button>
                              ))}
                            </div>
                          </motion.div>

                          {/* 8. Smoking */}
                          <motion.div 
                            className="card p-6 border-l-4 border-green-500"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <label className="block text-white font-semibold mb-3">
                              Do you smoke? 🚭
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {['Yes', 'No'].map((answer) => (
                                <button
                                  key={answer}
                                  onClick={() => updateFormData('smokes', answer)}
                                  className={`px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                                    formData.smokes === answer
                                      ? 'bg-green-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {answer}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}

                      {/* Life Insurance Questions */}
                      {formData.insuranceTypes.includes('Life') && (
                        <motion.div 
                          className="card p-6 border-l-4 border-purple-500"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          <label className="block text-white font-semibold mb-3">
                            Expected Coverage Amount 💰
                          </label>
                          <select
                            value={formData.lifeCoverage}
                            onChange={(e) => updateFormData('lifeCoverage', e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-purple-500 focus:outline-none transition-all"
                          >
                            <option value="">Select coverage amount</option>
                            <option value="100000">$100,000</option>
                            <option value="250000">$250,000</option>
                            <option value="500000">$500,000</option>
                            <option value="1000000">$1,000,000</option>
                            <option value="1000000+">$1,000,000+</option>
                          </select>
                        </motion.div>
                      )}

                      {/* Auto Insurance Questions */}
                      {formData.insuranceTypes.includes('Auto') && (
                        <>
                          <motion.div 
                            className="card p-6 border-l-4 border-blue-500"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                          >
                            <label className="block text-white font-semibold mb-3">
                              Do you have a car? 🚗
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {['Yes', 'No'].map((answer) => (
                                <button
                                  key={answer}
                                  onClick={() => updateFormData('hasCar', answer)}
                                  className={`px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                                    formData.hasCar === answer
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                  }`}
                                >
                                  {answer}
                                </button>
                              ))}
                            </div>
                          </motion.div>

                          {formData.hasCar === 'Yes' && (
                            <>
                              <motion.div 
                                className="card p-6 border-l-4 border-blue-500"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                              >
                                <label className="block text-white font-semibold mb-3">
                                  Do you have car insurance?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  {['Yes', 'No'].map((answer) => (
                                    <button
                                      key={answer}
                                      onClick={() => updateFormData('hasCarInsurance', answer)}
                                      className={`px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                                        formData.hasCarInsurance === answer
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                      }`}
                                    >
                                      {answer}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>

                              {formData.hasCarInsurance === 'No' && (
                                <motion.div 
                                  className="card p-6 border-l-4 border-blue-500"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 1.2 }}
                                >
                                  <label className="block text-white font-semibold mb-3">
                                    Car Details
                                  </label>
                                  <div className="space-y-3">
                                    <input
                                      type="text"
                                      value={formData.carPlate}
                                      onChange={(e) => updateFormData('carPlate', e.target.value)}
                                      placeholder="Car Plate Number (e.g., ABC1234)"
                                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                    <input
                                      type="text"
                                      value={formData.carModel}
                                      onChange={(e) => updateFormData('carModel', e.target.value)}
                                      placeholder="Car Model (e.g., Toyota Camry 2020)"
                                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </>
                          )}
                        </>
                      )}

                      {/* Travel Frequency */}
                      <motion.div 
                        className="card p-6 border-l-4 border-yellow-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          How often do you travel per year? ✈️
                        </label>
                        <p className="text-gray-400 text-sm mb-4">
                          {formData.travelFrequency >= '3' && '✨ We recommend adding Travel Insurance!'}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['0-1', '2', '3-5', '6+'].map((freq) => (
                            <button
                              key={freq}
                              onClick={() => updateFormData('travelFrequency', freq)}
                              className={`px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                                formData.travelFrequency === freq
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
                              }`}
                            >
                              {freq} times
                            </button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Continue Button */}
                      <motion.button
                        onClick={handleContinue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                      >
                        Continue to Personalized Recommendations →
                      </motion.button>
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