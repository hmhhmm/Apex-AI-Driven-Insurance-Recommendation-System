import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useOnboardingStore, type AccountCreationData } from '../../store/onboardingStore'
import { useNavigate } from 'react-router-dom'

// Validation schema
const accountSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type FormData = z.infer<typeof accountSchema>

export default function AccountCreation() {
  const navigate = useNavigate()
  const { saveAccountCreation, setCurrentStep, goToPreviousStep } = useOnboardingStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(accountSchema)
  })

  const onSubmit = async (data: FormData) => {
    // Simulate account creation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { confirmPassword, ...accountData } = data
    saveAccountCreation(accountData as AccountCreationData)
    setCurrentStep('dna-test-option')
    navigate('/onboarding/dna-test')
  }

  const handleBack = () => {
    goToPreviousStep()
    navigate('/onboarding/quick-assessment')
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-950/50 text-blue-400 rounded-full text-sm font-semibold border border-blue-800/30">
              Step 2 of 4
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Create Your Account</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Secure your personalized insurance journey with APEX
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 w-full bg-zinc-900 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="card space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                👤
              </span>
              <input
                type="text"
                {...register('fullName')}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                📧
              </span>
              <input
                type="email"
                {...register('email')}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                📱
              </span>
              <input
                type="tel"
                {...register('phone')}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">We'll send you updates about your DNA test and insurance recommendations</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full pl-12 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters with uppercase and number</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                🔒
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="w-full pl-12 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="pt-4 border-t border-zinc-800">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('agreeToTerms')}
                className="mt-1 w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300">
                I agree to APEX's{' '}
                <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </a>
                . I understand my genetic data will be securely stored and used only for insurance recommendations.
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-2 text-sm text-red-500">{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary flex items-center gap-2"
            >
              <span>←</span>
              Back
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin">⚙️</span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🔐</div>
            <div className="text-xs font-semibold text-gray-300 mb-1">Bank-Level Security</div>
            <div className="text-xs text-gray-500">256-bit encryption</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🏥</div>
            <div className="text-xs font-semibold text-gray-300 mb-1">HIPAA Compliant</div>
            <div className="text-xs text-gray-500">Medical data protected</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🧬</div>
            <div className="text-xs font-semibold text-gray-300 mb-1">DNA Privacy</div>
            <div className="text-xs text-gray-500">Never shared or sold</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
