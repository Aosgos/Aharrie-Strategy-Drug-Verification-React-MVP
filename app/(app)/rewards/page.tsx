"use client";
import { useState } from "react";
import { Palette, Award, Check, Lock, Sparkles, Flame, Trophy, Shield } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useStreak } from "@/context/StreakContext";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import { purchaseFreeze, FREEZE_COST } from "@/lib/streak";

type RewardTab = "themes" | "badges" | "stats";

export default function RewardsPage() {
  const { streak, activeTheme, unlockedThemes, lockedThemes, allBadges, setTheme, setBadge, refresh } = useStreak();
  const { t } = useI18n();
  const { isDark } = useTheme();
  const [tab, setTab] = useState<RewardTab>("themes");
  const [freezeMsg, setFreezeMsg] = useState("");

  function handleBuyFreeze() {
    const ok = purchaseFreeze();
    refresh();
    setFreezeMsg(ok ? "✅ Streak freeze purchased!" : "❌ Not enough points.");
    setTimeout(() => setFreezeMsg(""), 2500);
  }

  const TABS: { id: RewardTab; icon: typeof Palette; label: string }[] = [
    { id:"themes", icon:Palette, label:t("rewards_themes") },
    { id:"badges", icon:Award,   label:t("rewards_badges") },
    { id:"stats",  icon:Trophy,  label:"Stats"             },
  ];

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
          <h1 className="text-[18px] font-bold" style={{ color: "var(--t1)" }}>
            {t("rewards_title")}
          </h1>
          {/* Streak badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #FFB84D22, #FF8C0022)", border: "1px solid #FFB84D44" }}>
            <Flame size={14} color="#FF8C00" />
            <span className="text-[13px] font-bold" style={{ color: "var(--t1)" }}>{streak.current}</span>
            <span className="text-[11px]" style={{ color: "var(--t2)" }}>day streak</span>
          </div>
        </div>

        {/* Points card */}
        <div className="mx-4 mb-3 rounded-2xl p-4 flex-shrink-0"
          style={{ background: "var(--green)", boxShadow: "0 4px 20px rgba(74,124,94,0.25)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-white/70 mb-0.5">Verification Points</p>
              <p className="text-[28px] font-bold text-white">{streak.verificationPoints}</p>
              <p className="text-[11px] text-white/60 mt-0.5">
                {streak.freezes} freeze{streak.freezes !== 1 ? "s" : ""} remaining
              </p>
            </div>
            <div className="text-right">
              <button onClick={handleBuyFreeze}
                className="px-3 py-2 rounded-xl text-[12px] font-medium border-none cursor-pointer mb-2"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                <Shield size={12} className="inline mr-1" />
                Buy freeze ({FREEZE_COST}pts)
              </button>
              {freezeMsg && <p className="text-[11px] text-white/80">{freezeMsg}</p>}
            </div>
          </div>
          {/* Progress to next milestone */}
          {streak.current > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-white/70 mb-1">
                <span>Day {streak.current}</span>
                <span>Next milestone: {[7,14,30,60,100,200,365].find(m => m > streak.current) ?? "Max"} days</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (streak.current / ([7,14,30,60,100,200,365].find(m => m > streak.current) ?? streak.current)) * 100)}%`,
                    background: "rgba(255,255,255,0.85)",
                  }} />
              </div>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 px-4 mb-3 flex-shrink-0">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium border-none cursor-pointer transition-colors"
              style={{ background: tab === id ? "var(--green)" : "var(--card-bg)", color: tab === id ? "#fff" : "var(--t2)", boxShadow: "var(--card-shadow)" }}>
              <Icon size={14} color={tab === id ? "#fff" : "var(--t2)"} />{label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
          {/* ── THEMES ── */}
          {tab === "themes" && (
            <div className="flex flex-col gap-4">
              {/* Active */}
              <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-[14px]" style={{ color: "var(--t1)" }}>
                  <Sparkles size={16} color="var(--green)" />{t("rewards_active")}
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: `${activeTheme.primary}18`, border: `1px solid ${activeTheme.primary}40` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: activeTheme.primary }}>
                    <Palette size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[13px]" style={{ color: "var(--t1)" }}>
                      {unlockedThemes.find(th => th.colors.primary === activeTheme.primary)?.name ?? "Nature Green"}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--t2)" }}>Currently active</p>
                  </div>
                  <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: activeTheme.primary }}>
                    <Check size={12} color="white" />
                  </div>
                </div>
              </div>

              {/* Unlocked */}
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--t3)" }}>
                  {t("rewards_unlocked")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {unlockedThemes.map(theme => (
                    <button key={theme.id} onClick={() => setTheme(theme.id)}
                      className="relative p-4 rounded-2xl text-left border-none cursor-pointer transition-all"
                      style={{
                        background: theme.colors.primary === activeTheme.primary ? `${theme.colors.primary}15` : "var(--card-bg)",
                        border: `${theme.colors.primary === activeTheme.primary ? "2px" : "1px"} solid ${theme.colors.primary === activeTheme.primary ? theme.colors.primary : "var(--border)"}`,
                        boxShadow: "var(--card-shadow)",
                      }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                        style={{ background: `${theme.colors.primary}22` }}>
                        <Palette size={22} style={{ color: theme.colors.primary }} />
                      </div>
                      <p className="font-semibold text-[13px]" style={{ color: "var(--t1)" }}>{theme.name}</p>
                      <div className="flex gap-1 mt-2">
                        {Object.values(theme.colors).map((c, i) => (
                          <div key={i} className="w-4 h-4 rounded-full border" style={{ background: c, borderColor: "var(--border)" }} />
                        ))}
                      </div>
                      {theme.colors.primary === activeTheme.primary && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: theme.colors.primary }}>
                          <Check size={10} color="white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locked */}
              {lockedThemes.length > 0 && (
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--t3)" }}>
                    {t("rewards_locked")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {lockedThemes.map(theme => (
                      <div key={theme.id} className="relative p-4 rounded-2xl opacity-55"
                        style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                          style={{ background: "var(--bg-input)" }}>
                          <Lock size={22} color="var(--t3)" />
                        </div>
                        <p className="font-semibold text-[13px]" style={{ color: "var(--t1)" }}>{theme.name}</p>
                        <p className="text-[11px] mt-1" style={{ color: "var(--t3)" }}>
                          {t("rewards_unlock_at")} {theme.milestone}-{t("rewards_day_streak")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── BADGES ── */}
          {tab === "badges" && (
            <div className="flex flex-col gap-3">
              {allBadges.map(badge => (
                <div key={badge.id}
                  className={`relative p-4 rounded-2xl flex items-center gap-4 transition-all ${badge.unlocked ? "" : "opacity-50"}`}
                  style={{
                    background: badge.unlocked ? "#FFF9E6" : "var(--card-bg)",
                    border: badge.unlocked
                      ? (isDark ? "1px solid #F4D03F44" : "1px solid #F4D03F")
                      : "1px solid var(--border)",
                    boxShadow: "var(--card-shadow)",
                  }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: badge.unlocked ? "#FEF9E7" : "var(--bg-input)" }}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[14px]" style={{ color: isDark && badge.unlocked ? "#1A1200" : "var(--t1)" }}>
                        {badge.name}
                      </p>
                      {badge.unlocked && streak.activeBadge === badge.id && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-white"
                          style={{ background: "var(--green)" }}>Active</span>
                      )}
                    </div>
                    <p className="text-[12px]" style={{ color: isDark && badge.unlocked ? "#4A3A00" : "var(--t2)" }}>
                      {badge.description}
                    </p>
                    {!badge.unlocked && (
                      <p className="text-[11px] mt-1" style={{ color: "var(--t3)" }}>
                        Unlock at {badge.milestone}-day streak
                      </p>
                    )}
                  </div>
                  {badge.unlocked && (
                    <button onClick={() => setBadge(streak.activeBadge === badge.id ? null : badge.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0 transition-colors"
                      style={{ background: streak.activeBadge === badge.id ? "var(--green)" : "var(--card-bg)", border: `1px solid ${streak.activeBadge === badge.id ? "var(--green)" : "var(--border)"}` }}>
                      {streak.activeBadge === badge.id
                        ? <Check size={16} color="white" />
                        : <Award size={16} color="var(--green)" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── STATS ── */}
          {tab === "stats" && (
            <div className="flex flex-col gap-3">
              {[
                { label:"Current streak",      value:`${streak.current} days`,            icon:"🔥" },
                { label:"Longest streak",      value:`${streak.longest} days`,            icon:"🏆" },
                { label:"Total verifications", value:`${streak.totalVerifications}`,       icon:"💊" },
                { label:"Points earned",       value:`${streak.verificationPoints} pts`,  icon:"⭐" },
                { label:"Milestones hit",      value:`${streak.milestones.length}`,       icon:"🎯" },
                { label:"Themes unlocked",     value:`${streak.unlockedThemes.length}/6`, icon:"🎨" },
                { label:"Badges unlocked",     value:`${streak.unlockedBadges.length}/8`, icon:"🏅" },
                { label:"Streak freezes",      value:`${streak.freezes} remaining`,       icon:"🛡️" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <p className="text-[12px]" style={{ color: "var(--t2)" }}>{label}</p>
                    <p className="text-[15px] font-bold" style={{ color: "var(--t1)" }}>{value}</p>
                  </div>
                </div>
              ))}

              {/* Milestone timeline */}
              <div className="rounded-2xl p-4" style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
                <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--t1)" }}>Milestone progress</p>
                {[7,14,30,60,100,200,365].map(m => (
                  <div key={m} className="flex items-center gap-3 mb-2.5 last:mb-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] flex-shrink-0"
                      style={{ background: streak.milestones.includes(m) ? "var(--green)" : "var(--bg-input)" }}>
                      {streak.milestones.includes(m) ? "✓" : ""}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[12px]" style={{ color: "var(--t1)" }}>{m} days</span>
                        {streak.current >= m
                          ? <span className="text-[11px] font-medium" style={{ color: "var(--green)" }}>Achieved!</span>
                          : <span className="text-[11px]" style={{ color: "var(--t3)" }}>{m - streak.current} days to go</span>}
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${Math.min(100, (streak.current / m) * 100)}%`,
                          background: streak.current >= m ? "var(--green)" : "var(--amber)",
                          transition: "width 0.7s ease",
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <BottomNav role={streak.totalVerifications >= 0 ? "patient" : "patient"} />
      </div>
    </div>
  );
}
