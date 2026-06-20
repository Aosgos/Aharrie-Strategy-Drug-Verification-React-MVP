"use client";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightIcon?: ReactNode;
  error?: string;
}

const FieldInput = forwardRef<HTMLInputElement, Props>(({ label, rightIcon, error, className = "", ...props }, ref) => (
  <div className="mb-3.5">
    <label className="block text-[13px] font-medium text-[#1A2E25] mb-1.5">{label}</label>
    <div className="relative">
      <input
        ref={ref}
        className={`w-full rounded-[10px] px-3.5 py-2.5 text-sm text-[#1A2E25] border border-[#C8DDD2] bg-[#EAF4EE] outline-none focus:border-[#4A7C5E] focus:bg-white transition-colors placeholder:text-[#8AA398] ${rightIcon ? "pr-10" : ""} ${className}`}
        {...props}
      />
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA398]">{rightIcon}</div>}
    </div>
    {error && <p className="text-[12px] text-[#D4607A] mt-1">{error}</p>}
  </div>
));
FieldInput.displayName = "FieldInput";
export default FieldInput;
