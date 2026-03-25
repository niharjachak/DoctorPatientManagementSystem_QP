import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ErrorAlert from '../components/shared/ErrorAlert'

// PublicLanding Component
// Purpose: Public dashboard showing all active doctors with search and filter functionality
// Features: Display doctor cards, search by keyword, filter by specialty/gender/fees/hospital
// Flow: Load doctors → apply filters → click doctor to view details → login to book
export default function PublicLanding() {
  const navigate = useNavigate()

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    speciality: '',
    gender: '',
    minFee: '',
    maxFee: '',
    hospitalName: ''
  })

  // Data from backend
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [specialties, setSpecialties] = useState([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  // Fetch hospitals and initial doctors list on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch hospitals for filter dropdown
        const hospitalsRes = await api.get('/public/getHospitals')
        setHospitals(hospitalsRes.data || [])

        // Fetch all doctors initially
        const doctorsRes = await api.get('/public/getDoctors')
        setDoctors(doctorsRes.data.data || [])

        // Extract unique specialties from doctors
        const uniqueSpecialties = [...new Set(doctorsRes.data.data?.map(doc => doc.speciality) || [])]
        setSpecialties(uniqueSpecialties)
      } catch (err) {
        console.error('Failed to initialize dashboard:', err)
        setError('Failed to load dashboard. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [])

  // Handle search with filters
  const handleSearch = async () => {
    setSearching(true)
    setError('')

    try {
      const params = new URLSearchParams()

      // Add keyword if provided
      if (searchQuery.trim()) {
        params.append('keyword', searchQuery.trim())
      }

      // Add filters if provided
      if (filters.speciality) params.append('speciality', filters.speciality)
      if (filters.gender) params.append('gender', filters.gender)
      if (filters.minFee) params.append('minFee', filters.minFee)
      if (filters.maxFee) params.append('maxFee', filters.maxFee)
      if (filters.hospitalName) params.append('hospitalName', filters.hospitalName)

      const response = await api.get(`/public/getDoctors?${params}`)
      setDoctors(response.data.data || [])
    } catch (err) {
      console.error('Search failed:', err)
      setError('Search failed. Please try again.')
      setDoctors([])
    } finally {
      setSearching(false)
    }
  }

  // Clear all filters and search
  const clearFilters = async () => {
    setSearchQuery('')
    setFilters({
      speciality: '',
      gender: '',
      minFee: '',
      maxFee: '',
      hospitalName: ''
    })
    setSearching(true)

    try {
      const response = await api.get('/public/getDoctors')
      setDoctors(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch doctors:', err)
      setError('Failed to reset filters. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  // Handle Enter key in search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Show loading spinner while fetching initial data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Login/Register */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Doctor Patient System</h1>
            <p className="text-sm text-gray-600">Book appointments with active doctors</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register-choice')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Error Message */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Find a Doctor</h2>

          {/* Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by doctor name, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <select
                value={filters.speciality}
                onChange={(e) => setFilters({ ...filters, speciality: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Specialties</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Min Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Fee</label>
              <input
                type="number"
                placeholder="Min fees"
                value={filters.minFee}
                onChange={(e) => setFilters({ ...filters, minFee: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Max Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee</label>
              <input
                type="number"
                placeholder="Max fees"
                value={filters.maxFee}
                onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Hospital Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
              <select
                value={filters.hospitalName}
                onChange={(e) => setFilters({ ...filters, hospitalName: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Hospitals</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.name}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Clear all filters
            </button>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Available Doctors ({doctors.length})
          </h3>

          {searching ? (
            <div className="text-center py-12">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Searching doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/doctor/${doctor.doctorId}`)}
                >
                  {/* Doctor Image */}
                  <div className="h-48 bg-blue-100 flex items-center justify-center overflow-hidden">
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
                      <svg className="w-24 h-24 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h4>
                    <p className="text-blue-600 font-medium text-sm mb-3">{doctor.speciality}</p>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p><span className="font-medium">Hospital:</span> {doctor.hospitalName}</p>
                      <p><span className="font-medium">Experience:</span> {doctor.yearsOfExperience} years</p>
                      <p><span className="font-medium">Consultation Fee:</span> ₹{doctor.fees}</p>
                      {doctor.gender && (
                        <p><span className="font-medium">Gender:</span> {doctor.gender}</p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/doctor/${doctor.doctorId}`)
                      }}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Details & Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}