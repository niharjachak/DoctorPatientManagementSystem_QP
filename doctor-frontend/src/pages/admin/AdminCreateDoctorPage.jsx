import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createDoctor } from "../../api/modules/admin.api";
import { applyServerFieldErrors } from "../auth/auth-form-utils";

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

export default function AdminCreateDoctorPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      speciality: "",
      qualification: "",
      yearsOfExperience: "",
      gender: "",
      fees: "",
      image: null,
    },
  });

  const inputClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

  const onSubmit = async (values) => {
    setFormError("");

    try {
      const response = await createDoctor({
        data: {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          speciality: values.speciality,
          qualification: values.qualification,
          yearsOfExperience: Number(values.yearsOfExperience),
          gender: values.gender,
          fees: Number(values.fees),
        },
        image: values.image?.[0],
      });

      navigate("/admin/doctors", {
        replace: true,
        state: {
          successMessage: response.message || "Doctor created successfully.",
          tempPassword: response.data?.temporaryPassword,
          doctorName: response.data?.name,
        },
      });
    } catch (error) {
      if (error.status === 400 && error.fieldErrors) {
        applyServerFieldErrors(error.fieldErrors, setError);
        return;
      }

      setFormError(error.message || "Unable to create doctor.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Admin Area
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Create Doctor
            </h1>
            <p className="text-sm text-slate-600">
              Create a doctor account for your hospital and upload a profile image.
            </p>
          </div>

          <Link
            to="/admin/doctors"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Doctors
          </Link>
        </div>

        {formError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        ) : null}

        <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 lg:p-8">
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                className={inputClassName}
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name ? <p className="text-sm text-rose-600">{errors.name.message}</p> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                className={inputClassName}
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email ? <p className="text-sm text-rose-600">{errors.email.message}</p> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Phone Number</span>
              <input
                type="tel"
                className={inputClassName}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
              />
              {errors.phoneNumber ? (
                <p className="text-sm text-rose-600">{errors.phoneNumber.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Speciality</span>
              <select
                className={inputClassName}
                {...register("speciality", {
                  required: "Speciality is required",
                })}
              >
                <option value="">Select speciality</option>
                {SPECIALITIES.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              {errors.speciality ? (
                <p className="text-sm text-rose-600">{errors.speciality.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Qualification</span>
              <input
                type="text"
                className={inputClassName}
                {...register("qualification", {
                  required: "Qualification is required",
                })}
              />
              {errors.qualification ? (
                <p className="text-sm text-rose-600">{errors.qualification.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Years of Experience
              </span>
              <input
                type="number"
                min="0"
                max="40"
                className={inputClassName}
                {...register("yearsOfExperience", {
                  required: "Years of experience is required",
                })}
              />
              {errors.yearsOfExperience ? (
                <p className="text-sm text-rose-600">
                  {errors.yearsOfExperience.message}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Gender</span>
              <select
                className={inputClassName}
                {...register("gender", {
                  required: "Gender is required",
                })}
              >
                <option value="">Select gender</option>
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {errors.gender ? <p className="text-sm text-rose-600">{errors.gender.message}</p> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Fees</span>
              <input
                type="number"
                min="1"
                step="0.01"
                className={inputClassName}
                {...register("fees", {
                  required: "Fees is required",
                })}
              />
              {errors.fees ? <p className="text-sm text-rose-600">{errors.fees.message}</p> : null}
            </label>

            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Profile Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className={inputClassName}
                {...register("image", {
                  required: "Profile image is required",
                })}
              />
              {errors.image ? <p className="text-sm text-rose-600">{errors.image.message}</p> : null}
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Creating..." : "Create Doctor"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

