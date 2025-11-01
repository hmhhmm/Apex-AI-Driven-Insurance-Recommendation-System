// AI Assistant Chat Type Definitions

export interface Message {
  id: string
  conversationId: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  read: boolean
  metadata?: {
    intent?: string
    confidence?: number
    suggestedActions?: string[]
  }
}

export interface Conversation {
  id: string
  title: string
  userId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  metadata?: {
    topic?: string
    tags?: string[]
  }
}

export interface UserContext {
  userId: string
  policies: Array<{
    id: string
    type: string
    status: string
    premium: number
  }>
  claims: Array<{
    id: string
    status: string
    amount: number
  }>
  dnaTestStatus: 'not_ordered' | 'ordered' | 'processing' | 'complete'
  dnaResults?: {
    riskScore: number
    recommendations: string[]
  }
  onboardingComplete: boolean
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  action: () => void
}
