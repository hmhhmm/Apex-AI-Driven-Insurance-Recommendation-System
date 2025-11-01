import { create } from 'zustand'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  read: boolean
}

interface ChatState {
  messages: Message[]
  isTyping: boolean
  sendMessage: (type: 'user' | 'bot', content: string) => void
  markAsRead: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,

  sendMessage: (type, content) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date(),
      read: type === 'user',
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    // If user sent message, simulate bot response
    if (type === 'user') {
      set({ isTyping: true })
      
      setTimeout(() => {
        const botResponse = generateBotResponse(content)
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'bot',
              content: botResponse,
              timestamp: new Date(),
              read: false,
            },
          ],
          isTyping: false,
        }))
      }, 1500)
    }
  },

  markAsRead: () => {
    set((state) => ({
      messages: state.messages.map((msg) => ({ ...msg, read: true })),
    }))
  },
}))

function generateBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  
  if (lower.includes('claim')) {
    return "I can help you file a claim! Would you like to start the process now? It only takes a few minutes."
  }
  if (lower.includes('dna') || lower.includes('test')) {
    return "Our DNA test analyzes over 10 million genetic markers to personalize your insurance. You can upload existing results or order our kit for $49!"
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('save')) {
    return "APEX customers save an average of $3,600/year compared to traditional insurance! Bundle 3+ plans for up to 40% off."
  }
  if (lower.includes('how') || lower.includes('work')) {
    return "Here's how APEX works: 1) Complete your profile 2) Take DNA test 3) Our AI creates personalized plans 4) Choose your coverage 5) Start saving!"
  }
  
  return "I'm here to help! You can ask me about claims, DNA testing, pricing, or how APEX works. What would you like to know?"
}
