import { Link } from "react-router-dom";
import FilmStrip from "./FilmStrip";
import { Aperture } from "lucide-react";

export default function AuthLayout({ eyebrow, children }) {
  return (
    <div className="relative flex min-h-screen w-full bg-ink">
      {/* ambient glow behind the form panel */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full md:w-[440px]">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-safelight opacity-[0.12] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber opacity-[0.08] blur-[110px]" />
      </div>

      <FilmStrip />

      <div className="relative z-[1] flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 md:w-[440px] md:flex-none">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 md:hidden">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,var(--color-amber),var(--color-amber-soft),var(--color-safelight),var(--color-amber))]">
              <span className="absolute inset-[2px] rounded-full bg-ink" />
              <Aperture className="relative h-3.5 w-3.5 text-amber-soft" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-semibold text-paper">Roll</span>
          </Link>

          <div className="rounded-3xl border border-ink-line bg-ink-soft/70 p-7 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-8">
            {eyebrow && (
              <span className="mb-3 inline-block font-mono text-[11px] uppercase tracking-[0.28em] text-amber">
                {eyebrow}
              </span>
            )}
            {children}
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-paper-dim transition-colors hover:text-paper"
          >
            &larr; Back to Roll
          </Link>
        </div>
      </div>
    </div>
  );
}
