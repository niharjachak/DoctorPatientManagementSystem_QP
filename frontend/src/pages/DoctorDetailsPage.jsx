import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ErrorAlert from '../components/shared/ErrorAlert'
import SuccessAlert from '../components/shared/SuccessAlert'

// DoctorDetailsPage Component
// Purpose: Show detailed doctor information and available appointment slots
// Features: Full doctor profile, available slots by date, appointment booking
// Flow: ← from doctor card → view details & available slots → login if needed → book
export default function DoctorDetailsPage() {
  const navigate = useNavigate()
  const { doctorId } = useParams()
  const { user } = useAuth()

  // Doctor details and slots state
  const [doctor, setDoctor] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  // UI state
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch doctor details when component loads
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await api.get(`/public/getDoctorDetails/${doctorId}`)
        const doctorData = response.data.data

        setDoctor(doctorData)

        // Set all available slots directly (no filtering by date)
        if (doctorData.availableSlots && doctorData.availableSlots.length > 0) {
          setAvailableSlots(doctorData.availableSlots)
        }
      } catch (err) {
        console.error('Failed to fetch doctor details:', err)
        setError('Failed to load doctor information. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorDetails()
  }, [doctorId])

  // Remove date selection effect - not needed anymore

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login')
      return
    }

    if (!selectedSlot) {
      setError('Please select a time slot')
      return
    }

    setBooking(true)
    setError('')
    setSuccess('')

    try {
      const bookingData = {
        doctorId: parseInt(doctorId),
        slotId: selectedSlot.id
      }

      const response = await api.post('/patient/bookAppointment', bookingData)

      setSuccess('Appointment booked successfully!')
      setSelectedSlot(null)

      // Redirect to appointments page after 2 seconds
      setTimeout(() => {
        navigate('/patient/appointments')
      }, 2000)

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  // Show loading spinner while fetching doctor data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    )
  }

  // Show error if doctor not found
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Error/Success Messages */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}
        {success && (
          <SuccessAlert message={success} onDismiss={() => setSuccess('')} />
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back to Doctors
        </button>

        {/* Doctor Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Doctor Avatar */}
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                {doctor.doctorId ? (
                  <img
                    src={`http://localhost:8080/public/doctors/getImage/${doctor.doctorId}`}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <svg className="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="md:col-span-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{doctor.name}</h1>
              <p className="text-xl text-blue-600 font-medium mb-1">{doctor.speciality}</p>
              <p className="text-gray-600 mb-6">{doctor.hospitalName}</p>

              {/* Doctor Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{doctor.yearsOfExperience || 0}</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">₹{doctor.fees}</p>
                  <p className="text-sm text-gray-600">Fee</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{doctor.gender || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Gender</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
              </div>

              {/* About Doctor */}
              {doctor.qualification && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Qualifications</h3>
                  <p className="text-gray-700">{doctor.qualification}</p>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Appointment Booking Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>

          {/* Available Slots */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Available Slots</h3>

            {availableSlots.length === 0 ? (
              <p className="text-gray-600">No slots available at this time. Please check back later.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={!slot.isAvailable}
                    className={`p-3 border rounded-lg text-center font-medium transition-colors text-sm ${
                      selectedSlot?.id === slot.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : slot.isAvailable
                        ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-900'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div>{new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                    <div className="text-xs text-gray-600">{new Date(slot.slotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Slot Summary and Book Button */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
              {selectedSlot && (
                <p className="text-gray-700">
                  <span className="font-medium">Selected:</span> {new Date(selectedSlot.slotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              )}
            </div>
            <button
              onClick={handleBookAppointment}
              disabled={!selectedSlot || booking || !user || user.role !== 'PATIENT'}
              className="bg-blue-600 text-white px-8 py-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {booking ? 'Booking...' : user?.role === 'PATIENT' ? 'Confirm Booking' : 'Book'}
            </button>
          </div>

          {/* Login Prompt */}
          {!user && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <span className="font-medium">Note:</span> You need to login as a patient to book an appointment.
                <button
                  onClick={() => navigate('/login')}
                  className="ml-2 text-blue-600 hover:underline font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          )}
          {user && user.role !== 'PATIENT' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <span className="font-medium">Error:</span> Only patients can book appointments. Please login as a patient.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}