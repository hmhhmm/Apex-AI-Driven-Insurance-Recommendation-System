import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
}

export const useKeyboardShortcut = ({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  callback,
}: KeyboardShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all modifier keys match
      const ctrlMatch = ctrlKey ? event.ctrlKey : !event.ctrlKey
      const metaMatch = metaKey ? event.metaKey : !event.metaKey
      const shiftMatch = shiftKey ? event.shiftKey : !event.shiftKey
      const altMatch = altKey ? event.altKey : !event.altKey

      // Check if key matches (case-insensitive)
      const keyMatch = event.key.toLowerCase() === key.toLowerCase()

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrlKey, metaKey, shiftKey, altKey, callback])
}

// Specific hook for chat toggle (Cmd/Ctrl + K)
export const useChatToggleShortcut = (callback: () => void) => {
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    metaKey: true, // Works for both Ctrl (Windows) and Cmd (Mac)
    callback,
  })
}

// Specific hook for closing chat (Escape)
export const useEscapeKey = (callback: () => void) => {
  useKeyboardShortcut({
    key: 'Escape',
    callback,
  })
}
