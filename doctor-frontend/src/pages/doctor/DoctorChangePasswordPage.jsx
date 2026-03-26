import { useState } from "react";
import { useForm } from "react-hook-form";
import { changePassword } from "../../api/modules/doctor.api";
import { useAuth } from "../../auth/auth-context/useAuth";

export default function DoctorChangePasswordPage() {
  const { logout } = useAuth();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async ({ confirmPassword, ...values }) => {
    setFormError("");

    try {
      await changePassword(values);
      await logout({
        redirectPath: "/login",
        state: {
          registrationSuccess:
            "Password changed successfully. Please login again.",
        },
      });
    } catch (error) {
      setFormError(error.message || "Unable to change password.");
    }
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Doctor Security
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Change Your Password
          </h1>
          <p className="text-sm text-slate-600">
            You must change your system-generated password before accessing the
            doctor dashboard.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Current Password</span>
            <input
              type="password"
              className={inputClassName}
              {...register("oldPassword", {
                required: "Current password is required",
              })}
            />
            {errors.oldPassword ? (
              <p className="text-sm text-rose-600">{errors.oldPassword.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">New Password</span>
            <input
              type="password"
              className={inputClassName}
              {...register("newPassword", {
                required: "New password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
            />
            {errors.newPassword ? (
              <p className="text-sm text-rose-600">{errors.newPassword.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Confirm Password</span>
            <input
              type="password"
              className={inputClassName}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPasswordValue || "Passwords do not match",
              })}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-rose-600">{errors.confirmPassword.message}</p>
            ) : null}
          </label>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
