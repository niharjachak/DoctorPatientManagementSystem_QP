import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl sm:p-12">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
            Doctor Patient System
          </span>
          <div className="mt-6 space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Search doctors, compare hospitals, and view available appointment slots.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Start with the public doctor directory, then sign in as a patient to
              continue into appointment booking.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Explore Doctors
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">What you can do here</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Public access</h3>
              <p className="mt-1 text-sm text-slate-600">
                Search doctors, inspect doctor profiles, and view available slots.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Patient access</h3>
              <p className="mt-1 text-sm text-slate-600">
                Register and sign in to move from discovery into appointment booking.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">Role-based system</h3>
              <p className="mt-1 text-sm text-slate-600">
                Doctors and admins get their own protected workspaces after login.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

