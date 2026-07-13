"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Scan, AlertTriangle, History, Building2, Bell, Leaf, Sun, Moon } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import { StreakDisplay } from "@/components/ui/StreakDisplay";

const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground").then(m => m.ParticleBackground), { ssr: false });
const MoleculeCanvas = dynamic(() => import("@/components/three/MoleculeCanvas").then(m => m.MoleculeCanvas), { ssr: false });

const QUICK_ACTIONS = [
  { key: "report_fake",    icon: AlertTriangle, href: "/report",    pink: true  },
  { key: "scan_history",   icon: History,       href: "/history",   pink: false },
  { key: "find_pharmacy",  icon: Building2,     href: "/pharmacies",pink: false },
  { key: "alerts",         icon: Bell,          href: "/home",      pink: false },
];

export default function PatientHomePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { isDark, toggle } = useTheme();
  const initials = (user?.name ?? "??").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const labels: Record<string, string> = {
    report_fake:   t("home_report_fake"),
    scan_history:  t("home_scan_history"),
    find_pharmacy: t("home_find_pharmacy"),
    alerts:        t("home_alerts"),
  };
  const subs: Record<string, string> = {
    report_fake:   "Flag suspicious drug",
    scan_history:  "View past verifications",
    find_pharmacy: "Find trusted near you",
    alerts:        "2 new NAFDAC alerts",
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <ParticleBackground dark={isDark} />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5 text-[15px] font-medium" style={{ color: "var(--t1)" }}>
            <Leaf size={16} color="var(--green)" />Aharrie Strategy
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center border"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              {isDark ? <Sun size={14} color="var(--amber)" /> : <Moon size={14} color="var(--t2)" />}
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold"
              style={{ background: "var(--green-lt)", color: "var(--green)" }}>{initials}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">
          {/* Streak */}
          <StreakDisplay />

          {/* Scan hero with molecule */}
          <div className="rounded-2xl p-5 text-center" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <div className="flex justify-center">
              <MoleculeCanvas width={110} height={110} scale={1} />
            </div>
            <h2 className="text-[16px] font-semibold mb-1 mt-2" style={{ color: "var(--t1)" }}>
              {t("home_verify_title")}
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "var(--t2)" }}>{t("home_verify_sub")}</p>
            <Link href="/scan" className="flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-[15px] font-medium text-white"
              style={{ background: "var(--green)" }}>
              <Scan size={16} />{t("home_open_scanner")}
            </Link>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map(({ key, icon: Icon, href, pink }) => (
              <Link key={key} href={href}>
                <div className="rounded-xl p-3.5 cursor-pointer transition-colors"
                  style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    style={{ background: pink ? "var(--pink-bg)" : "var(--green-lt)" }}>
                    <Icon size={16} color={pink ? "var(--pink)" : "var(--green)"} />
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--t1)" }}>{labels[key]}</p>
                  <p className="text-[11px]" style={{ color: "var(--t2)" }}>{subs[key]}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* NAFDAC Alerts */}
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--t3)" }}>
            {t("home_nafdac_alerts")}
          </p>
          {[
            { title: "Fake Paracetamol 500mg",   sub: "Batch LG-2024-881 · Lagos" },
            { title: "Counterfeit Coartem 80/480mg", sub: "Multiple batches · Nationwide" },
          ].map(a => (
            <div key={a.title} className="rounded-xl p-3 flex items-start gap-3"
              style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--pink-bg)" }}>
                <AlertTriangle size={15} color="var(--pink)" />
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--t1)" }}>{a.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--t2)" }}>{a.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <BottomNav role="patient" />
      </div>
    </div>
  );
}
