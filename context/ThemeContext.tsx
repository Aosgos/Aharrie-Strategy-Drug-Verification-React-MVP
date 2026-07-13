"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ColorMode = "light" | "dark" | "system";

interface ThemeCtx {
  mode:      ColorMode;
  isDark:    boolean;
  setMode:   (m: ColorMode) => void;
  toggle:    () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const KEY = "aharrie_color_mode";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>("system");
  const [isDark, setIsDark]  = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as ColorMode) || "system";
    setModeState(saved);
    applyMode(saved);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => { if (mode === "system") applyMode("system"); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyMode(m: ColorMode) {
    const dark =
      m === "dark" ||
      (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }

  function setMode(m: ColorMode) {
    setModeState(m);
    localStorage.setItem(KEY, m);
    applyMode(m);
  }

  function toggle() {
    setMode(isDark ? "light" : "dark");
  }

  return (
    <Ctx.Provider value={{ mode, isDark, setMode, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
