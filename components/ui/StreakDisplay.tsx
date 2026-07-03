"use client";

import { Flame, Trophy, ShieldCheck, Shield, Coins } from "lucide-react";
import { useStreak } from "@/context/StreakContext";
import { useState } from "react";

export function StreakDisplay({ compact = false }: { compact?: boolean }) {
  const { streak, nextMilestone, progress, freezeCost, purchaseFreeze } = useStreak();
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezeSuccess, setFreezeSuccess] = useState(false);

  if (streak.current === 0 && compact) return null;

  const milestonesHit = streak.milestones.length;

  const handleBuyFreeze = () => {
    const success = purchaseFreeze();
    setFreezeSuccess(success);
    setShowFreezeModal(true);
    setTimeout(() => setShowFreezeModal(false), 2000);
  };

  return (
    <>
      <div
        className={`flex items-center gap-2 ${compact ? "px-3 py-2" : "px-4 py-3"} bg-white/80 backdrop-blur rounded-2xl border border-[#C8DDD2]/50`}
        style={{ boxShadow: "0 4px 24px rgba(74,124,94,0.08)" }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB84D] to-[#FF8C00] flex items-center justify-center animate-pulse">
            <Flame size={16} color="white" />
          </div>
          {streak.current > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4607A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {streak.current > 99 ? "99+" : streak.current}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="font-semibold text-[#1A2E25]">{streak.current}</span>
            <span className="text-[#5A7067]">day{streak.current !== 1 ? "s" : ""} streak</span>
            {milestonesHit > 0 && (
              <Trophy size={12} className="text-[#FFB84D]" />
            )}
          </div>
          {!compact && nextMilestone && (
            <div className="mt-1.5 h-1.5 bg-[#EAF4EE] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4A7C5E] to-[#7AB896] rounded-full transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          )}
        </div>

        {!compact && (
          <div className="text-right">
            <div className="text-[10px] font-medium text-[#4A7C5E]">Best: {streak.longest}</div>
            <div className="text-[10px] text-[#8AA398]">Next: {nextMilestone ?? "Max"} days</div>
          </div>
        )}

        {!compact && streak.freezes > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#D4EDE0] text-[#4A7C5E] text-[10px] font-medium">
            <Shield size={10} /> {streak.freezes} freeze{streak.freezes !== 1 ? "s" : ""}
          </div>
        )}

        {!compact && streak.freezes === 0 && streak.verificationPoints >= freezeCost && (
          <button onClick={handleBuyFreeze} className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFF4E0] text-[#C07A1A] text-[10px] font-medium hover:bg-[#FFE8D0] transition-colors">
            <Coins size={10} /> Buy freeze ({freezeCost})
          </button>
        )}
      </div>

      {showFreezeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center animate-in zoom-in">
            {freezeSuccess ? (
              <>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#D4EDE0] flex items-center justify-center">
                  <ShieldCheck size={28} color="#4A7C5E" />
                </div>
                <h3 className="text-xl font-bold text-[#1A2E25] mb-1">Streak Freeze Purchased!</h3>
                <p className="text-[#5A7067] mb-4">Your streak is protected for one missed day.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#FFE8EC] flex items-center justify-center">
                  <Shield size={28} color="#D4607A" />
                </div>
                <h3 className="text-xl font-bold text-[#1A2E25] mb-1">Not Enough Points</h3>
                <p className="text-[#5A7067] mb-4">Verify more drugs to earn points for streak freezes.</p>
              </>
            )}
            <button
              onClick={() => setShowFreezeModal(false)}
              className="w-full bg-[#4A7C5E] text-white py-3 rounded-full font-medium hover:bg-[#2E5C42] transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function StreakBadge({ className = "" }: { className?: string }) {
  const { streak } = useStreak();

  if (streak.current === 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFB84D]/20 to-[#FF8C00]/20 border border-[#FFB84D]/30 ${className}`}
    >
      <Flame size={12} className="text-[#FF8C00]" />
      <span className="text-[11px] font-semibold text-[#1A2E25]">{streak.current}</span>
    </div>
  );
}

export function MilestoneCelebration({ milestone, onClose }: { milestone: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center animate-in zoom-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFB84D] to-[#FF8C00] flex items-center justify-center">
          <Trophy size={32} color="white" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A2E25] mb-1">Milestone Unlocked!</h3>
        <p className="text-[#5A7067] mb-2">{milestone}-day streak achieved</p>
        <p className="text-[13px] text-[#8AA398] mb-6">Keep protecting medication authenticity!</p>
        <button
          onClick={onClose}
          className="w-full bg-[#4A7C5E] text-white py-3 rounded-full font-medium hover:bg-[#2E5C42] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
