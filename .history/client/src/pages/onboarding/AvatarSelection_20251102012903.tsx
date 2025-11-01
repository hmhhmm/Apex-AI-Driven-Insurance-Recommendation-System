import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'
import Spline from '@splinetool/react-spline'

type Gender = 'male' | 'female' | null

export default function AvatarSelection() {
  const navigate = useNavigate()
  const { setSelectedGender: saveGender } = useOnboardingStore()
  const [selectedGender, setSelectedGender] = useState<Gender>(null)

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender)
    // Wait for animation then navigate
    setTimeout(() => {
      if (gender) {
        saveGender(gender)
      }
      navigate('/onboarding/quick-assessment')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-black">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!selectedGender ? (
            // Initial State: Show both avatars
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
                  <div className="card p-8 hover:border-pink-500 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30">
                  {/* Female 3D Avatar */}
                  <div className="w-64 h-64 mx-auto mb-6 relative">
                    <Spline 
                      scene="https://prod.spline.design/xWHBgK2bOBQRvsmd/scene.splinecode"
                      className="w-full h-full [&_#logo]:hidden"
                    />
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
                  <div className="card p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30">
                    {/* Male Avatar SVG */}
                    <div className="w-64 h-64 mx-auto mb-6 relative">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Head */}
                        <ellipse cx="100" cy="80" rx="35" ry="38" fill="#F4C4A0" />
                        
                        {/* Hair - Short cut */}
                        <path d="M 65 55 Q 65 30, 100 28 Q 135 30, 135 55 L 135 70 Q 130 75, 125 70 L 75 70 Q 70 75, 65 70 Z" fill="#2C2416" />
                        
                        {/* Eyes */}
                        <circle cx="85" cy="75" r="4" fill="#1A120C" />
                        <circle cx="115" cy="75" r="4" fill="#1A120C" />
                        <circle cx="86" cy="74" r="2" fill="white" />
                        <circle cx="116" cy="74" r="2" fill="white" />
                        
                        {/* Smile */}
                        <path d="M 85 92 Q 100 97, 115 92" stroke="#D4876F" strokeWidth="2" fill="none" strokeLinecap="round" />
                        
                        {/* Eyebrows */}
                        <path d="M 78 68 Q 85 66, 92 68" stroke="#2C2416" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <path d="M 108 68 Q 115 66, 122 68" stroke="#2C2416" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        
                        {/* Body - Shirt */}
                        <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#5DADE2" />
                        
                        {/* Collar */}
                        <polygon points="90,120 100,130 110,120" fill="#3498DB" />
                        
                        {/* Arms */}
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
            // Selected State: Show centered avatar
            <motion.div
              key="selected"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-48 h-48 mx-auto mb-8">
                {selectedGender === 'female' ? (
                  <Spline 
                    scene="https://prod.spline.design/xWHBgK2bOBQRvsmd/scene.splinecode"
                    className="w-full h-full [&_#logo]:hidden"
                  />
                ) : (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Male Avatar - Same as above */}
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
