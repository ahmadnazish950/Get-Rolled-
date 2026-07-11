import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, User, Lock, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, authBusy } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordOk = password.length >= 6;

  async function handleSubmit(e) {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast.error("Username needs at least 3 characters.");
      return;
    }
    if (!passwordOk) {
      toast.error("Password needs at least 6 characters.");
      return;
    }
    const result = await register(username.trim(), password);
    if (result.ok) {
      toast.success("Account created. Let's shoot.");
      navigate("/feed", { replace: true });
    } else {
      toast.error(result.message);
    }
  }

  return (
    <AuthLayout eyebrow="Frame · New roll">
      <h1 className="font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-paper">
        Load your first roll.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-paper-dim">
        Pick a username. Every photo you post gets an AI-written caption.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">Username</span>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-dim"
              strokeWidth={1.8}
            />
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-ink-line bg-ink px-4 py-3 pl-10 font-body text-sm text-paper outline-none transition-colors focus:border-amber"
              placeholder="yourname"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">Password</span>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-dim"
              strokeWidth={1.8}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-ink-line bg-ink px-4 py-3 pl-10 pr-11 font-body text-sm text-paper outline-none transition-colors focus:border-amber"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-dim hover:text-paper"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <span
            className={`mt-1 flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
              passwordOk ? "text-sage" : "text-paper-dim"
            }`}
          >
            <Check className={`h-3 w-3 ${passwordOk ? "opacity-100" : "opacity-30"}`} strokeWidth={2.5} />
            At least 6 characters
          </span>
        </label>

        <button
          type="submit"
          disabled={authBusy}
          className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-amber py-3.5 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_30px_-12px_rgba(245,166,35,0.55)] enabled:active:translate-y-0 disabled:opacity-50"
        >
          {authBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
              Creating account&hellip;
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center font-mono text-xs text-paper-dim">
        Already shooting?{" "}
        <Link to="/login" className="text-amber underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
