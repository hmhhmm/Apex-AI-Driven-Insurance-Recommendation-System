import { useChatPanel } from '../../hooks/useChatPanel'

const ChatHeader = () => {
  const { closeChat } = useChatPanel()

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-800 border-b border-zinc-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-base text-white">APEX AI Assistant</h3>
          <p className="text-xs flex items-center gap-1 text-gray-400">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Online
          </p>
        </div>
      </div>

      <button
        onClick={closeChat}
        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-gray-400 hover:text-white"
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
