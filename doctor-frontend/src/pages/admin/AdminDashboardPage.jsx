import { Link } from "react-router-dom";
import LogoutButton from "../../components/auth/LogoutButton";
import { useAuth } from "../../auth/auth-context/useAuth";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Admin Dashboard
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Manage doctors for your hospital and review the latest activity
                through analytics.
              </p>
            </div>

            <LogoutButton />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/admin/doctors"
            className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl transition hover:-translate-y-1 hover:bg-slate-800"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Manage Doctors
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Doctor directory</h2>
            <p className="mt-3 text-sm text-slate-300">
              View doctors in your hospital and activate or deactivate them.
            </p>
          </Link>

          <Link
            to="/admin/doctors/create"
            className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Add Doctor
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Create a new doctor account
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Register a doctor under your hospital and receive a temporary
              password from the backend.
            </p>
          </Link>

          <Link
            to="/admin/analytics"
            className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Analytics
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              View hospital metrics
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Track patient counts, active doctors, appointments, and cancellation
              rate.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}

