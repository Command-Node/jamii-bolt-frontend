import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B35",
          50: "#FFF4F0",
          100: "#FFE8E0",
          500: "#FF6B35",
          600: "#E55A2B",
          700: "#CC4F21",
        },
        success: {
          DEFAULT: "#2ECC71",
          50: "#E8F8F0",
          100: "#D1F1E1",
          500: "#2ECC71",
          600: "#27B865",
          700: "#1E9A4F",
        },
      },
    },
  },
  plugins: [],
};

export default config;

