import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthPageShell from "../../components/auth/AuthPageShell";
import FormField from "../../components/auth/FormField";
import { useAuth } from "../../auth/auth-context/useAuth";
import {
  applyServerFieldErrors,
  buttonClassName,
  inputClassName,
} from "./auth-form-utils";

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const [formError, setFormError] = useState("");
  const successMessage = location.state?.registrationSuccess || "";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setFormError("");

    try {
      await login(values);
    } catch (error) {
      if (error.status === 400 && error.fieldErrors) {
        applyServerFieldErrors(error.fieldErrors, setError);
        return;
      }

      setFormError(error.message);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Secure Access"
      title="Sign in to the Doctor Patient System"
      description="Use your registered account to continue. Your role and first-login password rules will be enforced automatically after sign in."
      alternateLabel="Need an account first?"
      alternateHref="/register/patient"
      alternateText="Create a patient account"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-600">
            Sign in as a patient, doctor, or admin.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Email" error={errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className={inputClassName}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className={inputClassName}
              {...register("password", {
                required: "Password is required",
              })}
            />
          </FormField>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <button type="submit" disabled={isSubmitting} className={buttonClassName}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <Link className="font-medium text-slate-900 hover:text-slate-700" to="/register/patient">
            Register as patient
          </Link>
          <Link className="font-medium text-slate-900 hover:text-slate-700" to="/register/admin">
            Register as admin
          </Link>
        </div>
      </div>
    </AuthPageShell>
  );
}
