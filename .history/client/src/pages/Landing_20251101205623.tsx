import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Shield, Activity, Dna, Zap, ClipboardList, FlaskConical, DollarSign, CheckCircle2, Clock, Wallet, Star } from 'lucide-react'
import ParticleBackground from '../components/landing/ParticleBackground'
import AnimatedHero from '../components/landing/AnimatedHero'
import DashboardCard from '../components/landing/DashboardCard'

const Landing = () => {
  const navigate = useNavigate()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])

  return (
    <div ref={containerRef} className="relative overflow-x-hidden w-full">
      {/* Enhanced Background with Multiple Gradient Layers */}
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

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO WITH GLASSMORPHISM
          ═══════════════════════════════════════════════════════════════ */}
      <motion.section 
        className="relative min-h-screen"
        style={{ opacity, scale }}
      >
        <ParticleBackground />
        <AnimatedHero />
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: HOW IT WORKS - 4 STEP PROCESS
          ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-32 px-6 w-full overflow-x-hidden">
        {/* Section gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Shield className="w-8 h-8 text-white/80" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-light text-white mb-4">
              How <span className="font-normal">APEX Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get insured in 4 simple steps. From DNA analysis to comprehensive coverage in just 5 days.</p>
          </motion.div>

          {/* Timeline Steps */}
          <div className="max-w-4xl mx-auto">
            {[
<<<<<<< HEAD
              { step: 1, icon: '📝', title: 'Complete Profile', desc: 'Share your health, lifestyle & family history' },
              { step: 2, icon: '🧬', title: 'DNA Test', desc: 'Upload existing or order our $49 kit' },
              { step: 3, icon: '🤖', title: 'AI Analysis', desc: 'Triple AI agents analyze your unique risks' },
              { step: 4, icon: '💎', title: 'Get Plans', desc: 'Receive personalized insurance recommendations' },
              { step: 5, icon: '🎉', title: 'Save Money', desc: 'Bundle & save up to 40% annually' },
            ].map((item) => (
=======
              {
                number: "01",
                title: "Complete Your Profile",
                description: "Quick 5-minute form covering medical history, lifestyle assessment, and family health background. Upload existing DNA test results or order our FDA-approved kit.",
                IconComponent: ClipboardList,
                time: "5 minutes",
                details: ["Medical history questionnaire", "Lifestyle risk assessment", "Family health background", "DNA test upload/order"]
              },
              {
                number: "02",
                title: "DNA Analysis & Risk Assessment",
                description: "Our CLIA-certified labs analyze 750,000+ genetic markers. Three specialized AI agents process your data to predict health risks, longevity factors, and personalized insurance needs.",
                IconComponent: FlaskConical,
                time: "3-5 days",
                details: ["750K+ genetic markers analyzed", "3 AI agents process your data", "Health risk prediction", "HIPAA-compliant processing"]
              },
              {
                number: "03",
                title: "Receive Personalized Quotes",
                description: "Get 40-50 customized insurance quotes from 10+ top-rated providers. All tailored to your unique genetic profile with transparent side-by-side comparisons.",
                IconComponent: DollarSign,
                time: "Instant",
                details: ["40-50 personalized quotes", "10+ A-rated insurers", "DNA-optimized pricing", "Side-by-side comparison"]
              },
              {
                number: "04",
                title: "Choose & Manage Coverage",
                description: "Select the best plans for your needs. Mix and match providers for optimal coverage. Manage everything from one unified dashboard with 24/7 AI assistance.",
                IconComponent: CheckCircle2,
                time: "Same day",
                details: ["Mix different providers", "Bundle discounts up to 40%", "Unified dashboard", "Coverage starts immediately"]
              }
            ].map((step, index) => (
>>>>>>> origin/main
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-16 last:mb-0"
              >
                {/* Timeline line */}
                {index < 3 && (
                  <div className="absolute left-[31px] top-20 w-0.5 h-full bg-gradient-to-b from-purple-500/50 to-blue-500/30" />
                )}

                <div className="flex gap-6">
                  {/* Step number circle */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                      <step.IconComponent className="w-7 h-7 text-white/80" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <DashboardCard delay={index * 0.2 + 0.4}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm text-purple-400 font-medium mb-2">STEP {step.number}</div>
                          <h3 className="text-2xl font-light text-white mb-2">{step.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-400">{step.time}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{step.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {step.details.map((detail, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.6 + i * 0.1 }}
                            className="flex items-center gap-2 text-sm text-gray-500"
                          >
                            <div className="w-1 h-1 rounded-full bg-purple-400/50" />
                            <span>{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </DashboardCard>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: "Total Time", value: "5 days", IconComponent: Clock },
              { label: "Average Savings", value: "RM3,200/year", IconComponent: Wallet },
              { label: "Customer Satisfaction", value: "98.7%", IconComponent: Star }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-6 text-center"
              >
                <stat.IconComponent className="w-8 h-8 text-purple-400/80 mx-auto mb-3" />
                <div className="text-2xl font-light text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: WHY DNA CHANGES EVERYTHING
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 w-full overflow-x-hidden">
        {/* Section gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <Dna className="w-16 h-16 text-white/80 mx-auto" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-light text-white mb-4">
              Why <span className="font-normal">DNA Changes Everything</span>
            </h2>
            <p className="text-gray-400">
              Personalized insurance powered by your unique genetic profile
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
            {/* Left Column - Problems & Solutions */}
            <div className="space-y-8 flex flex-col">
              {/* Traditional Problems */}
              <DashboardCard title="Traditional Insurance Problem" delay={0.1}>
                <div className="space-y-3">
                  {[
                    "One-size-fits-all pricing",
                    "Based only on age, gender, location",
                    "Healthy people overpay",
                    "Miss hidden risks"
                  ].map((problem, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 text-gray-400"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-400 text-sm">✕</span>
                      </div>
                      <span>{problem}</span>
                    </motion.div>
                  ))}
                </div>
              </DashboardCard>

              {/* APEX Solution */}
              <DashboardCard title="APEX DNA Solution" delay={0.3}>
                <div className="space-y-3">
                  {[
                    "Personalized to YOUR genetics",
                    "Fair pricing based on actual risk",
                    "Low genetic risk = lower premiums",
                    "Early detection of future risks"
                  ].map((solution, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 text-sm">✓</span>
                      </div>
                      <span>{solution}</span>
                    </motion.div>
                  ))}
                </div>
              </DashboardCard>

              {/* Example Savings */}
              <DashboardCard title="Real Example" delay={0.5}>
                <div className="space-y-4">
                  <div className="text-sm text-gray-400">Sarah, 32, Low Heart Risk</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-xs text-gray-500 mb-1">Traditional</div>
                      <div className="text-2xl font-light text-white">RM450<span className="text-sm text-gray-500">/mo</span></div>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-xs text-gray-500 mb-1">With APEX</div>
                      <div className="text-2xl font-light text-green-400">RM289<span className="text-sm text-gray-500">/mo</span></div>
                    </div>
                  </div>
                  <motion.div 
                    className="text-center pt-3 border-t border-white/10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-purple-400 font-medium">Saves: RM1,932/year</span>
                    <span className="ml-2">✨</span>
                  </motion.div>
                </div>
              </DashboardCard>
            </div>

            {/* Right Column - What DNA Reveals */}
            <div className="space-y-8 flex flex-col">
              <DashboardCard title="📊 What Your DNA Reveals" delay={0.2}>
                <div className="space-y-6">
                  {/* Health Insurance */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-red-400" />
                      <h4 className="text-white font-medium">Health Insurance</h4>
                    </div>
                    <div className="space-y-2 pl-7">
                      {[
                        "Heart disease risk (APOE gene)",
                        "Cancer susceptibility (BRCA1/2)",
                        "Diabetes likelihood (TCF7L2)"
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="text-sm text-gray-400"
                        >
                          • {item}
                        </motion.div>
                      ))}
                      <div className="text-sm text-purple-400 pt-1">→ Custom coverage for YOUR risks</div>
                    </div>
                  </div>

                  {/* Life Insurance */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-medium">Life Insurance</h4>
                    </div>
                    <div className="space-y-2 pl-7">
                      {[
                        "Longevity prediction",
                        "Hereditary conditions",
                        "Sudden death risk factors"
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="text-sm text-gray-400"
                        >
                          • {item}
                        </motion.div>
                      ))}
                      <div className="text-sm text-purple-400 pt-1">→ Fair premiums, not guesswork</div>
                    </div>
                  </div>

                  {/* Auto Insurance */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-white font-medium">Auto Insurance</h4>
                    </div>
                    <div className="space-y-2 pl-7">
                      {[
                        "Reaction time genes (COMT)",
                        "Risk-taking behavior (DRD4)",
                        "Vision degradation timeline"
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="text-sm text-gray-400"
                        >
                          • {item}
                        </motion.div>
                      ))}
                      <div className="text-sm text-purple-400 pt-1">→ Safe drivers pay less</div>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* DNA Data Protection */}
              <DashboardCard title="🔒 Your DNA Data Is Protected" delay={0.4}>
                <div className="space-y-2">
                  {[
                    "HIPAA Compliant",
                    "Encrypted end-to-end",
                    "Never shared (only risk scores)",
                    "Deletable anytime",
                    "GINA Protected (no discrimination)"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Get Started Section */}
      <section id="signup" className="min-h-screen py-20 bg-gradient-to-br from-blue-950 via-purple-950 to-black flex items-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-2xl mx-auto px-4 w-full relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
              Begin your personalized insurance journey with APEX. Takes only 2 minutes to complete.
            </p>

            <button
              onClick={() => navigate('/onboarding/avatar-selection')}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300"
            >
              Get Started →
            </button>

            <p className="text-center text-sm text-gray-500 mt-8">
              No credit card required • Free assessment • 2 minutes
            </p>
          </motion.div>
=======
      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gray-500 text-sm"
            >
              Empowering smart decisions through AI-driven DNA insurance matching
            </motion.p>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <a href="#" className="text-gray-400 hover:text-white transition-colors underline">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </motion.div>

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 text-sm"
            >
              © 2025 APEX. All rights reserved.
            </motion.p>
          </div>
>>>>>>> origin/main
        </div>
      </footer>
    </div>
  )
}

export default Landing
