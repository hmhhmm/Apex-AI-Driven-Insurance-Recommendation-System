import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  read: boolean
}

interface ChatPanelState {
  // UI State
  isOpen: boolean
  currentContext: string // Current page user is on
  
  // Messages
  messages: Message[]
  isTyping: boolean
  
  // Actions
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  sendMessage: (content: string) => void
  markAsRead: () => void
  setContext: (context: string) => void
}

export const useChatPanelStore = create<ChatPanelState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: false,
      currentContext: '/',
      messages: [],
      isTyping: false,

      // Open chat
      openChat: () => {
        set({ isOpen: true })
        get().markAsRead()
        
        // Send context-aware greeting if no messages
        if (get().messages.length === 0) {
          const context = get().currentContext
          let greeting = "Hi! I'm your APEX AI Assistant. How can I help you today? 😊"
          
          if (context === '/dashboard') {
            greeting = "Hi! I see you're on your dashboard. I can help explain your policies, DNA results, or insurance recommendations. What would you like to know?"
          } else if (context === '/claims') {
            greeting = "Hi! I can help with your claim. Would you like to check a claim status or file a new one?"
          } else if (context === '/products') {
            greeting = "Hi! I can help you choose the right insurance plan based on your needs. What type of coverage are you interested in?"
          }
          
          set({
            messages: [{
              id: Date.now().toString(),
              type: 'bot',
              content: greeting,
              timestamp: new Date(),
              read: true,
            }],
          })
        }
      },

      // Close chat
      closeChat: () => set({ isOpen: false }),

      // Toggle chat
      toggleChat: () => {
        const { isOpen } = get()
        if (isOpen) {
          get().closeChat()
        } else {
          get().openChat()
        }
      },

      // Send message
      sendMessage: (content: string) => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content,
          timestamp: new Date(),
          read: true,
        }

        set((state) => ({
          messages: [...state.messages, userMessage],
          isTyping: true,
        }))

        // Simulate AI response
        setTimeout(() => {
          const botResponse = generateBotResponse(content, get().currentContext)
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: botResponse,
            timestamp: new Date(),
            read: false,
          }

          set((state) => ({
            messages: [...state.messages, botMessage],
            isTyping: false,
          }))
        }, 1500)
      },

      // Mark messages as read
      markAsRead: () => {
        set((state) => ({
          messages: state.messages.map((msg) => ({ ...msg, read: true })),
        }))
      },

      // Set current context
      setContext: (context: string) => set({ currentContext: context }),
    }),
    {
      name: 'chat-panel-storage',
      partialize: (state) => ({
        messages: state.messages,
        currentContext: state.currentContext,
      }),
    }
  )
)

// Generate contextual bot responses
function generateBotResponse(userMessage: string, context: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Context-specific responses
  if (context === '/dashboard') {
    if (lowerMessage.includes('dna') || lowerMessage.includes('genetic')) {
      return "Your DNA analysis shows your unique genetic risk profile. We've analyzed 10M+ markers to identify potential health risks. Would you like me to explain any specific findings?"
    }
    if (lowerMessage.includes('policy') || lowerMessage.includes('plan')) {
      return "Based on your DNA profile and lifestyle, we've recommended personalized insurance plans that could save you up to 40%. Would you like me to explain the recommendations?"
    }
  }

  if (context === '/claims') {
    if (lowerMessage.includes('status') || lowerMessage.includes('claim')) {
      return "I can help you check your claim status. Your most recent claim (CLM-2024-001) is currently being processed. The AI analysis is complete, and we're awaiting adjuster review. Expected resolution: 2-3 business days."
    }
    if (lowerMessage.includes('file') || lowerMessage.includes('new')) {
      return "To file a new claim, click the 'File New Claim' button. You'll need to provide incident details and upload photos. Our AI will analyze the damage and provide an instant estimate!"
    }
  }

  if (context === '/products') {
    if (lowerMessage.includes('health')) {
      return "Our health insurance plans are personalized based on your DNA. The Standard plan at $299/mo offers comprehensive coverage with a $2,000 deductible, including dental, vision, and prescription drugs. Would you like to see how it compares to your genetic risk profile?"
    }
    if (lowerMessage.includes('auto') || lowerMessage.includes('car')) {
      return "Our auto insurance starts at $49/mo for liability coverage. Based on your driving history and location, I'd recommend the Comprehensive plan at $89/mo. It includes collision, theft, and glass protection. Would you like to add it to your cart?"
    }
  }

  // General responses
  if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
    return "With APEX's DNA-driven approach, customers save an average of $3,600/year compared to traditional insurance. Your personalized rate is based on your actual genetic risk, not broad demographics. Would you like a detailed breakdown?"
  }

  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return "APEX uses three AI agents: DNA Agent (analyzes genetic markers), Cognitive Agent (processes lifestyle & medical history), and Quantum Risk Engine (calculates personalized premiums). This gives you fairer pricing and better coverage!"
  }

  if (lowerMessage.includes('help')) {
    return "I can help you with: 📊 Understanding your DNA results, 💎 Choosing the right insurance plan, 📋 Filing or checking claims, 💰 Calculating savings, 🧬 Ordering a DNA test kit. What would you like to know?"
  }

  // Default response
  return "I'm here to help! I can answer questions about your insurance policies, DNA analysis, claims, or help you find the right coverage. What would you like to know?"
}
