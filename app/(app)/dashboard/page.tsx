"use client";
import Link from "next/link";
import { ShieldCheck, QrCode, FileText, BarChart3, AlertTriangle, CircleCheck, X } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { StreakDisplay } from "@/components/ui/StreakDisplay";

const actions = [
  { icon: QrCode,        label:"Bulk verify",    sub:"Scan a batch",    href:"/scan",       pink:false },
  { icon: FileText,      label:"Dispensing log", sub:"148 records",     href:"/dispensing", pink:false },
  { icon: BarChart3,     label:"Analytics",      sub:"This month",      href:"/analytics",  pink:false },
  { icon: AlertTriangle, label:"Report fake",    sub:"3 pending",       href:"/report",     pink:true  },
];

const recent = [
  { drug:"Amoxicillin 500mg", batch:"BN-20241105", status:"authentic",   time:"2 mins ago" },
  { drug:"Paracetamol 500mg", batch:"LG-2024-881", status:"counterfeit", time:"14 mins ago" },
  { drug:"Metformin 500mg",   batch:"GCPG-240901", status:"authentic",   time:"1 hour ago" },
];

export default function PharmacistDashboardPage() {
  const { user } = useAuth();
  const pharmacy = user?.pharmacyName ?? "Obi's Pharmacy";
  const plan     = user?.subscriptionPlan ?? "professional";

  return (
    <PageShell>
      <div className="flex-shrink-0" style={{ background:"#4A7C5E", padding:"18px 16px 28px" }}>
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1 text-[11px] text-white w-fit mb-2">
              <ShieldCheck size={12} color="white" />Verified Pharmacist
            </div>
            <h1 className="text-[17px] font-semibold text-white">{pharmacy}</h1>
            <p className="text-[12px] text-white/65 capitalize">{plan} plan · Lagos</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-semibold text-white">OP</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3 bg-[#F2F8F4]">
        <div className="px-4 pt-2">
          <StreakDisplay />
        </div>
        <div className="grid grid-cols-2 gap-2.5 -mt-4">
          {[{ label:"Scans today", value:"47", sub:"↑ 12% vs yesterday", vc:"#4A7C5E" }, { label:"Flagged drugs", value:"3", sub:"Needs review", vc:"#D4607A" }].map(({ label, value, sub, vc }) => (
            <div key={label} className="bg-white rounded-xl p-3.5" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
              <p className="text-[11px] text-[#5A7067] mb-1">{label}</p>
              <p className="text-[22px] font-semibold" style={{ color:vc }}>{value}</p>
              <p className="text-[11px] mt-0.5" style={{ color:vc }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {actions.map(({ icon: Icon, label, sub, href, pink }) => (
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

        <p className="text-[11px] font-medium text-[#8AA398] uppercase tracking-wider">Recent verifications</p>
        {recent.map((r) => (
          <div key={r.drug + r.time} className="bg-white rounded-xl p-3 flex items-center gap-3" style={{ boxShadow:"0 2px 14px rgba(74,124,94,0.09)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: r.status === "authentic" ? "#D4EDE0" : "#FFE8EC" }}>
              {r.status === "authentic"
                ? <CircleCheck size={16} color="#4A7C5E" />
                : <X size={16} color="#D4607A" />}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1A2E25]">{r.drug} · {r.batch}</p>
              <p className="text-[11px] text-[#5A7067] mt-0.5 capitalize">{r.status} · {r.time}</p>
            </div>
          </div>
        ))}
      </div>
      <BottomNav role="pharmacist" />
    </PageShell>
  );
}
