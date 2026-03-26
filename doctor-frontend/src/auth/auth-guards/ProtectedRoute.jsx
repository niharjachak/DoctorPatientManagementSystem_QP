import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapped } = useAuth();
  const location = useLocation();

  if (!isBootstrapped) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.login}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

