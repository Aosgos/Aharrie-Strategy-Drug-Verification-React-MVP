"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
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
      planeGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

interface ThreeDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  className?: string;
}

const VARIANT_STYLES = {
  primary: {
    color: "#4A7C5E",
    hoverColor: "#2E5C42",
    textColor: "white",
    glowColor: "#4A7C5E",
  },
  secondary: {
    color: "#D4EDE0",
    hoverColor: "#C8E6D4",
    textColor: "#4A7C5E",
    glowColor: "#4A7C5E",
  },
  outline: {
    color: "transparent",
    hoverColor: "#EAF5EF",
    textColor: "#4A7C5E",
    glowColor: "#4A7C5E",
  },
};

export const ThreeDButton = forwardRef<HTMLButtonElement, ThreeDButtonProps>(
  ({ children, variant = "primary", fullWidth = true, className = "", onClick, disabled, style, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const buttonMeshRef = useRef<THREE.Mesh>(null);

    const { color, hoverColor, textColor, glowColor } = VARIANT_STYLES[variant];

    useFrame(() => {
      if (!groupRef.current) return;

      const targetZ = isPressed ? -0.08 : isHovered ? 0.15 : 0;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.15);

      if (buttonMeshRef.current) {
        const targetScale = isPressed ? 0.94 : isHovered ? 1.02 : 1;
        buttonMeshRef.current.scale.setScalar(THREE.MathUtils.lerp(buttonMeshRef.current.scale.x, targetScale, 0.1));
      }
    });

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) setIsPressed(true);
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      setIsHovered(false);
      props.onMouseLeave?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) setIsHovered(true);
      props.onMouseEnter?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        disabled={disabled}
        className={className}
        style={{
          ...style,
          width: fullWidth ? "100%" : "auto",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          position: "relative",
          zIndex: 10,
        }}
        {...props}
      >
        <div style={{ width: "100%", height: "100%", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <group ref={groupRef} position={[0, 0, 0]}>
            <mesh
              ref={buttonMeshRef}
              position={[0, 0, 0]}
              scale={1}
              receiveShadow
              castShadow
            >
              <boxGeometry args={[1, 0.5, 0.2]} />
              <meshStandardMaterial
                color={isPressed ? hoverColor : color}
                roughness={0.3}
                metalness={0.1}
                transparent={variant === "outline"}
                opacity={variant === "outline" ? 0 : 1}
              />
            </mesh>

            {variant === "outline" && (
              <mesh position={[0, 0, 0.101]} scale={[1.02, 1.04, 1]}>
                <boxGeometry args={[1, 0.5, 0.02]} />
                <meshBasicMaterial color={glowColor} transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        </div>
        <span style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          fontSize: "15px",
          fontWeight: 500,
          pointerEvents: "none",
          zIndex: 20,
        }}>
          {children}
        </span>
      </button>
    );
  }
);

ThreeDButton.displayName = "ThreeDButton";