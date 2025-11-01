import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateAIResponse, generateWelcomeMessage } from '../services/geminiService'

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
          const greeting = generateWelcomeMessage(context)
          
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
      sendMessage: async (content: string) => {
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

        // Get conversation history for context
        const messages = get().messages
        const conversationHistory = messages.slice(-6).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))

        try {
          // Generate AI response using Gemini
          const botResponse = await generateAIResponse(
            content,
            get().currentContext,
            conversationHistory
          )

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
        } catch (error) {
          console.error('Error generating AI response:', error)
          
          // Fallback response
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment. 😊",
            timestamp: new Date(),
            read: false,
          }

          set((state) => ({
            messages: [...state.messages, errorMessage],
            isTyping: false,
          }))
        }
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
