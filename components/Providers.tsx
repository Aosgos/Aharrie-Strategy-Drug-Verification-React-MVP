"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/AuthContext";
import { StreakProvider } from "@/context/StreakContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { I18nProvider } from "@/context/I18nContext";
import { PWARegistration } from "@/components/PWARegistration";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F2F8F4", fontFamily: "system-ui, sans-serif", padding: 24, textAlign: "center" }}>
          <div>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#D4EDE0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7C5E" strokeWidth="2">
                <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z"/>
              </svg>
            </div>
            <p style={{ color: "#1A2E25", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Something went wrong</p>
            <p style={{ color: "#5A7067", fontSize: 13, marginBottom: 20 }}>Please refresh the page to continue</p>
            <button onClick={() => window.location.reload()}
              style={{ background: "#4A7C5E", color: "white", border: "none", borderRadius: 24, padding: "10px 24px", fontSize: 14, cursor: "pointer" }}>
              Refresh
            </button>
          </div>
        </div>
      }
    >
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
    </ErrorBoundary>
  );
}
