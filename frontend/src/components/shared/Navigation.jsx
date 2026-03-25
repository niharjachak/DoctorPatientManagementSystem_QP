import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

// This shows different menu items based on what role you are
// Patient sees: Search Doctors, My Appointments
// Doctor sees: Manage Slots, My Appointments
// Admin sees: Create Doctor, Manage Doctors, Analytics

export default function Navigation() {
  const { user } = useAuth()

  // Don't show nav if not logged in
  if (!user) {
    return null
  }

  return (
    <nav className="bg-gray-200 px-6 py-3 border-b">
      <div className="flex gap-8">
        {/* Links that show for EVERYONE logged in */}
        <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium">
          Home
        </Link>

        {/* Links(these dont reload the page) only for PATIENTS */}
        {user.role === 'ROLE_PATIENT' && (
          <>
            <Link to="/patient/dashboard" className="text-gray-800 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/patient/search-doctors" className="text-gray-800 hover:text-blue-600 font-medium">
              Search Doctors
            </Link>
            <Link to="/patient/appointments" className="text-gray-800 hover:text-blue-600 font-medium">
              My Appointments
            </Link>
          </>
        )}

        {/* Links only for DOCTORS */}
        {user.role === 'ROLE_DOCTOR' && (
          <>
            <Link to="/doctor/dashboard" className="text-gray-800 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/doctor/slots" className="text-gray-800 hover:text-blue-600 font-medium">
              Manage Slots
            </Link>
            <Link to="/doctor/appointments" className="text-gray-800 hover:text-blue-600 font-medium">
              Appointments
            </Link>
          </>
        )}

        {/* Links only for ADMINS */}
        {user.role === 'ROLE_ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="text-gray-800 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/admin/create-doctor" className="text-gray-800 hover:text-blue-600 font-medium">
              Create Doctor
            </Link>
            <Link to="/admin/manage-doctors" className="text-gray-800 hover:text-blue-600 font-medium">
              Manage Doctors
            </Link>
            <Link to="/admin/analytics" className="text-gray-800 hover:text-blue-600 font-medium">
              Analytics
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}