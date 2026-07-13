"use client";
import Link from "next/link";
import { ShieldCheck, QrCode, FileText, BarChart3, AlertTriangle, CircleCheck, X, Sun, Moon } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import { StreakDisplay } from "@/components/ui/StreakDisplay";

const ACTIONS = [
  { icon: QrCode,        label:"Bulk verify",    sub:"Scan a batch",    href:"/scan",       pink:false },
  { icon: FileText,      label:"Dispensing log", sub:"148 records",     href:"/dispensing", pink:false },
  { icon: BarChart3,     label:"Analytics",      sub:"This month",      href:"/analytics",  pink:false },
  { icon: AlertTriangle, label:"Report fake",    sub:"3 pending",       href:"/report",     pink:true  },
];

const RECENT = [
  { drug:"Amoxicillin 500mg", batch:"BN-20241105", status:"authentic",   time:"2 mins ago"  },
  { drug:"Paracetamol 500mg", batch:"LG-2024-881", status:"counterfeit", time:"14 mins ago" },
  { drug:"Metformin 500mg",   batch:"GCPG-240901", status:"authentic",   time:"1 hour ago"  },
];

export default function PharmacistDashboardPage() {
  const { user }     = useAuth();
  const { t }        = useI18n();
  const { isDark, toggle } = useTheme();
  const pharmacy     = user?.pharmacyName ?? "Obi's Pharmacy";
  const plan         = user?.subscriptionPlan ?? "professional";

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Hero banner */}
        <div className="flex-shrink-0 px-4 pt-4 pb-8 rounded-b-3xl"
          style={{ background: "var(--green)" }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-1.5 w-fit mb-2 px-2.5 py-1 rounded-full text-[11px] text-white"
                style={{ background: "rgba(255,255,255,0.18)" }}>
                <ShieldCheck size={12} color="white" />Verified Pharmacist
              </div>
              <h1 className="text-[17px] font-semibold text-white">{pharmacy}</h1>
              <p className="text-[12px] capitalize" style={{ color: "rgba(255,255,255,0.65)" }}>
                {plan} plan · Lagos
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggle}
                className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.2)" }}>
                {isDark ? <Sun size={14} color="white" /> : <Moon size={14} color="white" />}
              </button>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold text-white"
                style={{ background: "rgba(255,255,255,0.2)" }}>OP</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3 -mt-4">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label:"Scans today",  value:"47", sub:"↑ 12% vs yesterday", color: "var(--green)" },
              { label:"Flagged drugs",value:"3",  sub:"Needs review",        color: "var(--pink)"  },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="rounded-xl p-3.5"
                style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                <p className="text-[11px] mb-1" style={{ color: "var(--t2)" }}>{label}</p>
                <p className="text-[22px] font-semibold" style={{ color }}>{value}</p>
                <p className="text-[11px] mt-0.5" style={{ color }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Streak */}
          <StreakDisplay compact />

          {/* Action grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {ACTIONS.map(({ icon: Icon, label, sub, href, pink }) => (
              <Link key={label} href={href}>
                <div className="rounded-xl p-3.5 cursor-pointer transition-colors"
                  style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    style={{ background: pink ? "var(--pink-bg)" : "var(--green-lt)" }}>
                    <Icon size={16} color={pink ? "var(--pink)" : "var(--green)"} />
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--t1)" }}>{label}</p>
                  <p className="text-[11px]" style={{ color: "var(--t2)" }}>{sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent */}
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--t3)" }}>
            Recent verifications
          </p>
          {RECENT.map(r => (
            <div key={r.drug + r.time} className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: r.status === "authentic" ? "var(--green-lt)" : "var(--pink-bg)" }}>
                {r.status === "authentic"
                  ? <CircleCheck size={16} color="var(--green)" />
                  : <X size={16} color="var(--pink)" />}
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--t1)" }}>
                  {r.drug} · {r.batch}
                </p>
                <p className="text-[11px] mt-0.5 capitalize" style={{ color: "var(--t2)" }}>
                  {r.status} · {r.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <BottomNav role="pharmacist" />
      </div>
    </div>
  );
}
