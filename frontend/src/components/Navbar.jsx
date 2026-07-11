import { useEffect, useRef, useState } from "react";
import { Camera, LogOut, Aperture, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar({ onUploadClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    toast("Logged out.", { icon: "🎞️" });
  }

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 border-b border-ink-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,var(--color-amber),var(--color-amber-soft),var(--color-safelight),var(--color-amber))]">
            <span className="absolute inset-[2px] rounded-full bg-ink" />
            <Aperture className="relative h-3.5 w-3.5 text-amber-soft" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">Roll</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onUploadClick}
            className="group flex items-center gap-2 rounded-full bg-amber px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Camera className="h-4 w-4" strokeWidth={2.4} />
            <span className="hidden sm:inline">Upload photo</span>
            <span className="sm:hidden">Upload</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-ink-line py-1.5 pl-1.5 pr-2.5 transition-colors hover:border-amber/40"
            >
              <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-amber/30 bg-amber/10 font-display text-xs font-semibold text-amber">
                {initial}
              </span>
              <span className="hidden font-mono text-xs text-paper-dim sm:inline">{user?.username}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-paper-dim transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-48 overflow-hidden rounded-2xl border border-ink-line bg-ink-soft shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
                <div className="border-b border-ink-line px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">Signed in as</p>
                  <p className="mt-0.5 truncate font-display text-sm font-semibold text-paper">{user?.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left font-mono text-xs uppercase tracking-wide text-paper-dim transition-colors hover:bg-safelight/10 hover:text-safelight"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
