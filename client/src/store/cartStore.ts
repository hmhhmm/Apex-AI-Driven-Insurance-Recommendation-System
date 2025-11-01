import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  type: string
  price: number
  features: string[]
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }))
  },
  
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
  
  clearCart: () => {
    set({ items: [] })
  },
  
  get total() {
    return get().items.reduce((sum, item) => sum + item.price, 0)
  },
}))
