import { Aperture, ArrowRight } from "lucide-react";

export default function EmptyState({ onUploadClick }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-ink-line bg-ink-soft/40 px-6 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber/25 bg-amber/10">
        <Aperture className="h-7 w-7 text-amber" strokeWidth={1.6} />
      </span>
      <div>
        <p className="font-display text-xl font-semibold text-paper">No exposures yet</p>
        <p className="mx-auto mt-1.5 max-w-xs font-mono text-xs leading-relaxed text-paper-dim">
          Upload your first photo and let the AI write a caption you didn&rsquo;t ask for.
        </p>
      </div>
      <button
        onClick={onUploadClick}
        className="group flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(245,166,35,0.55)] active:translate-y-0"
      >
        Upload photo
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
      </button>
    </div>
  );
}
