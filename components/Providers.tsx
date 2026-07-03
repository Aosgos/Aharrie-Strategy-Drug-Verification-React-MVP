"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { StreakProvider } from "@/context/StreakContext";
import { PWARegistration } from "@/components/PWARegistration";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StreakProvider>
        {children}
        <PWARegistration />
      </StreakProvider>
    </AuthProvider>
  );
}
