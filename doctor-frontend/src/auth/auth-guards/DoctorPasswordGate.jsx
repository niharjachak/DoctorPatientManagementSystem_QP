import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { ROUTE_PATHS } from "../../routes/route-paths";
// DoctorPasswordGate is a component that ensures doctors who are required to 
// change their password are redirected to the change password page.
// It checks the user's role and password change requirement, and redirects accordingly.
export default function DoctorPasswordGate() {
  const { role, mustChangePassword } = useAuth();
  const location = useLocation();
  const isChangePasswordRoute =
    location.pathname === ROUTE_PATHS.doctor.changePassword;

  if (role !== "DOCTOR") {
    return <Outlet />;
  }

  if (mustChangePassword && !isChangePasswordRoute) {
    return <Navigate to={ROUTE_PATHS.doctor.changePassword} replace />;
  }

  if (!mustChangePassword && isChangePasswordRoute) {
    return <Navigate to={ROUTE_PATHS.doctor.dashboard} replace />;
  }

  return <Outlet />;
}

