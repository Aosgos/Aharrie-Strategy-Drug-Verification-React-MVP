export interface StreakData {
  current: number;
  longest: number;
  lastActive: string | null;
  freezes: number;
  totalVerifications: number;
  verificationPoints: number;
  milestones: number[];
  unlockedThemes: string[];
  unlockedBadges: string[];
  activeTheme: string;
  activeBadge: string | null;
}

const STORAGE_KEY = "aharrie_streak";
const MILESTONES = [7, 14, 30, 60, 100, 200, 365];
const FREEZE_COST = 50;

const THEMES: Record<string, { name: string; cost: number; milestone: number; colors: { primary: string; secondary: string; accent: string } }> = {
  default: { name: "Nature Green", cost: 0, milestone: 0, colors: { primary: "#4A7C5E", secondary: "#D4EDE0", accent: "#1DCA8E" } },
  ocean: { name: "Ocean Blue", cost: 100, milestone: 7, colors: { primary: "#2E86C1", secondary: "#D6EAF8", accent: "#5DADE2" } },
  sunset: { name: "Sunset Orange", cost: 200, milestone: 14, colors: { primary: "#E67E22", secondary: "#FDEBD0", accent: "#F39C12" } },
  royal: { name: "Royal Purple", cost: 400, milestone: 30, colors: { primary: "#8E44AD", secondary: "#F0E6F6", accent: "#BB8FCE" } },
  gold: { name: "Gold Elite", cost: 800, milestone: 60, colors: { primary: "#D4A843", secondary: "#FEF9E7", accent: "#F4D03F" } },
  diamond: { name: "Diamond", cost: 1500, milestone: 100, colors: { primary: "#2C3E50", secondary: "#EBF5FB", accent: "#85C1E9" } },
};

const BADGES: Record<string, { name: string; description: string; milestone: number; icon: string }> = {
  beginner: { name: "First Steps", description: "Completed your first verification", milestone: 1, icon: "🌱" },
  week_warrior: { name: "Week Warrior", description: "7-day streak achieved", milestone: 7, icon: "🔥" },
  fortnight_champion: { name: "Fortnight Champion", description: "14-day streak achieved", milestone: 14, icon: "⚔️" },
  monthly_master: { name: "Monthly Master", description: "30-day streak achieved", milestone: 30, icon: "🏆" },
  guardian: { name: "Guardian of Health", description: "60-day streak achieved", milestone: 60, icon: "🛡️" },
  centurion: { name: "Centurion", description: "100-day streak achieved", milestone: 100, icon: "💎" },
  legend: { name: "Living Legend", description: "200-day streak achieved", milestone: 200, icon: "👑" },
  immortal: { name: "Immortal", description: "365-day streak achieved", milestone: 365, icon: "♾️" },
};

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function getStreak(): StreakData {
  if (typeof window === "undefined") {
    return initialStreak();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStreak();
    const parsed = JSON.parse(raw) as StreakData;
    return { ...initialStreak(), ...parsed };
  } catch {
    return initialStreak();
  }
}

function initialStreak(): StreakData {
  return {
    current: 0,
    longest: 0,
    lastActive: null,
    freezes: 1,
    totalVerifications: 0,
    verificationPoints: 0,
    milestones: [],
    unlockedThemes: ["default"],
    unlockedBadges: [],
    activeTheme: "default",
    activeBadge: null,
  };
}

export function saveStreak(data: StreakData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function incrementStreak(isVerification = true): StreakData {
  const streak = getStreak();
  const today = todayISO();
  const yesterday = yesterdayISO();

  if (streak.lastActive === today) {
    if (isVerification) {
      streak.totalVerifications += 1;
      streak.verificationPoints += 10;
    }
    return streak;
  }

  if (streak.lastActive === yesterday) {
    streak.current += 1;
  } else if (streak.lastActive !== null) {
    streak.current = 1;
  } else {
    streak.current = 1;
  }

  streak.lastActive = today;
  streak.longest = Math.max(streak.longest, streak.current);
  if (isVerification) {
    streak.totalVerifications += 1;
    streak.verificationPoints += 10;
  }

  checkMilestones(streak);

  saveStreak(streak);
  return streak;
}

function checkMilestones(streak: StreakData): void {
  for (const m of MILESTONES) {
    if (streak.current >= m && !streak.milestones.includes(m)) {
      streak.milestones.push(m);
      streak.verificationPoints += m * 5;
      unlockRewards(streak, m);
    }
  }
}

function unlockRewards(streak: StreakData, milestone: number): void {
  for (const [key, theme] of Object.entries(THEMES)) {
    if (theme.milestone === milestone && !streak.unlockedThemes.includes(key)) {
      streak.unlockedThemes.push(key);
    }
  }
  for (const [key, badge] of Object.entries(BADGES)) {
    if (badge.milestone === milestone && !streak.unlockedBadges.includes(key)) {
      streak.unlockedBadges.push(key);
      streak.activeBadge = key;
    }
  }
}

export function useStreakFreeze(): boolean {
  const streak = getStreak();
  if (streak.current === 0 || streak.freezes <= 0) return false;

  const today = todayISO();
  const yesterday = yesterdayISO();

  if (streak.lastActive !== yesterday) return false;

  streak.freezes -= 1;
  streak.lastActive = today;
  saveStreak(streak);
  return true;
}

export function purchaseFreeze(): boolean {
  const streak = getStreak();
  if (streak.verificationPoints < FREEZE_COST) return false;

  streak.verificationPoints -= FREEZE_COST;
  streak.freezes += 1;
  saveStreak(streak);
  return true;
}

export function getNextMilestone(current: number): number | null {
  for (const m of MILESTONES) {
    if (current < m) return m;
  }
  return null;
}

export function getMilestoneProgress(current: number): { current: number; target: number; percent: number } {
  const next = getNextMilestone(current);
  if (!next) return { current, target: current, percent: 100 };
  const prev = MILESTONES.find((m) => m < current) ?? 0;
  return {
    current: current - prev,
    target: next - prev,
    percent: Math.round(((current - prev) / (next - prev)) * 100),
  };
}

export function awardFreeze(): void {
  const streak = getStreak();
  streak.freezes += 1;
  saveStreak(streak);
}

export function setActiveTheme(themeId: string): boolean {
  const streak = getStreak();
  if (!streak.unlockedThemes.includes(themeId)) return false;
  streak.activeTheme = themeId;
  saveStreak(streak);
  return true;
}

export function setActiveBadge(badgeId: string | null): boolean {
  const streak = getStreak();
  if (badgeId && !streak.unlockedBadges.includes(badgeId)) return false;
  streak.activeBadge = badgeId;
  saveStreak(streak);
  return true;
}

export function getActiveTheme(): { primary: string; secondary: string; accent: string } {
  const streak = getStreak();
  return THEMES[streak.activeTheme]?.colors ?? THEMES.default.colors;
}

export function getUnlockedThemes(): Array<{ id: string; name: string; colors: { primary: string; secondary: string; accent: string } }> {
  const streak = getStreak();
  return streak.unlockedThemes.map(id => ({ id, name: THEMES[id].name, colors: THEMES[id].colors }));
}

export function getLockedThemes(): Array<{ id: string; name: string; milestone: number; colors: { primary: string; secondary: string; accent: string } }> {
  const streak = getStreak();
  return Object.entries(THEMES)
    .filter(([id]) => !streak.unlockedThemes.includes(id))
    .map(([id, theme]) => ({ id, name: theme.name, milestone: theme.milestone, colors: theme.colors }));
}

export function getUnlockedBadges(): Array<{ id: string; name: string; description: string; icon: string }> {
  const streak = getStreak();
  return streak.unlockedBadges.map(id => ({ id, ...BADGES[id] }));
}

export function getAllBadges(): Array<{ id: string; name: string; description: string; milestone: number; icon: string; unlocked: boolean }> {
  const streak = getStreak();
  return Object.entries(BADGES).map(([id, badge]) => ({
    id,
    ...badge,
    unlocked: streak.unlockedBadges.includes(id),
  }));
}

export function resetStreak(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export { FREEZE_COST, THEMES, BADGES };