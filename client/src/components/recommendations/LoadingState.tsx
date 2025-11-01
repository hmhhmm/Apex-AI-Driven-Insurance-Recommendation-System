import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-6"
        >
          <Loader2 className="w-16 h-16 text-purple-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Analyzing Your Profile...
        </h2>
        
        <div className="space-y-2 text-purple-300">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🧬 Interpreting DNA data...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            📊 Calculating risk profile...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            🎯 Matching insurance plans...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            💰 Optimizing pricing...
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-purple-400"
        >
          This may take a few moments...
        </motion.div>
      </motion.div>
    </div>
  );
}
