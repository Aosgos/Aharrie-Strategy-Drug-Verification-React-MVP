"use client";
import Link from "next/link";
import { Scan, AlertTriangle, History, Building2, Bell, Leaf } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";

const quickActions = [
  { icon: AlertTriangle, label:"Report fake",  sub:"Flag suspicious drug",  href:"/report",    pink:true  },
  { icon: History,       label:"Scan history", sub:"View past verifications",href:"/history",   pink:false },
  { icon: Building2,     label:"Pharmacies",   sub:"Find trusted near you",  href:"/pharmacies",pink:false },
  { icon: Bell,          label:"Alerts",       sub:"2 new NAFDAC alerts",   href:"/home",       pink:false },
];

export default function PatientHomePage() {
  const { user } = useAuth();
  const initials = (user?.name ?? "??").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  return (
    <PageShell>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5 text-[15px] font-medium text-[#1A2E25]"><Leaf size={16} color="#4A7C5E" />Aharrie Strategy</div>
        <div className="w-8 h-8 rounded-full bg-[#D4EDE0] flex items-center justify-center text-[13px] font-semibold text-[#4A7C5E]">{initials}</div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">
        <Card className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#D4EDE0] flex items-center justify-center mx-auto mb-3"><Scan size={22} color="#4A7C5E" /></div>
          <h2 className="text-[16px] font-semibold text-[#1A2E25] mb-1">Verify a medication</h2>
          <p className="text-[13px] text-[#5A7067] mb-4">Scan the QR code on any drug package</p>
          <Link href="/scan" className="flex items-center justify-center gap-2 w-full bg-[#4A7C5E] text-white rounded-full py-3.5 text-[15px] font-medium hover:bg-[#2E5C42] transition-colors">
            <Scan size={16} />Open scanner
          </Link>
        </Card>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map(({ icon: Icon, label, sub, href, pink }) => (
            <Link key={label} href={href}>
              <div className="bg-white rounded-xl p-3.5 cursor-pointer hover:bg-[#EAF5EF] transition-colors" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ background: pink ? "#FFE8EC" : "#D4EDE0" }}>
                  <Icon size={16} color={pink ? "#D4607A" : "#4A7C5E"} />
                </div>
                <p className="text-[13px] font-semibold text-[#1A2E25]">{label}</p>
                <p className="text-[11px] text-[#5A7067]">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-[11px] font-medium text-[#8AA398] uppercase tracking-wider">NAFDAC alerts</p>
        {[{ title:"Fake Paracetamol 500mg", sub:"Batch LG-2024-881 · Lagos" }, { title:"Counterfeit Coartem 80/480mg", sub:"Multiple batches · Nationwide" }].map(a => (
          <div key={a.title} className="bg-white rounded-xl p-3 flex items-start gap-3" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
            <div className="w-8 h-8 rounded-full bg-[#FFE8EC] flex items-center justify-center flex-shrink-0"><AlertTriangle size={15} color="#D4607A" /></div>
            <div><p className="text-[13px] font-semibold text-[#1A2E25]">{a.title}</p><p className="text-[11px] text-[#5A7067] mt-0.5">{a.sub}</p></div>
          </div>
        ))}
      </div>
      <BottomNav role="patient" />
    </PageShell>
  );
}
