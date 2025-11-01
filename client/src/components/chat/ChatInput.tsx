import { useState } from 'react'
import { useChatPanel } from '../../hooks/useChatPanel'

const ChatInput = () => {
  const [inputValue, setInputValue] = useState('')
  const { sendMessage, isTyping } = useChatPanel()

  const handleSend = () => {
    if (inputValue.trim() && !isTyping) {
      sendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t border-zinc-700 bg-zinc-900">
      <div className="flex gap-2 items-end">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
          className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send (Enter)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-gray-400 font-mono text-xs">Enter</kbd> to send
      </p>
    </div>
  )
}

export default ChatInput
