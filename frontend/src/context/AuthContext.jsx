import { createContext, useContext, useState } from 'react'
import api from '../services/api'  // Import axios instance

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // user stores: { token, role, name, mustChangePassword }
  // null if not logged in
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')
    const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true'
    
    return token ? { token, role, name, mustChangePassword } : null
  })

  const [error, setError] = useState(null)  // Store any auth errors

  // Call this when user logs in with their data
  const login = (data) => {
    try {
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('name', data.name)
      localStorage.setItem('mustChangePassword', data.mustChangePassword || false)
      
      setUser(data)
      setError(null)  // Clear any previous errors
    } catch (err) {
      setError('Failed to login. Please try again.')
    }
  }

  // Call backend logout endpoint first, then clear localStorage
  const logout = async () => {
    try {
      // Call the backend logout endpoint to invalidate token on server
      await api.post('/auth/logout')
    } catch (err) {
      // Even if logout fails on server, still clear local session
      // (token might be expired or server down)
      console.error('Logout error:', err)
    } finally {
      // Always clear localStorage and reset user state
      localStorage.clear()
      setUser(null)
      setError(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth anywhere in your app
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}