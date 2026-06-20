"use client";
import Link from "next/link";
import { Scan, Lock, AlertTriangle, Building2, ShieldCheck, Leaf } from "lucide-react";
import PageShell from "@/components/ui/PageShell";

export default function GuestHomePage() {
  return (
    <PageShell>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5 text-[15px] font-medium text-[#1A2E25]"><Leaf size={16} color="#4A7C5E" />Aharrie Strategy</div>
        <Link href="/role" className="text-[13px] text-[#4A7C5E] font-medium">Sign in</Link>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
          <div className="w-12 h-12 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3"><Scan size={22} color="#4A7C5E" /></div>
          <h2 className="text-[16px] font-semibold text-[#1A2E25] mb-1">Verify a drug</h2>
          <p className="text-[13px] text-[#5A7067] mb-4">Check any drug&apos;s authenticity — no login needed</p>
          <Link href="/scan" className="flex items-center justify-center gap-2 w-full bg-[#4A7C5E] text-white rounded-full py-3.5 text-[15px] font-medium hover:bg-[#2E5C42] transition-colors">
            <Scan size={16} />Open scanner
          </Link>
        </div>
        <div className="flex gap-2.5 bg-[#FFF4E0] rounded-xl p-3">
          <AlertTriangle size={16} color="#C07A1A" className="flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#633806] leading-relaxed">You can scan up to 3 drugs as a guest. <Link href="/role" className="text-[#4A7C5E] font-medium">Sign in</Link> to unlock history, reporting, and alerts.</p>
        </div>
        <p className="text-[11px] font-medium text-[#8AA398] uppercase tracking-wider">Locked features</p>
        {[{ icon: ShieldCheck, label: "Scan history" }, { icon: AlertTriangle, label: "Report a fake drug" }, { icon: Building2, label: "Find trusted pharmacies" }].map(({ icon: Icon, label }) => (
          <Link key={label} href="/role" className="bg-white rounded-xl p-3 flex items-center gap-3 opacity-60" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
            <Lock size={18} color="#8AA398" />
            <div><p className="text-[13px] text-[#1A2E25]">{label}</p><p className="text-[11px] text-[#4A7C5E]">Sign in to unlock →</p></div>
          </Link>
        ))}
      </div>
      <nav className="bg-white border-t border-[#D4E8DC] flex justify-around px-2 py-2.5 pb-6 flex-shrink-0">
        {[{ icon: Scan, label: "Scan" }, { icon: Lock, label: "History" }, { icon: Lock, label: "Report" }, { icon: Lock, label: "Account" }].map(({ icon: Icon, label }, i) => (
          <div key={label} className="flex flex-col items-center gap-0.5 px-3" style={{ color: i === 0 ? "#4A7C5E" : "#8AA398" }}>
            <Icon size={22} color={i === 0 ? "#4A7C5E" : "#8AA398"} />
            <span className="text-[10px]">{label}</span>
          </div>
        ))}
      </nav>
    </PageShell>
  );
}
