"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const R3FCanvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);
const Molecule = dynamic(
  () => import("./MoleculeViewer").then((m) => m.MoleculeViewer),
  { ssr: false }
);

// Lightweight CSS fallback shown while 3D loads or if WebGL unavailable
function FallbackIcon() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="18" fill="none" stroke="#4A7C5E" strokeWidth="3" />
        <circle cx="50" cy="22" r="8"  fill="#D4EDE0" stroke="#4A7C5E" strokeWidth="2" />
        <circle cx="50" cy="78" r="8"  fill="#D4EDE0" stroke="#4A7C5E" strokeWidth="2" />
        <circle cx="22" cy="50" r="8"  fill="#D4EDE0" stroke="#4A7C5E" strokeWidth="2" />
        <circle cx="78" cy="50" r="8"  fill="#D4EDE0" stroke="#4A7C5E" strokeWidth="2" />
        <circle cx="30" cy="30" r="6"  fill="#FFE8EC" stroke="#D4607A" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="6"  fill="#FFE8EC" stroke="#D4607A" strokeWidth="1.5" />
        <line x1="50" y1="30" x2="50" y2="68" stroke="#C8DDD2" strokeWidth="1.5" />
        <line x1="30" y1="50" x2="68" y2="50" stroke="#C8DDD2" strokeWidth="1.5" />
        <line x1="35" y1="35" x2="65" y2="65" stroke="#C8DDD2" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

interface Props {
  width?:    number | string;
  height?:   number | string;
  scale?:    number;
  className?: string;
}

export function MoleculeCanvas({ width = 200, height = 200, scale = 1.1, className = "" }: Props) {
  return (
    <div style={{ width, height }} className={`relative ${className}`}>
      <ErrorBoundary fallback={<FallbackIcon />}>
        <R3FCanvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 28 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Molecule scale={scale} autoRotate />
          </Suspense>
        </R3FCanvas>
      </ErrorBoundary>
    </div>
  );
}
