"use client";

import { useEffect, useState } from "react";

export function PWARegistration() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:bottom-24 md:w-80 z-50 animate-in slide-in-from-bottom-2">
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-[#C8DDD2]" style={{ boxShadow: "0 10px 40px rgba(74,124,94,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D4EDE0] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A7C5E" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#1A2E25]">Install Aharrie Verify</p>
            <p className="text-[12px] text-[#5A7067]">Add to home screen for offline access</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleDismiss} className="flex-1 py-2 px-4 rounded-xl text-sm font-medium text-[#5A7067] bg-[#EAF4EE] hover:bg-[#DCEEE3] transition-colors">
            Later
          </button>
          <button onClick={handleInstall} className="flex-1 py-2 px-4 rounded-xl text-sm font-medium text-white bg-[#4A7C5E] hover:bg-[#2E5C42] transition-colors">
            Install
          </button>
        </div>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}