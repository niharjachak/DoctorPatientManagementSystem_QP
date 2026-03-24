import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// This component checks if the user is logged in and has the right role
// If yes: it shows the page <Component />
// If no: it redirects to login

// Without this, any logged-in patient could type /admin/analytics in the browser and see admin pages
// It protects your app from unauthorized access

export default function ProtectedRoute({ 
  component: Component,  // The page/component to protect
  requiredRole          // The role needed (e.g., "ROLE_PATIENT", "ROLE_ADMIN")
}) {
  const { user } = useAuth()  // Get current logged-in user from context

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If requiredRole is specified AND user's role doesn't match, redirect to dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  // If checks pass, show the component
  return <Component />
}