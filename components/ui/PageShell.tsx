import { ReactNode } from "react";

export default function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${className}`} style={{ background: "#F2F8F4" }}>
      <div className="absolute -top-8 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: "#C8E6D4", opacity: 0.45 }} />
      <div className="absolute bottom-16 -left-8 w-24 h-24 rounded-full pointer-events-none" style={{ background: "#C8E6D4", opacity: 0.4  }} />
      <div className="absolute top-1/2 -right-5 w-20 h-20 rounded-full pointer-events-none" style={{ background: "#C8E6D4", opacity: 0.3  }} />
      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
