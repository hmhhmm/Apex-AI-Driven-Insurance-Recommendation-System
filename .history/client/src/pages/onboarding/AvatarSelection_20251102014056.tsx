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

  // Remove watermark continuously
  useEffect(() => {
    const removeWatermark = () => {
      const selectors = [
        '#logo',
        '[id*="logo"]',
        '[class*="spline"]',
        'a[href*="spline"]',
        'canvas + div',
        'canvas ~ div'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        });
      });
    };

    // Run immediately and repeatedly
    removeWatermark();
    const interval = setInterval(removeWatermark, 100);
    
    return () => clearInterval(interval);
  }, []);

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
      {/* Multiple layers of watermark hiding */}
      <style dangerouslySetInnerHTML={{
        __html: `
          #logo, 
          [id*="logo"],
          [class*="spline-watermark"],
          [class*="spline"],
          canvas + div,
          canvas ~ div,
          a[href*="spline"],
          div[style*="position: absolute"] > a,
          div[style*="position: fixed"] > a {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
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
                    {/* Female 3D Avatar - Triple wrapped to hide watermark */}
                    <div className="w-64 h-64 mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden">
                        <Spline 
                          scene="https://prod.spline.design/xWHBgK2bOBQRvsmd/scene.splinecode"
                          className="w-full h-full"
                          onLoad={() => {
                            setTimeout(() => {
                              const logos = document.querySelectorAll('#logo, [id*="logo"], a[href*="spline"]');
                              logos.forEach(logo => {
                                if (logo instanceof HTMLElement) {
                                  logo.remove();
                                }
                              });
                            }, 100);
                          }}
                        />
                      </div>
                      {/* Gradient overlay at bottom to cover watermark */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a0b2e] via-[#1a0b2e]/80 to-transparent pointer-events-none z-10" />
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
                    <div className="w-64 h-64 mb-6 relative">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <ellipse cx="100" cy="80" rx="35" ry="38" fill="#F4C4A0" />
                        <path d="M 65 55 Q 65 30, 100 28 Q 135 30, 135 55 L 135 70 Q 130 75, 125 70 L 75 70 Q 70 75, 65 70 Z" fill="#2C2416" />
                        <circle cx="85" cy="75" r="4" fill="#1A120C" />
                        <circle cx="115" cy="75" r="4" fill="#1A120C" />
                        <circle cx="86" cy="74" r="2" fill="white" />
                        <circle cx="116" cy="74" r="2" fill="white" />
                        <path d="M 85 92 Q 100 97, 115 92" stroke="#D4876F" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <path d="M 78 68 Q 85 66, 92 68" stroke="#2C2416" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <path d="M 108 68 Q 115 66, 122 68" stroke="#2C2416" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#5DADE2" />
                        <polygon points="90,120 100,130 110,120" fill="#3498DB" />
                        <ellipse cx="55" cy="145" rx="13" ry="32" fill="#F4C4A0" transform="rotate(-20 55 145)" />
                        <ellipse cx="145" cy="145" rx="13" ry="32" fill="#F4C4A0" transform="rotate(20 145 145)" />
                      </svg>
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
              <div className="w-48 h-48 mx-auto mb-8 overflow-hidden relative">
                {selectedGender === 'female' ? (
                  <>
                    <Spline 
                      scene="https://prod.spline.design/xWHBgK2bOBQRvsmd/scene.splinecode"
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1a0b2e] via-[#1a0b2e]/80 to-transparent pointer-events-none z-10" />
                  </>
                ) : (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <ellipse cx="100" cy="80" rx="35" ry="38" fill="#F4C4A0" />
                    <path d="M 65 55 Q 65 30, 100 28 Q 135 30, 135 55 L 135 70 Q 130 75, 125 70 L 75 70 Q 70 75, 65 70 Z" fill="#2C2416" />
                    <circle cx="85" cy="75" r="4" fill="#1A120C" />
                    <circle cx="115" cy="75" r="4" fill="#1A120C" />
                    <circle cx="86" cy="74" r="2" fill="white" />
                    <circle cx="116" cy="74" r="2" fill="white" />
                    <path d="M 85 92 Q 100 97, 115 92" stroke="#D4876F" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 78 68 Q 85 66, 92 68" stroke="#2C2416" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 108 68 Q 115 66, 122 68" stroke="#2C2416" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#5DADE2" />
                    <polygon points="90,120 100,130 110,120" fill="#3498DB" />
                    <ellipse cx="55" cy="145" rx="13" ry="32" fill="#F4C4A0" transform="rotate(-20 55 145)" />
                    <ellipse cx="145" cy="145" rx="13" ry="32" fill="#F4C4A0" transform="rotate(20 145 145)" />
                  </svg>
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
