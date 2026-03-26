import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/auth-guards/ProtectedRoute";
import PublicOnlyRoute from "../auth/auth-guards/PublicOnlyRoute";
import RoleRoute from "../auth/auth-guards/RoleRoute";
import DoctorPasswordGate from "../auth/auth-guards/DoctorPasswordGate";
import LoginPage from "../pages/auth/LoginPage";
import PatientRegisterPage from "../pages/auth/PatientRegisterPage";
import AdminRegisterPage from "../pages/auth/AdminRegisterPage";
import LandingPage from "../pages/public/LandingPage";
import DoctorsPage from "../pages/public/DoctorsPage";
import DoctorDetailPage from "../pages/public/DoctorDetailPage";
import PatientDashboardPage from "../pages/patient/PatientDashboardPage";
import PatientAppointmentsPage from "../pages/patient/PatientAppointmentsPage";
import DoctorDashboardPage from "../pages/doctor/DoctorDashboardPage";
import DoctorSlotsPage from "../pages/doctor/DoctorSlotsPage";
import DashboardPlaceholderPage from "../pages/dashboard/DashboardPlaceholderPage";
import NotFoundPage from "../pages/NotFoundPage";
import { ROUTE_PATHS } from "./route-paths";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.home} element={<LandingPage />} />
      <Route path={ROUTE_PATHS.doctors} element={<DoctorsPage />} />
      <Route path={ROUTE_PATHS.doctorDetails} element={<DoctorDetailPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTE_PATHS.login} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.registerPatient} element={<PatientRegisterPage />} />
        <Route path={ROUTE_PATHS.registerAdmin} element={<AdminRegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["PATIENT"]} />}>
          <Route
            path={ROUTE_PATHS.patient.dashboard}
            element={<PatientDashboardPage />}
          />
          <Route
            path={ROUTE_PATHS.patient.appointments}
            element={<PatientAppointmentsPage />}
          />
        </Route>

        <Route element={<RoleRoute allowedRoles={["DOCTOR"]} />}>
          <Route element={<DoctorPasswordGate />}>
            <Route
              path={ROUTE_PATHS.doctor.changePassword}
              element={
                <DashboardPlaceholderPage
                  roleLabel="Doctor"
                  title="Doctor Change Password"
                />
              }
            />
            <Route
              path={ROUTE_PATHS.doctor.dashboard}
              element={<DoctorDashboardPage />}
            />
            <Route
              path={ROUTE_PATHS.doctor.slots}
              element={<DoctorSlotsPage />}
            />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path={ROUTE_PATHS.admin.dashboard}
            element={
              <DashboardPlaceholderPage
                roleLabel="Admin"
                title="Admin Dashboard"
              />
            }
          />
          <Route
            path={ROUTE_PATHS.admin.doctors}
            element={
              <DashboardPlaceholderPage
                roleLabel="Admin"
                title="Admin Doctors"
              />
            }
          />
          <Route
            path={ROUTE_PATHS.admin.createDoctor}
            element={
              <DashboardPlaceholderPage
                roleLabel="Admin"
                title="Create Doctor"
              />
            }
          />
          <Route
            path={ROUTE_PATHS.admin.analytics}
            element={
              <DashboardPlaceholderPage
                roleLabel="Admin"
                title="Admin Analytics"
              />
            }
          />
        </Route>
      </Route>

      <Route path={ROUTE_PATHS.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
