import { motion } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

const AnimatedHero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient overlay like the design */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Small label above title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <span className="text-sm text-gray-400 tracking-wider uppercase">
              AI-Powered Insurance Intelligence
            </span>
          </motion.div>

          {/* Main Headline - Matches "One-click for Asset Defense" style */}
          <motion.div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-4 leading-tight"
            >
              <span className="text-white font-light">Insurance Made </span>
              <span className="text-white font-normal">Personal </span>
              <span className="text-white font-light">with DNA</span>
            </motion.h1>
          </motion.div>

          {/* Subheadline - matches design subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-base md:text-lg text-gray-400">
              Discover personalized insurance plans tailored to your unique genetic profile. Save money while getting the coverage that truly fits your health needs.
            </p>
          </motion.div>

          {/* CTA Buttons - matches design style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link to="/onboarding/avatar-selection">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2"
              >
                Get Started
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const section = document.getElementById('how-it-works');
                if (section) {
                  const sectionTop = section.offsetTop;
                  const sectionHeight = section.offsetHeight;
                  const startPosition = window.pageYOffset;
                  const distanceToSection = sectionTop - startPosition;
                  const totalDistance = sectionHeight + distanceToSection;
                  
                  // Fast scroll to section (2 seconds), then slow scroll through it (8 seconds)
                  const fastScrollDuration = 2000;
                  const slowScrollDuration = 8000;
                  const totalDuration = fastScrollDuration + slowScrollDuration;
                  const startTime = performance.now();
                  
                  function smoothScroll(currentTime: number) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / totalDuration, 1);
                    
                    let scrollPosition;
                    if (elapsed < fastScrollDuration) {
                      // Fast phase - scroll to section top
                      const fastProgress = elapsed / fastScrollDuration;
                      const easeOut = 1 - Math.pow(1 - fastProgress, 3);
                      scrollPosition = startPosition + (distanceToSection * easeOut);
                    } else {
                      // Slow phase - scroll through section
                      const slowElapsed = elapsed - fastScrollDuration;
                      const slowProgress = slowElapsed / slowScrollDuration;
                      const easeInOut = slowProgress < 0.5
                        ? 4 * slowProgress * slowProgress * slowProgress
                        : 1 - Math.pow(-2 * slowProgress + 2, 3) / 2;
                      scrollPosition = sectionTop + (sectionHeight * easeInOut);
                    }
                    
                    window.scrollTo(0, scrollPosition);
                    
                    if (progress < 1) {
                      requestAnimationFrame(smoothScroll);
                    }
                  }
                  
                  requestAnimationFrame(smoothScroll);
                }
              }}
              className="px-8 py-3 border border-white/20 text-white rounded-full font-medium text-sm hover:bg-white/5 transition-colors duration-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              How it Works
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500 mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AnimatedHero
