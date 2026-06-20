import { ReactNode } from "react";

type Variant = "green" | "pink" | "amber";
type Size    = "sm" | "md" | "lg";

const sizes   = { sm: "w-9 h-9", md: "w-12 h-12", lg: "w-16 h-16" };
const bg      = { green: "#D4EDE0", pink: "#FFE8EC", amber: "#FFF4E0" };
const colors  = { green: "#4A7C5E", pink: "#D4607A", amber: "#C07A1A" };

export default function IconCircle({ children, size = "md", variant = "green" }: { children: ReactNode; size?: Size; variant?: Variant }) {
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center flex-shrink-0`} style={{ background: bg[variant], color: colors[variant] }}>
      {children}
    </div>
  );
}
