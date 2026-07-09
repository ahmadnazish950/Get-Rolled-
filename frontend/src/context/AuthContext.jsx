import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

function extractErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);

  // On first load, ask the backend if the auth cookie still points to a valid user.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const { data } = await api.get("/auth/me");
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (username, password) => {
    setAuthBusy(true);
    try {
      const { data } = await api.post("/auth/register", { username, password });
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, "Couldn't create your account. Try again.") };
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setAuthBusy(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      setUser(data.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, "Couldn't log you in. Try again.") };
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // clear locally regardless of network failure
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, checkingSession, authBusy, register, login, logout }),
    [user, checkingSession, authBusy, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
