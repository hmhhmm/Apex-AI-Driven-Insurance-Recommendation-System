import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore, type DocumentVaultData } from '../../../store/onboardingStore'

type TabType = 'upload' | 'import' | 'manage'

interface UploadedDoc {
  id: string
  name: string
  type: 'medical' | 'insurance' | 'prescription' | 'lab-report'
  uploadDate: string
  url: string
  size: number
}

export default function DocumentVault() {
  const navigate = useNavigate()
  const { saveDocumentVault, completeOnboarding, goToPreviousStep } = useOnboardingStore()
  const [activeTab, setActiveTab] = useState<TabType>('upload')
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])
  const [connectedProviders, setConnectedProviders] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const docTypes = [
    { id: 'medical', label: 'Medical Records', icon: '🏥', color: 'blue' },
    { id: 'insurance', label: 'Insurance Cards', icon: '💳', color: 'purple' },
    { id: 'prescription', label: 'Prescriptions', icon: '💊', color: 'green' },
    { id: 'lab-report', label: 'Lab Reports', icon: '🔬', color: 'pink' }
  ]

  const providers = [
    { id: 'epic', name: 'Epic MyChart', icon: '🏥', connected: false },
    { id: 'kaiser', name: 'Kaiser Permanente', icon: '⚕️', connected: false },
    { id: 'anthem', name: 'Anthem Blue Cross', icon: '💙', connected: false },
    { id: 'cigna', name: 'Cigna', icon: '📋', connected: false }
  ]

  const handleFileUpload = async (files: FileList | null, type: string) => {
    if (!files) return

    const newDocs: UploadedDoc[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: type as any,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file),
      size: file.size
    }))

    setUploadedDocs(prev => [...prev, ...newDocs])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files, 'medical')
  }

  const connectProvider = async (providerId: string) => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setConnectedProviders(prev => [...prev, providerId])
    setIsProcessing(false)
  }

  const handleComplete = async () => {
    saveDocumentVault({
      uploadedDocs,
      connectedProviders
    })
    completeOnboarding()
    navigate('/dashboard')
  }

  const handleBack = () => {
    goToPreviousStep()
    navigate('/onboarding/dna-test')
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-950/50 text-blue-400 rounded-full text-sm font-semibold border border-blue-800/30">
              Step 4 of 4 - Final Step!
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Secure Document Vault</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Store and manage your medical documents securely (Optional - You can skip this step)
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 w-full bg-zinc-900 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'upload', label: 'Smart Upload', icon: '📤' },
            { id: 'import', label: 'Auto Import', icon: '🔗' },
            { id: 'manage', label: 'Manage', icon: '📁' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-zinc-900 text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Smart Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Drag & Drop Zone */}
              <div className="card">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📤</span> Upload Documents
                </h2>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-950/30'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-5xl mb-4">📁</div>
                  <div className="text-lg font-semibold text-white mb-2">
                    Drag & drop files here
                  </div>
                  <div className="text-sm text-gray-400 mb-4">or</div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary"
                  >
                    Browse Files
                  </button>
                  <div className="text-xs text-gray-500 mt-4">
                    Supports: PDF, JPG, PNG (Max 10MB per file)
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files, 'medical')}
                    className="hidden"
                  />
                </div>

                {/* OCR Feature Highlight */}
                <div className="mt-6 p-4 bg-purple-950/20 rounded-lg border border-purple-800/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <div className="font-semibold text-white mb-1">AI-Powered OCR</div>
                      <div className="text-sm text-gray-400">
                        Our AI automatically extracts key information from your documents, 
                        making them searchable and organized.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Category Upload */}
              <div className="card">
                <h3 className="font-bold text-white mb-4">Quick Upload by Category</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {docTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 hover:border-blue-500 text-center transition-all duration-300"
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium text-white">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Auto Import Tab */}
          {activeTab === 'import' && (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🔗</span> Connect Healthcare Providers
              </h2>
              <p className="text-gray-400 mb-8">
                Automatically import your medical records from your healthcare providers
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {providers.map((provider) => {
                  const isConnected = connectedProviders.includes(provider.id)
                  return (
                    <div
                      key={provider.id}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        isConnected
                          ? 'border-green-500 bg-green-950/20'
                          : 'border-zinc-800 bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{provider.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{provider.name}</div>
                            {isConnected && (
                              <div className="text-sm text-green-400">✓ Connected</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {!isConnected ? (
                        <button
                          onClick={() => connectProvider(provider.id)}
                          disabled={isProcessing}
                          className="w-full btn-primary text-sm disabled:opacity-50"
                        >
                          {isProcessing ? 'Connecting...' : 'Connect'}
                        </button>
                      ) : (
                        <div className="text-sm text-gray-400">
                          Last synced: Just now
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-blue-950/20 rounded-lg border border-blue-800/30">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Bank-level security:</span> We use OAuth 2.0 for 
                    secure authentication. We never store your login credentials.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📁</span> Your Documents ({uploadedDocs.length})
              </h2>

              {uploadedDocs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📂</div>
                  <div className="text-gray-400 mb-4">No documents uploaded yet</div>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="btn-secondary"
                  >
                    Upload Documents
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {docTypes.find(t => t.id === doc.type)?.icon || '📄'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{doc.name}</div>
                          <div className="text-sm text-gray-400">
                            {(doc.size / 1024).toFixed(2)} KB • {new Date(doc.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-400 hover:text-blue-300">
                          👁️ View
                        </button>
                        <button
                          onClick={() => setUploadedDocs(prev => prev.filter(d => d.id !== doc.id))}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-12"
        >
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center gap-2"
          >
            <span>←</span>
            Back
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleComplete}
              className="btn-secondary"
            >
              Skip for Now
            </button>
            
            <button
              onClick={handleComplete}
              className="btn-primary flex items-center gap-2"
            >
              Complete Onboarding
              <span>🎉</span>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-4"
        >
          <div className="card text-center">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-white">{uploadedDocs.length}</div>
            <div className="text-sm text-gray-500">Documents Uploaded</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-white">{connectedProviders.length}</div>
            <div className="text-sm text-gray-500">Providers Connected</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-2xl font-bold text-white">256-bit</div>
            <div className="text-sm text-gray-500">Encryption Level</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
