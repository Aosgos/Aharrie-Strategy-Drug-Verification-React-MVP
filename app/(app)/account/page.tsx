"use client";
import { useRouter } from "next/navigation";
import { User, Bell, ShieldCheck, Leaf, HelpCircle, LogOut, ChevronRight, Star, Sun, Moon, Monitor, Globe } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import { LANG_OPTIONS, SupportedLang } from "@/lib/i18n";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { mode, setMode, isDark } = useTheme();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const initials = (user?.name ?? "??")
    .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  function handleLogout() { logout(); router.push("/"); }

  const currentLang = LANG_OPTIONS.find(l => l.code === lang);

  const COLOR_MODES = [
    { id: "light",  icon: Sun,     label: t("theme_light")  },
    { id: "dark",   icon: Moon,    label: t("theme_dark")   },
    { id: "system", icon: Monitor, label: t("theme_system") },
  ];

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1.5 text-[15px] font-medium" style={{ color: "var(--t1)" }}>
            <Leaf size={16} color="var(--green)" />Aharrie
          </div>
          <h1 className="text-[15px] font-semibold" style={{ color: "var(--t1)" }}>{t("account_title")}</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">
          {/* Profile card */}
          <div className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-semibold flex-shrink-0"
              style={{ background: "var(--green-lt)", color: "var(--green)" }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-semibold truncate" style={{ color: "var(--t1)" }}>{user?.name}</p>
              <p className="text-[12px] truncate" style={{ color: "var(--t2)" }}>{user?.email || "No email set"}</p>
              {user?.role === "pharmacist" && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "var(--green-lt)", color: "var(--green)" }}>
                  <ShieldCheck size={10} color="var(--green)" />Verified Pharmacist
                </span>
              )}
            </div>
          </div>

          {/* Subscription banner — pharmacist */}
          {user?.role === "pharmacist" && user?.subscriptionPlan && (
            <div className="rounded-2xl p-4 flex items-center justify-between"
              style={{ background: "var(--green)", boxShadow: "0 4px 16px rgba(74,124,94,0.25)" }}>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Star size={12} color="rgba(255,255,255,0.75)" />
                  <p className="text-[12px] capitalize" style={{ color: "rgba(255,255,255,0.75)" }}>{user.subscriptionPlan} plan</p>
                </div>
                <p className="text-[15px] font-semibold text-white">Active subscription</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>Renews July 10, 2026</p>
              </div>
              <button className="text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full border-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.2)" }}>Manage</button>
            </div>
          )}

          {/* Patient stats */}
          {user?.role === "patient" && (
            <div className="grid grid-cols-3 gap-2.5">
              {[{ label:"Total scans", val:"24" },{ label:"Authentic", val:"21" },{ label:"Flagged", val:"3" }].map(({ label, val }) => (
                <div key={label} className="rounded-xl p-3 text-center"
                  style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                  <p className="text-[18px] font-semibold" style={{ color: "var(--green)" }}>{val}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--t2)" }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Appearance section */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
            {/* Theme toggle */}
            <button onClick={() => { setShowThemePicker(!showThemePicker); setShowLangPicker(false); }}
              className="flex items-center gap-3 w-full px-4 py-3.5 border-none cursor-pointer text-left"
              style={{ background: "transparent", borderBottom: "1px solid var(--border)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--green-lt)" }}>
                {isDark ? <Moon size={16} color="var(--green)" /> : <Sun size={16} color="var(--green)" />}
              </div>
              <span className="flex-1 text-[14px]" style={{ color: "var(--t1)" }}>Appearance</span>
              <span className="text-[12px]" style={{ color: "var(--t3)" }}>{COLOR_MODES.find(m => m.id === mode)?.label}</span>
              <ChevronRight size={15} color="var(--t3)" style={{ transform: showThemePicker ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {showThemePicker && (
              <div className="flex gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                {COLOR_MODES.map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => setMode(id as typeof mode)}
                    className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border-none cursor-pointer transition-colors text-[11px] font-medium"
                    style={{ background: mode === id ? "var(--green)" : "var(--bg-input)", color: mode === id ? "#fff" : "var(--t2)" }}>
                    <Icon size={18} color={mode === id ? "#fff" : "var(--t2)"} />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Language picker */}
            <button onClick={() => { setShowLangPicker(!showLangPicker); setShowThemePicker(false); }}
              className="flex items-center gap-3 w-full px-4 py-3.5 border-none cursor-pointer text-left"
              style={{ background: "transparent", borderBottom: "1px solid var(--border)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--green-lt)" }}>
                <Globe size={16} color="var(--green)" />
              </div>
              <span className="flex-1 text-[14px]" style={{ color: "var(--t1)" }}>Language</span>
              <span className="text-[12px]" style={{ color: "var(--t3)" }}>{currentLang?.flag} {currentLang?.label}</span>
              <ChevronRight size={15} color="var(--t3)" style={{ transform: showLangPicker ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {showLangPicker && (
              <div className="px-4 py-3 flex flex-col gap-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                {LANG_OPTIONS.map(({ code, label, flag }) => (
                  <button key={code} onClick={() => { setLang(code as SupportedLang); setShowLangPicker(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border-none cursor-pointer text-left transition-colors"
                    style={{ background: lang === code ? "var(--green-lt)" : "transparent", color: lang === code ? "var(--green)" : "var(--t1)" }}>
                    <span className="text-lg">{flag}</span>
                    <span className="text-[13px] font-medium">{label}</span>
                    {lang === code && <ShieldCheck size={14} color="var(--green)" className="ml-auto" />}
                  </button>
                ))}
              </div>
            )}

            {/* Menu items */}
            {[
              { icon: User,        label: t("account_edit"),          value: "" },
              { icon: Bell,        label: t("account_notifications"),  value: t("common_on") },
              { icon: ShieldCheck, label: t("account_privacy"),        value: "" },
              { icon: Leaf,        label: t("account_about"),          value: "" },
              { icon: HelpCircle,  label: t("account_help"),           value: "" },
            ].map(({ icon: Icon, label, value }) => (
              <button key={label} className="flex items-center gap-3 w-full px-4 py-3.5 border-none cursor-pointer text-left"
                style={{ background: "transparent", borderBottom: "1px solid var(--border)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--green-lt)" }}>
                  <Icon size={16} color="var(--green)" />
                </div>
                <span className="flex-1 text-[14px]" style={{ color: "var(--t1)" }}>{label}</span>
                {value && <span className="text-[12px]" style={{ color: "var(--t3)" }}>{value}</span>}
                <ChevronRight size={15} color="var(--t3)" />
              </button>
            ))}

            {/* Sign out */}
            <button onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 border-none cursor-pointer text-left"
              style={{ background: "transparent" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--pink-bg)" }}>
                <LogOut size={16} color="var(--pink)" />
              </div>
              <span className="flex-1 text-[14px]" style={{ color: "var(--pink)" }}>{t("account_signout")}</span>
            </button>
          </div>

          <p className="text-center text-[11px]" style={{ color: "var(--t3)" }}>
            Aharrie Strategy v3.0.0 · NAFDAC integrated
          </p>
        </div>
        <BottomNav role={user?.role ?? "patient"} />
      </div>
    </div>
  );
}
