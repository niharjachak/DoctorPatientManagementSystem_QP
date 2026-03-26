import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHospitals, searchDoctors } from "../../api/modules/public.api";
import DoctorCard from "../../components/public/DoctorCard";

const SPECIALITIES = [
  "CARDIOLOGY",
  "NEUROLOGY",
  "DERMATOLOGY",
  "PEDIATRICS",
  "ONCOLOGY",
  "DENTISTRY",
  "HOMEOPATHY",
  "ORTHOPEDICS",
  "GYNECOLOGY",
  "PSYCHIATRY",
  "RADIOLOGY",
  "OPHTHALMOLOGY",
  "ENT",
  "GENERAL_MEDICINE",
];

const GENDERS = ["MALE", "FEMALE", "OTHER"];

const initialFilters = {
  keyword: "",
  speciality: "",
  gender: "",
  minFee: "",
  maxFee: "",
  hospitalName: "",
  date: "",
};

export default function DoctorsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const hospitalOptions = useMemo(
    () =>
      hospitals.map((hospital) => ({
        label: `${hospital.name} - ${hospital.city}`,
        value: hospital.name,
      })),
    [hospitals],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadHospitals() {
      try {
        const response = await getHospitals();

        if (isMounted) {
          setHospitals(response);
        }
      } catch {
        // Hospital filter is helpful, but doctor search should still work without it.
      }
    }

    loadHospitals();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDoctors() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await searchDoctors(filters);

        if (!isMounted) {
          return;
        }

        setDoctors(response.data ?? []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setDoctors([]);
        setErrorMessage(error.message || "Unable to load doctors.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDoctors();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Public Doctor Directory
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Find doctors across hospitals
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Search by name, speciality, fee range, gender, hospital, and date.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              Back Home
            </Link>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Search by doctor name"
              className={inputClassName}
            />

            <select
              name="speciality"
              value={filters.speciality}
              onChange={handleFilterChange}
              className={inputClassName}
            >
              <option value="">All specialities</option>
              {SPECIALITIES.map((speciality) => (
                <option key={speciality} value={speciality}>
                  {speciality.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className={inputClassName}
            >
              <option value="">All genders</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>

            <select
              name="hospitalName"
              value={filters.hospitalName}
              onChange={handleFilterChange}
              className={inputClassName}
            >
              <option value="">All hospitals</option>
              {hospitalOptions.map((hospital) => (
                <option key={hospital.label} value={hospital.value}>
                  {hospital.label}
                </option>
              ))}
            </select>

            <input
              name="minFee"
              type="number"
              min="0"
              value={filters.minFee}
              onChange={handleFilterChange}
              placeholder="Minimum fee"
              className={inputClassName}
            />

            <input
              name="maxFee"
              type="number"
              min="0"
              value={filters.maxFee}
              onChange={handleFilterChange}
              placeholder="Maximum fee"
              className={inputClassName}
            />

            <input
              name="date"
              type="date"
              value={filters.date}
              onChange={handleFilterChange}
              className={inputClassName}
            />
          </div>
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
            No doctors matched your current filters.
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.doctorId} doctor={doctor} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

