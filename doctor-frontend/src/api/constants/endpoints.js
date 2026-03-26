export const ENDPOINTS = {
  auth: {
    registerPatient: "/auth/register/patient",
    registerAdmin: "/auth/register/admin",
    login: "/auth/login",
    logout: "/auth/logout",
  },
  public: {
    hospitals: "/public/getHospitals",
    doctors: "/public/getDoctors",
    doctorDetails: (doctorId) => `/public/getDoctorDetails/${doctorId}`,
    doctorImage: (doctorId) => `/public/doctors/getImage/${doctorId}`,
  },
  patient: {
    bookAppointment: "/patient/bookappointments",
    appointments: "/patient/getappointments",
    cancelAppointment: (appointmentId) =>
      `/patient/deleteappointments/${appointmentId}`,
  },
  doctor: {
    changePassword: "/doctor/change-password",
    slots: "/doctor/getslots",
    addSlot: "/doctor/addslots",
    deleteSlot: (slotId) => `/doctor/deleteslots/${slotId}`,
  },
  admin: {
    createDoctor: "/admin/createDoctor",
    hospitalDoctors: "/admin/getHospitalDoctors",
    updateDoctorStatus: (doctorId) =>
      `/admin/updatedoctorstatus/${doctorId}`,
    analytics: "/admin/analytics",
  },
};

