"use client";

import { Canvas } from "@react-three/fiber";
import { ReactNode, Suspense } from "react";

export function SceneProvider({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} style={{ position: "absolute", inset: 0, zIndex: -1 }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 30, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#F2F8F4"]} />
        <fog attach="fog" args={["#F2F8F4", 1, 50]} />
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}

export function SceneWrapper({
  children,
  className = "",
  style = {},
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <SceneProvider>{children}</SceneProvider>
    </div>
  );
}