import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerAdmin } from "../../api/modules/auth.api";
import { getHospitals } from "../../api/modules/public.api";
import AuthPageShell from "../../components/auth/AuthPageShell";
import FormField from "../../components/auth/FormField";
import {
  applyServerFieldErrors,
  buttonClassName,
  inputClassName,
} from "./auth-form-utils";

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const [hospitalsError, setHospitalsError] = useState("");
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
      hospitalId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    let isMounted = true;

    async function loadHospitals() {
      setHospitalsLoading(true);
      setHospitalsError("");

      try {
        const hospitalList = await getHospitals();

        if (!isMounted) {
          return;
        }

        setHospitals(hospitalList);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setHospitalsError(error.message || "Unable to load hospitals.");
      } finally {
        if (isMounted) {
          setHospitalsLoading(false);
        }
      }
    }

    loadHospitals();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async ({ confirmPassword, hospitalId, ...values }) => {
    setFormError("");

    try {
      const response = await registerAdmin({
        ...values,
        hospitalId: Number(hospitalId),
      });

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess:
            response.message || "Admin registration successful.",
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
      eyebrow="Hospital Admin"
      title="Register your hospital admin account"
      description="Choose your hospital, create your admin profile, and then manage only the doctors assigned to that hospital."
      alternateLabel="Already registered as admin?"
      alternateHref="/login"
      alternateText="Back to login"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Admin registration
          </h2>
          <p className="text-sm text-slate-600">
            Hospital selection comes directly from the backend.
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

          <FormField label="Hospital" error={errors.hospitalId?.message}>
            <select
              className={inputClassName}
              disabled={hospitalsLoading || Boolean(hospitalsError)}
              {...register("hospitalId", {
                required: "Hospital selection is required",
              })}
            >
              <option value="">
                {hospitalsLoading ? "Loading hospitals..." : "Select your hospital"}
              </option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.city}
                </option>
              ))}
            </select>
          </FormField>

          {hospitalsError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {hospitalsError}
            </div>
          ) : null}

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

          <button
            type="submit"
            disabled={isSubmitting || hospitalsLoading || Boolean(hospitalsError)}
            className={buttonClassName}
          >
            {isSubmitting ? "Creating account..." : "Create admin account"}
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

