import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About APEX Insurance
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pioneering the future of insurance with DNA-driven risk assessment and AI-powered personalization
          </p>
        </motion.div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                At APEX Insurance, we believe insurance should be as unique as your DNA. Traditional insurance uses broad demographics and outdated risk models. We use cutting-edge genetic science and artificial intelligence to provide truly personalized coverage.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our mission is to make insurance fair, transparent, and tailored to your individual genetic profile—helping you save money while getting better protection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-950 to-purple-950 rounded-2xl p-8 border border-blue-500/30"
            >
              <div className="text-6xl mb-4">🧬</div>
              <h3 className="text-2xl font-bold mb-4 text-white">DNA-Driven Innovation</h3>
              <p className="text-gray-300">
                We analyze over 10 million DNA markers to create your unique risk profile, resulting in up to 40% savings on insurance premiums.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500K+', label: 'Customers Protected' },
              { value: '94%', label: 'AI Accuracy Rate' },
              { value: '$3,600', label: 'Avg. Annual Savings' },
              { value: '10M+', label: 'DNA Markers Analyzed' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-zinc-950 rounded-xl p-6 border border-zinc-800"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center text-white">Our Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🧬',
                title: 'DNA Analysis Agent',
                desc: 'Analyzes your genetic markers to identify health risks and optimal coverage needs',
              },
              {
                icon: '🧠',
                title: 'Cognitive AI Agent',
                desc: 'Processes your lifestyle, family history, and medical records for comprehensive risk assessment',
              },
              {
                icon: '⚛️',
                title: 'Quantum Risk Engine',
                desc: 'Uses advanced algorithms to calculate personalized premiums and recommendations',
              },
            ].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center hover:border-blue-500/50 transition-colors"
              >
                <div className="text-6xl mb-4">{tech.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{tech.title}</h3>
                <p className="text-gray-400">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center text-white">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Chen',
                role: 'CEO & Founder',
                bio: 'Former genomics researcher at Stanford, 15+ years in biotech',
                image: '👩‍💼',
              },
              {
                name: 'Michael Rodriguez',
                role: 'CTO',
                bio: 'AI/ML expert, previously at Google DeepMind',
                image: '👨‍💻',
              },
              {
                name: 'Dr. James Williams',
                role: 'Chief Medical Officer',
                bio: 'Board-certified physician specializing in preventive medicine',
                image: '👨‍⚕️',
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <div className="text-7xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                <div className="text-blue-400 text-sm mb-3">{member.role}</div>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join the Future of Insurance</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Get started with APEX today and discover how DNA-driven insurance can save you thousands while providing better protection.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all">
            Get Your Free Quote
          </button>
        </motion.section>
      </div>
    </div>
  )
}

export default About
