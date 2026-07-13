"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const R3FCanvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);
const Molecule = dynamic(
  () => import("./MoleculeViewer").then((m) => m.MoleculeViewer),
  { ssr: false }
);

interface Props {
  width?: number | string;
  height?: number | string;
  scale?: number;
  className?: string;
}

export function MoleculeCanvas({ width = 200, height = 200, scale = 1.1, className = "" }: Props) {
  return (
    <div style={{ width, height }} className={`relative ${className}`}>
      <R3FCanvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Molecule scale={scale} autoRotate />
        </Suspense>
      </R3FCanvas>
    </div>
  );
}
