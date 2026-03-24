import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// This appears at the top of every page showing app title, user name, and logout button
export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')  // Send user back to login after logout
  }

  return (
    <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center">
        {/* Left side: App title */}
        <div>
          <h1 className="text-2xl font-bold">Doctor Patient System</h1>
        </div>

        {/* Right side: User info and logout */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}