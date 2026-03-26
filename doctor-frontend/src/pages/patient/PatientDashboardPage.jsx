import { Link } from "react-router-dom";
import LogoutButton from "../../components/auth/LogoutButton";
import { useAuth } from "../../auth/auth-context/useAuth";

export default function PatientDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Patient Dashboard
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Continue by finding doctors or reviewing your booked appointments.
              </p>
            </div>

            <LogoutButton />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Link
            to="/doctors"
            className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl transition hover:-translate-y-1 hover:bg-slate-800"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Find Doctors
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Browse doctors and slots</h2>
            <p className="mt-3 text-sm text-slate-300">
              Search by speciality, hospital, fee, or date and continue into
              appointment booking from the doctor details page.
            </p>
          </Link>

          <Link
            to="/patient/appointments"
            className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              My Appointments
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              View and manage bookings
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              See your appointment status and cancel booked appointments when allowed.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}

