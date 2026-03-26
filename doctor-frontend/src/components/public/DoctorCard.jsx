import { Link } from "react-router-dom";
import { getDoctorImageUrl } from "../../api/modules/public.api";

export default function DoctorCard({ doctor }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={getDoctorImageUrl(doctor.doctorId)}
        alt={doctor.name}
        className="h-52 w-full object-cover"
      />

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
          <p className="text-sm font-medium text-emerald-700">{doctor.speciality}</p>
          <p className="text-sm text-slate-600">{doctor.hospitalName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
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
        </div>

        <Link
          to={`/doctors/${doctor.doctorId}`}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

