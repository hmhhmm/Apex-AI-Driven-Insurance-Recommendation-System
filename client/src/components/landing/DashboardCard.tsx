import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface DashboardCardProps {
  title: string
  children: React.ReactNode
  delay?: number
  className?: string
}

const DashboardCard = ({ title, children, delay = 0, className = '' }: DashboardCardProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      {/* Card Header */}
      <div className="mb-6">
        <h3 className="text-lg font-light text-white/80">{title}</h3>
      </div>

      {/* Card Content */}
      <div>{children}</div>

      {/* Glassmorphism shine effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  )
}

export default DashboardCard
