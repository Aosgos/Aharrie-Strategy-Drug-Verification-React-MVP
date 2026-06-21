"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, SubscriptionPlan } from "@/types";

interface AuthCtx {
  user:            User | null;
  token:           string | null;
  isAuthenticated: boolean;
  loading:         boolean;
  login:           (user: User, token: string) => void;
  logout:          () => void;
  updatePlan:      (plan: SubscriptionPlan)    => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]  = useState<User | null>(null);
  const [token,   setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem("aharrie_token");
      const u = localStorage.getItem("aharrie_user");
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  function login(u: User, t: string) {
    setUser(u); setToken(t);
    localStorage.setItem("aharrie_token", t);
    localStorage.setItem("aharrie_user",  JSON.stringify(u));
    // Note: the actual auth cookie middleware reads is set server-side by
    // /api/auth/login and /api/auth/register via Set-Cookie (httpOnly).
    // This call here only matters for the demo bypass buttons (Biometric/
    // Passkey) which skip the real API — harmless no-op otherwise.
  }

  function logout() {
    setUser(null); setToken(null);
    localStorage.removeItem("aharrie_token");
    localStorage.removeItem("aharrie_user");
    // Cookie is httpOnly now, so it can only be cleared server-side.
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }

  function updatePlan(plan: SubscriptionPlan) {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, subscriptionPlan: plan };
      localStorage.setItem("aharrie_user", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <Ctx.Provider value={{ user, token, isAuthenticated: !!user, loading, login, logout, updatePlan }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
