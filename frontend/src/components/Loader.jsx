export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-ink px-6">
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2 border-ink-line" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-amber" />
      </div>
      <p className="font-mono text-xs tracking-widest text-paper-dim uppercase">{label}</p>
    </div>
  );
}
