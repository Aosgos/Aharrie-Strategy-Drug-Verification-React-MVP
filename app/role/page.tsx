"use client";
import Link from "next/link";
import { User, Building2, ShieldCheck, Pill, Activity } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";

function Chip({ icon: Icon, label, pink = false }: { icon: typeof User; label: string; pink?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: pink ? "#FFE8EC" : "#D4EDE0" }}>
        <Icon size={16} color={pink ? "#D4607A" : "#4A7C5E"} />
      </div>
      <span className="text-[11px] text-[#5A7067]">{label}</span>
    </div>
  );
}

export default function RoleSelectPage() {
  return (
    <PageShell>
      <TopNav title="Choose Your Role" backHref="/" />
      <div className="px-4 pb-3 text-center">
        <div className="w-14 h-14 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3">
          <ShieldCheck size={24} color="#4A7C5E" />
        </div>
        <p className="text-[13px] text-[#5A7067] leading-relaxed">Select your role to personalize your medication verification experience</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-3">
        <Link href="/login/patient">
          <Card className="text-center hover:bg-[#EAF5EF] transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3">
              <User size={28} color="#4A7C5E" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#1A2E25] mb-1.5">I&apos;m a Patient</h3>
            <p className="text-[12px] text-[#5A7067] leading-relaxed mb-4">Verify medications for personal use, track your health journey, and contribute to medication safety</p>
            <div className="flex justify-center gap-5">
              <Chip icon={Pill} label="Quick Verify" />
              <Chip icon={Activity} label="Health Tracking" />
              <Chip icon={ShieldCheck} label="Safety First" pink />
            </div>
          </Card>
        </Link>

        <Link href="/login/pharmacist">
          <Card className="text-center hover:bg-[#EAF5EF] transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3">
              <Building2 size={28} color="#4A7C5E" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#1A2E25] mb-1">I&apos;m a Pharmacist</h3>
            <span className="inline-block bg-[#E6F1FB] text-[#185FA5] text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2">Subscription required</span>
            <p className="text-[12px] text-[#5A7067] leading-relaxed mb-4">Professional verification tools, batch scanning, audit logs, and comprehensive reporting features</p>
            <div className="flex justify-center gap-5">
              <Chip icon={User} label="Batch Scan" />
              <Chip icon={Activity} label="Audit Logs" />
              <Chip icon={Building2} label="Pro Tools" pink />
            </div>
          </Card>
        </Link>

        <p className="text-center text-[13px] text-[#5A7067]">
          Just browsing?{" "}
          <Link href="/guest" className="text-[#4A7C5E] font-medium">Continue as guest</Link>
        </p>
      </div>
    </PageShell>
  );
}
