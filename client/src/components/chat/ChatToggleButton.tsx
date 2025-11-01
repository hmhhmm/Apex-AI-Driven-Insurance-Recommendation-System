import { useChatPanel } from '../../hooks/useChatPanel'
import { Sparkles } from 'lucide-react'

const ChatToggleButton = () => {
  const { isOpen, toggleChat, unreadCount } = useChatPanel()

  return (
    <button
      onClick={toggleChat}
      className="relative flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-purple-900/40 to-purple-800/30 backdrop-blur-xl text-purple-300 rounded-xl hover:from-purple-800/50 hover:to-purple-700/40 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30"
      title="Toggle AI Assistant (Cmd/Ctrl + K)"
    >
      <div className="relative">
        <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 blur-md bg-purple-400/20 group-hover:bg-purple-300/30 transition-all duration-300" />
      </div>
      <span className="hidden sm:inline font-medium text-sm bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
        AI Assistant
      </span>
      
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-xs flex items-center justify-center font-bold animate-pulse text-white shadow-lg shadow-red-500/50">
          {unreadCount}
        </span>
      )}
    </button>
  )
}

export default ChatToggleButton
