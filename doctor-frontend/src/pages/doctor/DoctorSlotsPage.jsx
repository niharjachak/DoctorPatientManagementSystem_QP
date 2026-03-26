import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addSlot, deleteSlot, getMySlots } from "../../api/modules/doctor.api";
import LogoutButton from "../../components/auth/LogoutButton";

const todayDate = new Date().toISOString().split("T")[0];

function combineDateAndTime(date, time) {
  return `${date}T${time}:00`;
}

function getDurationInMinutes(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  return endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
}

function formatSlotTime(startTime, endTime) {
  const options = { hour: "2-digit", minute: "2-digit" };

  return `${new Date(startTime).toLocaleTimeString([], options)} - ${new Date(
    endTime,
  ).toLocaleTimeString([], options)}`;
}

export default function DoctorSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingSlotId, setDeletingSlotId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      slotDate: "",
      startTime: "",
      endTime: "",
    },
  });

  const loadSlots = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getMySlots();
      setSlots(response ?? []);
    } catch (error) {
      setSlots([]);
      setErrorMessage(error.message || "Unable to load slots.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const onSubmit = async (values) => {
    setErrorMessage("");
    setSuccessMessage("");
    clearErrors("slotDate");

    if (values.slotDate < todayDate) {
      setError("slotDate", {
        type: "manual",
        message: "Slot date must be today or a future date",
      });
      return;
    }

    const durationInMinutes = getDurationInMinutes(
      values.startTime,
      values.endTime,
    );

    if (values.startTime === values.endTime) {
      setErrorMessage("Start time and end time cannot be the same.");
      return;
    }

    if (durationInMinutes < 0) {
      setErrorMessage("Start time must be earlier than end time.");
      return;
    }

    if (durationInMinutes < 15) {
      setErrorMessage("Slot duration must be at least 15 minutes.");
      return;
    }

    try {
      const payload = {
        slotDate: values.slotDate,
        startTime: combineDateAndTime(values.slotDate, values.startTime),
        endTime: combineDateAndTime(values.slotDate, values.endTime),
      };

      console.log("Creating slot payload:", payload);

      const response = await addSlot(payload);

      setSuccessMessage(response.message || "Slot added successfully.");
      reset();
      await loadSlots();
    } catch (error) {
      setErrorMessage(error.message || "Unable to create slot.");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    setDeletingSlotId(slotId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await deleteSlot(slotId);
      setSuccessMessage(response.message || "Slot deleted successfully.");
      await loadSlots();
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete slot.");
    } finally {
      setDeletingSlotId(null);
    }
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Doctor Area
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Manage Slots
            </h1>
            <p className="text-sm text-slate-600">
              Create future slots, review current slot status, and delete only
              those that are still unbooked.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/doctor/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 lg:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Create Slot</h2>
          <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Date</span>
              <input
                type="date"
                min={todayDate}
                className={inputClassName}
                {...register("slotDate", {
                  required: "Date is required",
                })}
              />
              {errors.slotDate ? (
                <p className="text-sm text-rose-600">{errors.slotDate.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Start Time</span>
              <input
                type="time"
                step={900}
                className={inputClassName}
                {...register("startTime", {
                  required: "Start time is required",
                })}
              />
              {errors.startTime ? (
                <p className="text-sm text-rose-600">{errors.startTime.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">End Time</span>
              <input
                type="time"
                step={900}
                className={inputClassName}
                {...register("endTime", {
                  required: "End time is required",
                })}
              />
              {errors.endTime ? (
                <p className="text-sm text-rose-600">{errors.endTime.message}</p>
              ) : null}
            </label>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Creating..." : "Create Slot"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 lg:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">My Slots</h2>

          {isLoading ? (
            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
              Loading slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
              No slots have been created yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {slots.map((slot) => {
                const isBooked = slot.slotStatus === "BOOKED";

                return (
                  <article
                    key={slot.slotId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="grid flex-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Date
                          </p>
                          <p className="mt-1 font-medium text-slate-900">
                            {slot.slotDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Time
                          </p>
                          <p className="mt-1 font-medium text-slate-900">
                            {formatSlotTime(slot.startTime, slot.endTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Status
                          </p>
                          <p className="mt-1 inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                            {isBooked ? "Booked" : "Available"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot.slotId)}
                        disabled={isBooked || deletingSlotId === slot.slotId}
                        className="inline-flex items-center justify-center rounded-2xl border border-rose-300 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingSlotId === slot.slotId ? "Deleting..." : "Delete Slot"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
