import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalytics } from "../../api/modules/admin.api";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAnalytics();

        if (isMounted) {
          setAnalytics(response);
        }
      } catch (error) {
        if (isMounted) {
          setAnalytics(null);
          setErrorMessage(error.message || "Unable to load analytics.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const metricCards = analytics
    ? [
        { label: "Total Patients", value: analytics.totalPatients },
        { label: "Active Doctors", value: analytics.activeDoctors },
        { label: "Total Appointments", value: analytics.totalAppointments },
        { label: "Cancellation Rate", value: `${analytics.cancellationRate}%` },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Admin Area
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Analytics
            </h1>
            <p className="text-sm text-slate-600">
              Review high-level hospital metrics based on the backend analytics API.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
            Loading analytics...
          </div>
        ) : analytics ? (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {metric.label}
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {metric.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Most Booked Doctors
                </h2>
                {analytics.mostBookedDoctors?.length ? (
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    {analytics.mostBookedDoctors.map((item) => (
                      <li
                        key={item.doctorName}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <span>{item.doctorName}</span>
                        <span className="font-semibold">{item.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-slate-600">
                    No doctor booking data available yet.
                  </p>
                )}
              </article>

              <article className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Most Booked Specialities
                </h2>
                {analytics.mostBookedSpecialities?.length ? (
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    {analytics.mostBookedSpecialities.map((item) => (
                      <li
                        key={item.speciality}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <span>{item.speciality}</span>
                        <span className="font-semibold">{item.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-slate-600">
                    No speciality booking data available yet.
                  </p>
                )}
              </article>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

