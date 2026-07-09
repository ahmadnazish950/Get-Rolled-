const HOLES = Array.from({ length: 14 });

export default function FilmStrip() {
  return (
    <div className="relative hidden h-full flex-1 flex-col justify-between overflow-hidden bg-ink-soft px-10 py-12 md:flex">
      {/* ambient safelight glow */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-safelight/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-amber/10 blur-3xl" />

      {/* sprocket rail */}
      <div className="pointer-events-none absolute left-4 top-0 flex h-full w-4 flex-col items-center justify-around">
        {HOLES.map((_, i) => (
          <span key={i} className="h-3 w-3 rounded-full bg-ink" style={{ boxShadow: "inset 0 0 0 1px #33322c" }} />
        ))}
      </div>
      <div className="pointer-events-none absolute right-4 top-0 flex h-full w-4 flex-col items-center justify-around">
        {HOLES.map((_, i) => (
          <span key={i} className="h-3 w-3 rounded-full bg-ink" style={{ boxShadow: "inset 0 0 0 1px #33322c" }} />
        ))}
      </div>

      <div className="relative z-10 pl-6">
        <span className="font-mono text-xs tracking-[0.3em] text-amber uppercase">Roll — No. 001</span>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-paper">
          Every photo
          <br />
          gets developed
          <br />
          <span className="text-amber">with a caption</span>
          <br />
          you didn&rsquo;t ask for.
        </h1>
      </div>

      <p className="relative z-10 max-w-xs pl-6 font-mono text-xs leading-relaxed text-paper-dim">
        An AI looks at what you upload and writes the caption. Dark humor is allowed. You have been warned.
      </p>
    </div>
  );
}
