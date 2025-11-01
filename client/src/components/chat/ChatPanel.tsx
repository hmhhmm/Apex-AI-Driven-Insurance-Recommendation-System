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
          {/* Optional backdrop for focus - uncomment if desired */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black/20 z-30"
          /> */}

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
            className="hidden md:flex fixed right-0 top-16 h-[calc(100vh-4rem)] w-[25%] min-w-[300px] max-w-[500px] bg-zinc-950 border-l border-zinc-800 shadow-2xl shadow-black/50 z-40 flex-col"
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
            className="md:hidden fixed inset-0 top-16 bg-zinc-950 z-40 flex flex-col"
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
