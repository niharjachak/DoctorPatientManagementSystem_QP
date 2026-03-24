import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

// LoginPage Component
// Purpose: Allow users to log in with email and password
// Flow: User enters credentials → submit → API call → store user in context → redirect based on role
const LoginPage = () => {
  const navigate = useNavigate()  // Hook to programmatically navigate to different pages
  const { login } = useAuth()  // Function from context to store logged-in user

  // Form data state - stores email and password values
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  // Field-level validation errors
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')  // Error message if login fails
  const [loading, setLoading] = useState(false)  // Loading state while API call is in progress

  // Update form state when user types in an input field
  // Also clear error for that field when user starts typing
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear this field's error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Handle form submission when user clicks Login button
  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent page reload on form submit
    setError('')  // Clear any previous errors
    setErrors({})  // Clear any previous field errors
    setLoading(true)  // Show loading state

    try {
      // Call backend login API with email and password
      const response = await api.post('/auth/login', formData)
      const data = response.data.data  // Extract user data from response

      // Save user info to AuthContext (global state) and localStorage
      login(data)

      // Redirect user based on their role
      // ROLE_ADMIN → Admin Dashboard
      // ROLE_DOCTOR → Password change page (if first login) or Doctor Dashboard
      // ROLE_PATIENT → Patient Dashboard
      if (data.role === 'ROLE_ADMIN') navigate('/admin/dashboard')
      else if (data.role === 'ROLE_DOCTOR') {
        if (data.mustChangePassword) navigate('/change-password')
        else navigate('/doctor/dashboard')
      }
      else if (data.role === 'ROLE_PATIENT') navigate('/patient/dashboard')

    } catch (err) {
      // Check if backend returned field-level validation errors
      const fieldErrors = err.response?.data?.data
      
      if (fieldErrors && typeof fieldErrors === 'object') {
        // Backend returned validation errors for specific fields
        setErrors(fieldErrors)
      } else {
        // Show error message from backend or generic error message
        setError(err.response?.data?.message || 'Login failed. Please try again.')
      }
    } finally {
      // Hide loading state (runs whether success or error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        {/* Header - Shows app title */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Doctor Patient System
        </h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">
          Login to your account
        </h2>

        {/* Error Message - Shows only if there's an error */}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email Input Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"  // Must match formData.email key
              value={formData.email}  // Value from state
              onChange={handleChange}  // Update state when user types
              placeholder="Enter your email"
              required  // HTML5 validation - field is required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"  // Hides typed text with dots
              name="password"  // Must match formData.password key
              value={formData.password}  // Value from state
              onChange={handleChange}  // Update state when user types
              placeholder="Enter your password"
              required  // HTML5 validation - field is required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit Button - Shows "Logging in..." while loading */}
          <button
            type="submit"
            disabled={loading}  // Disable button while API call is in progress
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register-choice" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage