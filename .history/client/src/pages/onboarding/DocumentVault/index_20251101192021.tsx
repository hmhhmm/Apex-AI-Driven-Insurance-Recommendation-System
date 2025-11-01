import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore, type DocumentVaultData } from '../../../store/onboardingStore'

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
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const docTypes = [
    { id: 'medical', label: 'Medical Records', icon: '🏥', color: 'blue' },
    { id: 'insurance', label: 'Insurance Cards', icon: '💳', color: 'purple' },
    { id: 'prescription', label: 'Prescriptions', icon: '💊', color: 'green' },
    { id: 'lab-report', label: 'Lab Reports', icon: '🔬', color: 'pink' }
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

  const handleComplete = async () => {
    saveDocumentVault({
      uploadedDocs,
      connectedProviders: []
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

        {/* Upload Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <div className="card text-center">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-3xl font-bold text-white">{uploadedDocs.length}</div>
            <div className="text-sm text-gray-500">Documents Uploaded</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">�</div>
            <div className="text-3xl font-bold text-white">256-bit</div>
            <div className="text-sm text-gray-500">Encryption Level</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
