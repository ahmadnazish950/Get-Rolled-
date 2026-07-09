import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, authBusy } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast.error("Username needs at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password needs at least 6 characters.");
      return;
    }
    const result = await register(username.trim(), password);
    if (result.ok) {
      toast.success("Account created. Let's shoot.");
      navigate("/", { replace: true });
    } else {
      toast.error(result.message);
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold text-paper">Load your first roll.</h1>
      <p className="mt-2 font-mono text-xs text-paper-dim">
        Pick a username. Every photo you post gets an AI-written caption.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">Username</span>
          <input
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="rounded-xl border border-ink-line bg-ink-soft px-4 py-3 font-body text-sm text-paper outline-none transition-colors focus:border-amber"
            placeholder="yourname"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-paper-dim">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-ink-line bg-ink-soft px-4 py-3 pr-11 font-body text-sm text-paper outline-none transition-colors focus:border-amber"
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
        </label>

        <button
          type="submit"
          disabled={authBusy}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-amber py-3 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-transform enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:opacity-50"
        >
          {authBusy ? "Creating account…" : "Create account"}
          {!authBusy && <ArrowRight className="h-4 w-4" strokeWidth={2.4} />}
        </button>
      </form>

      <p className="mt-6 font-mono text-xs text-paper-dim">
        Already shooting?{" "}
        <Link to="/login" className="text-amber hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
