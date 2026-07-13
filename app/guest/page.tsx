"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Scan, Lock, AlertTriangle, Building2, ShieldCheck, Leaf, Sun, Moon } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";

const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground").then(m => m.ParticleBackground), { ssr: false });

export default function GuestHomePage() {
  const { t } = useI18n();
  const { isDark, toggle } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <ParticleBackground dark={isDark} />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5 text-[15px] font-medium" style={{ color: "var(--t1)" }}>
            <Leaf size={16} color="var(--green)" />Aharrie Strategy
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              {isDark ? <Sun size={14} color="var(--amber)" /> : <Moon size={14} color="var(--t2)" />}
            </button>
            <Link href="/role" className="text-[13px] font-medium" style={{ color: "var(--green)" }}>{t("auth_signin")}</Link>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-3">
          <div className="rounded-2xl p-5 text-center" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "var(--green-lt)" }}>
              <Scan size={22} color="var(--green)" />
            </div>
            <h2 className="text-[16px] font-semibold mb-1" style={{ color: "var(--t1)" }}>Verify a drug</h2>
            <p className="text-[13px] mb-4" style={{ color: "var(--t2)" }}>Check any drug&apos;s authenticity — no login needed</p>
            <Link href="/scan" className="flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-[15px] font-medium text-white"
              style={{ background: "var(--green)" }}>
              <Scan size={16} />{t("home_open_scanner")}
            </Link>
          </div>
          <div className="flex gap-2.5 rounded-xl p-3" style={{ background: "var(--amber-bg)" }}>
            <AlertTriangle size={16} color="var(--amber)" className="flex-shrink-0 mt-0.5" />
            <p className="text-[12px] leading-relaxed" style={{ color: "#633806" }}>
              Guest scan is limited to 3 drugs.{" "}
              <Link href="/role" className="font-medium" style={{ color: "var(--green)" }}>{t("auth_signin")}</Link>{" "}
              to unlock history, reports, and alerts.
            </p>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--t3)" }}>Locked features</p>
          {[{ icon: ShieldCheck, label:"Scan history" }, { icon: AlertTriangle, label:"Report a fake drug" }, { icon: Building2, label:"Find trusted pharmacies" }].map(({ icon: Icon, label }) => (
            <Link key={label} href="/role" className="rounded-xl p-3 flex items-center gap-3 opacity-60"
              style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
              <Lock size={18} color="var(--t3)" />
              <div>
                <p className="text-[13px]" style={{ color: "var(--t1)" }}>{label}</p>
                <p className="text-[11px]" style={{ color: "var(--green)" }}>Sign in to unlock →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
