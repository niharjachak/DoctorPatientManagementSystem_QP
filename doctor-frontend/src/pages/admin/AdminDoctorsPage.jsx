import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { baseURL } from "../../api/client/http-client";
import { getHospitalDoctors, updateDoctorStatus } from "../../api/modules/admin.api";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${baseURL}${imageUrl}`;
}

function isDoctorActive(doctor) {
  if (typeof doctor.active === "boolean") {
    return doctor.active;
  }

  return Boolean(doctor.isActive);
}

export default function AdminDoctorsPage() {
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || "",
  );
  const [tempPassword, setTempPassword] = useState(location.state?.tempPassword || "");
  const [doctorName, setDoctorName] = useState(location.state?.doctorName || "");
  const [updatingDoctorId, setUpdatingDoctorId] = useState(null);

  const loadDoctors = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getHospitalDoctors();
      setDoctors(response ?? []);
    } catch (error) {
      setDoctors([]);
      setErrorMessage(error.message || "Unable to load doctors.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleToggleStatus = async (doctor) => {
    const currentlyActive = isDoctorActive(doctor);

    setUpdatingDoctorId(doctor.doctorId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateDoctorStatus(doctor.doctorId, !currentlyActive);
      setSuccessMessage(response.message || "Doctor status updated successfully.");
      setTempPassword("");
      setDoctorName("");
      await loadDoctors();
    } catch (error) {
      setErrorMessage(error.message || "Unable to update doctor status.");
    } finally {
      setUpdatingDoctorId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Admin Area
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Manage Doctors
            </h1>
            <p className="text-sm text-slate-600">
              Doctors shown here are restricted to the admin&apos;s hospital by backend logic.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/admin/doctors/create"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add Doctor
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
            <p>{successMessage}</p>
            {tempPassword ? (
              <p className="mt-2 font-medium text-emerald-900">
                Temporary password for {doctorName || "the doctor"}: {tempPassword}
              </p>
            ) : null}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
            No doctors found for this hospital.
          </div>
        ) : (
          <section className="grid gap-5">
            {doctors.map((doctor) => {
              const active = isDoctorActive(doctor);

              return (
                <article
                  key={doctor.doctorId}
                  className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <img
                        src={resolveImageUrl(doctor.imageUrl)}
                        alt={doctor.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Name</p>
                          <p className="mt-1 font-medium text-slate-900">{doctor.name}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                          <p className="mt-1 font-medium text-slate-900">{doctor.email}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Speciality</p>
                          <p className="mt-1 font-medium text-slate-900">{doctor.speciality}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Experience</p>
                          <p className="mt-1 font-medium text-slate-900">
                            {doctor.yearsOfExperience} years
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Fees</p>
                          <p className="mt-1 font-medium text-slate-900">Rs. {doctor.fees}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
                          <p className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {active ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(doctor)}
                      disabled={updatingDoctorId === doctor.doctorId}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingDoctorId === doctor.doctorId
                        ? "Updating..."
                        : active
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
