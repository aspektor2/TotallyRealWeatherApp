import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#3D4350",
        slateink: "#6B7280",
        mist: "#9AA3B2",
        cloud: "#F7FAFE",
        line: "#E5E7EB",
        leaf: { DEFAULT: "#58CC02", edge: "#46A302" },
        sky: { DEFAULT: "#1CB0F6", edge: "#1899D6", wash: "#EAF6FF" },
        sun: { DEFAULT: "#FFC800", edge: "#E0B000" },
        berry: { DEFAULT: "#FF6FA5", edge: "#E55590" },
        tile: {
          mint: "#E2F7EA",
          mintText: "#2E7D45",
          blue: "#E3F2FE",
          blueText: "#1467A8",
          amber: "#FFF4D6",
          amberText: "#8A5A00",
          pink: "#FFE9F0",
          pinkText: "#B23A62",
          purple: "#F1EAFE",
          purpleText: "#6D3FC4",
          coral: "#FFEBE3",
          coralText: "#B0481F",
        },
        brand: { DEFAULT: "#1CB0F6", deep: "#1899D6", soft: "#EAF6FF" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 2px 0 rgba(61,67,80,0.06)",
        modal: "0 24px 64px rgba(61,67,80,0.25)",
        lift: "0 6px 16px rgba(28,176,246,0.25)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        modalIn: {
          from: { opacity: "0", transform: "translate(-50%, -46%) scale(0.96)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(6deg)" },
        },
        confetti: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(140px) rotate(540deg)", opacity: "0" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22,1,0.36,1) both",
        modalIn: "modalIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 3.5s ease-in-out infinite",
        wiggle: "wiggle 0.4s ease-in-out",
        confetti: "confetti 1.4s ease-in forwards",
      },
    },
  },
  plugins: [],
};
export default config;
