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
                <div className="w-48 mb-4 mx-auto relative overflow-hidden" style={{ height: '210px' }}>
                  {selectedGender === 'female' ? (
                    <div 
                      className="absolute top-0 left-0 right-0"
                      style={{ 
                        height: '240px',
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
                        height: '240px',
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
                    <h2 className="text-3xl font-bold text-white mb-6">
                      Tell us a bit about yourself
                    </h2>

                    <div className="space-y-4 text-left">
                      {/* Question 1 */}
                      <div className="card p-6">
                        <label className="block text-white font-semibold mb-3">
                          What's your age range?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['18-25', '26-35', '36-50', '50+'].map((age) => (
                            <button
                              key={age}
                              className="px-4 py-3 bg-zinc-800 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                            >
                              {age}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 2 */}
                      <div className="card p-6">
                        <label className="block text-white font-semibold mb-3">
                          What type of insurance are you interested in?
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {['Health Insurance', 'Life Insurance', 'Travel Insurance', 'Auto Insurance'].map((type) => (
                            <button
                              key={type}
                              className="px-4 py-3 bg-zinc-800 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 text-left"
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Continue Button */}
                      <motion.button
                        onClick={handleContinue}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                      >
                        Continue to Full Assessment →
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