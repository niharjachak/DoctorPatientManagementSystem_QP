import LogoutButton from "../../components/auth/LogoutButton";

export default function DashboardPlaceholderPage({ roleLabel, title }) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {roleLabel}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="max-w-xl text-sm text-slate-600">
              This is a placeholder page for the protected dashboard. The main
              purpose here is to verify role-based routing and logout behavior.
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

