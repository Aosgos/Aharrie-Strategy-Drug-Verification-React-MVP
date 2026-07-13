"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Canvas = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), { ssr: false });
const Particles = dynamic(() => import("./FloatingParticles").then((m) => m.FloatingParticles), { ssr: false });

interface Props { className?: string; dark?: boolean; }

export function ParticleBackground({ className = "", dark = false }: Props) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Particles
            count={dark ? 120 : 90}
            speed={0.08}
            spread={12}
            height={14}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
