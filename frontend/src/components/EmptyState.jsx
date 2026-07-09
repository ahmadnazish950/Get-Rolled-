import { Aperture } from "lucide-react";

export default function EmptyState({ onUploadClick }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink-line px-6 py-16 text-center">
      <Aperture className="h-9 w-9 text-ink-line" strokeWidth={1.5} />
      <div>
        <p className="font-display text-lg font-semibold text-paper">No exposures yet</p>
        <p className="mt-1 font-mono text-xs text-paper-dim">
          Upload your first photo to start the roll.
        </p>
      </div>
      <button
        onClick={onUploadClick}
        className="rounded-full bg-amber px-5 py-2 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] active:scale-95"
      >
        Upload photo
      </button>
    </div>
  );
}
