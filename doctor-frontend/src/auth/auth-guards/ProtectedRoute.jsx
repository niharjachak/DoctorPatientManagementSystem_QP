import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { ROUTE_PATHS } from "../../routes/route-paths";

// ProtectedRoute is a component that guards routes based on the user's authentication status and role.
// It checks if the user is authenticated and has the necessary permissions to access certain routes.
// If not authenticated, it redirects to the login page. If a doctor must change their password, it redirects to the change password page.
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
        to={ROUTE_PATHS.home}
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
