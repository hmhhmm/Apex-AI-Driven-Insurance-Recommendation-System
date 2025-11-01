import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../../store/onboardingStore'
import { useState } from 'react'

const orderKitSchema = z.object({
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please select your state'),
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid postcode (5 digits)')
})

type FormData = z.infer<typeof orderKitSchema>

export default function OrderKit() {
  const navigate = useNavigate()
  const { saveDNATest, setCurrentStep } = useOnboardingStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(orderKitSchema)
  })

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    saveDNATest({
      option: 'order-kit',
      kitDetails: data
    })
    
    setCurrentStep('document-vault')
    navigate('/onboarding/documents')
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Order Your DNA Kit</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We'll ship your kit within 24 hours
          </p>
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span> What's Included
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '🧪', title: 'Saliva Collection Kit', desc: 'Easy-to-use, no blood required' },
              { icon: '📝', title: 'Instructions', desc: 'Step-by-step guide included' },
              { icon: '📦', title: 'Return Shipping', desc: 'Prepaid return label included' },
              { icon: '🔬', title: 'Lab Processing', desc: 'CLIA-certified lab analysis' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Address Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit(onSubmit)}
          className="card space-y-6"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🏠</span> Shipping Address
          </h2>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('address')}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="123 Main Street, Apt 4B"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="Kuala Lumpur"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* State & Postcode */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                {...register('state')}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="">Select state</option>
                <option value="Johor">Johor</option>
                <option value="Kedah">Kedah</option>
                <option value="Kelantan">Kelantan</option>
                <option value="Malacca">Malacca</option>
                <option value="Negeri Sembilan">Negeri Sembilan</option>
                <option value="Pahang">Pahang</option>
                <option value="Penang">Penang</option>
                <option value="Perak">Perak</option>
                <option value="Perlis">Perlis</option>
                <option value="Sabah">Sabah</option>
                <option value="Sarawak">Sarawak</option>
                <option value="Selangor">Selangor</option>
                <option value="Terengganu">Terengganu</option>
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Labuan">Labuan</option>
                <option value="Putrajaya">Putrajaya</option>
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('zipCode')}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="50000"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-500">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-blue-950/30 to-purple-950/30 rounded-xl p-6 border border-blue-800/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">DNA Test Kit</span>
              <span className="text-white font-semibold">RM 49.00</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Shipping & Return Label</span>
              <span className="text-green-400 font-semibold">FREE</span>
            </div>
            <div className="border-t border-zinc-700 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total Due Today</span>
              <span className="text-3xl font-bold text-gradient">RM 49.00</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-zinc-900 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">📅 What Happens Next</h3>
            <div className="space-y-3">
              {[
                { day: 'Today', action: 'Order confirmed & kit prepared' },
                { day: 'Day 1-2', action: 'Kit ships via Pos Malaysia' },
                { day: 'Day 3-5', action: 'You receive kit & collect sample' },
                { day: 'Day 6-7', action: 'Return kit using prepaid label' },
                { day: 'Day 21-28', action: 'Results ready in your dashboard' }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-blue-400 text-sm font-semibold">{step.day}</div>
                    <div className="text-gray-400 text-sm">{step.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => navigate('/onboarding/dna-test')}
              className="btn-secondary flex items-center gap-2"
            >
              <span>←</span>
              Back
            </button>
            
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin">⚙️</span>
                  Processing...
                </>
              ) : (
                <>
                  Complete Order - $49
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-6 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <span>↩️</span>
            <span>Easy Returns</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
