import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/forms/FormInput'
import ErrorAlert from '../../components/shared/ErrorAlert'
import SuccessAlert from '../../components/shared/SuccessAlert'

// ChangePasswordPage Component
// Purpose: Force doctors to change their password on first login (when mustChangePassword = true)
// Features: Validate password strength, confirm password match, auto-logout after success
// Flow: User enters old and new passwords → validate → submit → logout → redirect to login

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()  // Function to logout user after password change

  // Form data state - stores old password and new password fields
  const [formData, setFormData] = useState({
    oldPassword: '',  // Current password
    newPassword: '',  // New password
    confirmPassword: ''  // Confirm new password (must match newPassword)
  })

  // Validation errors for each field
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')  // General error message (API errors)
  const [success, setSuccess] = useState('')  // Success message
  const [loading, setLoading] = useState(false)  // Loading state during form submission

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

    // Validate old password
    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required'
    }

    // Validate new password - Must meet all requirements
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase letter'
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain lowercase letter'
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain number'
    } else if (!/[!@#$%^&*]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain special character (!@#$%^&*)'
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Check that new password is different from old password
    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
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
      // Call backend API to change password
      await api.post('/doctor/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })

      setSuccess('Password changed successfully! Logging you out...')
      
      // Logout user and redirect to login after 2 seconds
      // This forces user to log back in with new password
      setTimeout(async () => {
        await logout()
        navigate('/login')
      }, 2000)
    } catch (err) {
      // Check if backend returned field-level validation errors
      const fieldErrors = err.response?.data?.data
      
      if (fieldErrors && typeof fieldErrors === 'object') {
        // Backend returned validation errors for specific fields
        setErrors(fieldErrors)
      } else {
        // Show error from backend or generic message
        setError(
          err.response?.data?.message ||
            'Failed to change password. Please try again.'
        )
      }
    } finally {
      setLoading(false)  // Hide loading state
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header - Shows app title and purpose */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Doctor Patient System
        </h1>
        <h2 className="text-lg text-center text-gray-600 mb-6">
          Change Your Password
        </h2>

        {/* Info Message - Explains why password change is required */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6 text-sm">
          👉 You must change your password before continuing
        </div>

        {/* Error Message - Shows API errors if change fails */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}

        {/* Success Message - Shows after successful password change */}
        {success && (
          <SuccessAlert message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* Password Change Form */}
        <form onSubmit={handleSubmit}>
          {/* Current Password Input - Using reusable FormInput component */}
          <FormInput
            label="Current Password"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            error={errors.oldPassword}  // Show error if validation failed
            placeholder="Enter your current password"
          />

          {/* New Password Input - Using reusable FormInput component */}
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}  // Show error if validation failed
            placeholder="Min 8 chars with uppercase, lowercase, number & symbol"
          />

          {/* Confirm New Password Input - Using reusable FormInput component */}
          <FormInput
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}  // Show error if validation failed
            placeholder="Re-enter your new password"
          />

          {/* Submit Button - Shows "Changing Password..." while loading */}
          <button
            type="submit"
            disabled={loading}  // Disable while API call is in progress
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        {/* Password Requirements Box - Shows what makes a valid password */}
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-300">
          <h4 className="font-bold text-sm text-gray-700 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Minimum 8 characters</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one number (0-9)</li>
            <li>At least one special character (!@#$%^&*)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
