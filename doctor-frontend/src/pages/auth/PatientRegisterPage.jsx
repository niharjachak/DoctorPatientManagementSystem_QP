import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerPatient } from "../../api/modules/auth.api";
import AuthPageShell from "../../components/auth/AuthPageShell";
import FormField from "../../components/auth/FormField";
import {
  applyServerFieldErrors,
  buttonClassName,
  inputClassName,
} from "./auth-form-utils";

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function PatientRegisterPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async ({ confirmPassword, ...values }) => {
    setFormError("");

    try {
      const response = await registerPatient(values);
      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess:
            response.message || "Patient registration successful.",
        },
      });
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
      eyebrow="Patient Access"
      title="Create your patient account"
      description="Register once to search doctors, view available slots, and manage your appointments."
      alternateLabel="Already registered?"
      alternateHref="/login"
      alternateText="Back to login"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Patient registration
          </h2>
          <p className="text-sm text-slate-600">
            Fill in your details exactly as you want them saved.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Full name" error={errors.name?.message}>
            <input
              type="text"
              placeholder="Enter your full name"
              className={inputClassName}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must not exceed 50 characters",
                },
              })}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
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

            <FormField label="Phone number" error={errors.phoneNumber?.message}>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10 digit phone number"
                className={inputClassName}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                })}
              />
            </FormField>
          </div>

          <FormField label="Date of birth" error={errors.dateOfBirth?.message}>
            <input
              type="date"
              className={inputClassName}
              {...register("dateOfBirth", {
                required: "Date of birth is required",
              })}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Password" error={errors.password?.message}>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                className={inputClassName}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordPattern,
                    message:
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                })}
              />
            </FormField>

            <FormField
              label="Confirm password"
              error={errors.confirmPassword?.message}
            >
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className={inputClassName}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
            </FormField>
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError}
            </div>
          ) : null}

          <button type="submit" disabled={isSubmitting} className={buttonClassName}>
            {isSubmitting ? "Creating account..." : "Create patient account"}
          </button>
        </form>

        <div className="border-t border-slate-200 pt-5 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-slate-900 hover:text-slate-700" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </AuthPageShell>
  );
}

