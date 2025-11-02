import { motion } from 'framer-motion';
import ParticleBackground from '../landing/ParticleBackground';
import { Loader2, Shield, TrendingUp, Activity } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Main spinner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Outer ring */}
            <motion.div
              className="w-32 h-32 rounded-full border-4 border-purple-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner spinning circle */}
            <motion.div
              className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-light text-white mb-3"
        >
          Analyzing Your <span className="font-normal">Profile</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-12"
        >
          Our AI is processing your information to find the best insurance matches
        </motion.p>

        {/* Progress steps */}
        <div className="space-y-4 max-w-md mx-auto">
          <LoadingStep
            icon={Activity}
            text="Interpreting DNA data"
            delay={0.4}
          />
          <LoadingStep
            icon={TrendingUp}
            text="Calculating risk profile"
            delay={0.6}
          />
          <LoadingStep
            icon={Shield}
            text="Finding optimal plans"
            delay={0.8}
          />
        </div>

        {/* Pulsing dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

interface LoadingStepProps {
  icon: any;
  text: string;
  delay: number;
}

function LoadingStep({ icon: Icon, text, delay }: LoadingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-4 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10"
    >
      <div className="flex-shrink-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-5 h-5 text-purple-400" />
        </motion.div>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-400" />
        <span className="text-white font-light">{text}</span>
      </div>
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex gap-1"
      >
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
      </motion.div>
    </motion.div>
  );
}
