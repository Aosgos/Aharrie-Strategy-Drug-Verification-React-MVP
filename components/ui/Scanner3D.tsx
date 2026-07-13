"use client";

import { useEffect, useRef, useState } from "react";

type ScanState = "idle" | "scanning" | "success" | "error";

interface Props {
  state?: ScanState;
  className?: string;
}

const CORNER = "absolute w-7 h-7 border-[#1DCA8E]";

export function Scanner3D({ state = "idle", className = "" }: Props) {
  const lineRef  = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [burst,  setBurst] = useState(false);

  // Trigger burst animation when state changes to success
  useEffect(() => {
    if (state === "success") {
      setBurst(true);
      const t = setTimeout(() => setBurst(false), 700);
      return () => clearTimeout(t);
    }
  }, [state]);

  const borderColor =
    state === "success" ? "#1DCA8E"
    : state === "error"   ? "#D4607A"
    : "#1DCA8E";

  const cornerStyle = {
    borderColor,
    transition: "border-color 0.3s ease",
    filter: state === "success" ? "drop-shadow(0 0 6px #1DCA8E)" : "none",
  };

  return (
    <div
      ref={frameRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: 220, height: 220 }}
    >
      {/* Floating 3D depth shadow */}
      <div
        className="absolute inset-4 rounded-2xl"
        style={{
          background: "rgba(29,202,142,0.03)",
          boxShadow: state === "scanning"
            ? "0 0 40px 4px rgba(29,202,142,0.15), inset 0 0 40px 4px rgba(29,202,142,0.05)"
            : "none",
          transition: "box-shadow 0.4s ease",
        }}
      />

      {/* Corner brackets */}
      <div className={`${CORNER} top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-sm`} style={cornerStyle} />
      <div className={`${CORNER} top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-sm`} style={cornerStyle} />
      <div className={`${CORNER} bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-sm`} style={cornerStyle} />
      <div className={`${CORNER} bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-sm`} style={cornerStyle} />

      {/* Scanning line */}
      {(state === "scanning" || state === "idle") && (
        <div
          ref={lineRef}
          className="scan-line absolute left-3 right-3 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
            boxShadow: `0 0 8px 2px ${borderColor}60`,
          }}
        />
      )}

      {/* Success checkmark */}
      {state === "success" && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full animate-in"
          style={{ background: "rgba(29,202,142,0.15)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1DCA8E" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Error X */}
      {state === "error" && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full animate-in"
          style={{ background: "rgba(212,96,122,0.12)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4607A" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Success burst rings */}
      {burst && (
        <>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl"
              style={{
                border: "2px solid #1DCA8E",
                animation: `burst ${0.2 * i + 0.4}s ease-out ${(i - 1) * 0.08}s forwards`,
                opacity: 0.9,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
