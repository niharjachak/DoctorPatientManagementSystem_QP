import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import FormInput from '../../components/forms/FormInput'
import ErrorAlert from '../../components/shared/ErrorAlert'
import SuccessAlert from '../../components/shared/SuccessAlert'

// RegisterPage Component (Patient Registration)
// Purpose: Allow patients to register with name, email, password, phone, and DOB
// Features: Form validation, field-level error display, backend validation feedback
// Flow: User enters details → submit → API call → show success/errors → redirect or stay
const RegisterPage = () => {
  const navigate = useNavigate()

  // Form data state - stores all patient registration fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: ''
  })
  
  // Field-level validation errors from frontend or backend
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')  // General error message if API call fails
  const [success, setSuccess] = useState('')  // Success message after registration
  const [loading, setLoading] = useState(false)  // Loading state while API call is in progress

  // Update form state when user types in any input field
  // Also clear error for that field when user starts fixing it
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear this field's error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Handle form submission when user clicks Register button
  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent page reload
    setError('')  // Clear any previous API errors
    setErrors({})  // Clear any previous field errors
    setSuccess('')  // Clear any previous success message
    setLoading(true)  // Show loading state

    try {
      // Call backend registration API with patient data
      await api.post('/auth/register/patient', formData)
      
      // Show success message
      setSuccess('Registration successful! Please login.')
      
      // Redirect to login page after 2 seconds
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      // Check if backend returned field-level validation errors
      const fieldErrors = err.response?.data?.data
      
      if (fieldErrors && typeof fieldErrors === 'object') {
        // Backend returned validation errors for specific fields
        // Example: { password: "Password must contain ...", email: "Invalid format" }
        setErrors(fieldErrors)
      } else {
        // Backend returned general error or network error
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      // Hide loading state (runs whether success or error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        {/* Header - Shows app title and page title */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Doctor Patient System
        </h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">
          Register Patient
        </h2>

        {/* Error Message - Shows API errors if registration fails */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}

        {/* Success Message - Shows after successful registration */}
        {success && (
          <SuccessAlert message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>

          {/* Full Name Input - Using reusable FormInput component */}
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}  // Show error if validation failed
            placeholder="Enter your full name"
          />

          {/* Email Input - Using reusable FormInput component */}
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}  // Show error if validation failed
            placeholder="Enter your email"
          />

          {/* Password Input - Using reusable FormInput component */}
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}  // Show error if validation failed (both frontend & backend)
            placeholder="Min 8 chars with uppercase, lowercase, number & symbol"
          />

          {/* Phone Number Input - Using reusable FormInput component */}
          <FormInput
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}  // Show error if validation failed
            placeholder="10 digit phone number"
          />

          {/* Date of Birth Input - Simple date picker */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                errors.dateOfBirth
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Submit Button - Shows "Registering..." while loading */}
          <button
            type="submit"
            disabled={loading}  // Disable button while API call is in progress
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

        {/* Registration Type Link */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Want to register as admin?{' '}
          <Link to="/register-choice" className="text-blue-600 hover:underline">
            Change registration type
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage