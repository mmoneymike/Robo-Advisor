/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#496A94",
          hover: "#5a7fad",
        },
        surface: "#f5f7fa",
        "app-border": "#e0e4ea",
        navy: "#1a1a2e",
        muted: "#6b7280",
        danger: "#b42318",
        chart: {
          blue: "#3b82f6",
          sky: "#0ea5e9",
          steel: "#496A94",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "portfolio-wave": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "portfolio-wave": "portfolio-wave 20s linear infinite",
        "portfolio-wave-slow": "portfolio-wave 28s linear infinite",
        "portfolio-wave-fast": "portfolio-wave 14s linear infinite",
      },
    },
  },
  plugins: [],
};
