import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Aperture,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Cloud,
  ShieldCheck,
  Layers,
  Zap,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";

const CAPTIONS = [
  "A person, apparently unaware they are being documented.",
  "Lighting: accidental. Composition: also accidental.",
  "This photo contains at least one questionable decision.",
  "Subject appears confident. Subject should not be.",
  "Filed under: things that happened, technically.",
];

const STACK = ["React", "Vite", "Tailwind CSS", "Express", "MongoDB", "Gemini", "ImageKit", "Framer Motion"];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Gemini writes the caption",
    body: "Every upload gets read by Gemini and handed back a caption you never asked for — dry, specific, occasionally too honest.",
  },
  {
    icon: Cloud,
    title: "Prints developed in the cloud",
    body: "ImageKit stores and serves every frame, so your roll loads fast whether you shot on a phone or a flatbed scanner.",
  },
  {
    icon: LayoutGrid,
    title: "A roll, not a grid",
    body: "Posts stack newest-first, numbered like frames on a strip — your feed reads like a contact sheet, not a wall.",
  },
  {
    icon: ShieldCheck,
    title: "Sessions that actually hold",
    body: "JWT-backed auth keeps you logged in across refreshes, with cookies handled properly end to end.",
  },
  {
    icon: Zap,
    title: "Motion that means something",
    body: "Uploads flicker through a real \u201cdeveloping\u201d sequence before the caption types itself out, frame by frame.",
  },
  {
    icon: Layers,
    title: "Responsive by default",
    body: "The brand panel collapses on mobile, the composer becomes a bottom sheet, and every control keeps a visible focus ring.",
  },
];

const STEPS = [
  { n: "01", title: "Shoot or pick a photo", body: "Drop in anything — a real photo, a screenshot, a questionable decision." },
  { n: "02", title: "It \u201cdevelops\u201d", body: "A short darkroom animation plays while ImageKit processes and stores the print." },
  { n: "03", title: "Gemini writes the line", body: "The caption types itself out under the photo, letter by letter, no take-backs." },
  { n: "04", title: "It joins your roll", body: "The frame is numbered and added to your feed, newest print first." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
};

function Reveal({ children, className = "", delay = 0, scale = false }) {
  return (
    <motion.div
      className={className}
      initial={scale ? { opacity: 0, scale: 0.94 } : "hidden"}
      whileInView={scale ? { opacity: 1, scale: 1 } : "show"}
      variants={scale ? undefined : fadeUp}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const captionIndex = useRef(0);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let charTimer;
    let holdTimer;

    function typeLine() {
      const text = CAPTIONS[captionIndex.current % CAPTIONS.length];
      if (reduceMotion) {
        setCaption(text);
        holdTimer = setTimeout(() => {
          captionIndex.current += 1;
          typeLine();
        }, 2600);
        return;
      }
      let i = 0;
      setCaption("");
      charTimer = setInterval(() => {
        i += 1;
        setCaption(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(charTimer);
          holdTimer = setTimeout(() => {
            captionIndex.current += 1;
            typeLine();
          }, 1800);
        }
      }, 32);
    }

    typeLine();
    return () => {
      clearInterval(charTimer);
      clearTimeout(holdTimer);
    };
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#process", label: "How it works" },
    { href: "#stack", label: "Stack" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-paper">
      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ================= NAV — half-width floating pill ================= */}
      <div className="fixed left-1/2 top-[18px] z-[100] w-[min(640px,calc(100%-32px))] -translate-x-1/2">
        <div
          className={`flex items-center justify-between gap-2.5 rounded-full bg-ink/70 py-2.5 pl-4 pr-2.5 backdrop-blur-xl transition-shadow ${
            scrolled ? "shadow-[0_10px_32px_-12px_rgba(0,0,0,0.55)] border-[#43423a]" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap font-display text-base font-semibold tracking-tight">
            <span className="relative flex h-6.5 w-6.5 flex-none items-center justify-center rounded-full bg-[conic-gradient(from_210deg,var(--color-amber),var(--color-amber-soft),var(--color-safelight),var(--color-amber))]">
              <span className="absolute inset-[2px] rounded-full bg-ink" />
              <Aperture className="relative h-3.5 w-3.5 text-amber-soft" strokeWidth={2} />
            </span>
            Roll
            <span className="ml-0.5 rounded-full border border-ink-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-paper-dim">
              no. 001
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-[13.5px] font-medium text-paper-dim sm:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="relative py-1 transition-colors hover:text-paper">
                {l.label}
              </a>
            ))}
          </nav>

          <Link
            to="/register"
            className="hidden whitespace-nowrap rounded-full bg-amber px-4 py-2 font-mono text-[11.5px] font-medium uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] active:scale-95 sm:inline-block"
          >
            Get started
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink-line sm:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-2 flex flex-col gap-0.5 rounded-[20px] border border-ink-line bg-ink/95 p-2.5 backdrop-blur-xl sm:hidden">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-paper-dim hover:bg-ink-soft hover:text-paper"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-paper-dim hover:bg-ink-soft hover:text-paper"
            >
              Get started
            </Link>
          </div>
        )}
      </div>

      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden px-6 pb-[110px] pt-[150px] sm:px-8">
        <div className="pointer-events-none absolute -top-[140px] left-[calc(50%-640px)] h-[520px] w-[520px] rounded-full bg-safelight opacity-[0.16] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-[200px] right-[calc(50%-640px)] h-[480px] w-[480px] rounded-full bg-amber opacity-[0.13] blur-[130px]" />

        <div className="relative z-[2] mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber">
                Frame No. 001 — AI photo captioner
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-4.5 font-display text-[2.5rem] font-semibold leading-[1.04] tracking-tight sm:text-[3.2rem] lg:text-[4.1rem]">
                Every photo gets developed
                <br />
                <span className="text-amber">with a caption</span>
                <br />
                you didn&rsquo;t ask for.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mb-8 mt-5 max-w-[460px] text-[16.5px] leading-relaxed text-paper-dim">
                Upload a photo. Gemini looks at it and writes a caption dry, weird, occasionally unkind. ImageKit
                develops the print, MongoDB keeps the roll. Nothing about your feed is under your control, and
                that&rsquo;s the point.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mb-9 flex flex-wrap gap-3.5">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-full bg-amber px-6.5 py-3.5 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(245,166,35,0.55)]"
                >
                  Load your first roll
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
                </Link>
                <a
                  href="#process"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-line px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-wide transition-colors hover:border-sage hover:bg-sage/5 hover:text-sage"
                >
                  <PlayCircle className="h-3.5 w-3.5" strokeWidth={2} />
                  See it develop
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-4.5 font-mono text-[11.5px] text-paper-dim">
                <span className="inline-flex items-center">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sage shadow-[0_0_0_3px_rgba(126,165,131,0.15)]" />
                  Gemini · ImageKit · MongoDB
                </span>
                <span>·</span>
                <span>Fully responsive</span>
              </div>
            </Reveal>
          </div>

          {/* ---- signature: developing frame ---- */}
          <Reveal scale delay={0.1} className="relative">
            <div className="absolute -left-0.5 top-3.5 bottom-3.5 flex w-3.5 flex-col justify-between">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full bg-ink shadow-[inset_0_0_0_1px_var(--color-ink-line)]" />
              ))}
            </div>
            <div className="absolute -right-0.5 top-3.5 bottom-3.5 flex w-3.5 flex-col justify-between">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full bg-ink shadow-[inset_0_0_0_1px_var(--color-ink-line)]" />
              ))}
            </div>

            <div className="relative mx-5 aspect-[4/5] overflow-hidden rounded-2xl border border-ink-line bg-[linear-gradient(155deg,#1d1c17,#141310_60%)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)]">
              <span className="absolute left-5 top-5 rounded-full border border-amber/35 bg-ink/55 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-amber-soft backdrop-blur-sm">
                DEVELOPING
              </span>
              <span className="absolute right-5 top-5 rounded-full border border-ink-line bg-ink/55 px-2.5 py-1 font-mono text-[10px] text-paper-dim">
                #0247
              </span>

              <div className="absolute inset-2.5 animate-develop overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_22%,#4c3a24_0%,transparent_45%),radial-gradient(circle_at_75%_65%,#2c3b30_0%,transparent_50%),linear-gradient(200deg,#38342a,#18160f_70%)]">
                <div className="absolute bottom-0 left-1/2 h-[78%] w-[64%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_100%,#0d0c0a_0%,transparent_68%),radial-gradient(circle_at_50%_32%,#2a251c_0%,transparent_30%)]" />
                <div className="absolute inset-x-0 h-[38%] animate-scan bg-[linear-gradient(180deg,rgba(232,73,29,0)_0%,rgba(232,73,29,0.16)_45%,rgba(245,166,35,0.22)_55%,rgba(232,73,29,0)_100%)] mix-blend-screen" />
              </div>
            </div>

            <div className="mx-5 mt-4 flex items-start gap-2.5 rounded-xl border border-ink-line bg-ink-soft p-3.5">
              <Sparkles className="mt-0.5 h-4 w-4 flex-none text-sage" strokeWidth={2} />
              <div className="min-h-[38px] font-mono text-[12.5px] leading-relaxed text-paper">
                {caption}
                <span className="animate-flicker ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] bg-amber" />
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ================= STACK MARQUEE ================= */}
      <div id="stack" className="relative z-[2] bg-ink-soft py-5.5">
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="roll-marquee flex w-max gap-13">
            {[...STACK, ...STACK].map((name, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap font-mono text-[20px] text-paper-dim">
                <Aperture className="h-3.5 w-3.5 text-amber" strokeWidth={1.8} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-[1180px] px-6 py-[100px] sm:px-8 sm:py-[120px]">
        <Reveal className="mb-14">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber">What&rsquo;s in the roll</span>
          <h2 className="mb-3.5 mt-3.5 max-w-[560px] font-display text-[1.7rem] font-semibold leading-tight tracking-tight sm:text-[2.5rem]">
            Built like a darkroom, run like an app.
          </h2>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-paper-dim">
            Every part of the stack exists to get a photo in front of an AI, and its opinion in front of you, as fast
            as possible.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.06} className="bg-ink-soft p-8 transition-colors hover:bg-[#232019]">
              <div className="mb-4.5 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border border-amber/25 bg-amber/10">
                <Icon className="h-4.5 w-4.5 text-amber" strokeWidth={1.9} />
              </div>
              <h3 className="mb-2 font-display text-[16.5px] font-semibold tracking-tight">{title}</h3>
              <p className="text-[13.5px] leading-relaxed text-paper-dim">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section id="process" className="border-y border-ink-line bg-ink-soft py-[100px]">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <Reveal className="mb-14">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber">Frame by frame</span>
            <h2 className="mt-3.5 max-w-[560px] font-display text-[1.7rem] font-semibold leading-tight tracking-tight sm:text-[2.5rem]">
              From shutter to feed in four steps.
            </h2>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-9 md:grid-cols-4 md:gap-0">
            <div className="pointer-events-none absolute top-[19px] left-0 right-0 hidden h-px bg-ink-line md:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className="relative pr-6">
                <div className="relative z-[2] mb-5.5 flex h-9.5 w-9.5 items-center justify-center rounded-full border border-amber bg-ink font-mono text-[13px] text-amber">
                  {s.n}
                </div>
                <h4 className="mb-2 font-display text-[15.5px] font-semibold">{s.title}</h4>
                <p className="text-[13.5px] leading-relaxed text-paper-dim">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-[130px] sm:px-8">
        <Reveal scale className="relative mx-auto max-w-[640px] overflow-hidden rounded-3xl border border-ink-line bg-ink-soft px-6 py-16 text-center sm:px-10">
          <div className="pointer-events-none absolute left-1/2 -top-20 h-[220px] w-[360px] -translate-x-1/2 bg-safelight opacity-[0.18] blur-[90px]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-3.5 justify-evenly">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-ink shadow-[inset_0_0_0_1px_var(--color-ink-line)]" />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-3.5 justify-evenly">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-ink shadow-[inset_0_0_0_1px_var(--color-ink-line)]" />
            ))}
          </div>

          <span className="relative font-mono text-[11px] uppercase tracking-[0.28em] text-amber">Ready when you are</span>
          <h2 className="relative mb-3.5 mt-3.5 font-display text-[1.7rem] font-semibold tracking-tight sm:text-[2.4rem]">
            Load your first roll.
          </h2>
          <p className="relative mb-7.5 text-[14.5px] text-paper-dim">
            Register, upload a photo, and see what the AI decides to say about it. You&rsquo;ve been warned once
            already.
          </p>
          <Link
            to="/register"
            className="group relative inline-flex items-center gap-2 rounded-full bg-amber px-6.5 py-3.5 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(245,166,35,0.55)]"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
          </Link>
        </Reveal>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-ink-line px-6 py-9 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-2 font-display text-[15px] font-semibold">
            <span className="relative flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,var(--color-amber),var(--color-amber-soft),var(--color-safelight),var(--color-amber))]">
              <span className="absolute inset-[2px] rounded-full bg-ink" />
              <Aperture className="relative h-2.5 w-2.5 text-amber-soft" strokeWidth={2} />
            </span>
            Roll
          </Link>
          <div className="flex gap-6 text-[13px] text-paper-dim">
            <a href="#features" className="transition-colors hover:text-amber">Features</a>
            <a href="#process" className="transition-colors hover:text-amber">How it works</a>
            <a href="#stack" className="transition-colors hover:text-amber">Stack</a>
          </div>
        </div>
        <p className="mx-auto mt-6.5 max-w-[1180px] text-center font-mono text-[11px] text-ink-line">
          ROLL · FRAME NO. 001 · DEVELOPED IN THE DARK, CAPTIONED BY GEMINI
        </p>
      </footer>

      <style>{`
        @keyframes roll-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .roll-marquee {
          animation: roll-marquee 26s linear infinite;
        }
        .roll-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .roll-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}
