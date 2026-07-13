"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { api } from "@/lib/api";
import { User } from "@/types";

const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground").then(m => m.ParticleBackground), { ssr: false });

export default function PatientLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { user, token } = await api.auth.login(email, password) as { user: User; token: string };
      login(user, token);
      router.push("/home");
    } catch (err: unknown) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <ParticleBackground />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <button onClick={() => router.push("/role")} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <span className="text-[11px] rounded-full px-2.5 py-1" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--t1)" }}>Patient</span>
        </div>
        <div className="flex flex-col items-center px-4 py-4 gap-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--green-lt)" }}>
            <ShieldCheck size={26} color="var(--green)" />
          </div>
          <p className="text-[13px] text-center" style={{ color: "var(--t2)" }}>Secure access to your health verification platform</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
          <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <h1 className="text-[18px] font-semibold text-center mb-1" style={{ color: "var(--t1)" }}>Welcome Back</h1>
            <p className="text-[13px] text-center mb-5" style={{ color: "var(--t2)" }}>Access your health verification tools</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3.5">
                <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--t1)" }}>{t("auth_email")}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
              </div>
              <div className="mb-3.5">
                <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--t1)" }}>{t("auth_password")}</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none pr-10"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer" style={{ color: "var(--t3)" }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-[12px] mb-3" style={{ color: "var(--pink)" }}>{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium text-white border-none cursor-pointer disabled:opacity-50"
                style={{ background: "var(--green)" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : t("auth_signin")}
              </button>
            </form>
            <p className="text-[13px] text-center mt-4" style={{ color: "var(--t2)" }}>
              {t("auth_no_account")}{" "}
              <button onClick={() => router.push("/register")} className="font-medium border-none bg-transparent cursor-pointer" style={{ color: "var(--green)" }}>{t("auth_signup")}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
