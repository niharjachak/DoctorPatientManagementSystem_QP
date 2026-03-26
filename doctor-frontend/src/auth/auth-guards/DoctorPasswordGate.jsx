import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { ROUTE_PATHS } from "../../routes/route-paths";

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

