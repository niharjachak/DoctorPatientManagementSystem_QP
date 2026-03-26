import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth-context/useAuth";
import { getDefaultRouteForSession } from "../../routes/redirect-by-role";

export default function RoleRoute({ allowedRoles = [] }) {
  const { role, token, mustChangePassword, user } = useAuth();

  if (!allowedRoles.includes(role)) {
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

