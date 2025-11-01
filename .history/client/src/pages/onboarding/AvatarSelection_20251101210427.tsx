import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background - Same as Landing */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/3 w-1/2 h-1/2 bg-cyan-500/15 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
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
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30" style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
                    {/* Female Avatar SVG */}
                    <div className="w-64 h-64 mx-auto mb-6 relative">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Head */}
                        <ellipse cx="100" cy="80" rx="35" ry="40" fill="#FFD1B8" />
                        
                        {/* Hair */}
                        <path d="M 65 60 Q 65 30, 100 30 Q 135 30, 135 60 L 135 100 Q 135 110, 125 110 L 75 110 Q 65 110, 65 100 Z" fill="#4A3426" />
                        
                        {/* Eyes */}
                        <circle cx="85" cy="75" r="4" fill="#2C1810" />
                        <circle cx="115" cy="75" r="4" fill="#2C1810" />
                        <circle cx="86" cy="74" r="2" fill="white" />
                        <circle cx="116" cy="74" r="2" fill="white" />
                        
                        {/* Smile */}
                        <path d="M 85 90 Q 100 95, 115 90" stroke="#FF8B9A" strokeWidth="2" fill="none" strokeLinecap="round" />
                        
                        {/* Rosy cheeks */}
                        <circle cx="75" cy="85" r="8" fill="#FFB3C1" opacity="0.4" />
                        <circle cx="125" cy="85" r="8" fill="#FFB3C1" opacity="0.4" />
                        
                        {/* Body - Blouse */}
                        <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#E8B4F9" />
                        
                        {/* Arms */}
                        <ellipse cx="55" cy="140" rx="12" ry="30" fill="#FFD1B8" transform="rotate(-20 55 140)" />
                        <ellipse cx="145" cy="140" rx="12" ry="30" fill="#FFD1B8" transform="rotate(20 145 140)" />
                      </svg>
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
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Female Avatar - Same as above */}
                    <ellipse cx="100" cy="80" rx="35" ry="40" fill="#FFD1B8" />
                    <path d="M 65 60 Q 65 30, 100 30 Q 135 30, 135 60 L 135 100 Q 135 110, 125 110 L 75 110 Q 65 110, 65 100 Z" fill="#4A3426" />
                    <circle cx="85" cy="75" r="4" fill="#2C1810" />
                    <circle cx="115" cy="75" r="4" fill="#2C1810" />
                    <circle cx="86" cy="74" r="2" fill="white" />
                    <circle cx="116" cy="74" r="2" fill="white" />
                    <path d="M 85 90 Q 100 95, 115 90" stroke="#FF8B9A" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <circle cx="75" cy="85" r="8" fill="#FFB3C1" opacity="0.4" />
                    <circle cx="125" cy="85" r="8" fill="#FFB3C1" opacity="0.4" />
                    <path d="M 70 120 L 70 170 Q 70 180, 80 180 L 120 180 Q 130 180, 130 170 L 130 120 Z" fill="#E8B4F9" />
                    <ellipse cx="55" cy="140" rx="12" ry="30" fill="#FFD1B8" transform="rotate(-20 55 140)" />
                    <ellipse cx="145" cy="140" rx="12" ry="30" fill="#FFD1B8" transform="rotate(20 145 140)" />
                  </svg>
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
