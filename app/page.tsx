"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ShieldCheck, Heart, Users, Globe, Leaf } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import Card from "@/components/ui/Card";
import IconCircle from "@/components/ui/IconCircle";

const MoleculeCanvas = dynamic(() => import("@/components/three/MoleculeCanvas").then(m => m.MoleculeCanvas), { ssr: false });
const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground").then(m => m.ParticleBackground), { ssr: false });

export default function LandingPage() {
  const { t } = useI18n();
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg)" }}>
      <ParticleBackground dark={isDark} />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <div className="flex items-center gap-1.5 text-[15px] font-medium" style={{ color: "var(--t1)" }}>
            <Leaf size={16} color="var(--green)" />Aharrie Strategy
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 flex flex-col gap-5">
          {/* Hero with molecule */}
          <div className="text-center pt-2 flex flex-col items-center">
            <MoleculeCanvas width={160} height={160} scale={1.2} className="float" />
            <h1 className="text-[22px] font-bold leading-snug mb-2 mt-2" style={{ color: "var(--t1)" }}>
              {t("landing_hero")}
            </h1>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--t2)" }}>
              {t("landing_sub")}
            </p>
          </div>

          {/* Feature icons */}
          <div className="flex justify-around">
            {[
              { icon: ShieldCheck, label: "Smart Scan" },
              { icon: ShieldCheck, label: "Instant Verify" },
              { icon: Heart,       label: "Health First" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-full flex items-center justify-center border"
                  style={{ border: "1px solid var(--border)", background: "var(--card-bg)" }}>
                  <Icon size={20} color="var(--green)" />
                </div>
                <span className="text-[11px]" style={{ color: "var(--t2)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, value: "2M+", label: t("landing_stat_lives") },
              { icon: Globe, value: "45+", label: t("landing_stat_countries") },
            ].map(({ icon: Icon, value, label }) => (
              <Card key={label} className="flex items-center gap-2.5 !p-3.5">
                <IconCircle size="sm"><Icon size={16} color="var(--green)" /></IconCircle>
                <div>
                  <div className="text-lg font-semibold" style={{ color: "var(--green)" }}>{value}</div>
                  <div className="text-[11px]" style={{ color: "var(--t2)" }}>{label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Mission */}
          <Card className="text-center !p-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "var(--green-lt)" }}>
              <Heart size={18} color="var(--green)" />
            </div>
            <h3 className="text-[16px] font-semibold mb-2" style={{ color: "var(--t1)" }}>
              {t("landing_mission_title")}
            </h3>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--t2)" }}>
              {t("landing_mission_body")}
            </p>
          </Card>

          {/* CTA */}
          <Link
            href="/role"
            className="flex items-center justify-center gap-2 w-full rounded-full py-4 text-[15px] font-semibold text-white pulse-glow"
            style={{ background: "var(--green)" }}
          >
            <ShieldCheck size={18} />{t("landing_cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
