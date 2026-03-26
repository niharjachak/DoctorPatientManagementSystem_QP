import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAnalytics } from "../../api/modules/admin.api";

function formatLabel(label = "") {
  return label.replaceAll("_", " ");
}

function ChartCard({ title, description, children }) {
  return (
    <article className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function EmptyChartState({ message }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
      {message}
    </div>
  );
}

function AnalyticsBarChart({ data, dataKey, labelKey, barColor }) {
  return (
    <div className="h-[320px] rounded-2xl bg-slate-50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis
            dataKey={labelKey}
            tickFormatter={formatLabel}
            tick={{ fill: "#475569", fontSize: 12 }}
            angle={data.length > 5 ? -18 : 0}
            textAnchor={data.length > 5 ? "end" : "middle"}
            height={data.length > 5 ? 56 : 30}
          />
          <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [value, "Appointments"]}
            labelFormatter={(value) => formatLabel(value)}
            contentStyle={{
              borderRadius: "1rem",
              borderColor: "#cbd5e1",
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} name="Appointments" fill={barColor} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AnalyticsLineChart({ data }) {
  return (
    <div className="h-[320px] rounded-2xl bg-slate-50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fill: "#475569", fontSize: 12 }}
            minTickGap={24}
          />
          <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [value, "Appointments"]}
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
            contentStyle={{
              borderRadius: "1rem",
              borderColor: "#cbd5e1",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name="Appointments"
            stroke="#0f766e"
            strokeWidth={3}
            dot={{ fill: "#0f766e", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

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

  const metricCards = useMemo(
    () =>
      analytics
        ? [
            { label: "Total Patients", value: analytics.totalPatients },
            { label: "Active Doctors", value: analytics.activeDoctors },
            { label: "Total Appointments", value: analytics.totalAppointments },
            {
              label: "Cancellation Rate",
              value: `${analytics.cancellationRate}%`,
            },
          ]
        : [],
    [analytics],
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Admin Area
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Review hospital metrics, booking concentration, and appointment trends.
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

            <section className="grid gap-6 xl:grid-cols-2">
              <ChartCard
                title="Most Booked Speciality"
                description="Appointment volume grouped by speciality."
              >
                {analytics.mostBookedSpecialities?.length ? (
                  <AnalyticsBarChart
                    data={analytics.mostBookedSpecialities}
                    dataKey="count"
                    labelKey="speciality"
                    barColor="#10b981"
                  />
                ) : (
                  <EmptyChartState message="No speciality booking data available yet." />
                )}
              </ChartCard>

              <ChartCard
                title="Most Booked Doctor"
                description="Top doctors by appointment volume."
              >
                {analytics.mostBookedDoctors?.length ? (
                  <AnalyticsBarChart
                    data={analytics.mostBookedDoctors}
                    dataKey="count"
                    labelKey="doctorName"
                    barColor="#0ea5e9"
                  />
                ) : (
                  <EmptyChartState message="No doctor booking data available yet." />
                )}
              </ChartCard>
            </section>

            <section>
              <ChartCard
                title="Appointments Over Time"
                description="Daily appointment volume for the last 30 days."
              >
                {analytics.appointmentsLast30Days?.length ? (
                  <AnalyticsLineChart data={analytics.appointmentsLast30Days} />
                ) : (
                  <EmptyChartState message="No appointment trend data available yet." />
                )}
              </ChartCard>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
