import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorAlert from '../../components/shared/ErrorAlert'
import SuccessAlert from '../../components/shared/SuccessAlert'
import ConfirmDialog from '../../components/shared/ConfirmDialog'

// AppointmentsPage Component
// Purpose: Display patient's appointments with filtering and management options
// Features: View upcoming/past appointments, cancel appointments, reschedule
// Flow: Load appointments → filter by status → perform actions
export default function AppointmentsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Appointments data
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])

  // Filter state
  const [filter, setFilter] = useState('ALL') // ALL, UPCOMING, COMPLETED, CANCELLED

  // UI state
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)

  // Fetch appointments when component loads
  useEffect(() => {
    fetchAppointments()
  }, [])

  // Filter appointments when filter changes
  useEffect(() => {
    filterAppointments()
  }, [appointments, filter])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/patient/appointments')
      setAppointments(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch appointments:', err)
      setError('Failed to load appointments. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    switch (filter) {
      case 'UPCOMING':
        filtered = appointments.filter(apt => apt.status === 'CONFIRMED' || apt.status === 'PENDING')
        break
      case 'COMPLETED':
        filtered = appointments.filter(apt => apt.status === 'COMPLETED')
        break
      case 'CANCELLED':
        filtered = appointments.filter(apt => apt.status === 'CANCELLED')
        break
      default:
        filtered = appointments
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`)
      const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`)
      return dateA - dateB
    })

    setFilteredAppointments(filtered)
  }

  const handleCancelAppointment = (appointment) => {
    setAppointmentToCancel(appointment)
    setShowCancelDialog(true)
  }

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return

    setCancelling(appointmentToCancel.id)
    setShowCancelDialog(false)
    setError('')
    setSuccess('')

    try {
      await api.post(`/patient/cancel-appointment/${appointmentToCancel.id}`)

      setSuccess('Appointment cancelled successfully!')

      // Update appointment status locally
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentToCancel.id
            ? { ...apt, status: 'CANCELLED' }
            : apt
        )
      )

      setAppointmentToCancel(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment. Please try again.')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canCancelAppointment = (appointment) => {
    if (appointment.status !== 'CONFIRMED' && appointment.status !== 'PENDING') {
      return false
    }

    const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`)
    const now = new Date()
    const hoursDiff = (appointmentDateTime - now) / (1000 * 60 * 60)

    // Can cancel if more than 24 hours before appointment
    return hoursDiff > 24
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-600">Manage your healthcare appointments</p>
          </div>
          <button
            onClick={() => navigate('/patient/search-doctors')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Book New Appointment
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}
        {success && (
          <SuccessAlert message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4 border-b border-gray-200">
            {[
              { key: 'ALL', label: 'All Appointments', count: appointments.length },
              { key: 'UPCOMING', label: 'Upcoming', count: appointments.filter(apt => apt.status === 'CONFIRMED' || apt.status === 'PENDING').length },
              { key: 'COMPLETED', label: 'Completed', count: appointments.filter(apt => apt.status === 'COMPLETED').length },
              { key: 'CANCELLED', label: 'Cancelled', count: appointments.filter(apt => apt.status === 'CANCELLED').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  filter === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'ALL'
                  ? "You haven't booked any appointments yet."
                  : `No ${filter.toLowerCase()} appointments.`
                }
              </p>
              <button
                onClick={() => navigate('/patient/search-doctors')}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Dr. {appointment.doctorName}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <p className="text-sm text-gray-500">{appointment.hospitalName}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.appointmentTime}</p>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </div>

                        {canCancelAppointment(appointment) && (
                          <button
                            onClick={() => handleCancelAppointment(appointment)}
                            disabled={cancelling === appointment.id}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            {cancelling === appointment.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Consultation Fee:</span>
                        <span className="ml-2">₹{appointment.consultationFee}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Booked on:</span>
                        <span className="ml-2">
                          {new Date(appointment.bookedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {appointment.notes && (
                        <div>
                          <span className="font-medium text-gray-700">Notes:</span>
                          <span className="ml-2">{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showCancelDialog}
          title="Cancel Appointment"
          message={`Are you sure you want to cancel your appointment with Dr. ${appointmentToCancel?.doctorName} on ${appointmentToCancel ? new Date(appointmentToCancel.appointmentDate).toLocaleDateString() : ''} at ${appointmentToCancel?.appointmentTime}?`}
          confirmText="Yes, Cancel Appointment"
          cancelText="Keep Appointment"
          onConfirm={confirmCancelAppointment}
          onCancel={() => {
            setShowCancelDialog(false)
            setAppointmentToCancel(null)
          }}
          type="danger"
        />

      </div>
    </div>
  )
}