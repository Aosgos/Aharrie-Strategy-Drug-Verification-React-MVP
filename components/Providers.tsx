"use client";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { StreakProvider } from "@/context/StreakContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { I18nProvider } from "@/context/I18nContext";
import { PWARegistration } from "@/components/PWARegistration";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <StreakProvider>
            {children}
            <PWARegistration />
          </StreakProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
