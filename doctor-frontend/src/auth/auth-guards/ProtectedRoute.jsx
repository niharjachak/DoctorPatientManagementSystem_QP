import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapped, role, mustChangePassword } = useAuth();
  const location = useLocation();
  const isProtectedPath =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/doctor") ||
    location.pathname.startsWith("/patient");

  if (!isBootstrapped) {
    return null;
  }

  if (!isAuthenticated && isProtectedPath) {
    return (
      <Navigate
        to={ROUTE_PATHS.login}
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    role === "DOCTOR" &&
    mustChangePassword &&
    location.pathname !== ROUTE_PATHS.doctor.changePassword
  ) {
    return <Navigate to={ROUTE_PATHS.doctor.changePassword} replace />;
  }

  return <Outlet />;
}
