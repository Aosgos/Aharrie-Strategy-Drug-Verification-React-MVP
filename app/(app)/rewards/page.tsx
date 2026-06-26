"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Palette, Award, Check, Lock, Sparkles } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import TopNav from "@/components/ui/TopNav";
import Card from "@/components/ui/Card";
import { useStreak } from "@/context/StreakContext";
import { useAuth } from "@/lib/AuthContext";

export default function RewardsPage() {
  const { streak, activeTheme, unlockedThemes, lockedThemes, unlockedBadges, allBadges, setTheme, setBadge } = useStreak();
  const { user } = useAuth();
  const [tab, setTab] = useState<"themes" | "badges">("themes");

  return (
    <PageShell>
      <TopNav title="Rewards" backHref="/home" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("themes")} className={`flex-1 py-2 rounded-xl font-medium text-sm transition-colors ${tab === "themes" ? "bg-[#4A7C5E] text-white" : "bg-white text-[#5A7067]"}`}>
            <Palette size={16} className="inline mr-1" /> Themes
          </button>
          <button onClick={() => setTab("badges")} className={`flex-1 py-2 rounded-xl font-medium text-sm transition-colors ${tab === "badges" ? "bg-[#4A7C5E] text-white" : "bg-white text-[#5A7067]"}`}>
            <Award size={16} className="inline mr-1" /> Badges
          </button>
        </div>

        {tab === "themes" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 14px rgba(74,124,94,0.09)" }}>
              <h3 className="font-semibold text-[#1A2E25] mb-3 flex items-center gap-2">
                <Sparkles size={18} color="#4A7C5E" /> Active Theme
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${activeTheme.primary}15`, border: `1px solid ${activeTheme.primary}40` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: activeTheme.primary }}>
                  <Palette size={20} color="white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A2E25]">{unlockedThemes.find(t => t.colors.primary === activeTheme.primary)?.name ?? "Nature Green"}</p>
                  <p className="text-[12px] text-[#5A7067]">Currently active</p>
                </div>
              </div>
            </div>

            <h4 className="font-medium text-[#5A7067] text-sm mb-2">Unlocked Themes</h4>
            <div className="grid grid-cols-2 gap-3">
              {unlockedThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`relative p-4 rounded-2xl text-left transition-all ${theme.colors.primary === activeTheme.primary ? "ring-2" : ""}`}
                  style={{ 
                    background: theme.colors.primary === activeTheme.primary ? `${theme.colors.primary}15` : "white",
                    border: theme.colors.primary === activeTheme.primary ? `2px solid ${theme.colors.primary}` : "1px solid #E8F0ED",
                    boxShadow: "0 2px 14px rgba(74,124,94,0.09)"
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style={{ background: `${theme.colors.primary}20` }}>
                    <Palette size={24} style={{ color: theme.colors.primary }} />
                  </div>
                  <p className="font-semibold text-[#1A2E25] text-sm">{theme.name}</p>
                  {theme.colors.primary === activeTheme.primary && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#4A7C5E] flex items-center justify-center">
                      <Check size={10} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <h4 className="font-medium text-[#5A7067] text-sm mb-2 mt-6">Locked Themes</h4>
            <div className="grid grid-cols-2 gap-3">
              {lockedThemes.map(theme => (
                <div key={theme.id} className="relative p-4 rounded-2xl text-left opacity-60" style={{ background: "white", border: "1px solid #E8F0ED", boxShadow: "0 2px 14px rgba(74,124,94,0.09)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style={{ background: "#F0F5F2" }}>
                    <Lock size={24} color="#8AA398" />
                  </div>
                  <p className="font-semibold text-[#1A2E25] text-sm">{theme.name}</p>
                  <p className="text-[11px] text-[#8AA398] mt-1">Unlock at {theme.milestone}-day streak</p>
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full border border-[#C8DDD2] flex items-center justify-center">
                    <Lock size={10} color="#8AA398" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "badges" && (
          <div className="space-y-4">
            {allBadges.map(badge => (
              <div key={badge.id} className={`relative p-4 rounded-2xl flex items-center gap-4 transition-all ${badge.unlocked ? "" : "opacity-50"}`} style={{ 
                background: badge.unlocked ? "#FFF9E6" : "white", 
                border: badge.unlocked ? "1px solid #F4D03F" : "1px solid #E8F0ED",
                boxShadow: "0 2px 14px rgba(74,124,94,0.09)"
              }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: badge.unlocked ? "#FEF9E7" : "#F0F5F2" }}>
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#1A2E25]">{badge.name}</p>
                    {badge.unlocked && streak.activeBadge === badge.id && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4A7C5E] text-white">Active</span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#5A7067] mt-0.5">{badge.description}</p>
                  {!badge.unlocked && (
                    <p className="text-[11px] text-[#8AA398] mt-1">Unlock at {badge.milestone}-day streak</p>
                  )}
                </div>
                {badge.unlocked && (
                  <button
                    onClick={() => setBadge(streak.activeBadge === badge.id ? null : badge.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${streak.activeBadge === badge.id ? "bg-[#4A7C5E]" : "bg-white border border-[#C8DDD2]"}`}
                  >
                    {streak.activeBadge === badge.id ? <Check size={16} color="white" /> : <Award size={16} color="#4A7C5E" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}