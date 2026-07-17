import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          DEFAULT: "#B88556",
          dark: "#96693F",
          light: "#D3AB80",
        },
        navy: {
          DEFAULT: "#3F4B63",
        },
        pix: {
          DEFAULT: "#10C44C",
        },
        cream: {
          DEFAULT: "#FFF6DD",
        },
        muted: {
          DEFAULT: "#7C7C7C",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jost)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 10px 25px -8px rgba(63, 75, 99, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
