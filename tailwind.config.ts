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
        ink: "#0E1726",
        slateink: "#46506B",
        mist: "#8B93AB",
        cloud: "#F6F8FC",
        line: "#E5E9F2",
        brand: {
          DEFAULT: "#3D5BF5",
          deep: "#2741C8",
          soft: "#EDF1FF",
        },
        sky: {
          wash: "#DCEBFB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,23,38,0.04), 0 8px 24px rgba(14,23,38,0.06)",
        modal: "0 24px 64px rgba(14,23,38,0.22)",
        lift: "0 2px 4px rgba(14,23,38,0.05), 0 16px 40px rgba(39,65,200,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
