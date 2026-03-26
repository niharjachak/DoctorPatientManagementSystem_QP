import { Link } from "react-router-dom";

export default function AuthPageShell({
  eyebrow,
  title,
  description,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row">
        <section className="flex flex-1 flex-col justify-between rounded-3xl bg-slate-900 p-8 text-white shadow-xl lg:p-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
              {eyebrow}
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">{alternateLabel}</p>
            <Link
              to={alternateHref}
              className="mt-3 inline-flex text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              {alternateText}
            </Link>
          </div>
        </section>

        <section className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}

