import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../../store/onboardingStore'

export default function UploadExisting() {
  const navigate = useNavigate()
  const { saveDNATest, setCurrentStep } = useOnboardingStore()
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const providers = [
    { id: '23andme', name: '23andMe', icon: '🧬', formats: '.zip, .txt' },
    { id: 'ancestry', name: 'AncestryDNA', icon: '🌳', formats: '.zip, .txt' },
    { id: 'myheritage', name: 'MyHeritage', icon: '👨‍👩‍👧', formats: '.csv' },
    { id: 'ftdna', name: 'FamilyTreeDNA', icon: '🌲', formats: '.csv' },
    { id: 'other', name: 'Other Provider', icon: '📄', formats: '.txt, .csv, .zip' }
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider || !uploadedFile) return

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    saveDNATest({
      option: 'upload-existing',
      existingProvider: selectedProvider,
      existingFileUrl: URL.createObjectURL(uploadedFile)
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
          <div className="text-6xl mb-4">📤</div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Upload Existing Results</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Already have DNA test results? Upload them and get instant analysis!
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Provider Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🏢</span> Select Your Provider
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    selectedProvider === provider.id
                      ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/20'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{provider.icon}</span>
                    <span className="font-semibold text-white">{provider.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">Accepts: {provider.formats}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* How to Download Instructions */}
          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-blue-950/20 border-blue-800/30"
            >
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span>💡</span> How to Download Your Raw Data
              </h3>
              
              {selectedProvider === '23andme' && (
                <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                  <li>Log in to your 23andMe account</li>
                  <li>Go to Settings → Download Raw Data</li>
                  <li>Request your raw data file</li>
                  <li>Wait for email confirmation (usually within minutes)</li>
                  <li>Download the ZIP file and upload it here</li>
                </ol>
              )}
              
              {selectedProvider === 'ancestry' && (
                <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                  <li>Log in to your AncestryDNA account</li>
                  <li>Click on DNA → Your DNA Results Summary</li>
                  <li>Scroll down and click "Download DNA Data"</li>
                  <li>Confirm your download request</li>
                  <li>Download the file and upload it here</li>
                </ol>
              )}

              {(selectedProvider === 'myheritage' || selectedProvider === 'ftdna' || selectedProvider === 'other') && (
                <p className="text-gray-400 text-sm">
                  Please download your raw DNA data file from your provider's website, 
                  then upload it here. The file is usually found in your account settings 
                  or DNA results section.
                </p>
              )}
            </motion.div>
          )}

          {/* File Upload */}
          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📁</span> Upload Your File
              </h2>

              {/* Drag & Drop Zone */}
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
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="text-5xl">✅</div>
                    <div>
                      <div className="text-lg font-semibold text-white">{uploadedFile.name}</div>
                      <div className="text-sm text-gray-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-5xl">📁</div>
                    <div>
                      <div className="text-lg font-semibold text-white mb-2">
                        Drop your file here
                      </div>
                      <div className="text-sm text-gray-400 mb-4">or</div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary"
                      >
                        Browse Files
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Supported formats: .zip, .txt, .csv (Max 50MB)
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".zip,.txt,.csv"
                  className="hidden"
                />
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-green-950/20 rounded-lg border border-green-800/30">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Your data is secure:</span> All files are encrypted during 
                    upload and stored in HIPAA-compliant servers. We never share your genetic data with third parties.
                  </div>
                </div>
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
              disabled={!selectedProvider || !uploadedFile || isProcessing}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin">⚙️</span>
                  Analyzing...
                </>
              ) : (
                <>
                  Continue (FREE)
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          {[
            { icon: '⚡', title: 'Instant Results', desc: 'No waiting period' },
            { icon: '💰', title: 'Free Analysis', desc: 'Save $49 on DNA kit' },
            { icon: '🎯', title: 'Same Accuracy', desc: 'Identical AI analysis' }
          ].map((benefit, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{benefit.icon}</div>
              <div className="font-semibold text-white mb-1">{benefit.title}</div>
              <div className="text-xs text-gray-500">{benefit.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
