"use client";

import { useMemo, useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";

extend({ instancedMesh: THREE.InstancedMesh });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instancedMesh: any;
      color: any;
      fog: any;
    }
  }
}

const BRAND_COLORS = [
  new THREE.Color("#4A7C5E"),
  new THREE.Color("#D4EDE0"),
  new THREE.Color("#C8E6D4"),
  new THREE.Color("#EAF5EF"),
];

interface ParticleData {
  velocity: THREE.Vector3;
  baseScale: number;
  phase: number;
  colorIndex: number;
}

export function FloatingParticles({
  count = 180,
  speed = 0.15,
  spread = 8,
  height = 12,
}: {
  count?: number;
  speed?: number;
  spread?: number;
  height?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const dummy = useRef(new THREE.Object3D()).current;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.55,
        vertexColors: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
      }),
    []
  );

  if (particlesRef.current.length === 0) {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          speed * (0.5 + Math.random() * 0.5),
          (Math.random() - 0.5) * 0.01
        ),
        baseScale: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * BRAND_COLORS.length),
      });
    }
  }

  const colorsArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = BRAND_COLORS[particlesRef.current[i]?.colorIndex ?? 0];
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const halfHeight = height / 2;

    for (let i = 0; i < count; i++) {
      const p = particlesRef.current[i];
      if (!p) continue;

      mesh.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      dummy.position.addScaledVector(p.velocity, delta * 60);

      const pulse = Math.sin(p.phase + performance.now() * 0.001) * 0.15 + 1;
      dummy.scale.setScalar(p.baseScale * pulse);

      if (dummy.position.y > halfHeight) {
        dummy.position.y = -halfHeight;
        dummy.position.x = (Math.random() - 0.5) * spread;
        dummy.position.z = (Math.random() - 0.5) * spread;
        p.velocity.y = speed * (0.5 + Math.random() * 0.5);
      }

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
      instanceColor={colorsArray}
    />
  );
}
