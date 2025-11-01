import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  hasPurchased: boolean
  activePlans?: any[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Mock login - replace with real API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          hasPurchased: false,
        }
        
        set({ user: mockUser, isAuthenticated: true })
      },

      signup: async (email, password, name) => {
        // Mock signup - replace with real API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          hasPurchased: false,
        }
        
        set({ user: mockUser, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'apex-auth',
    }
  )
)
