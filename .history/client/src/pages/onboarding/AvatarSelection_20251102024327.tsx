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
    setTimeout(() => {
      if (gender) {
        saveGender(gender)
      }
      navigate('/onboarding/quick-assessment')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
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
                    {/* Male 3D Avatar - Adjusted to match female size EXACTLY */}
                    <div className="w-64 mb-6 relative overflow-hidden" style={{ height: '280px' }}>
                      {/* Inner container with scale, position, and rotation adjustments */}
                      <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                          height: '400px',
                          clipPath: 'inset(5% 0 25% 0)',
                          transform: 'scale(0.95) translateY(-10px) rotateY(50deg)',
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'center center'
                        }}
                      >
                        <Spline
                          scene="https://prod.spline.design/odtCmzosoH-uUN4I/scene.splinecode"
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
              <div className="w-48 mb-8 mx-auto relative overflow-hidden" style={{ height: '210px' }}>
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
                      height: '300px',
                      clipPath: 'inset(5% 0 25% 0)',
                      transform: 'scale(0.95) translateY(-5px) rotateY(50deg)',
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'center center'
                    }}
                  >
                    <Spline 
                      scene="https://prod.spline.design/odtCmzosoH-uUN4I/scene.splinecode"
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-950/30 text-green-400 rounded-full border border-green-800/30 mb-4">
                  <span>✓</span>
                  <span>Perfect! Let's continue...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}