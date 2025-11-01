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
    <div className="p-4 border-t border-zinc-800 bg-zinc-950">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
          className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send (Enter)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press <kbd className="px-2 py-1 bg-zinc-800 rounded text-gray-400">Enter</kbd> to send, 
        <kbd className="px-2 py-1 bg-zinc-800 rounded text-gray-400 ml-1">Shift + Enter</kbd> for new line
      </p>
    </div>
  )
}

export default ChatInput
