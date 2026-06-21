"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Fingerprint, KeyRound } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { User } from "@/types";

export default function PatientLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail]       = useState("patient@example.com");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { user, token } = await api.auth.login(email, password) as { user: User; token: string };
      login(user, token);
      router.push("/home");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <PageShell>
      <TopNav title="Aharrie Strategy" backHref="/role"
        right={<span className="text-[12px] text-[#1A2E25] bg-white border border-[#C8DDD2] rounded-full px-2.5 py-1">Patient</span>} />
      <div className="flex flex-col items-center px-4 py-4 gap-2">
        <div className="w-14 h-14 rounded-full bg-[#D4EDE0] flex items-center justify-center">
          <ShieldCheck size={26} color="#4A7C5E" />
        </div>
        <p className="text-[13px] text-[#5A7067] text-center">Secure access to your health verification platform</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <Card>
          <h1 className="text-[18px] font-semibold text-[#1A2E25] text-center mb-1">Welcome Back</h1>
          <p className="text-[13px] text-[#5A7067] text-center mb-5">Access your health verification tools</p>
          <form onSubmit={handleSubmit} noValidate>
            <FieldInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="patient@example.com" required />
            <FieldInput label="Password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
              rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>} required />
            {error && <p className="text-[12px] text-[#D4607A] mb-3">{error}</p>}
            <Button type="submit" disabled={loading} className="mb-4">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : "Sign In"}
            </Button>
          </form>
          <div className="flex items-center gap-2.5 my-1 text-[#8AA398] text-[12px]">
            <div className="flex-1 h-px bg-[#D4E8DC]" />OR CONTINUE WITH<div className="flex-1 h-px bg-[#D4E8DC]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <Button variant="outline" type="button" onClick={() => { login({ id:"demo", email:"", name:"Patient User", role:"patient", createdAt: new Date().toISOString() }, "demo-token"); router.push("/home"); }}>
              <Fingerprint size={16} />Biometric
            </Button>
            <Button variant="outline" type="button" onClick={() => { login({ id:"demo", email:"", name:"Patient User", role:"patient", createdAt: new Date().toISOString() }, "demo-token"); router.push("/home"); }}>
              <KeyRound size={16} />Passkey
            </Button>
          </div>
          <p className="text-[12px] text-[#5A7067] text-center mt-4">Demo: patient@example.com / password123</p>
          <p className="text-[13px] text-[#5A7067] text-center mt-2">
            Don&apos;t have an account?{" "}
            <button onClick={() => router.push("/register")} className="text-[#4A7C5E] font-medium">Sign up</button>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
