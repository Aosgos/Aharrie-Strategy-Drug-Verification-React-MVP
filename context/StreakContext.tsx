"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { StreakData } from "@/lib/streak";
import { 
  getStreak, 
  saveStreak, 
  incrementStreak, 
  useStreakFreeze, 
  getNextMilestone, 
  getMilestoneProgress, 
  purchaseFreeze, 
  FREEZE_COST,
  setActiveTheme,
  setActiveBadge,
  getActiveTheme,
  getUnlockedThemes,
  getLockedThemes,
  getUnlockedBadges,
  getAllBadges,
} from "@/lib/streak";

interface StreakContextType {
  streak: StreakData;
  increment: (isVerification?: boolean) => StreakData;
  freeze: () => boolean;
  purchaseFreeze: () => boolean;
  nextMilestone: number | null;
  progress: { current: number; target: number; percent: number };
  freezeCost: number;
  refresh: () => void;
  activeTheme: { primary: string; secondary: string; accent: string };
  unlockedThemes: Array<{ id: string; name: string; colors: { primary: string; secondary: string; accent: string } }>;
  lockedThemes: Array<{ id: string; name: string; milestone: number; colors: { primary: string; secondary: string; accent: string } }>;
  unlockedBadges: Array<{ id: string; name: string; description: string; icon: string }>;
  allBadges: Array<{ id: string; name: string; description: string; milestone: number; icon: string; unlocked: boolean }>;
  setTheme: (themeId: string) => boolean;
  setBadge: (badgeId: string | null) => boolean;
}

const Ctx = createContext<StreakContextType | null>(null);

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState<StreakData>(() => getStreak());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
    const handleStorage = () => setStreak(getStreak());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const increment = (isVerification = true) => {
    const updated = incrementStreak(isVerification);
    setStreak(updated);
    return updated;
  };

  const freeze = () => {
    const worked = useStreakFreeze();
    if (worked) setStreak(getStreak());
    return worked;
  };

  const buyFreeze = () => {
    const worked = purchaseFreeze();
    if (worked) setStreak(getStreak());
    return worked;
  };

  const changeTheme = (themeId: string) => {
    const worked = setActiveTheme(themeId);
    if (worked) setStreak(getStreak());
    return worked;
  };

  const changeBadge = (badgeId: string | null) => {
    const worked = setActiveBadge(badgeId);
    if (worked) setStreak(getStreak());
    return worked;
  };

  const refresh = () => setStreak(getStreak());

  if (!mounted) {
    return <Ctx.Provider value={{ streak: getStreak(), increment, freeze, purchaseFreeze: buyFreeze, nextMilestone: null, progress: { current: 0, target: 1, percent: 0 }, freezeCost: FREEZE_COST, refresh, activeTheme: getActiveTheme(), unlockedThemes: getUnlockedThemes(), lockedThemes: getLockedThemes(), unlockedBadges: getUnlockedBadges(), allBadges: getAllBadges(), setTheme: changeTheme, setBadge: changeBadge }}>{children}</Ctx.Provider>;
  }

  return (
    <Ctx.Provider
      value={{
        streak,
        increment,
        freeze,
        purchaseFreeze: buyFreeze,
        nextMilestone: getNextMilestone(streak.current),
        progress: getMilestoneProgress(streak.current),
        freezeCost: FREEZE_COST,
        refresh,
        activeTheme: getActiveTheme(),
        unlockedThemes: getUnlockedThemes(),
        lockedThemes: getLockedThemes(),
        unlockedBadges: getUnlockedBadges(),
        allBadges: getAllBadges(),
        setTheme: changeTheme,
        setBadge: changeBadge,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStreak must be used within StreakProvider");
  return ctx;
}
