import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useChatPanel } from './hooks/useChatPanel'
import { useChatToggleShortcut } from './hooks/useKeyboardShortcut'
import Navigation from './components/layout/Navigation'
import ChatPanel from './components/chat/ChatPanel'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Purchase from './pages/Purchase'
import AIAnalysis from './pages/AIAnalysis'
import RecommendationsPage from './pages/RecommendationsPage'

// Onboarding Pages
import AvatarSelection from './pages/onboarding/AvatarSelection'
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
  const location = useLocation()

  // Keyboard shortcut: Cmd/Ctrl + K to toggle chat
  useChatToggleShortcut(toggleChat)

  // Hide navigation on onboarding pages
  const isOnboardingPage = location.pathname.startsWith('/onboarding')

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-x-hidden">
      {!isOnboardingPage && <Navigation />}
      
      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Main Content Area - Resizes when chat is open */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${
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
              path="/analysis" 
              element={isAuthenticated ? <AIAnalysis /> : <Navigate to="/" />} 
            />
            <Route 
              path="/recommendations" 
              element={isAuthenticated ? <RecommendationsPage /> : <Navigate to="/" />} 
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
