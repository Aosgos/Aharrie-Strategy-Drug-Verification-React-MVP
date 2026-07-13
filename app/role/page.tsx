"use client";
import Link from "next/link";
import { User, Building2, ShieldCheck, Pill, Activity, Leaf } from "lucide-react";
import dynamic from "next/dynamic";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";

const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground").then(m => m.ParticleBackground), { ssr: false });

function Chip({ icon: Icon, label, pink = false }: { icon: typeof User; label: string; pink?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: pink ? "var(--pink-bg)" : "var(--green-lt)" }}>
        <Icon size={16} color={pink ? "var(--pink)" : "var(--green)"} />
      </div>
      <span className="text-[11px]" style={{ color: "var(--t2)" }}>{label}</span>
    </div>
  );
}

export default function RoleSelectPage() {
  const { t } = useI18n();
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <ParticleBackground dark={isDark} />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5 text-[15px] font-medium" style={{ color: "var(--t1)" }}>
            <Leaf size={16} color="var(--green)" />Aharrie Strategy
          </div>
        </div>

        <div className="px-4 pb-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--green-lt)" }}>
            <ShieldCheck size={24} color="var(--green)" />
          </div>
          <h1 className="text-[18px] font-semibold mb-1" style={{ color: "var(--t1)" }}>
            {t("role_title")}
          </h1>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--t2)" }}>
            Select your role to personalize your experience
          </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 flex flex-col gap-3">
          {/* Patient card */}
          <Link href="/login/patient">
            <div className="rounded-2xl p-5 text-center cursor-pointer transition-all hover:scale-[1.01]"
              style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)", border: "1px solid var(--border)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "var(--green-lt)" }}>
                <User size={28} color="var(--green)" />
              </div>
              <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--t1)" }}>
                {t("role_patient")}
              </h3>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--t2)" }}>
                {t("role_patient_sub")}
              </p>
              <div className="flex justify-center gap-5">
                <Chip icon={Pill}        label="Quick Verify" />
                <Chip icon={Activity}   label="Health Tracking" />
                <Chip icon={ShieldCheck} label="Safety First" pink />
              </div>
            </div>
          </Link>

          {/* Pharmacist card */}
          <Link href="/login/pharmacist">
            <div className="rounded-2xl p-5 text-center cursor-pointer transition-all hover:scale-[1.01]"
              style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)", border: "1px solid var(--border)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "var(--green-lt)" }}>
                <Building2 size={28} color="var(--green)" />
              </div>
              <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--t1)" }}>
                {t("role_pharmacist")}
              </h3>
              <span className="inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2"
                style={{ background: "#E6F1FB", color: "#185FA5" }}>
                Subscription required
              </span>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--t2)" }}>
                {t("role_pharmacist_sub")}
              </p>
              <div className="flex justify-center gap-5">
                <Chip icon={Activity}   label="Audit Logs" />
                <Chip icon={Building2} label="Pro Tools" pink />
                <Chip icon={ShieldCheck} label="Batch Scan" />
              </div>
            </div>
          </Link>

          <p className="text-center text-[13px]" style={{ color: "var(--t2)" }}>
            Just browsing?{" "}
            <Link href="/guest" className="font-medium" style={{ color: "var(--green)" }}>
              {t("role_guest")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
