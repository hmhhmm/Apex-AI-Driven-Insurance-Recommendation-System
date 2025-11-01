import { useChatPanel } from '../../hooks/useChatPanel'

const ChatToggleButton = () => {
  const { isOpen, toggleChat, unreadCount } = useChatPanel()

  return (
    <button
      onClick={toggleChat}
      className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
      title="Toggle AI Assistant (Cmd/Ctrl + K)"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline font-medium">AI Assistant</span>
      
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
          {unreadCount}
        </span>
      )}
    </button>
  )
}

export default ChatToggleButton
