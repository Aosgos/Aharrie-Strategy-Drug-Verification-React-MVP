"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

const SceneWrapper = dynamic(
  () => import("@/components/three").then((m) => m.SceneWrapper),
  { ssr: false, loading: () => null }
);
const FloatingParticles = dynamic(
  () => import("@/components/three").then((m) => m.FloatingParticles),
  { ssr: false, loading: () => null }
);

export default function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${className}`} style={{ background: "#F2F8F4" }}>
      <SceneWrapper>
        <FloatingParticles count={160} speed={0.12} spread={10} height={14} />
      </SceneWrapper>
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {children}
      </div>
    </div>
  );
}