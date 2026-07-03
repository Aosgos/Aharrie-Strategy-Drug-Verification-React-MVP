"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ScannerOverlay({
  active = true,
  color = "#1DCA8E",
}: {
  active?: boolean;
  color?: string;
}) {
  const lineRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.getElapsedTime();

    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(t * 1.5) * 1.2;
      const mat = lineRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 3) * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const scale = 1 + Math.sin(t * 2) * 0.05;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group>
      <mesh ref={lineRef} position={[0, 0, 0]}>
        <planeGeometry args={[3, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0, -0.5]}>
        <ringGeometry args={[1.2, 1.25, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
