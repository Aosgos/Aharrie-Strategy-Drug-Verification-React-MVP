"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { User, UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

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
      const body = {
        name, email, password, role,
        ...(role === "pharmacist" ? { pharmacyName, pcnLicence } : {}),
      };
      const { user, token } = await api.auth.register(body) as { user: User; token: string };
      login(user, token);
      router.push(role === "pharmacist" ? "/subscription" : "/home");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <PageShell>
      <TopNav title="Create Account" backHref="/role" />
      <div className="flex flex-col items-center px-4 py-4 gap-2">
        <div className="w-14 h-14 rounded-full bg-[#D4EDE0] flex items-center justify-center">
          <ShieldCheck size={26} color="#4A7C5E" />
        </div>
        <p className="text-[13px] text-[#5A7067] text-center">Create your Aharrie Strategy account</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <Card>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {(["patient", "pharmacist"] as UserRole[]).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className="rounded-xl px-3 py-2.5 text-[13px] font-medium border cursor-pointer transition-colors capitalize"
                style={{ border: `1px solid ${role === r ? "#4A7C5E" : "#C8DDD2"}`, background: role === r ? "#EAF5EF" : "#EAF4EE", color: role === r ? "#4A7C5E" : "#5A7067" }}>
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FieldInput label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            <FieldInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />

            {role === "pharmacist" && (
              <>
                <FieldInput label="Pharmacy name" value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} placeholder="e.g. HealthPlus Pharmacy" required />
                <FieldInput label="PCN licence number" value={pcnLicence} onChange={e => setPcnLicence(e.target.value)} placeholder="e.g. PCN/2024/00123" required />
              </>
            )}

            <FieldInput label="Password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"
              rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>} required minLength={6} />

            {error && <p className="text-[12px] text-[#D4607A] mb-3">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : "Create account"}
            </Button>
          </form>

          <p className="text-[13px] text-[#5A7067] text-center mt-4">
            Already have an account?{" "}
            <button onClick={() => router.push(role === "pharmacist" ? "/login/pharmacist" : "/login/patient")} className="text-[#4A7C5E] font-medium">
              Sign in
            </button>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
