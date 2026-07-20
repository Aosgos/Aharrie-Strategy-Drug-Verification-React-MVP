"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Using simple individual meshes — avoids the InstancedMesh/instanceColor
// prop issues that cause runtime crashes in R3F with three@0.169.0

const BRAND_COLORS = ["#4A7C5E","#D4EDE0","#C8E6D4","#EAF5EF","#5EAA7A"];

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  scale: number;
  phase: number;
  colorIndex: number;
}

export function FloatingParticles({
  count  = 60,
  speed  = 0.12,
  spread = 8,
  height = 12,
}: {
  count?:  number;
  speed?:  number;
  spread?: number;
  height?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const particles = useMemo<Particle[]>(() => {
    const halfH = height / 2;
    return Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * height,
        (Math.random() - 0.5) * spread * 0.5,
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        speed * (0.4 + Math.random() * 0.6),
        (Math.random() - 0.5) * 0.008,
      ),
      scale:      0.06 + Math.random() * 0.12,
      phase:      Math.random() * Math.PI * 2,
      colorIndex: Math.floor(Math.random() * BRAND_COLORS.length),
    }));
  }, [count, speed, spread, height]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const halfH = height / 2;
    group.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;
      p.pos.addScaledVector(p.vel, delta * 60);
      if (p.pos.y > halfH) {
        p.pos.y = -halfH;
        p.pos.x = (Math.random() - 0.5) * spread;
        p.pos.z = (Math.random() - 0.5) * spread * 0.5;
      }
      child.position.copy(p.pos);
      const pulse = 1 + Math.sin(p.phase + performance.now() * 0.001) * 0.15;
      child.scale.setScalar(p.scale * pulse);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={BRAND_COLORS[p.colorIndex]}
            transparent
            opacity={0.45}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
