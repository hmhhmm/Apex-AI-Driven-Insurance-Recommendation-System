import { motion, AnimatePresence } from 'framer-motion'
import { useChatPanel } from '../../hooks/useChatPanel'
import { useEscapeKey } from '../../hooks/useKeyboardShortcut'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import QuickActions from './QuickActions'
import ChatInput from './ChatInput'

const ChatPanel = () => {
  const { isOpen, closeChat } = useChatPanel()

  // Close chat on Escape key
  useEscapeKey(closeChat)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Chat Panel - Desktop */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="hidden md:flex fixed right-0 top-16 h-[calc(100vh-4rem)] w-[30%] min-w-[320px] max-w-[480px] bg-zinc-900/95 backdrop-blur-sm border-l border-zinc-700/50 shadow-2xl z-40 flex-col"
          >
            <ChatHeader />
            <ChatMessages />
            <QuickActions />
            <ChatInput />
          </motion.aside>

          {/* Chat Panel - Mobile (Full Screen Overlay) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300
            }}
            className="md:hidden fixed inset-0 top-16 bg-zinc-900 z-40 flex flex-col"
          >
            <ChatHeader />
            <ChatMessages />
            <QuickActions />
            <ChatInput />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatPanel
