"use client";

import { ButtonHTMLAttributes, ReactNode, useRef } from "react";

interface ThreeDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

export function ThreeDButton({
  children,
  variant = "primary",
  fullWidth = true,
  className = "",
  onMouseEnter,
  onMouseLeave,
  ...props
}: ThreeDButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleEnter(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current;
    if (btn) {
      btn.style.transform = "perspective(300px) translateZ(6px) scale(1.02)";
      btn.style.transition = "transform 0.12s ease-out";
    }
    onMouseEnter?.(e);
  }

  function handleLeave(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current;
    if (btn) {
      btn.style.transform = "perspective(300px) translateZ(0px) scale(1)";
      btn.style.transition = "transform 0.25s ease-out";
    }
    onMouseLeave?.(e);
  }

  const base =
    "flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-medium transition-colors disabled:opacity-50 cursor-pointer";
  const variants = {
    primary: "bg-[#4A7C5E] text-white hover:bg-[#2E5C42]",
    outline: "bg-white text-[#1A2E25] border border-[#C8DDD2] hover:bg-[#EAF4EE]",
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </button>
  );
}
