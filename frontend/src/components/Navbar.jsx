import { Camera, LogOut, Aperture } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar({ onUploadClick }) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast("Logged out.", { icon: "🎞️" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-ink-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Aperture className="h-6 w-6 text-amber" strokeWidth={2} />
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

          <div className="hidden items-center gap-2 rounded-full border border-ink-line px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            <span className="font-mono text-xs text-paper-dim">{user?.username}</span>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="rounded-full border border-ink-line p-2 text-paper-dim transition-colors hover:border-safelight hover:text-safelight"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
