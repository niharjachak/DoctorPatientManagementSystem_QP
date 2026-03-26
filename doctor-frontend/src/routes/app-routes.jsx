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
import DoctorChangePasswordPage from "../pages/doctor/DoctorChangePasswordPage";
import DoctorDashboardPage from "../pages/doctor/DoctorDashboardPage";
import DoctorSlotsPage from "../pages/doctor/DoctorSlotsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminCreateDoctorPage from "../pages/admin/AdminCreateDoctorPage";
import AdminDoctorsPage from "../pages/admin/AdminDoctorsPage";
import AdminAnalyticsPage from "../pages/admin/AdminAnalyticsPage";
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
              element={<DoctorChangePasswordPage />}
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
            element={<AdminDashboardPage />}
          />
          <Route
            path={ROUTE_PATHS.admin.doctors}
            element={<AdminDoctorsPage />}
          />
          <Route
            path={ROUTE_PATHS.admin.createDoctor}
            element={<AdminCreateDoctorPage />}
          />
          <Route
            path={ROUTE_PATHS.admin.analytics}
            element={<AdminAnalyticsPage />}
          />
        </Route>
      </Route>

      <Route path={ROUTE_PATHS.notFound} element={<NotFoundPage />} />
    </Routes>
  );
}
