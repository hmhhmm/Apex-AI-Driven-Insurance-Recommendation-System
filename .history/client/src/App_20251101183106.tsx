import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useChatPanel } from './hooks/useChatPanel'
import { useChatToggleShortcut } from './hooks/useKeyboardShortcut'
import Navigation from './components/layout/Navigation'
import ChatPanel from './components/chat/ChatPanel'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import Purchase from './pages/Purchase'

// Onboarding Pages
import AvatarSelection from './pages/onboarding/AvatarSelection'
import QuickAssessment from './pages/onboarding/QuickAssessment'
import AccountCreation from './pages/onboarding/AccountCreation'
import DNATestSelection from './pages/onboarding/DNATestOptions'
import OrderKit from './pages/onboarding/DNATestOptions/OrderKit'
import UploadExisting from './pages/onboarding/DNATestOptions/UploadExisting'
import ScheduleLab from './pages/onboarding/DNATestOptions/ScheduleLab'
import DocumentVault from './pages/onboarding/DocumentVault'

// Main app content that needs Router context
function AppContent() {
  const { isAuthenticated } = useAuthStore()
  const { isOpen, toggleChat } = useChatPanel()

  // Keyboard shortcut: Cmd/Ctrl + K to toggle chat
  useChatToggleShortcut(toggleChat)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 relative">
        {/* Main Content Area - Resizes when chat is open */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isOpen ? 'md:mr-[25%] md:min-w-0' : 'w-full'
          }`}
          style={{
            minWidth: isOpen ? '75%' : '100%',
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/purchase" element={<Purchase />} />

            {/* Onboarding Flow */}
            <Route path="/onboarding/avatar-selection" element={<AvatarSelection />} />
            <Route path="/onboarding/quick-assessment" element={<QuickAssessment />} />
            <Route path="/onboarding/account" element={<AccountCreation />} />
            <Route path="/onboarding/dna-test" element={<DNATestSelection />} />
            <Route path="/onboarding/dna-test/order-kit" element={<OrderKit />} />
            <Route path="/onboarding/dna-test/upload-existing" element={<UploadExisting />} />
            <Route path="/onboarding/dna-test/schedule-lab" element={<ScheduleLab />} />
            <Route path="/onboarding/documents" element={<DocumentVault />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/claims" 
              element={isAuthenticated ? <Claims /> : <Navigate to="/" />} 
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Slide-out Chat Panel */}
        <ChatPanel />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
