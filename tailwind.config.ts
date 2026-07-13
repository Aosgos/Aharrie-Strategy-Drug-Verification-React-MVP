import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: "#4A7C5E", dark: "#2E5C42",
          light: "#D4EDE0", xlight: "#EAF5EF",
        },
        pink:  { DEFAULT: "#D4607A", bg: "#FFE8EC" },
        amber: { DEFAULT: "#C07A1A", bg: "#FFF4E0" },
      },
      borderRadius: { pill: "100px" },
      boxShadow: {
        card: "0 2px 14px rgba(74,124,94,0.09)",
        "card-dark": "0 2px 14px rgba(0,0,0,0.35)",
        glow: "0 0 24px 6px rgba(74,124,94,0.22)",
      },
      animation: {
        "float":      "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "burst":      "burst 0.6s ease-out forwards",
        "zoom-in":    "zoom-in 0.25s ease-out",
        "scan-move":  "scanMove 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
