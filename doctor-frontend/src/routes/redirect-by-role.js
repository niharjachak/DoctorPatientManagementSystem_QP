import { ROUTE_PATHS } from "./route-paths";

export function getDefaultRouteForSession(session) {
  if (!session?.token || !session?.role) {
    return ROUTE_PATHS.login;
  }

  if (session.role === "PATIENT") {
    return ROUTE_PATHS.patient.dashboard;
  }

  if (session.role === "ADMIN") {
    return ROUTE_PATHS.admin.dashboard;
  }

  if (session.role === "DOCTOR") {
    return session.mustChangePassword
      ? ROUTE_PATHS.doctor.changePassword
      : ROUTE_PATHS.doctor.dashboard;
  }

  return ROUTE_PATHS.login;
}

