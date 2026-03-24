import { useNavigate } from 'react-router-dom'

// RegistrationChoicePage Component
// Purpose: Let users choose whether to register as a patient or hospital admin
// Visual: Two large buttons with descriptions
// Flow: User clicks one button → navigate to corresponding registration page

export default function RegistrationChoicePage() {
  const navigate = useNavigate()  // Hook to navigate to different pages

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Doctor Patient System
        </h1>
        <h2 className="text-lg text-center text-gray-600 mb-8">
          Choose your registration type
        </h2>

        {/* Patient Registration Option */}
        <div className="mb-6">
          {/* Button that navigates to patient registration */}
          <button
            onClick={() => navigate('/register/patient')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg transition duration-200 transform hover:scale-105"
          >
            <div className="mb-2">👤</div>
            Register as Patient
          </button>
          <p className="text-sm text-gray-600 text-center mt-2">
            Book appointments with doctors
          </p>
        </div>

        {/* Admin Registration Option */}
        <div className="mb-6">
          {/* Button that navigates to admin registration */}
          <button
            onClick={() => navigate('/register/admin')}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-bold text-lg transition duration-200 transform hover:scale-105"
          >
            <div className="mb-2">🏥</div>
            Register as Hospital Admin
          </button>
          <p className="text-sm text-gray-600 text-center mt-2">
            Manage your hospital and doctors
          </p>
        </div>

        {/* Login Link - For users who already have an account */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          {/* Button to go back to login page */}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}
