"use client";

import { useRef, MouseEvent, ReactNode } from "react";

interface ThreeDCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number;
}

export function ThreeDCard({
  children,
  className = "",
  onClick,
  intensity = 8,
}: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) scale3d(1.02,1.02,1.02)`;
    card.style.transition = "transform 0.08s ease-out";
  }

  function handleMouseLeave() {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    card.style.transition = "transform 0.35s ease-out";
  }

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        boxShadow: "0 2px 14px rgba(74,124,94,0.09)",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
