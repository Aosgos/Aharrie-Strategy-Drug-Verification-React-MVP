"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instancedMesh: any;
      color: any;
      fog: any;
      group: any;
      mesh: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
    }
  }
}

interface ScannerOverlayProps {
  isScanning: boolean;
  onComplete?: () => void;
}

export function ScannerOverlay({ isScanning, onComplete }: ScannerOverlayProps) {
  const lineRef = useRef<THREE.Mesh>(null);
  const cornerRefs = useRef<THREE.Mesh[]>([]);
  const pulseRef = useRef(0);
  const completedRef = useRef(false);

  useFrame((_, delta) => {
    if (!isScanning) {
      if (lineRef.current) lineRef.current.visible = false;
      cornerRefs.current.forEach(c => c && (c.visible = false));
      return;
    }

    if (lineRef.current) lineRef.current.visible = true;
    cornerRefs.current.forEach(c => c && (c.visible = true));

    const speed = 1.5;
    const height = 2.5;

    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(performance.now() * 0.001 * speed) * height * 0.5;
      lineRef.current.scale.y = 0.8 + Math.sin(performance.now() * 0.002) * 0.2;
      const mat = lineRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.6 + Math.sin(performance.now() * 0.005) * 0.3;
    }

    cornerRefs.current.forEach((corner, i) => {
      if (!corner) return;
      corner.scale.setScalar(1 + Math.sin(performance.now() * 0.003 + i) * 0.15);
      const mat = corner.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.8 + Math.sin(performance.now() * 0.004 + i) * 0.2;
    });

    pulseRef.current += delta;
  });

  if (!isScanning) return null;

  return (
    <group position={[0, 0, 0]}>
      <mesh
        ref={lineRef}
        position={[0, 0, 0.1]}
        scale={[2.2, 0.02, 1]}
        visible={isScanning}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#1DCA8E"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {[
        { x: -1.1, y: 1.1, rot: 0 },
        { x: 1.1, y: 1.1, rot: Math.PI / 2 },
        { x: -1.1, y: -1.1, rot: -Math.PI / 2 },
        { x: 1.1, y: -1.1, rot: Math.PI },
      ].map((corner, i) => (
        <mesh
          key={i}
          ref={(el: THREE.Mesh | null) => { cornerRefs.current[i] = el!; }}
          position={[corner.x, corner.y, 0.1]}
          rotation={[0, 0, corner.rot]}
          scale={0.4}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#1DCA8E"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            alphaTest={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SuccessBurst({ trigger }: { trigger: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const agesRef = useRef({ current: new Float32Array(100) });
  const velocitiesRef = useRef({ current: new Float32Array(300) });
  const startedRef = useRef(false);

  useFrame((_, delta) => {
    if (!trigger || startedRef.current === false) {
      if (trigger > 0 && !startedRef.current) {
        startedRef.current = true;
        const positions = particlesRef.current?.geometry.attributes.position.array as Float32Array;
        agesRef.current.current = new Float32Array(100);
        velocitiesRef.current.current = new Float32Array(300);

        for (let i = 0; i < 100; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 0.1 + Math.random() * 0.1;
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          const speed = 2 + Math.random() * 3;
          velocitiesRef.current.current[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
          velocitiesRef.current.current[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
          velocitiesRef.current.current[i * 3 + 2] = Math.cos(phi) * speed;
          agesRef.current.current[i] = 0;
        }
        particlesRef.current!.geometry.attributes.position.needsUpdate = true;
      }
      return;
    }

    const mesh = particlesRef.current;
    if (!mesh) return;
    const positions = mesh.geometry.attributes.position.array as Float32Array;
    const colors = mesh.geometry.attributes.color?.array as Float32Array;
    const sizes = mesh.geometry.attributes.size?.array as Float32Array;

    if (!positions || !agesRef.current.current) return;

    let alive = 0;
    for (let i = 0; i < 100; i++) {
      agesRef.current.current[i] += delta;
      const age = agesRef.current.current[i];
      const life = 1.5;

      if (age < life) {
        alive++;
        const progress = age / life;
        positions[i * 3] += velocitiesRef.current.current[i * 3] * delta;
        positions[i * 3 + 1] += velocitiesRef.current.current[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocitiesRef.current.current[i * 3 + 2] * delta;

        velocitiesRef.current.current[i * 3 + 1] -= 2 * delta;

        if (colors) {
          const c = 1 - progress;
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.8;
          colors[i * 3 + 2] = c * 0.5;
        }
        if (sizes) {
          sizes[i] = (1 - progress) * 8;
        }
      } else {
        if (sizes) sizes[i] = 0;
      }
    }

    mesh.geometry.attributes.position.needsUpdate = true;
    if (colors) mesh.geometry.attributes.color.needsUpdate = true;
    if (sizes) mesh.geometry.attributes.size.needsUpdate = true;

    if (alive === 0) {
      startedRef.current = false;
    }
  });

  if (!startedRef.current && !trigger) return null;

  return (
    <points ref={particlesRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={100} itemSize={3} array={new Float32Array(300)} />
        <bufferAttribute attach="attributes-color" count={100} itemSize={3} array={new Float32Array(300)} />
        <bufferAttribute attach="attributes-size" count={100} itemSize={1} array={new Float32Array(100).fill(4)} />
      </bufferGeometry>
      <pointsMaterial
        size={4}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}