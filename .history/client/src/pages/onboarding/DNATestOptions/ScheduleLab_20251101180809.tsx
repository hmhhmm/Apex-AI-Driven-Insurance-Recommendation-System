import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../../store/onboardingStore'

const scheduleSchema = z.object({
  location: z.string().min(1, 'Please select a lab location'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time')
})

type FormData = z.infer<typeof scheduleSchema>

export default function ScheduleLab() {
  const navigate = useNavigate()
  const { saveDNATest, setCurrentStep } = useOnboardingStore()
  const [searchZip, setSearchZip] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showLocations, setShowLocations] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(scheduleSchema)
  })

  const mockLocations = [
    { id: '1', name: 'Quest Diagnostics - Downtown', address: '123 Main St, San Francisco, CA 94102', distance: '0.8 mi', slots: 15 },
    { id: '2', name: 'LabCorp - Mission District', address: '456 Valencia St, San Francisco, CA 94110', distance: '1.2 mi', slots: 8 },
    { id: '3', name: 'Quest Diagnostics - Marina', address: '789 Chestnut St, San Francisco, CA 94123', distance: '2.5 mi', slots: 12 },
    { id: '4', name: 'Bio-Reference Labs', address: '321 Market St, San Francisco, CA 94103', distance: '0.5 mi', slots: 6 }
  ]

  const availableTimes = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ]

  const handleSearchLocations = async () => {
    if (!searchZip) return
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowLocations(true)
    setIsSearching(false)
  }

  const onSubmit = async (data: FormData) => {
    saveDNATest({
      option: 'schedule-lab',
      labAppointment: data
    })

    setCurrentStep('document-vault')
    navigate('/onboarding/documents')
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Schedule Lab Visit</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Visit a certified partner lab for professional blood draw and most comprehensive analysis
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: '🔬', title: 'Most Comprehensive', desc: 'Blood sample provides detailed analysis' },
            { icon: '👨‍⚕️', title: 'Professional Collection', desc: 'Trained phlebotomists' },
            { icon: '⚡', title: 'Faster Results', desc: 'Results in 1-2 weeks' }
          ].map((benefit, i) => (
            <div key={i} className="card text-center">
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <div className="font-semibold text-white mb-1">{benefit.title}</div>
              <div className="text-sm text-gray-400">{benefit.desc}</div>
            </div>
          ))}
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Search Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📍</span> Find Nearby Labs
            </h2>

            <div className="flex gap-4">
              <input
                type="text"
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                placeholder="Enter ZIP code"
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleSearchLocations}
                disabled={isSearching}
                className="btn-primary disabled:opacity-50"
              >
                {isSearching ? (
                  <span className="inline-block animate-spin">🔄</span>
                ) : (
                  'Search'
                )}
              </button>
            </div>

            {/* Location Results */}
            {showLocations && (
              <div className="mt-6 space-y-3">
                {mockLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => setValue('location', location.name)}
                    className="w-full p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 hover:border-blue-500 text-left transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-white">{location.name}</div>
                      <div className="text-sm text-blue-400">{location.distance}</div>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{location.address}</div>
                    <div className="text-xs text-green-400">✓ {location.slots} appointments available this week</div>
                  </button>
                ))}
              </div>
            )}
            {errors.location && (
              <p className="mt-2 text-sm text-red-500">{errors.location.message}</p>
            )}
          </motion.div>

          {/* Date & Time Selection */}
          {showLocations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📅</span> Choose Date & Time
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('date')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('time')}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>
                  )}
                </div>
              </div>

              {/* What to Expect */}
              <div className="mt-6 p-4 bg-blue-950/20 rounded-lg border border-blue-800/30">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📋</span> What to Expect
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Appointment takes 10-15 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Bring a valid ID and appointment confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Fast for 8 hours before visit (water is okay)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>Wear short sleeves or easily rolled-up sleeves</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Price Summary */}
          {showLocations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-blue-950/30 to-purple-950/30 border-blue-800/30"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Lab Visit & DNA Analysis</span>
                <span className="text-white font-semibold">$79.00</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Professional Blood Draw</span>
                <span className="text-green-400 font-semibold">Included</span>
              </div>
              <div className="border-t border-zinc-700 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total Due at Lab</span>
                <span className="text-3xl font-bold text-gradient">$79.00</span>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
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
              disabled={!showLocations}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Appointment
              <span>→</span>
            </button>
          </div>
        </form>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-6 text-sm text-gray-500"
        >
          {[
            { icon: '✓', label: 'CLIA Certified' },
            { icon: '🏆', label: '500+ Locations' },
            { icon: '⭐', label: '4.9/5 Rating' },
            { icon: '🔒', label: 'HIPAA Compliant' }
          ].map((trust, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{trust.icon}</span>
              <span>{trust.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
