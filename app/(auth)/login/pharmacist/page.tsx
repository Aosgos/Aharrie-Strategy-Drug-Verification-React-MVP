"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Info } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { User } from "@/types";

export default function PharmacistLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email,   setEmail]   = useState("");
  const [pcn,     setPcn]     = useState("");
  const [password,setPassword]= useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { user, token } = await api.auth.login(email, password) as { user: User; token: string };
      login(user, token);
      router.push(user.subscriptionPlan ? "/dashboard" : "/subscription");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <PageShell>
      <TopNav title="Aharrie Strategy" backHref="/role"
        right={<span className="text-[12px] text-[#1A2E25] bg-white border border-[#C8DDD2] rounded-full px-2.5 py-1">Pharmacist</span>} />
      <div className="flex flex-col items-center px-4 py-4 gap-2">
        <div className="w-14 h-14 rounded-full bg-[#D4EDE0] flex items-center justify-center">
          <ShieldCheck size={26} color="#4A7C5E" />
        </div>
        <p className="text-[13px] text-[#5A7067] text-center">Professional access — pharmacy verification dashboard</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <Card>
          <h1 className="text-[18px] font-semibold text-[#1A2E25] text-center mb-4">Pharmacist Sign In</h1>
          <div className="flex gap-2.5 bg-[#E6F1FB] rounded-[10px] p-3 mb-4">
            <Info size={16} color="#185FA5" className="flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#0C447C] leading-relaxed">You need a valid PCN licence and an active Aharrie subscription to access the pharmacy dashboard.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <FieldInput label="Pharmacy email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="pharmacy@example.com" required />
            <FieldInput label="PCN licence number" value={pcn} onChange={e => setPcn(e.target.value)} placeholder="e.g. PCN/2024/00123" required />
            <FieldInput label="Password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
              rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>} required />
            {error && <p className="text-[12px] text-[#D4607A] mb-3">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" /> : "Continue to subscription"}
            </Button>
          </form>
          <p className="text-[13px] text-[#5A7067] text-center mt-3">
            Don&apos;t have an account?{" "}
            <button onClick={() => router.push("/register")} className="text-[#4A7C5E] font-medium">Sign up</button>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
