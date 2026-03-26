export const ROUTE_PATHS = {
  home: "/",
  doctors: "/doctors",
  doctorDetails: "/doctors/:doctorId",
  login: "/login",
  registerPatient: "/register/patient",
  registerAdmin: "/register/admin",
  patient: {
    dashboard: "/patient/dashboard",
    appointments: "/patient/appointments",
    bookDoctor: "/patient/book/:doctorId",
  },
  doctor: {
    changePassword: "/doctor/change-password",
    dashboard: "/doctor/dashboard",
    slots: "/doctor/slots",
  },
  admin: {
    dashboard: "/admin/dashboard",
    doctors: "/admin/doctors",
    createDoctor: "/admin/doctors/create",
    analytics: "/admin/analytics",
  },
  notFound: "*",
};

