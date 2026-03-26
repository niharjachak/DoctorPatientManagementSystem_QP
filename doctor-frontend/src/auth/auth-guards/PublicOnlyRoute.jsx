import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { getDefaultRouteForSession } from "../../routes/redirect-by-role";

export default function PublicOnlyRoute() {
  const {
    isAuthenticated,
    isBootstrapped,
    token,
    role,
    mustChangePassword,
    user,
  } = useAuth();

  if (!isBootstrapped) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={getDefaultRouteForSession({
          token,
          role,
          mustChangePassword,
          user,
        })}
        replace
      />
    );
  }

  return <Outlet />;
}
