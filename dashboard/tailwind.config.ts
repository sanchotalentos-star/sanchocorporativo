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
        sancho: {
          pink:        "#E91E8C",
          "pink-light":"#F472B6",
          "pink-bg":   "#FDF0F7",
          black:       "#1A1A1A",
          "gray-dark": "#4A4A4A",
          "gray-mid":  "#9CA3AF",
          bg:          "#F2F2F2",
          white:       "#FFFFFF",
          won:         "#16A34A",
          lost:        "#DC2626",
          pending:     "#D97706",
          border:      "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      fontWeight: {
        extrabold: "800",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 16px rgba(233,30,140,0.12)",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
