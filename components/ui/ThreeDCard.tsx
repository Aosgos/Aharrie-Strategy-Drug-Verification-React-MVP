"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      planeGeometry: any;
    }
  }
}

interface ThreeDCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  elevation?: number;
  interactive?: boolean;
}

export const ThreeDCard = forwardRef<HTMLDivElement, ThreeDCardProps>(
  ({ children, className = "", elevation = 1, interactive = true, style, ...props }, ref) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const cardMeshRef = useRef<THREE.Mesh>(null);
    const glowMeshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
      if (!groupRef.current) return;

      const targetX = interactive ? rotation.x : 0;
      const targetY = interactive ? rotation.y : 0;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);

      if (cardMeshRef.current) {
        const targetZ = isHovered ? 0.15 : 0;
        cardMeshRef.current.position.z = THREE.MathUtils.lerp(cardMeshRef.current.position.z, targetZ, 0.1);
      }

      if (glowMeshRef.current && interactive) {
        const mat = glowMeshRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHovered ? 0.15 : 0, 0.1);
      }
    });

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setRotation({ x: -y * 0.08, y: x * 0.08 });
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const shadowOpacity = elevation * 0.08;
    const shadowBlur = elevation * 8;

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={{
          ...style,
          width: "100%",
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
        {...props}
      >
        <div style={{ width: "100%", height: "100%", minHeight: 120, transformStyle: "preserve-3d" }}>
          <group ref={groupRef} position={[0, 0, 0]}>
            <mesh ref={glowMeshRef} position={[0, 0, -0.5]} scale={[1.1, 1.1, 1]} visible={interactive}>
              <boxGeometry args={[1, 1, 0.1]} />
              <meshBasicMaterial color="#4A7C5E" transparent opacity={0} />
            </mesh>

            <mesh
              ref={cardMeshRef}
              position={[0, 0, 0]}
              receiveShadow
              castShadow
            >
              <boxGeometry args={[1, 1, 0.08]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.9}
                metalness={0}
                transparent
                opacity={1}
              />
            </mesh>

            <mesh position={[0, 0, 0.041]} scale={[0.98, 0.98, 1]}>
              <planeGeometry args={[0.96, 0.96]} />
              <meshBasicMaterial
                color="#F2F8F4"
                transparent
                opacity={1}
              />
            </mesh>
          </group>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            transform: "translateZ(60px)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

ThreeDCard.displayName = "ThreeDCard";