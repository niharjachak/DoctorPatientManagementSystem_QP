import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cancelAppointment, getMyAppointments } from "../../api/modules/patient.api";

function formatAppointmentTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  return `${start.toLocaleDateString()} | ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`;
}

export default function PatientAppointmentsPage() {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancellingId, setIsCancellingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || "",
  );

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getMyAppointments();
      setAppointments(response ?? []);
    } catch (error) {
      setAppointments([]);
      setErrorMessage(error.message || "Unable to load appointments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancelAppointment = async (appointmentId) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCancellingId(appointmentId);

    try {
      const response = await cancelAppointment(appointmentId);
      setSuccessMessage(response.message || "Appointment cancelled successfully.");
      await loadAppointments();
    } catch (error) {
      setErrorMessage(error.message || "Unable to cancel appointment.");
    } finally {
      setIsCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Patient Area
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              My Appointments
            </h1>
            <p className="text-sm text-slate-600">
              Review your appointment status and cancel active bookings when needed.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/patient/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Find Doctors
            </Link>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">
              You do not have any appointments yet.
            </p>
            <Link
              to="/doctors"
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Find Doctors
            </Link>
          </div>
        ) : (
          <section className="grid gap-5">
            {appointments.map((appointment) => (
              <article
                key={appointment.appointmentId}
                className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Doctor
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {appointment.doctorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Hospital
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {appointment.hospitalName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Date & Time
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatAppointmentTime(
                          appointment.startTime,
                          appointment.endTime,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Status
                      </p>
                      <p className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {appointment.appointmentStatus}
                      </p>
                    </div>
                  </div>

                  {appointment.appointmentStatus === "BOOKED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleCancelAppointment(appointment.appointmentId)
                      }
                      disabled={isCancellingId === appointment.appointmentId}
                      className="inline-flex items-center justify-center rounded-2xl border border-rose-300 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCancellingId === appointment.appointmentId
                        ? "Cancelling..."
                        : "Cancel Appointment"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

