import { useChatPanel } from '../../hooks/useChatPanel'

const ChatHeader = () => {
  const { closeChat } = useChatPanel()

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-b border-blue-500/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          🤖
        </div>
        <div>
          <h3 className="font-semibold text-lg">APEX AI Assistant</h3>
          <p className="text-xs opacity-90 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online & Ready
          </p>
        </div>
      </div>

      <button
        onClick={closeChat}
        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        title="Close (Esc)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default ChatHeader
