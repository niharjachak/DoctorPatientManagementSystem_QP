import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoctorDetails, getDoctorImageUrl } from "../../api/modules/public.api";
import { bookAppointment } from "../../api/modules/patient.api";
import { useAuth } from "../../auth/auth-context/useAuth";

function formatSlotDate(slotDate) {
  return new Date(slotDate).toISOString().split("T")[0];
}

function formatSlotTime(startTime, endTime) {
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return `${new Date(startTime).toLocaleTimeString([], timeOptions)} - ${new Date(
    endTime,
  ).toLocaleTimeString([], timeOptions)}`;
}

export default function DoctorDetailPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const availableSlots =
    doctor?.availableSlots?.filter((slot) => slot.slotStatus === "AVAILABLE") ?? [];

  useEffect(() => {
    let isMounted = true;

    async function loadDoctor() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getDoctorDetails(doctorId);

        if (!isMounted) {
          return;
        }

        setDoctor(response.data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setDoctor(null);
        setErrorMessage(error.message || "Unable to load doctor details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDoctor();

    return () => {
      isMounted = false;
    };
  }, [doctorId]);

  const handleBookClick = async (slotId) => {
    setBookingMessage("");
    setErrorMessage("");

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/doctors/${doctorId}`,
        },
      });
      return;
    }

    if (role !== "PATIENT") {
      return;
    }

    setBookingSlotId(slotId);

    try {
      const response = await bookAppointment({
        doctorId: Number(doctorId),
        slotId: Number(slotId),
      });

      setDoctor((currentDoctor) => {
        if (!currentDoctor) {
          return currentDoctor;
        }

        return {
          ...currentDoctor,
          availableSlots: currentDoctor.availableSlots.filter(
            (slot) => slot.slotId !== slotId,
          ),
        };
      });

      navigate("/patient/appointments", {
        replace: true,
        state: {
          successMessage: response.message || "Appointment booked successfully.",
        },
      });
    } catch (error) {
      setBookingMessage(error.message || "Unable to book this appointment.");
    } finally {
      setBookingSlotId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10 text-center text-sm text-slate-600 shadow-xl ring-1 ring-slate-200">
          Loading doctor details...
        </div>
      </main>
    );
  }

  if (errorMessage || !doctor) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl space-y-4 rounded-[2rem] bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage || "Doctor details are unavailable right now."}
          </p>
          <Link
            to="/doctors"
            className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to doctor search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          to="/doctors"
          className="inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to doctor search
        </Link>

        <section className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="overflow-hidden rounded-[1.75rem] bg-slate-100">
            <img
              src={getDoctorImageUrl(doctor.doctorId)}
              alt={doctor.name}
              className="h-full min-h-72 w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Doctor Profile
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {doctor.name}
              </h1>
              <p className="text-base font-medium text-slate-700">
                {doctor.speciality}
              </p>
              <p className="text-sm text-slate-600">{doctor.hospitalName}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Qualification</p>
                <p className="mt-2 font-medium text-slate-900">{doctor.qualification}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Experience</p>
                <p className="mt-2 font-medium text-slate-900">
                  {doctor.yearsOfExperience} years
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Gender</p>
                <p className="mt-2 font-medium text-slate-900">{doctor.gender}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Fees</p>
                <p className="mt-2 font-medium text-slate-900">Rs. {doctor.fees}</p>
              </div>
            </div>

            {bookingMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {bookingMessage}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Available Slots</h2>
              <p className="mt-1 text-sm text-slate-600">
                These slots are coming from the public doctor details API.
              </p>
            </div>
          </div>

          {availableSlots.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {availableSlots.map((slot) => {
                const isDisabledForRole = isAuthenticated && role !== "PATIENT";
                const isDisabled =
                  bookingSlotId !== null || isDisabledForRole || slot.slotStatus !== "AVAILABLE";

                let buttonLabel = "Book Appointment";

                if (!isAuthenticated) {
                  buttonLabel = "Login to Book";
                } else if (role !== "PATIENT") {
                  buttonLabel = "Patients Only";
                } else if (bookingSlotId === slot.slotId) {
                  buttonLabel = "Booking...";
                }

                return (
                  <div
                    key={slot.slotId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-400">Date</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {formatSlotDate(slot.slotDate)}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">Time</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {formatSlotTime(slot.startTime, slot.endTime)}
                    </p>
                    <p className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {slot.slotStatus}
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => handleBookClick(slot.slotId)}
                        disabled={isDisabled}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {buttonLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              No available slots are currently listed for this doctor.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
