"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);
const Particles = dynamic(
  () => import("./FloatingParticles").then((m) => m.FloatingParticles),
  { ssr: false }
);

interface Props { className?: string; dark?: boolean; }

export function ParticleBackground({ className = "", dark = false }: Props) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    >
      <ErrorBoundary fallback={null}>
        <Canvas
          dpr={[1, 1]}
          camera={{ position: [0, 0, 6], fov: 65 }}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Particles
              count={dark ? 50 : 40}
              speed={0.09}
              spread={12}
              height={14}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
