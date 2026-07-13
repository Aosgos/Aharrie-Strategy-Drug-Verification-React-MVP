import { ReactNode } from "react";
export default function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick}
      className={`rounded-2xl p-5 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}>
      {children}
    </div>
  );
}
