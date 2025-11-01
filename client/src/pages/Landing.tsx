import { motion } from 'framer-motion'

const Landing = () => {

  return (
    <div className="overflow-x-hidden bg-black">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 grid-bg opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/10 to-black"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your DNA. Your Shield.
              </span>
              <br />
              <span className="text-white">Your Future.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered insurance tailored to your genetic blueprint.
              <br />
              <span className="text-gray-500">One test. Five personalized plans. Unlimited savings.</span>
            </p>

            <a
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
            >
              Unlock Your Protection →
            </a>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 bg-zinc-950/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-zinc-800/50">
                <span className="text-3xl">🧬</span>
                <span className="text-gray-300 font-medium">10M+ DNA markers</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-zinc-800/50">
                <span className="text-3xl">🤖</span>
                <span className="text-gray-300 font-medium">94% accuracy</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-zinc-800/50">
                <span className="text-3xl">💰</span>
                <span className="text-gray-300 font-medium">$3,600/year savings</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="min-h-screen py-20 bg-zinc-950 relative">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">How APEX Works</h2>
            <p className="text-xl text-gray-400">5 simple steps to personalized protection</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: 1, icon: '📝', title: 'Complete Profile', desc: 'Share your health, lifestyle & family history' },
              { step: 2, icon: '🧬', title: 'DNA Test', desc: 'Upload existing or order our $99 kit' },
              { step: 3, icon: '🤖', title: 'AI Analysis', desc: 'Triple AI agents analyze your unique risks' },
              { step: 4, icon: '💎', title: 'Get Plans', desc: 'Receive personalized insurance recommendations' },
              { step: 5, icon: '🎉', title: 'Save Money', desc: 'Bundle & save up to 40% annually' },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.step * 0.1 }}
                className="relative"
              >
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-500/50">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold text-blue-400 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                {item.step < 5 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-500/30 text-2xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="min-h-screen py-20 bg-black relative">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Traditional vs APEX</h2>
            <p className="text-xl text-gray-400">See the difference DNA-driven insurance makes</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="bg-zinc-950 rounded-2xl p-8 border-2 border-zinc-800">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-400">Traditional Insurance</h3>
                <p className="text-gray-600">One-size-fits-all approach</p>
              </div>
              <ul className="space-y-4">
                {[
                  'Generic risk assessment',
                  'Higher premiums for young customers',
                  'No personalization',
                  'Complex application process',
                  'Limited coverage options',
                  'Average savings: $0'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">✗</span>
                    <span className="text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* APEX */}
            <div className="bg-gradient-to-br from-blue-950 to-purple-950 rounded-2xl p-8 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 transform scale-105">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">APEX Insurance</h3>
                <p className="text-blue-200">DNA-driven personalization</p>
              </div>
              <ul className="space-y-4">
                {[
                  'Genetic-based risk profiling',
                  'Save up to 40% with bundles',
                  'Tailored to YOUR DNA',
                  '15-minute online application',
                  '5 insurance types in one platform',
                  'Average savings: $3,600/year'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-400 text-xl font-bold">✓</span>
                    <span className="font-medium text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
