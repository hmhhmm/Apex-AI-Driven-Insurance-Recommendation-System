import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import ChatToggleButton from '../chat/ChatToggleButton'

const Navigation = () => {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', requireAuth: true },
    { path: '/purchase', label: 'Browse Plans', requireAuth: false },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center h-16">
          
          {/* Logo - Simple Text Only */}
          <Link to="/" className="flex items-center pl-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
              APEX
            </span>
          </Link>

          {/* Spacer to push everything right */}
          <div className="flex-1"></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 -mr-4">
            {navLinks.map((link) => {
              if (link.requireAuth && !isAuthenticated) return null
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-all pb-1 ${
                    location.pathname === link.path
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-purple-400'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* AI Assistant Button */}
            <ChatToggleButton />

            {/* Account Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-900 transition border border-transparent hover:border-zinc-800"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-purple-500/30">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{user?.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-950 rounded-lg shadow-2xl border border-zinc-800 py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-900 hover:text-purple-400 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <hr className="my-2 border-zinc-800" />
                    <button
                      onClick={() => {
                        logout()
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-900 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/onboarding/avatar-selection"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-900 text-gray-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-zinc-800">
            {navLinks.map((link) => {
              if (link.requireAuth && !isAuthenticated) return null
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2 text-gray-300 hover:bg-zinc-900 rounded hover:text-purple-400 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            
            {isAuthenticated && (
              <>
                <div className="px-4 py-2 text-sm text-gray-500 border-t border-zinc-800 pt-4">
                  Signed in as {user?.email}
                </div>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-900 rounded transition"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
