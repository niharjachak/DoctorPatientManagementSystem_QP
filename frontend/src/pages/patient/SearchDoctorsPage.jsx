import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorAlert from '../../components/shared/ErrorAlert'

// SearchDoctorsPage Component
// Purpose: Allow patients to search and filter doctors for booking appointments
// Features: Search by name/specialty, filter by hospital/specialty, view doctor details
// Flow: Search/filter → view results → click doctor → go to details page
export default function SearchDoctorsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedHospital, setSelectedHospital] = useState('')
  const [doctors, setDoctors] = useState([])

  // Filter options
  const [hospitals, setHospitals] = useState([])
  const [specialties, setSpecialties] = useState([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  // Fetch initial data when component loads
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch hospitals and specialties for filters
        const [hospitalsRes, specialtiesRes] = await Promise.all([
          api.get('/public/getHospitals'),
          api.get('/public/getSpecialties')
        ])

        setHospitals(hospitalsRes.data.data || [])
        setSpecialties(specialtiesRes.data.data || [])

        // Load all doctors initially
        await performSearch()
      } catch (err) {
        console.error('Failed to fetch initial data:', err)
        setError('Failed to load search options. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Perform search with current filters
  const performSearch = async () => {
    setSearching(true)
    setError('')

    try {
      const searchParams = new URLSearchParams()
      if (searchQuery.trim()) searchParams.append('query', searchQuery.trim())
      if (selectedSpecialty) searchParams.append('specialty', selectedSpecialty)
      if (selectedHospital) searchParams.append('hospitalId', selectedHospital)

      const response = await api.get(`/public/search-doctors?${searchParams}`)
      setDoctors(response.data.data || [])
    } catch (err) {
      console.error('Search failed:', err)
      setError('Search failed. Please try again.')
      setDoctors([])
    } finally {
      setSearching(false)
    }
  }

  // Handle search when filters change
  useEffect(() => {
    if (!loading) { // Don't search on initial load
      const timeoutId = setTimeout(() => {
        performSearch()
      }, 500) // Debounce search by 500ms

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, selectedSpecialty, selectedHospital])

  // Handle Enter key in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialty('')
    setSelectedHospital('')
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
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Doctors</h1>
          <p className="text-gray-600">Find and book appointments with healthcare providers</p>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorAlert message={error} onDismiss={() => setError('')} />
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by name or specialty
              </label>
              <input
                type="text"
                placeholder="e.g., Dr. Smith, Cardiology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Hospitals</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Clear all filters
            </button>
            <button
              onClick={performSearch}
              disabled={searching}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {searching ? 'Searching...' : `Found ${doctors.length} Doctor${doctors.length !== 1 ? 's' : ''}`}
            </h2>
          </div>

          {searching ? (
            <div className="text-center py-12">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Searching doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4a7.963 7.963 0 015.5-2.5c2.34 0 4.29.98 5.5 2.5m-.5 4H7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or clearing filters.</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Dr. {doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                      <p className="text-sm text-gray-600">{doctor.hospitalName}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{doctor.experienceYears} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Consultation Fee:</span>
                      <span className="font-medium">₹{doctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">{doctor.rating || 'N/A'}/5</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/doctor/${doctor.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                    {user && (
                      <button
                        onClick={() => navigate(`/doctor/${doctor.id}`)}
                        className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        Book Now
                      </button>
                    )}
                  </div>

                  {!user && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Login required to book appointments
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}