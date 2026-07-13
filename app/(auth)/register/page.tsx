"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { api } from "@/lib/api";
import { User, UserRole } from "@/types";

const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground").then(m => m.ParticleBackground), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();
  const [role,         setRole]         = useState<UserRole>("patient");
  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [pcnLicence,   setPcnLicence]   = useState("");
  const [showPw,       setShowPw]       = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const body = { name, email, password, role, ...(role === "pharmacist" ? { pharmacyName, pcnLicence } : {}) };
      const { user, token } = await api.auth.register(body) as { user: User; token: string };
      login(user, token);
      router.push(role === "pharmacist" ? "/subscription" : "/home");
    } catch (err: unknown) { setError((err as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <ParticleBackground />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center px-4 pt-4 pb-1">
          <button onClick={() => router.push("/role")} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center px-4 py-4 gap-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--green-lt)" }}>
            <ShieldCheck size={26} color="var(--green)" />
          </div>
          <p className="text-[13px] text-center" style={{ color: "var(--t2)" }}>Create your Aharrie Strategy account</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
          <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <h1 className="text-[18px] font-semibold text-center mb-4" style={{ color: "var(--t1)" }}>{t("auth_create")}</h1>

            {/* Role toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(["patient","pharmacist"] as UserRole[]).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className="rounded-xl px-3 py-2.5 text-[13px] font-medium border-none cursor-pointer transition-colors capitalize"
                  style={{ background: role === r ? "var(--green-xl)" : "var(--bg-input)", border: `1px solid ${role === r ? "var(--green)" : "var(--border)"}`, color: role === r ? "var(--green)" : "var(--t2)" }}>
                  {r === "patient" ? t("role_patient") : t("role_pharmacist")}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {[
                { label:t("auth_name"),  type:"text",  val:name,  set:setName,  ph:"Your full name"    },
                { label:t("auth_email"), type:"email", val:email, set:setEmail, ph:"you@example.com"   },
              ].map(({ label, type, val, set, ph }) => (
                <div key={label} className="mb-3.5">
                  <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--t1)" }}>{label}</label>
                  <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} required
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
                </div>
              ))}

              {role === "pharmacist" && (
                <>
                  {[
                    { label:t("auth_pharmacy"), val:pharmacyName, set:setPharmacyName, ph:"e.g. HealthPlus Pharmacy" },
                    { label:t("auth_pcn"),      val:pcnLicence,   set:setPcnLicence,   ph:"e.g. PCN/2024/00123"     },
                  ].map(({ label, val, set, ph }) => (
                    <div key={label} className="mb-3.5">
                      <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--t1)" }}>{label}</label>
                      <input value={val} onChange={e => set(e.target.value)} placeholder={ph} required
                        className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
                        style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
                    </div>
                  ))}
                </>
              )}

              <div className="mb-4">
                <label className="block text-[13px] font-medium mb-1.5" style={{ color: "var(--t1)" }}>{t("auth_password")}</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters" required minLength={6}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none pr-10"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--t1)" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer" style={{ color: "var(--t3)" }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-[12px] mb-3" style={{ color: "var(--pink)" }}>{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium text-white border-none cursor-pointer disabled:opacity-50"
                style={{ background: "var(--green)" }}>
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : t("auth_create")}
              </button>
            </form>

            <p className="text-[13px] text-center mt-4" style={{ color: "var(--t2)" }}>
              {t("auth_have_account")}{" "}
              <button onClick={() => router.push(role === "pharmacist" ? "/login/pharmacist" : "/login/patient")}
                className="font-medium border-none bg-transparent cursor-pointer" style={{ color: "var(--green)" }}>
                {t("auth_signin")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
