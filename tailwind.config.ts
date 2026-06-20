import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: "#4A7C5E",
          dark:    "#2E5C42",
          light:   "#D4EDE0",
          xlight:  "#EAF5EF",
        },
        pink:  { DEFAULT: "#D4607A", bg: "#FFE8EC" },
        amber: { DEFAULT: "#C07A1A", bg: "#FFF4E0" },
        border: "#C8DDD2",
        bg:    { DEFAULT: "#F2F8F4", input: "#EAF4EE" },
        text:  { 1: "#1A2E25", 2: "#5A7067", 3: "#8AA398" },
      },
      borderRadius: { pill: "100px" },
      boxShadow: { card: "0 2px 14px rgba(74,124,94,0.09)" },
    },
  },
  plugins: [],
};
export default config;
