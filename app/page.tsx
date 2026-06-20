"use client";
import Link from "next/link";
import { ShieldCheck, Scan, CheckCircle, Heart, Users, Globe, Leaf } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import IconCircle from "@/components/ui/IconCircle";

export default function LandingPage() {
  return (
    <PageShell>
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <div className="flex items-center gap-1.5 text-[15px] font-medium text-[#1A2E25]">
          <Leaf size={16} color="#4A7C5E" />Aharrie Strategy
        </div>
        <span className="text-[11px] text-[#8AA398]">11:25</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-4">
        <div className="text-center pt-3">
          <div className="w-16 h-16 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={28} color="#4A7C5E" />
          </div>
          <h1 className="text-xl font-semibold text-[#1A2E25] leading-snug mb-2">HealthTech Verification Platform</h1>
          <p className="text-[13px] text-[#5A7067] leading-relaxed">Protecting communities through advanced medication authentication technology</p>
        </div>

        <div className="flex justify-around">
          {[{ icon: Scan, label: "Smart Scan" }, { icon: CheckCircle, label: "Instant Verify" }, { icon: Heart, label: "Health First" }].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-11 h-11 rounded-full border border-[#C8DDD2] bg-white flex items-center justify-center">
                <Icon size={20} color="#4A7C5E" />
              </div>
              <span className="text-[11px] text-[#5A7067]">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[{ icon: Users, value: "2M+", label: "Protected Lives" }, { icon: Globe, value: "45+", label: "Countries" }].map(({ icon: Icon, value, label }) => (
            <Card key={label} className="flex items-center gap-2.5 !p-3.5">
              <IconCircle size="sm"><Icon size={16} color="#4A7C5E" /></IconCircle>
              <div>
                <div className="text-lg font-semibold text-[#4A7C5E]">{value}</div>
                <div className="text-[11px] text-[#5A7067]">{label}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="text-center">
          <div className="w-10 h-10 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3">
            <Heart size={18} color="#4A7C5E" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#1A2E25] mb-2">Our Mission</h3>
          <p className="text-[13px] text-[#5A7067] leading-relaxed">Empowering healthcare communities with technology that ensures medication authenticity, promotes healthy practices, and creates a safer world for everyone.</p>
        </Card>

        <Link href="/role" className="flex items-center justify-center gap-2 w-full bg-[#4A7C5E] text-white rounded-full py-3.5 text-[15px] font-medium hover:bg-[#2E5C42] transition-colors">
          <ShieldCheck size={18} />Begin Health Journey
        </Link>
        <p className="text-center text-[12px] text-[#8AA398]">Join millions protecting medication authenticity worldwide</p>
      </div>
    </PageShell>
  );
}
