import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface FloatingStatsCardProps {
  number: number
  suffix?: string
  prefix?: string
  label: string
  delay?: number
  decimals?: number
}

const FloatingStatsCard = ({
  number,
  suffix = '',
  prefix = '',
  label,
  delay = 0,
  decimals = 0,
}: FloatingStatsCardProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
      }}
      className="backdrop-blur-xl bg-white/[0.03] border border-purple-500/20 rounded-2xl p-8 min-w-[200px] hover:border-purple-400/40 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(0, 0, 0, 0.3))',
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.3, type: 'spring' }}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
      >
        {isInView ? (
          <>
            {prefix}
            <CountUp end={number} duration={2.5} decimals={decimals} />
            {suffix}
          </>
        ) : (
          '0'
        )}
      </motion.div>
      <p className="text-sm md:text-base text-gray-400 mt-3 font-medium">{label}</p>
    </motion.div>
  )
}

export default FloatingStatsCard
