export function applyServerFieldErrors(fieldErrors, setError) {
  if (!fieldErrors || typeof fieldErrors !== "object") {
    return;
  }

  Object.entries(fieldErrors).forEach(([field, message]) => {
    setError(field, {
      type: "server",
      message,
    });
  });
}

export const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

export const buttonClassName =
  "inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400";

