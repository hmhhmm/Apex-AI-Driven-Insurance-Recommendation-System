import { useNavigate } from 'react-router-dom'
import { useChatPanel } from '../../hooks/useChatPanel'

const QuickActions = () => {
  const navigate = useNavigate()
  const { currentPage, sendMessage } = useChatPanel()

  // Define context-specific quick actions
  const actions = getQuickActionsForPage(currentPage)

  const handleAction = (action: QuickAction) => {
    if (action.navigate) {
      navigate(action.navigate)
    }
    if (action.message) {
      sendMessage(action.message)
    }
  }

  if (actions.length === 0) return null

  return (
    <div className="p-3 border-t border-zinc-700 bg-zinc-900">
      <p className="text-xs text-gray-400 mb-2 font-medium">Quick Actions</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs flex items-center gap-2 transition-colors text-gray-300 hover:text-white"
          >
            <span className="text-sm">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface QuickAction {
  id: string
  label: string
  icon: string
  navigate?: string
  message?: string
}

function getQuickActionsForPage(page: string): QuickAction[] {
  switch (page) {
    case '/':
      return [
        { id: '1', label: 'View Plans', icon: '💎', navigate: '/products' },
        { id: '2', label: 'How It Works', icon: '🤔', message: 'How does APEX insurance work?' },
        { id: '3', label: 'Get Started', icon: '🚀', navigate: '/' },
      ]

    case '/dashboard':
      return [
        { id: '1', label: 'Explain DNA Results', icon: '🧬', message: 'Can you explain my DNA analysis results?' },
        { id: '2', label: 'My Policies', icon: '📋', message: 'Show me my current policies' },
        { id: '3', label: 'Savings Calculator', icon: '💰', message: 'How much am I saving with APEX?' },
      ]

    case '/claims':
      return [
        { id: '1', label: 'Check Status', icon: '🔍', message: "What's the status of my claim?" },
        { id: '2', label: 'File New Claim', icon: '📝', message: 'How do I file a new claim?' },
        { id: '3', label: 'Upload Documents', icon: '📎', message: 'What documents do I need for a claim?' },
      ]

    case '/products':
      return [
        { id: '1', label: 'Health Plans', icon: '🏥', message: 'Tell me about health insurance plans' },
        { id: '2', label: 'Auto Plans', icon: '🚗', message: 'What auto insurance options do you have?' },
        { id: '3', label: 'Compare Plans', icon: '⚖️', message: 'Help me compare different plans' },
      ]

    case '/about':
      return [
        { id: '1', label: 'Contact Us', icon: '📞', navigate: '/contact' },
        { id: '2', label: 'Get Quote', icon: '💵', navigate: '/products' },
      ]

    case '/contact':
      return [
        { id: '1', label: 'Office Hours', icon: '🕐', message: 'What are your office hours?' },
        { id: '2', label: 'Emergency Support', icon: '🚨', message: 'I need emergency claim support' },
      ]

    default:
      return [
        { id: '1', label: 'View Dashboard', icon: '📊', navigate: '/dashboard' },
        { id: '2', label: 'Browse Plans', icon: '💎', navigate: '/products' },
        { id: '3', label: 'Help', icon: '❓', message: 'What can you help me with?' },
      ]
  }
}

export default QuickActions
