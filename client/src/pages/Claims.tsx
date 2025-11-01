import { useState } from 'react'
import { motion } from 'framer-motion'

const Claims = () => {
  const [isFileClaimOpen, setIsFileClaimOpen] = useState(false)

  const mockActiveClaims = [
    {
      id: 'CLM-2024-001',
      type: 'Health',
      date: '2024-10-28',
      amount: 2500,
      status: 'processing',
      description: 'Medical consultation and lab tests',
    },
  ]

  const mockPastClaims = [
    {
      id: 'CLM-2024-002',
      type: 'Auto',
      date: '2024-09-15',
      amount: 1200,
      status: 'approved',
    },
    {
      id: 'CLM-2024-003',
      type: 'Travel',
      date: '2024-08-10',
      amount: 800,
      status: 'approved',
    },
  ]

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Manage Your Claims</h1>
            <p className="text-gray-400">Track and file insurance claims</p>
          </div>
          <button
            onClick={() => setIsFileClaimOpen(true)}
            className="btn-primary"
          >
            + File New Claim
          </button>
        </div>

        {/* Active Claims */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Active Claims</h2>
          {mockActiveClaims.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              No active claims
            </div>
          ) : (
            <div className="space-y-4">
              {mockActiveClaims.map((claim) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:shadow-xl hover:shadow-blue-500/10 transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-white">{claim.id}</h3>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-2">{claim.description}</p>
                      <div className="flex gap-6 text-sm text-gray-500">
                        <span>Type: {claim.type}</span>
                        <span>Date: {claim.date}</span>
                        <span className="font-semibold text-gray-300">Amount: ${claim.amount}</span>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 font-medium">
                      View Details →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Claims History */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-white">Past Claims</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-zinc-950 divide-y divide-zinc-800">
                  {mockPastClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-zinc-900">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {claim.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {claim.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {claim.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        ${claim.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-400 hover:text-blue-300 font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* File Claim Modal */}
        {isFileClaimOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">File New Claim</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Insurance Type
                  </label>
                  <select className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                    <option>Health</option>
                    <option>Auto</option>
                    <option>Travel</option>
                    <option>Life</option>
                    <option>Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Claim Amount
                  </label>
                  <input
                    type="number"
                    placeholder="$0.00"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your claim..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFileClaimOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Submit Claim
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Claims
