"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({ variant = "primary", children, fullWidth = true, className = "", ...props }: Props) {
  const base = "flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-medium transition-all disabled:opacity-50 cursor-pointer";
  const v = {
    primary: "bg-[#4A7C5E] text-white hover:bg-[#2E5C42]",
    outline: "bg-white text-[#1A2E25] border border-[#C8DDD2] hover:bg-[#EAF4EE]",
    ghost:   "bg-transparent text-[#4A7C5E] hover:bg-[#EAF4EE]",
  };
  return (
    <button className={`${base} ${v[variant]} ${fullWidth ? "w-full" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
