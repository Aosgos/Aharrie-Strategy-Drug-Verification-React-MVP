import { ReactNode } from "react";

export default function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 ${onClick ? "cursor-pointer hover:bg-[#EAF5EF] transition-colors" : ""} ${className}`}
      style={{ boxShadow: "0 2px 14px rgba(74,124,94,0.09)" }}
    >
      {children}
    </div>
  );
}
