import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import FormInput from '../../components/forms/FormInput'
import FormSelect from '../../components/forms/FormSelect'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorAlert from '../../components/shared/ErrorAlert'
import SuccessAlert from '../../components/shared/SuccessAlert'

// AdminRegisterPage Component
// Purpose: Allow hospital admins to register by selecting a hospital
// Features: Hospital dropdown (fetched from backend), form validation, error/success messages
// Flow: Component mounts → fetch hospitals → User fills form → submit → validate → API call → redirect
export default function AdminRegisterPage() {
  const navigate = useNavigate()

  // Form data state - stores admin registration fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    hospitalId: ''  // Hospital selection from dropdown
  })

  // Validation errors for each field
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')  // General error message (API errors)
  const [success, setSuccess] = useState('')  // Success message
  const [loading, setLoading] = useState(false)  // Loading state during form submission
  const [fetchingHospitals, setFetchingHospitals] = useState(true)  // Loading state while fetching hospitals
  const [hospitals, setHospitals] = useState([])  // List of hospitals from backend

  // Fetch hospitals from backend when component first loads
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        // Call backend to get all hospitals
        const response = await api.get('/public/getHospitals')
        
        // Convert hospital objects to dropdown option format
        // {id, name} → {value: id, label: name}
        const options = response.data.map((hospital) => ({
          label: hospital.name,
          value: hospital.id.toString()
        }))
        setHospitals(options)  // Store formatted options
      } catch (err) {
        console.error('Failed to fetch hospitals:', err)
        setError('Failed to load hospitals. Please try again.')
      } finally {
        setFetchingHospitals(false)  // Hide loading spinner
      }
    }

    fetchHospitals()
  }, [])  // Empty dependency array = run only once on mount

  // Update form state when user types in any field
  // Also clear error for that specific field when user starts fixing it
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear this field's error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Validate all form fields before submission
  const validateForm = () => {
    const newErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Validate password - Must meet all requirements
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase letter'
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain lowercase letter'
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain number'
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain special character (!@#$%^&*)'
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits'
    }

    // Validate hospital selection
    if (!formData.hospitalId) {
      newErrors.hospitalId = 'Hospital selection is required'
    }

    setErrors(newErrors)  // Store all errors in state
    return Object.keys(newErrors).length === 0  // Return true if no errors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()  // Prevent page reload
    setError('')  // Clear previous API errors
    setSuccess('')  // Clear previous success message

    // Validate form first - if errors, don't submit
    if (!validateForm()) {
      return
    }

    setLoading(true)  // Show loading state

    try {
      // Call backend registration API with admin data
      const response = await api.post('/auth/register/admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        hospitalId: parseInt(formData.hospitalId)  // Convert string to number
      })

      setSuccess('Registration successful! Redirecting to login...')
      // Redirect to login after 2 seconds
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
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.'
        )
      }
    } finally {
      setLoading(false)  // Hide loading state
    }
  }

  // Show loading spinner while fetching hospitals
  if (fetchingHospitals) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Loading hospitals...</h2>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header - Shows app title and page purpose */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Doctor Patient System
        </h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">
          Register as Hospital Admin
        </h2>

        {/* Error Message - Shows API errors if registration fails */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}

        {/* Success Message - Shows after successful registration */}
        {success && (
          <SuccessAlert message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* Admin Registration Form */}
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
            error={errors.password}  // Show error if validation failed
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

          {/* Hospital Selection Dropdown - Using reusable FormSelect component */}
          <FormSelect
            label="Select Hospital"
            name="hospitalId"
            value={formData.hospitalId}
            onChange={handleChange}
            options={hospitals}  // List of hospitals fetched from backend
            error={errors.hospitalId}  // Show error if validation failed
            placeholder="Choose your hospital"
          />

          {/* Submit Button - Shows "Registering..." while loading */}
          <button
            type="submit"
            disabled={loading}  // Disable while API call is in progress
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Login Link - For users who already have an account */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

        {/* Registration Type Link - Go back to choice page or register as patient */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Want to register as patient?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register as Patient
          </Link>
        </p>
      </div>
    </div>
  )
}
