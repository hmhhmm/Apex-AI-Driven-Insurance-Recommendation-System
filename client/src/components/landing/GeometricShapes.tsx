import { motion } from 'framer-motion'

const GeometricShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating cube - top left */}
      <motion.div
        className="absolute left-20 top-40 w-24 h-24 border-2 border-purple-500/20"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 180],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Diamond shape - right side */}
      <motion.div
        className="absolute right-1/4 top-60 w-20 h-20 border-2 border-purple-400/30 rotate-45"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent)',
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [45, 90, 45],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Hexagon - bottom left */}
      <motion.div
        className="absolute left-1/4 bottom-40"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100">
          <polygon
            points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
            fill="none"
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Small floating circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full border border-purple-400/40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Pulsing ring - center right */}
      <motion.div
        className="absolute right-40 top-1/2 w-32 h-32 rounded-full border-2 border-purple-500/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Triangle - bottom right */}
      <motion.div
        className="absolute right-20 bottom-60"
        animate={{
          rotate: [0, 120, 240, 360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100">
          <polygon
            points="50 10, 90 90, 10 90"
            fill="none"
            stroke="rgba(192, 132, 252, 0.3)"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export default GeometricShapes
