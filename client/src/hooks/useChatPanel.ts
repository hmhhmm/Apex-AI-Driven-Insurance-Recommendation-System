import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useChatPanelStore } from '../store/chatPanelStore'

export const useChatPanel = () => {
  const location = useLocation()
  const { 
    isOpen, 
    messages, 
    isTyping,
    openChat, 
    closeChat, 
    toggleChat, 
    sendMessage,
    setContext,
    markAsRead 
  } = useChatPanelStore()

  // Update context when route changes
  useEffect(() => {
    setContext(location.pathname)
  }, [location.pathname, setContext])

  // Get unread message count
  const unreadCount = messages.filter(m => !m.read && m.type === 'bot').length

  return {
    isOpen,
    messages,
    isTyping,
    unreadCount,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    markAsRead,
    currentPage: location.pathname,
  }
}
