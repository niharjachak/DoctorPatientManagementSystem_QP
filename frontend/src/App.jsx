import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/shared/Header'
import Navigation from './components/shared/Navigation'
import ProtectedRoute from './components/ProtectedRoute'

// Import auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import RegistrationChoicePage from './pages/auth/RegistrationChoicePage'
import AdminRegisterPage from './pages/auth/AdminRegisterPage'
import ChangePasswordPage from './pages/auth/ChangePasswordPage'

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      {/* Show Header and Navigation on all pages */}
      <Header />
      <Navigation />

      {/* All routes go here */}
      <main className="container mx-auto py-8">
        <Routes>
          {/* PUBLIC ROUTES (anyone can access) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-choice" element={<RegistrationChoicePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/patient" element={<RegisterPage />} />
          <Route path="/register/admin" element={<AdminRegisterPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* Redirect / based on login status */}
          <Route
            path="/"
            element={
              user ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
                  <p className="text-gray-600">Dashboard will be created based on your role</p>
                </div>
              ) : (
                <LoginPage />
              )
            }
          />

          {/* Unauthorized page */}
          <Route
            path="/unauthorized"
            element={
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-gray-600">You don't have permission to access this page.</p>
              </div>
            }
          />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App