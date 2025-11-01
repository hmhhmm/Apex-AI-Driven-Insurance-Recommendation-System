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

    // Validate files
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                          file.type.startsWith('image/jpeg') || 
                          file.type.startsWith('image/jpg') ||
                          file.type.startsWith('image/png')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      
      if (!isValidType) {
        alert(`${file.name} is not a supported file type. Please upload PDF, JPG, or PNG files.`)
        return false
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`)
        return false
      }
      return true
    })

    const newDocs: UploadedDoc[] = validFiles.map(file => ({
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

  const handleCategoryUpload = (categoryType: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      handleFileUpload(files, categoryType)
    }
    input.click()
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
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]" />
        <motion.div 
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold border border-green-500/20 backdrop-blur-xl">
              🎉 Step 4 of 4 - Final Step!
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-light mb-4">
            Secure <span className="font-normal bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Document Vault</span>
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
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8" style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
                <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
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
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8" style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
                <h3 className="font-light text-white mb-4">Quick Upload by Category</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {docTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleCategoryUpload(type.id)}
                      className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 hover:border-blue-500 text-center transition-all duration-300 group"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{type.icon}</div>
                      <div className="text-sm font-medium text-white">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-1">Click to upload</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedDocs.length > 0 && (
                <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8" style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
                  <h3 className="font-light text-white mb-4 flex items-center justify-between">
                    <span>📋 Uploaded Files ({uploadedDocs.length})</span>
                    <button
                      onClick={() => setUploadedDocs([])}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Clear All
                    </button>
                  </h3>
                  <div className="space-y-3">
                    {uploadedDocs.map((doc) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">
                            {docTypes.find(t => t.id === doc.type)?.icon || '📄'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{doc.name}</div>
                            <div className="text-sm text-gray-400">
                              {(doc.size / 1024).toFixed(2)} KB • {new Date(doc.uploadDate).toLocaleDateString()} {new Date(doc.uploadDate).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 rounded-lg transition-all"
                          >
                            👁️ View
                          </a>
                          <button
                            onClick={() => setUploadedDocs(prev => prev.filter(d => d.id !== doc.id))}
                            className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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
